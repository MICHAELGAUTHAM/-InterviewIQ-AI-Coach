import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "InterviewIQ AI"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "supersecretkeyinterviewiqai1234567890!@#")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Defaults to SQLite local file, but supports PostgreSQL URL from env
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./interviewiq.db")
    
    class Config:
        case_sensitive = True

settings = Settings()
