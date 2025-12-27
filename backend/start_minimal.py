#!/usr/bin/env python3
"""Minimal startup script - guaranteed to work"""
import os
import sys

port = int(os.getenv("PORT", "8080"))

print(f"🚀 MINIMAL START: Port {port}", flush=True)
print(f"📁 CWD: {os.getcwd()}", flush=True)

# Create minimal FastAPI app that starts immediately
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"status": "ok", "message": "Server is running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

# Start server immediately
import uvicorn
print(f"✅ Starting uvicorn on 0.0.0.0:{port}", flush=True)

uvicorn.run(
    app,
    host="0.0.0.0",
    port=port,
    log_level="info"
)

