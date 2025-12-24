from pydantic_settings import BaseSettings
from typing import List, Optional
from pydantic import Field, field_validator
import os

class Settings(BaseSettings):
    # Database - reads from DATABASE_URL environment variable
    # Also supports database_url for backward compatibility
    database_url: str = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/ecommerce")
    
    # JWT - reads from JWT_SECRET_KEY, JWT_ALGORITHM, JWT_ACCESS_TOKEN_EXPIRE_MINUTES
    secret_key: str = os.getenv("JWT_SECRET_KEY", "your-super-secret-key-change-in-production")
    algorithm: str = os.getenv("JWT_ALGORITHM", "HS256")
    access_token_expire_minutes: int = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    # API Configuration
    ecommerce_api_url: str = "https://api.example.com"
    ecommerce_api_key: str = "your-api-key-here"
    
    # Server - reads from PORT environment variable (Cloud Run sets this)
    host: str = "0.0.0.0"
    port: int = int(os.getenv("PORT", os.getenv("port", "8000")))
    debug: bool = os.getenv("DEBUG", "false").lower() in ("true", "1", "yes", "on")
    environment: str = os.getenv("ENVIRONMENT", "development")
    
    # CORS - reads from CORS_ORIGINS (comma-separated string)
    # Default origins for local development and existing deployments
    _default_origins = [
        "http://localhost:3000", 
        "http://localhost:3001", 
        "http://localhost:5030",
        "https://frontend-6gdz6uhy6-pedros-projects-da4369b0.vercel.app",
        "https://e-commerce-store-nine-lovat.vercel.app",
        "https://e-commerce-store-git-main-victor-delis-projects.vercel.app",
        "https://admin-frontend-76n4q4bcz-pedros-projects-da4369b0.vercel.app",
    ]
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Parse CORS_ORIGINS from environment variable
        cors_env = os.getenv("CORS_ORIGINS", "")
        if cors_env:
            # Parse comma-separated string
            origins = [origin.strip() for origin in cors_env.split(",") if origin.strip()]
            # Merge with defaults to avoid breaking existing deployments
            self.allowed_origins = list(set(self._default_origins + origins))
        else:
            self.allowed_origins = self._default_origins
    
    # Redis - reads from REDIS_URL environment variable
    redis_url: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    
    class Config:
        env_file = ".env"
        case_sensitive = False

# Create settings instance
settings = Settings()

# Ensure allowed_origins is initialized (in case __init__ wasn't called properly)
if not hasattr(settings, 'allowed_origins') or not settings.allowed_origins:
    cors_env = os.getenv("CORS_ORIGINS", "")
    default_origins = [
        "http://localhost:3000", 
        "http://localhost:3001", 
        "http://localhost:5030",
        "https://frontend-6gdz6uhy6-pedros-projects-da4369b0.vercel.app",
        "https://e-commerce-store-nine-lovat.vercel.app",
        "https://e-commerce-store-git-main-victor-delis-projects.vercel.app",
        "https://admin-frontend-76n4q4bcz-pedros-projects-da4369b0.vercel.app",
    ]
    if cors_env:
        origins = [origin.strip() for origin in cors_env.split(",") if origin.strip()]
        settings.allowed_origins = list(set(default_origins + origins))
    else:
        settings.allowed_origins = default_origins

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

