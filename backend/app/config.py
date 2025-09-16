from pydantic_settings import BaseSettings
from typing import List, Optional
import os

class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql://postgres:password@localhost:5432/ecommerce"
    
    # JWT
    secret_key: str = "your-super-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # API Configuration
    ecommerce_api_url: str = "https://api.example.com"
    ecommerce_api_key: str = "your-api-key-here"
    
    # Server
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = True
    environment: str = "development"
    
    # CORS
    allowed_origins: List[str] = [
        "http://localhost:3000", 
        "http://localhost:3001", 
        "http://localhost:5030",
        "https://frontend-6gdz6uhy6-pedros-projects-da4369b0.vercel.app",
        "https://e-commerce-store-nine-lovat.vercel.app",
        "https://e-commerce-store-git-main-victor-delis-projects.vercel.app",
        "https://admin-frontend-76n4q4bcz-pedros-projects-da4369b0.vercel.app",
    ]
    
    # Redis
    redis_url: str = "redis://localhost:6379"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

# Create settings instance
settings = Settings()

# Database configuration
DATABASE_CONFIG = {
    "url": settings.database_url,
    "echo": settings.debug,
}

# JWT configuration
JWT_CONFIG = {
    "secret_key": settings.secret_key,
    "algorithm": settings.algorithm,
    "access_token_expire_minutes": settings.access_token_expire_minutes,
}

# API configuration
API_CONFIG = {
    "ecommerce_api_url": settings.ecommerce_api_url,
    "ecommerce_api_key": settings.ecommerce_api_key,
}

