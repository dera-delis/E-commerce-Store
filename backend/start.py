#!/usr/bin/env python3
"""Startup script for Cloud Run - ensures PORT is read correctly"""
import os
import sys

# Get port from environment variable
port = int(os.getenv("PORT", "8080"))

print(f"🚀 Starting server on port {port}", flush=True)
print(f"📦 Python: {sys.version}", flush=True)
print(f"📁 Working directory: {os.getcwd()}", flush=True)
print(f"📋 Python path: {sys.path}", flush=True)
print(f"🌐 PORT environment variable: {os.getenv('PORT', 'not set')}", flush=True)

# CRITICAL: Import uvicorn first - it's the most reliable
try:
    print("🔍 Step 1: Importing uvicorn...", flush=True)
    import uvicorn
    print("✅ uvicorn imported", flush=True)
except Exception as e:
    print(f"❌ CRITICAL: Cannot import uvicorn: {e}", flush=True)
    import traceback
    traceback.print_exc()
    sys.exit(1)

# Try importing the app module with detailed error reporting
try:
    print("🔍 Step 2: Importing app.main...", flush=True)
    from app import main
    print("✅ app.main imported successfully", flush=True)
    print(f"✅ App object type: {type(main.app)}", flush=True)
    print(f"✅ App object: {main.app}", flush=True)
except Exception as e:
    print(f"❌ CRITICAL: Failed to import app.main: {e}", flush=True)
    import traceback
    traceback.print_exc()
    print("\n" + "="*80, flush=True)
    print("FALLBACK: Starting minimal server to debug...", flush=True)
    print("="*80 + "\n", flush=True)
    
    # Fallback to minimal app
    from fastapi import FastAPI
    app = FastAPI()
    @app.get("/")
    async def root():
        return {"status": "error", "message": f"App import failed: {str(e)}"}
    @app.get("/health")
    async def health():
        return {"status": "degraded", "error": str(e)}
    
    print("✅ Fallback app created, starting server...", flush=True)
    uvicorn.run(app, host="0.0.0.0", port=port, log_level="info")
    sys.exit(0)

# All good - start the real app
try:
    print("✅ Step 3: All imports successful, starting server...", flush=True)
    print(f"🌐 Server will listen on 0.0.0.0:{port}", flush=True)
    
    # Start server - use string reference to avoid import issues
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        log_level="info",
        access_log=True
    )
except KeyboardInterrupt:
    print("🛑 Server stopped by user", flush=True)
    sys.exit(0)
except Exception as e:
    print(f"❌ CRITICAL: Fatal error starting server: {e}", flush=True)
    import traceback
    traceback.print_exc()
    sys.exit(1)

