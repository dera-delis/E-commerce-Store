from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import JSONResponse
import os
import uuid
from datetime import datetime
from app.routers.auth import verify_token

router = APIRouter()

# Configuration
UPLOAD_DIR = "uploads"  # Fallback for local development
GCS_BUCKET_NAME = os.getenv("GCS_BUCKET_NAME", "")  # Set via environment variable
USE_GCS = bool(GCS_BUCKET_NAME)  # Use GCS if bucket name is set

# Create uploads directory if it doesn't exist (for local dev fallback)
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

def allowed_file(filename):
    """Check if file extension is allowed"""
    return any(filename.lower().endswith(ext) for ext in ALLOWED_EXTENSIONS)

def upload_to_gcs(file_content: bytes, filename: str) -> str:
    """Upload file to Google Cloud Storage and return public URL"""
    try:
        from google.cloud import storage
        
        # Initialize GCS client
        client = storage.Client()
        bucket = client.bucket(GCS_BUCKET_NAME)
        
        # Create blob
        blob = bucket.blob(f"uploads/{filename}")
        
        # Set content type
        content_type = "image/jpeg"
        if filename.endswith(".png"):
            content_type = "image/png"
        elif filename.endswith(".gif"):
            content_type = "image/gif"
        elif filename.endswith(".webp"):
            content_type = "image/webp"
        
        # Upload file
        blob.upload_from_string(file_content, content_type=content_type)
        
        # Make blob publicly readable
        blob.make_public()
        
        # Return public URL
        return blob.public_url
    except Exception as e:
        print(f"❌ GCS upload failed: {e}", flush=True)
        raise HTTPException(status_code=500, detail=f"Failed to upload to cloud storage: {str(e)}")

@router.post("/image")
async def upload_image(
    file: UploadFile = File(...),
    current_user_id: str = Depends(verify_token)
):
    """Upload an image file to GCS (or local filesystem as fallback)"""
    try:
        # Check if file is provided
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")
        
        # Check file extension
        if not allowed_file(file.filename):
            raise HTTPException(
                status_code=400, 
                detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
            )
        
        # Check file size
        file_content = await file.read()
        if len(file_content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400, 
                detail=f"File too large. Maximum size: {MAX_FILE_SIZE // (1024*1024)}MB"
            )
        
        # Generate unique filename
        file_extension = os.path.splitext(file.filename)[1].lower()
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        
        # Upload to GCS if configured, otherwise use local filesystem
        if USE_GCS:
            try:
                file_url = upload_to_gcs(file_content, unique_filename)
                print(f"✅ Image uploaded to GCS: {file_url}", flush=True)
            except Exception as gcs_error:
                print(f"⚠️ GCS upload failed, falling back to local: {gcs_error}", flush=True)
                # Fallback to local storage
                file_path = os.path.join(UPLOAD_DIR, unique_filename)
                with open(file_path, "wb") as buffer:
                    buffer.write(file_content)
                file_url = f"/uploads/{unique_filename}"
        else:
            # Local filesystem storage (for development)
            file_path = os.path.join(UPLOAD_DIR, unique_filename)
            with open(file_path, "wb") as buffer:
                buffer.write(file_content)
            file_url = f"/uploads/{unique_filename}"
        
        return JSONResponse(content={
            "message": "Image uploaded successfully",
            "file_url": file_url,
            "filename": unique_filename,
            "original_filename": file.filename,
            "size": len(file_content)
        })
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Upload error: {e}", flush=True)
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@router.get("/image/{filename}")
async def get_image(filename: str):
    """Serve uploaded images (only for local filesystem, GCS files are served directly)"""
    try:
        # If using GCS, images are served directly from GCS public URLs
        # This endpoint is only for local filesystem fallback
        file_path = os.path.join(UPLOAD_DIR, filename)
        
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="Image not found")
        
        from fastapi.responses import FileResponse
        return FileResponse(file_path)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to serve image: {str(e)}")
