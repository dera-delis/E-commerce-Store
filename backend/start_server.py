#!/usr/bin/env python3
"""Startup script for Cloud Run deployment"""
import os
import sys

# Get port from environment variable, default to 8080
port = int(os.getenv("PORT", "8080"))

print(f"🚀 Starting E-commerce Store Backend on port {port}", flush=True)
print(f"📦 Python version: {sys.version}", flush=True)
print(f"🌐 PORT environment variable: {port}", flush=True)

# Import uvicorn and start the server
import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        log_level="info"
    )

