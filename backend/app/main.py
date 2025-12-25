from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import uvicorn
import os
from app.config import settings
from app.routers import auth, products, cart, orders, admin, upload
from app.database import init_db

# Application lifespan
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    import sys
    print("🚀 Starting E-commerce Store Backend...", flush=True)
    print(f"📦 Python version: {sys.version}", flush=True)
    print(f"🌐 PORT environment variable: {os.getenv('PORT', 'not set')}", flush=True)
    print("📊 Initializing database...", flush=True)
    try:
        init_db()
        print("✅ Database initialization completed", flush=True)
    except Exception as e:
        print(f"⚠️ Warning: Database initialization failed: {e}", flush=True)
        print("⚠️ App will continue, but database features may not work until database is configured.", flush=True)
        import traceback
        traceback.print_exc()
    print("✅ Application startup complete", flush=True)
    yield
    # Shutdown
    print("🛑 Shutting down E-commerce Store Backend...", flush=True)

# Create FastAPI app
app = FastAPI(
    title="E-commerce Store API",
    description="Full-stack e-commerce store backend API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add trusted host middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]  # Configure appropriately for production
)

# Include routers with versioning
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(products.router, prefix="/api/v1/products", tags=["Products"])
app.include_router(cart.router, prefix="/api/v1/cart", tags=["Cart"])
app.include_router(orders.router, prefix="/api/v1/orders", tags=["Orders"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])
app.include_router(upload.router, prefix="/api/v1/upload", tags=["Upload"])

# Mount static files for uploads
if os.path.exists("uploads"):
    app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "ecommerce-store-backend",
        "version": "1.0.0"
    }

# API version endpoint
@app.get("/api/version")
async def api_version():
    return {
        "api_version": "v1",
        "current_version": "1.0.0",
        "supported_versions": ["v1"],
        "deprecated_versions": []
    }

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to E-commerce Store API",
        "version": "1.0.0",
        "api_version": "v1",
        "docs": "/docs",
        "health": "/health",
        "version_info": "/api/version"
    }

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug
    )

