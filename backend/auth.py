import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
from passlib.context import CryptContext
import jwt

# Load .env file
load_dotenv()

# Password hashing
PWD_CONTEXT = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Read secrets from .env
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")  # default if not in .env

if not SECRET_KEY:
    raise ValueError("SECRET_KEY is not set in .env file")

# -------------------------------
# Password functions
# -------------------------------

def get_password_hash(password: str) -> str:
    return PWD_CONTEXT.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return PWD_CONTEXT.verify(plain_password, hashed_password)

# -------------------------------
# JWT Token functions
# -------------------------------

def create_access_token(data: dict, expires_minutes: int = 1440):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
