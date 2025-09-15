# Main entry point for Northflank deployment
import sys
import os

# Add the backend directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

# Change to backend directory to make relative imports work
os.chdir(os.path.join(os.path.dirname(__file__), 'backend'))

# Import and run the FastAPI app
from app.main import app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
