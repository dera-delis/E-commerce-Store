#!/usr/bin/env python3
"""Startup script for Cloud Run - ensures PORT is read correctly"""
import os
import sys

# Get port from environment variable
port = int(os.getenv("PORT", "8080"))

print(f"🚀 Starting server on port {port}", flush=True)
print(f"📦 Python: {sys.version}", flush=True)

# Import and run uvicorn
import uvicorn
uvicorn.run(
    "app.main:app",
    host="0.0.0.0",
    port=port,
    log_level="info"
)

