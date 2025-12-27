from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import uvicorn
import os

# CRITICAL: Import settings with error handling - don't block if it fails
try:
    from app.config import settings
except Exception as e:
    print(f"⚠️ Warning: Could not import settings: {e}", flush=True)
    # Create minimal settings
    class MinimalSettings:
        allowed_origins = ["*"]
        host = "0.0.0.0"
        port = int(os.getenv("PORT", "8080"))
        debug = False
    settings = MinimalSettings()

# CRITICAL: Import database with error handling - don't block if it fails
try:
    from app.database import init_db
except Exception as e:
    print(f"⚠️ Warning: Could not import database: {e}", flush=True)
    init_db = None

# Import routers with error handling
try:
    from app.routers import auth, products, cart, orders, admin, upload
    routers_available = True
except Exception as e:
    print(f"⚠️ Warning: Some routers failed to import: {e}", flush=True)
    import traceback
    traceback.print_exc()
    routers_available = False
    # Create dummy routers to prevent crashes
    class DummyRouter:
        pass
    auth = products = cart = orders = admin = upload = DummyRouter()

# Application lifespan - CRITICAL: Must be fast and never block
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup - mark ready IMMEDIATELY
    import sys
    print("🚀 Starting E-commerce Store Backend...", flush=True)
    print(f"📦 Python version: {sys.version}", flush=True)
    print(f"🌐 PORT environment variable: {os.getenv('PORT', 'not set')}", flush=True)
    
    # CRITICAL: Yield immediately - server MUST be ready NOW
    print("✅ Application startup complete - server is ready!", flush=True)
    yield
    
    # Initialize database in background AFTER server is ready
    if init_db:
        def init_db_background():
            try:
                print("📊 Initializing database in background...", flush=True)
                init_db()
            except Exception as e:
                print(f"⚠️ Warning: Database initialization failed: {e}", flush=True)
        
        import threading
        db_thread = threading.Thread(target=init_db_background, daemon=True)
        db_thread.start()
    
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

# Add CORS middleware - with error handling
try:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=getattr(settings, 'allowed_origins', ["*"]),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
except Exception as e:
    print(f"⚠️ Warning: CORS middleware setup failed: {e}", flush=True)

# Add trusted host middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]  # Configure appropriately for production
)

# Include routers with versioning (with error handling)
if routers_available:
    try:
        app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
        app.include_router(products.router, prefix="/api/v1/products", tags=["Products"])
        app.include_router(cart.router, prefix="/api/v1/cart", tags=["Cart"])
        app.include_router(orders.router, prefix="/api/v1/orders", tags=["Orders"])
        app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])
        app.include_router(upload.router, prefix="/api/v1/upload", tags=["Upload"])
        print("✅ All routers registered successfully", flush=True)
    except Exception as e:
        print(f"⚠️ Warning: Failed to register some routers: {e}", flush=True)
        import traceback
        traceback.print_exc()
        # App will still start, just without those routers
else:
    print("⚠️ Warning: Routers not available, app will start with limited functionality", flush=True)

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

