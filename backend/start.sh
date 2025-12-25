#!/bin/sh
set -e

# Get port from environment variable, default to 8080
PORT=${PORT:-8080}

echo "🚀 Starting E-commerce Store Backend on port $PORT"

# Start uvicorn
exec uvicorn app.main:app --host 0.0.0.0 --port "$PORT"

