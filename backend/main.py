import os
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from typing import List
import logging

import models, database, auth, schemas

# --------------------------------------------------
# LOGGING
# --------------------------------------------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="SkyDesk360 API")

# --------------------------------------------------
# ENVIRONMENT VARIABLES
# --------------------------------------------------
MAIL_USERNAME = os.getenv("MAIL_USERNAME")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://skydesk360.vercel.app")

MASTER_ADMIN_EMAIL = os.getenv("MASTER_ADMIN_EMAIL", "admin@skydesk.com")
MASTER_ADMIN_PASS = os.getenv("MASTER_ADMIN_PASS", "SkyControl@2026")[:72]  # bcrypt limit

# --------------------------------------------------
# EMAIL CONFIG
# --------------------------------------------------
conf = ConnectionConfig(
    MAIL_USERNAME=MAIL_USERNAME,
    MAIL_PASSWORD=MAIL_PASSWORD,
    MAIL_FROM=MAIL_USERNAME,
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

async def send_skydesk_email(subject: str, recipient: str, body_content: str):
    try:
        html = f"""
        <html>
            <body style="font-family: Arial; background:#f9f9f9; padding:20px">
            <div style="max-width:600px;margin:auto;background:white;padding:30px;border-radius:12px">
            <h2>SkyDesk360</h2>
            <hr>{body_content}<hr>
            <p style="font-size:10px;color:#aaa;text-align:center">
            This is an automated message
            </p>
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

    except Exception as e:
        logger.error(f"Email failed (ignored): {e}")

# --------------------------------------------------
# CORS
# --------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        FRONTEND_URL,
        "https://skydesk360.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# DATABASE
# --------------------------------------------------
models.Base.metadata.create_all(bind=database.engine)

# --------------------------------------------------
# MASTER ADMIN
# --------------------------------------------------
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
            logger.info("Master Admin Created")
    finally:
        db.close()

# --------------------------------------------------
# AUTH
# --------------------------------------------------
@app.post("/signup")
async def signup(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    if db.query(models.User).filter(models.User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pwd = auth.get_password_hash(user.password[:72])
    new_user = models.User(
        full_name=user.full_name,
        email=user.email,
        hashed_password=hashed_pwd,
        is_admin=False
    )
    db.add(new_user)
    db.commit()

    await send_skydesk_email(
        "Welcome to SkyDesk360",
        user.email,
        f"<p>Hello <b>{user.full_name}</b>, your account is active.</p>"
    )

    return {"message": "Signup successful"}

@app.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not auth.verify_password(user.password[:72], db_user.hashed_password):
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

# --------------------------------------------------
# BOOKINGS
# --------------------------------------------------
@app.post("/book-seat")
async def book_seat(booking: schemas.BookingCreate, db: Session = Depends(database.get_db)):
    if db.query(models.Booking).filter(models.Booking.unit_id == booking.unit_id).first():
        raise HTTPException(status_code=400, detail="Seat already booked")

    new_booking = models.Booking(**booking.model_dump())
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)

    user = db.query(models.User).filter(models.User.id == booking.user_id).first()
    if user:
        await send_skydesk_email(
            "Booking Confirmed",
            user.email,
            f"<p>Seat <b>{booking.unit_id}</b> booked successfully.</p>"
        )

    return {"status": "success"}

@app.get("/my-bookings/{user_id}", response_model=List[schemas.BookingResponse])
def get_user_bookings(user_id: int, db: Session = Depends(database.get_db)):
    return db.query(models.Booking).filter(models.Booking.user_id == user_id).all()

@app.delete("/cancel-booking/{booking_id}")
def cancel_booking(booking_id: int, db: Session = Depends(database.get_db)):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(booking)
    db.commit()
    return {"message": "Cancelled"}
