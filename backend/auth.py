import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
from passlib.context import CryptContext
import jwt
import logging

# Load .env file
load_dotenv()

# --- FIX FOR RENDER DEPLOYMENT ERROR ---
# This suppresses the bcrypt version warning that often causes crashes on newer Python environments
logging.getLogger("passlib").setLevel(logging.ERROR)

# Password hashing configuration
# Pinning the scheme to bcrypt only
PWD_CONTEXT = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Read secrets from .env
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

if not SECRET_KEY:
    # On Render, make sure you add SECRET_KEY in the "Environment Variables" section
    raise ValueError("SECRET_KEY is not set in environment variables")

# -------------------------------
# Password functions
# -------------------------------

def get_password_hash(password: str) -> str:
    # Ensure password is not exceeding 72 characters
    if len(password) > 72:
        password = password[:72]
    return PWD_CONTEXT.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return PWD_CONTEXT.verify(plain_password, hashed_password)
    except Exception as e:
        print(f"Password verification error: {e}")
        return False

# -------------------------------
# JWT Token functions
# -------------------------------

def create_access_token(data: dict, expires_minutes: int = 1440):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
