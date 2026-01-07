from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

# --- USER SCHEMAS ---
class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# --- BOOKING SCHEMAS ---
class BookingBase(BaseModel):
    unit_id: str
    unit_type: str
    price: float

class BookingCreate(BookingBase):
    user_id: int

# THIS IS THE CLASS THE ERROR WAS COMPLAINING ABOUT
class BookingResponse(BookingBase):
    id: int
    booking_date: datetime
    user_id: int

    class Config:
        from_attributes = True

# --- TOKEN SCHEMAS ---
class Token(BaseModel):
    access_token: str
    token_type: str
    is_admin: bool