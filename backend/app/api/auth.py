from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.models import models
from app.schemas import schemas
from app.core.config import settings

router = APIRouter()

@router.post("/register", response_model=schemas.Token)
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists."
        )
    
    # Hash password
    hashed_pwd = get_password_hash(user_in.password)
    
    # Create user (Check if it's the first user to make it admin, for admin panel access)
    is_first_user = db.query(models.User).count() == 0
    new_user = models.User(
        email=user_in.email,
        hashed_password=hashed_pwd,
        is_admin=is_first_user # Auto-make first user Admin
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create profile
    username = user_in.email.split("@")[0].capitalize()
    new_profile = models.Profile(
        user_id=new_user.id,
        full_name=username,
        preferred_role="Software Engineer",
        target_company="Google",
        education=[{"institution": "Tech University", "degree": "B.S. Computer Science", "year": "2025"}],
        skills=["Python", "FastAPI", "React", "JavaScript", "SQL"],
        achievements=["Dean's List 2024", "1st Place Hackathon"]
    )
    db.add(new_profile)
    
    # Create welcome notification
    notification = models.Notification(
        user_id=new_user.id,
        message="Welcome to InterviewIQ AI! Complete your profile and upload your resume to start."
    )
    db.add(notification)
    db.commit()
    
    # Create token
    access_token = create_access_token(new_user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": new_user
    }

@router.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password."
        )
    
    access_token = create_access_token(user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/forgot-password")
def forgot_password(email_in: dict, db: Session = Depends(get_db)):
    email = email_in.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")
        
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email not registered")
        
    # Mock password reset
    return {"message": "Password reset instructions sent to your email."}

@router.post("/google", response_model=schemas.Token)
def google_signin(google_token_in: dict, db: Session = Depends(get_db)):
    token = google_token_in.get("token")
    email = google_token_in.get("email", "googleuser@gmail.com")
    
    if not token:
        raise HTTPException(status_code=400, detail="Token is required")
        
    # Query or create Google user
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        hashed_pwd = get_password_hash("google-oauth-dummy-pass-123!")
        is_first = db.query(models.User).count() == 0
        user = models.User(
            email=email,
            hashed_password=hashed_pwd,
            is_admin=is_first
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
        profile = models.Profile(
            user_id=user.id,
            full_name=email.split("@")[0].capitalize(),
            preferred_role="Software Engineer",
            target_company="Google",
            education=[{"institution": "Online Learning", "degree": "Self-Taught", "year": "2024"}],
            skills=["Python", "JavaScript"],
            achievements=[]
        )
        db.add(profile)
        db.commit()
        
    access_token = create_access_token(user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }
