from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional
from app.config import JWT_CONFIG
from datetime import datetime, timedelta
import jwt
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from passlib.context import CryptContext

router = APIRouter()
security = HTTPBearer()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Pydantic models
class UserLogin(BaseModel):
    email: str
    password: str

class UserSignup(BaseModel):
    email: str
    password: str
    first_name: str
    last_name: str

class UserResponse(BaseModel):
    id: str
    email: str
    first_name: str
    last_name: str
    role: str
    access_token: str
    token_type: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str

# Mock user storage (replace with database in production)
users_db = {
    # Pre-created admin user
    "admin@ecommerce.com": {
        "id": "admin_1",
        "email": "admin@ecommerce.com",
        "password": "admin123",
        "first_name": "Admin",
        "last_name": "User",
        "role": "admin"
    },
    # Pre-created test user
    "test@example.com": {
        "id": "user_1",
        "email": "test@example.com",
        "password": "password",
        "first_name": "Test",
        "last_name": "User",
        "role": "customer"
    }
}

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=JWT_CONFIG["access_token_expire_minutes"])
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_CONFIG["secret_key"], algorithm=JWT_CONFIG["algorithm"])
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_CONFIG["secret_key"], algorithms=[JWT_CONFIG["algorithm"]])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/signup", response_model=UserResponse)
async def signup(user_data: UserSignup, db: Session = Depends(get_db)):
    """User registration endpoint"""
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    # Create user with hashed password
    user_id = f"user_{int(datetime.utcnow().timestamp())}"
    hashed_password = pwd_context.hash(user_data.password)
    
    new_user = User(
        id=user_id,
        email=user_data.email,
        name=f"{user_data.first_name} {user_data.last_name}",
        password_hash=hashed_password,
        role="customer"
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create access token
    access_token = create_access_token(data={"sub": user_id})
    
    return UserResponse(
        id=user_id,
        email=user_data.email,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        role="customer",
        access_token=access_token,
        token_type="bearer"
    )

@router.post("/login", response_model=UserResponse)
async def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """User login endpoint"""
    # Check if user exists
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Check password
    if not pwd_context.verify(user_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Create access token
    access_token = create_access_token(data={"sub": user.id})
    
    # Split name into first and last name
    name_parts = user.name.split(" ", 1)
    first_name = name_parts[0] if name_parts else ""
    last_name = name_parts[1] if len(name_parts) > 1 else ""
    
    return UserResponse(
        id=user.id,
        email=user.email,
        first_name=first_name,
        last_name=last_name,
        role=user.role,
        access_token=access_token,
        token_type="bearer"
    )

@router.post("/logout")
async def logout():
    """User logout endpoint"""
    # In production, you might want to blacklist the token
    return {"message": "Successfully logged out"}

@router.get("/me", response_model=dict)
async def get_current_user(current_user_id: str = Depends(verify_token), db: Session = Depends(get_db)):
    """Get current user information"""
    try:
        # Find user by ID
        user = db.query(User).filter(User.id == current_user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Split name into first and last name
        name_parts = user.name.split(" ", 1)
        first_name = name_parts[0] if name_parts else ""
        last_name = name_parts[1] if len(name_parts) > 1 else ""
        
        return {
            "id": user.id,
            "email": user.email,
            "first_name": first_name,
            "last_name": last_name,
            "role": user.role
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(current_user_id: str = Depends(verify_token)):
    """Refresh access token"""
    try:
        # Create new access token
        access_token = create_access_token(data={"sub": current_user_id})
        
        return TokenResponse(
            access_token=access_token,
            token_type="bearer"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
