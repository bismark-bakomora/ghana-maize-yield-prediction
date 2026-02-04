from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class SignUpRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None
    location: Optional[str] = None

class SignInRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    phone: Optional[str]
    location: Optional[str]
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True

class AuthResponse(BaseModel):
    user: UserResponse
    token: str

class UpdateProfileRequest(BaseModel):
    name: Optional[str]
    phone: Optional[str]
    location: Optional[str]

class ChangePasswordRequest(BaseModel):
    currentPassword: str
    newPassword: str
