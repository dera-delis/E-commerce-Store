# Setup Google Cloud Storage for Image Uploads

## Problem
Images uploaded through the admin panel disappear after a few minutes because Cloud Run containers are ephemeral - the local filesystem gets wiped when containers restart or scale.

## Solution
Use Google Cloud Storage (GCS) for persistent image storage.

## Steps to Set Up GCS Bucket

### 1. Create a GCS Bucket

1. **Go to Cloud Storage Console:**
   https://console.cloud.google.com/storage/browser?project=ecommerce-store-482103

2. **Click "Create Bucket"**

3. **Configure the bucket:**
   - **Name:** `ecommerce-store-uploads` (or your preferred name)
   - **Location type:** Region
   - **Location:** `us-central1` (same as your Cloud Run services)
   - **Storage class:** Standard
   - **Access control:** Uniform bucket-level access
   - **Public access:** Allow public access (so images can be viewed)

4. **Click "Create"**

### 2. Grant Cloud Run Service Account Access

1. **Go to IAM & Admin:**
   https://console.cloud.google.com/iam-admin/iam?project=ecommerce-store-482103

2. **Find your Cloud Run service account:**
   - Look for: `PROJECT_NUMBER-compute@developer.gserviceaccount.com`
   - Or: `ecommerce-backend@PROJECT_ID.iam.gserviceaccount.com`
   - If you don't see it, you can find it in Cloud Run service details

3. **Grant Storage Admin role:**
   - Click the edit icon (pencil) next to the service account
   - Click "Add Another Role"
   - Select: **Storage Admin** (`roles/storage.admin`)
   - Click "Save"

### 3. Set Environment Variable in Cloud Run

1. **Go to Cloud Run Console:**
   https://console.cloud.google.com/run/detail/us-central1/ecommerce-backend?project=ecommerce-store-482103

2. **Click "Edit & Deploy New Revision"**

3. **Go to "Variables & Secrets" tab**

4. **Add environment variable:**
   - **Name:** `GCS_BUCKET_NAME`
   - **Value:** `ecommerce-store-uploads` (or your bucket name)

5. **Click "Deploy"**

### 4. Make Bucket Public (for image viewing)

1. **Go to your bucket:**
   https://console.cloud.google.com/storage/browser/ecommerce-store-uploads?project=ecommerce-store-482103

2. **Click "Permissions" tab**

3. **Click "Grant Access"**

4. **Add:**
   - **Principal:** `allUsers`
   - **Role:** `Storage Object Viewer`

5. **Click "Save"**

## Alternative: Using gcloud CLI

If you have `gcloud` CLI installed:

```powershell
# Set your project
gcloud config set project ecommerce-store-482103

# Create bucket
gsutil mb -p ecommerce-store-482103 -c STANDARD -l us-central1 gs://ecommerce-store-uploads

# Make bucket public
gsutil iam ch allUsers:objectViewer gs://ecommerce-store-uploads

# Set environment variable in Cloud Run
gcloud run services update ecommerce-backend \
  --region us-central1 \
  --update-env-vars GCS_BUCKET_NAME=ecommerce-store-uploads
```

## Verify Setup

1. **Upload an image through the admin panel**
2. **Check the image URL** - it should start with `https://storage.googleapis.com/...`
3. **The image should persist** even after Cloud Run restarts

## Notes

- Images uploaded before GCS setup will still be lost (they were in local filesystem)
- New uploads will be stored in GCS and persist permanently
- The code automatically falls back to local filesystem if GCS_BUCKET_NAME is not set (for local development)

