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
        
        # Try to make blob publicly readable
        # This will work even if bucket has public access prevention enabled
        # (individual blobs can be made public even when bucket-level prevention is on)
        try:
            blob.make_public()
            print(f"✅ Blob made public: {blob.public_url}", flush=True)
            return blob.public_url
        except Exception as public_error:
            # If making public fails (e.g., org policy), generate a signed URL instead
            print(f"⚠️ Could not make blob public (may be restricted by org policy): {public_error}", flush=True)
            print(f"ℹ️ Using signed URL instead (valid for 1 year)", flush=True)
            
            # Generate signed URL that's valid for 1 year
            from datetime import timedelta
            url = blob.generate_signed_url(
                expiration=timedelta(days=365),
                method='GET'
            )
            return url
        
    except Exception as e:
        print(f"❌ GCS upload failed: {e}", flush=True)
        import traceback
        traceback.print_exc()
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
            print(f"📤 Uploading to GCS bucket: {GCS_BUCKET_NAME}", flush=True)
            try:
                file_url = upload_to_gcs(file_content, unique_filename)
                print(f"✅ Image uploaded to GCS successfully!", flush=True)
                print(f"   URL: {file_url}", flush=True)
                print(f"   Bucket: {GCS_BUCKET_NAME}", flush=True)
                print(f"   Filename: {unique_filename}", flush=True)
            except Exception as gcs_error:
                print(f"❌ GCS upload failed: {gcs_error}", flush=True)
                import traceback
                traceback.print_exc()
                print(f"⚠️ Falling back to local filesystem storage", flush=True)
                # Fallback to local storage
                file_path = os.path.join(UPLOAD_DIR, unique_filename)
                with open(file_path, "wb") as buffer:
                    buffer.write(file_content)
                file_url = f"/uploads/{unique_filename}"
                print(f"⚠️ Using local storage: {file_url}", flush=True)
        else:
            # Local filesystem storage (for development)
            print(f"ℹ️ GCS not configured (GCS_BUCKET_NAME not set), using local storage", flush=True)
            file_path = os.path.join(UPLOAD_DIR, unique_filename)
            with open(file_path, "wb") as buffer:
                buffer.write(file_content)
            file_url = f"/uploads/{unique_filename}"
            print(f"📁 Saved locally: {file_url}", flush=True)
        
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
