from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any
import jwt
from datetime import datetime, timedelta
import bcrypt
from src.services.persistence_service import PersistenceService
from src.config import settings  

router = APIRouter()
security = HTTPBearer()
persistence_service = PersistenceService()

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

class SignupRequest(BaseModel):
    name: str
    class_name: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserResponse(BaseModel):
    id: str 
    name: str
    email: str
    class_name: str


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify JWT token"""
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        return email
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")


@router.post("/signup", response_model=TokenResponse)
async def signup(request: SignupRequest):
    """Register a new user"""
    try:
        existing_user = await persistence_service.find_user_by_email(request.email)
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Hash password (ensure it's truncated to prevent bcrypt 72-byte limit)
        # Use conservative truncation to 50 characters to ensure < 72 bytes
        truncated_password = request.password[:50]
        hashed_password = bcrypt.hashpw(truncated_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        user_data = {
            "name": request.name,
            "email": request.email,
            "class_name": request.class_name,
            "password": hashed_password,
            "created_at": datetime.utcnow(),
            "stars": 0,
            "topics_completed": []
        }
        
        result = await persistence_service.create_user(user_data)
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": request.email}, expires_delta=access_token_expires
        )
        
        return TokenResponse(access_token=access_token)
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error during signup: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    """Login user"""
    try:
        user = await persistence_service.find_user_by_email(request.email)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        # Verify password (ensure it's truncated to prevent bcrypt 72-byte limit)
        # Use conservative truncation to 50 characters to ensure < 72 bytes
        truncated_password = request.password[:50]
        if not bcrypt.checkpw(truncated_password.encode('utf-8'), user["password"].encode('utf-8')):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": request.email}, expires_delta=access_token_expires
        )
        
        return TokenResponse(access_token=access_token)
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error during login: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/me", response_model=UserResponse)
async def get_current_user(email: str = Depends(verify_token)):
    """Get current user information"""
    try:
        user = await persistence_service.find_user_by_email(email)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return UserResponse(
            id=str(user["_id"]),
            name=user["name"],
            email=user["email"],
            class_name=user["class_name"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting user: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))