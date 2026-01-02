"""
Authentication Routes for Ghana Maize Yield Prediction API

Handles user registration, login, and authentication.
"""

from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, timedelta
import jwt
import bcrypt
from uuid import uuid4

router = APIRouter()
security = HTTPBearer()

# Configuration (move to environment variables in production)
SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# In-memory user storage (replace with database in production)
users_db = {}

# Pydantic Models
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
    email: str
    phone: Optional[str] = None
    location: Optional[str] = None
    createdAt: str
    updatedAt: str

class AuthResponse(BaseModel):
    user: UserResponse
    token: str

class UpdateProfileRequest(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None

class ChangePasswordRequest(BaseModel):
    currentPassword: str
    newPassword: str

# Helper Functions
def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    """Verify a password against its hash."""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_access_token(user_id: str) -> str:
    """Create a JWT access token."""
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {
        "sub": user_id,
        "exp": expire
    }
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Dependency to get current authenticated user."""
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        
        if user_id is None or user_id not in users_db:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials"
            )
        
        return users_db[user_id]
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )

# Routes
@router.post("/auth/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def signup(request: SignUpRequest):
    """Register a new user."""
    # Check if user already exists
    if any(u["email"] == request.email for u in users_db.values()):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    user_id = str(uuid4())
    now = datetime.utcnow().isoformat()
    
    user = {
        "id": user_id,
        "name": request.name,
        "email": request.email,
        "password": hash_password(request.password),
        "phone": request.phone,
        "location": request.location,
        "createdAt": now,
        "updatedAt": now
    }
    
    users_db[user_id] = user
    
    # Create token
    token = create_access_token(user_id)
    
    # Return user without password
    user_response = UserResponse(
        id=user["id"],
        name=user["name"],
        email=user["email"],
        phone=user["phone"],
        location=user["location"],
        createdAt=user["createdAt"],
        updatedAt=user["updatedAt"]
    )
    
    return AuthResponse(user=user_response, token=token)

@router.post("/auth/signin", response_model=AuthResponse)
async def signin(request: SignInRequest):
    """Authenticate a user and return token."""
    # Find user by email
    user = next((u for u in users_db.values() if u["email"] == request.email), None)
    
    if not user or not verify_password(request.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create token
    token = create_access_token(user["id"])
    
    # Return user without password
    user_response = UserResponse(
        id=user["id"],
        name=user["name"],
        email=user["email"],
        phone=user["phone"],
        location=user["location"],
        createdAt=user["createdAt"],
        updatedAt=user["updatedAt"]
    )
    
    return AuthResponse(user=user_response, token=token)

@router.post("/auth/signout")
async def signout(current_user: dict = Depends(get_current_user)):
    """Sign out user (token invalidation handled client-side)."""
    return {"message": "Successfully signed out"}

@router.get("/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current user information."""
    return UserResponse(
        id=current_user["id"],
        name=current_user["name"],
        email=current_user["email"],
        phone=current_user["phone"],
        location=current_user["location"],
        createdAt=current_user["createdAt"],
        updatedAt=current_user["updatedAt"]
    )

@router.put("/auth/profile", response_model=UserResponse)
async def update_profile(
    request: UpdateProfileRequest,
    current_user: dict = Depends(get_current_user)
):
    """Update user profile."""
    user_id = current_user["id"]
    
    if request.name:
        users_db[user_id]["name"] = request.name
    if request.phone:
        users_db[user_id]["phone"] = request.phone
    if request.location:
        users_db[user_id]["location"] = request.location
    
    users_db[user_id]["updatedAt"] = datetime.utcnow().isoformat()
    
    return UserResponse(
        id=users_db[user_id]["id"],
        name=users_db[user_id]["name"],
        email=users_db[user_id]["email"],
        phone=users_db[user_id]["phone"],
        location=users_db[user_id]["location"],
        createdAt=users_db[user_id]["createdAt"],
        updatedAt=users_db[user_id]["updatedAt"]
    )

@router.post("/auth/change-password")
async def change_password(
    request: ChangePasswordRequest,
    current_user: dict = Depends(get_current_user)
):
    """Change user password."""
    user_id = current_user["id"]
    
    # Verify current password
    if not verify_password(request.currentPassword, users_db[user_id]["password"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    # Update password
    users_db[user_id]["password"] = hash_password(request.newPassword)
    users_db[user_id]["updatedAt"] = datetime.utcnow().isoformat()
    
    return {"message": "Password changed successfully"}