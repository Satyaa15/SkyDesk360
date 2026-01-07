import os
from fastapi import FastAPI, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from typing import List
import logging

# Local imports
import models, database, auth, schemas

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="SkyDesk360 API")

# --- SMTP EMAIL CONFIGURATION ---
# IMPORTANT: If using Gmail, use an "App Password," not your regular password.
conf = ConnectionConfig(
    MAIL_USERNAME="sswami3081@gmail.com",
    MAIL_PASSWORD="psgm idoj lyux nezk",
    MAIL_FROM="sswami3081@gmail.com",
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

# Helper function to send emails asynchronously
async def send_skydesk_email(subject: str, recipient: str, body_content: str):
    html = f"""
    <html>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: white; padding: 40px; border-radius: 20px; border: 1px solid #eee;">
                <h2 style="color: #00f2fe; text-transform: uppercase; letter-spacing: 2px;">SkyDesk<span style="color: #7000ff;">360</span></h2>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                {body_content}
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 10px; color: #aaa; text-align: center;">This is an automated message from the SkyControl Command Center.</p>
            </div>
        </body>
    </html>
    """
    message = MessageSchema(
        subject=subject,
        recipients=[recipient],
        body=html,
        subtype=MessageType.html
    )
    fm = FastMail(conf)
    await fm.send_message(message)

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
models.Base.metadata.create_all(bind=database.engine)

# --- MASTER ADMIN STARTUP ---
MASTER_ADMIN_EMAIL = "admin@skydesk.com"
MASTER_ADMIN_PASS = "SkyControl@2026"

@app.on_event("startup")
def create_master_admin():
    db = database.SessionLocal()
    try:
        admin = db.query(models.User).filter(models.User.email == MASTER_ADMIN_EMAIL).first()
        if not admin:
            hashed_pwd = auth.get_password_hash(MASTER_ADMIN_PASS)
            new_admin = models.User(
                full_name="Super Admin",
                email=MASTER_ADMIN_EMAIL,
                hashed_password=hashed_pwd,
                is_admin=True
            )
            db.add(new_admin)
            db.commit()
            logger.info(f">>> MASTER ADMIN READY: {MASTER_ADMIN_EMAIL}")
    finally:
        db.close()

# --- AUTHENTICATION & SIGNUP ---

@app.post("/signup")
async def signup(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pwd = auth.get_password_hash(user.password)
    new_user = models.User(
        full_name=user.full_name, 
        email=user.email, 
        hashed_password=hashed_pwd,
        is_admin=False 
    )
    db.add(new_user)
    db.commit()

    # REAL EMAIL: Welcome
    content = f"<p>Welcome <b>{user.full_name}</b>,</p><p>Your SkyDesk360 account is active. You can now log in and reserve your workspace on the 14th Floor.</p>"
    await send_skydesk_email("Welcome to SkyDesk360", user.email, content)
    
    return {"message": "Signup successful. Welcome email sent."}

@app.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not auth.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = auth.create_access_token(data={
        "sub": db_user.email, 
        "admin": db_user.is_admin,
        "user_id": db_user.id,
        "name": db_user.full_name
    })
    return {
        "access_token": token, 
        "token_type": "bearer", 
        "is_admin": db_user.is_admin,
        "full_name": db_user.full_name,
        "user_id": db_user.id
    }

# --- ADMIN MANAGEMENT ---

@app.post("/admin/create-sub-admin")
async def create_sub_admin(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_pwd = auth.get_password_hash(user.password)
    new_admin = models.User(full_name=user.full_name, email=user.email, hashed_password=hashed_pwd, is_admin=True)
    db.add(new_admin)
    db.commit()

    # REAL EMAIL: Credentials
    content = f"""
    <p>Hello <b>{user.full_name}</b>,</p>
    <p>You have been authorized as an <b>Administrator</b> for the SkyDesk360 Command Center.</p>
    <p style="background: #f4f4f4; padding: 10px; border-radius: 5px;">
        <strong>Login:</strong> {user.email}<br>
        <strong>Temp Password:</strong> {user.password}
    </p>
    <p><a href="http://localhost:5173/signin" style="color: #00f2fe; font-weight: bold;">Login to Portal</a></p>
    """
    await send_skydesk_email("Access Granted: SkyControl Admin", user.email, content)

    return {"message": "Admin created and credentials emailed."}

# --- BOOKING LOGIC ---

@app.post("/book-seat")
async def book_seat(booking: schemas.BookingCreate, db: Session = Depends(database.get_db)):
    existing = db.query(models.Booking).filter(models.Booking.unit_id == booking.unit_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Seat occupied")

    new_booking = models.Booking(**booking.model_dump())
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)

    # REAL EMAIL: Booking Confirmation
    user = db.query(models.User).filter(models.User.id == booking.user_id).first()
    if user:
        content = f"<p>Reservation Confirmed!</p><p>Unit: <b>{booking.unit_id}</b><br>Type: {booking.unit_type}<br>Price: ₹{booking.price}</p>"
        await send_skydesk_email("Booking Confirmation", user.email, content)

    return {"status": "success"}

@app.get("/my-bookings/{user_id}", response_model=List[schemas.BookingResponse])
def get_user_bookings(user_id: int, db: Session = Depends(database.get_db)):
    return db.query(models.Booking).filter(models.Booking.user_id == user_id).all()

@app.delete("/cancel-booking/{booking_id}")
def cancel_booking(booking_id: int, db: Session = Depends(database.get_db)):
    db_booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not db_booking:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(db_booking)
    db.commit()
    return {"message": "Cancelled"}

@app.get("/admin/all-bookings", response_model=List[schemas.BookingResponse])
def get_all_bookings(db: Session = Depends(database.get_db)):
    return db.query(models.Booking).all()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)