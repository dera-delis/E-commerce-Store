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

# Test imports before starting
try:
    print("🔍 Testing imports...", flush=True)
    import uvicorn
    print("✅ uvicorn imported", flush=True)
    
    # Try importing the app module
    try:
        print("🔍 Importing app.main...", flush=True)
        from app import main
        print("✅ app.main imported successfully", flush=True)
        print(f"✅ App object: {main.app}", flush=True)
    except Exception as e:
        print(f"❌ Failed to import app.main: {e}", flush=True)
        import traceback
        traceback.print_exc()
        sys.exit(1)
    
    print("✅ All imports successful, starting server...", flush=True)
    print(f"🌐 Server will listen on 0.0.0.0:{port}", flush=True)
    
    # Run uvicorn with explicit configuration
    # Use exec to ensure proper signal handling
    import uvicorn.config
    import uvicorn.server
    
    # Start server - this should not block on startup
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        log_level="info",
        access_log=True,
        loop="auto"
    )
except KeyboardInterrupt:
    print("🛑 Server stopped by user", flush=True)
    sys.exit(0)
except Exception as e:
    print(f"❌ Fatal error starting server: {e}", flush=True)
    import traceback
    traceback.print_exc()
    sys.exit(1)

