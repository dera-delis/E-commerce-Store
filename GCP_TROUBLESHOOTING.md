# 🔧 GCP Deployment Troubleshooting Guide

## Current Issue: "Placeholder" Message in Cloud Run

If you see "Sorry, this is just a placeholder..." it means the build hasn't completed successfully yet.

## Step 1: Check Build Status

1. **Go to Cloud Build Console**
   - Open [Cloud Build History](https://console.cloud.google.com/cloud-build/builds)
   - Find the latest build for your project
   - Click on it to see build logs

2. **Check Build Logs**
   - Look for error messages
   - Common issues:
     - ❌ "unable to prepare context: unable to evaluate symlinks in Dockerfile path"
     - ❌ "Dockerfile not found"
     - ❌ Build timeout
     - ❌ Dependency installation failures

## Step 2: Verify Cloud Run Configuration

1. **Go to Cloud Run Console**
   - Open [Cloud Run Services](https://console.cloud.google.com/run)
   - Click on `ecommerce-backend` service
   - Go to **"Revisions"** tab
   - Check if there's a failed revision

2. **Check Service Configuration**
   - Go to **"Edit & Deploy New Revision"**
   - Verify:
     - **Source**: Should be "Cloud Build" or "Container image"
     - **Dockerfile path**: Should be `backend/Dockerfile`
     - **Build context**: Should be `backend/`

## Step 3: Common Fixes

### Fix 1: Cloud Run Building from Wrong Location

If Cloud Run is building from source directly:

1. **Option A: Use Cloud Build (Recommended)**
   - In Cloud Run, go to **"Edit & Deploy New Revision"**
   - Under **"Container"**, select **"Container image URL"**
   - Use: `gcr.io/ecommerce-store-482103/ecommerce-backend:latest`
   - First, build the image using Cloud Build:
     ```bash
     gcloud builds submit --config cloudbuild.yaml
     ```

2. **Option B: Fix Source Build**
   - In Cloud Run, go to **"Edit & Deploy New Revision"**
   - Under **"Source"**, click **"Edit"**
   - **Dockerfile path**: `backend/Dockerfile`
   - **Build context**: `backend/`
   - **Working directory**: Leave empty or set to `backend/`

### Fix 2: Build Fails with "Dockerfile not found"

**Solution**: The `cloudbuild.yaml` file should handle this. Verify:
- ✅ `cloudbuild.yaml` exists in root directory
- ✅ `backend/Dockerfile` exists
- ✅ Cloud Build is using the `cloudbuild.yaml` file

**To manually trigger build:**
```bash
gcloud builds submit --config cloudbuild.yaml
```

### Fix 3: Environment Variables Missing

The backend needs these environment variables in Cloud Run:

1. **Go to Cloud Run Service**
   - Click **"Edit & Deploy New Revision"**
   - Go to **"Variables & Secrets"** tab
   - Add these variables:

```
DATABASE_URL=postgresql://postgres:PASSWORD@CLOUD_SQL_IP:5432/ecommerce
REDIS_URL=redis://REDIS_IP:6379
JWT_SECRET_KEY=your-super-secret-key-change-this
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=https://your-customer-frontend.web.app,https://your-admin-frontend.web.app
ENVIRONMENT=production
DEBUG=false
PORT=8080
```

**Important**: Replace placeholders with actual values!

### Fix 4: Cloud SQL Connection Issues

1. **Add Cloud SQL Connection**
   - In Cloud Run service, go to **"Connections"** tab
   - Click **"Add connection"**
   - Select your Cloud SQL instance
   - Click **"Save"**

2. **Update DATABASE_URL**
   - Use Cloud SQL connection name format:
   ```
   DATABASE_URL=postgresql://postgres:PASSWORD@/ecommerce?host=/cloudsql/PROJECT_ID:REGION:INSTANCE_ID
   ```
   - Or use public IP:
   ```
   DATABASE_URL=postgresql://postgres:PASSWORD@PUBLIC_IP:5432/ecommerce
   ```

## Step 4: Manual Build and Deploy

If automatic deployment isn't working, deploy manually:

### 1. Build Image
```bash
# Set your project
gcloud config set project ecommerce-store-482103

# Build the image
gcloud builds submit --config cloudbuild.yaml
```

### 2. Deploy to Cloud Run
```bash
gcloud run deploy ecommerce-backend \
  --image gcr.io/ecommerce-store-482103/ecommerce-backend:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --min-instances 0 \
  --max-instances 1 \
  --memory 512Mi \
  --cpu 1 \
  --add-cloudsql-instances ecommerce-store-482103:us-central1:ecommerce-postgres \
  --set-env-vars DATABASE_URL=postgresql://postgres:PASSWORD@PUBLIC_IP:5432/ecommerce \
  --set-env-vars JWT_SECRET_KEY=your-secret-key \
  --set-env-vars CORS_ORIGINS=https://your-frontend.web.app
```

## Step 5: Verify Deployment

1. **Check Service URL**
   - Go to Cloud Run service
   - Copy the service URL
   - Test: `https://YOUR-SERVICE-URL.run.app/health`
   - Should return: `{"status": "healthy"}`

2. **Check API Docs**
   - Visit: `https://YOUR-SERVICE-URL.run.app/docs`
   - Should show Swagger UI

3. **Check Logs**
   - Go to Cloud Run service → **"Logs"** tab
   - Look for startup messages
   - Check for errors

## Common Error Messages

### "unable to prepare context: unable to evaluate symlinks in Dockerfile path"
**Fix**: Use `cloudbuild.yaml` or set correct Dockerfile path in Cloud Run

### "Connection refused" or "Database connection failed"
**Fix**: 
- Check Cloud SQL authorized networks
- Verify DATABASE_URL format
- Check Cloud SQL connection in Cloud Run

### "Port 8000 already in use"
**Fix**: Cloud Run uses PORT env var (default 8080). The Dockerfile should handle this.

### "Module not found" or "Import error"
**Fix**: Check `requirements.txt` includes all dependencies

## Still Having Issues?

1. **Check Cloud Build Logs**
   - [Cloud Build History](https://console.cloud.google.com/cloud-build/builds)

2. **Check Cloud Run Logs**
   - Cloud Run service → **"Logs"** tab

3. **Verify Files**
   - ✅ `cloudbuild.yaml` in root
   - ✅ `backend/Dockerfile` exists
   - ✅ `backend/requirements.txt` exists

4. **Test Locally First**
   ```bash
   cd backend
   docker build -t test-backend .
   docker run -p 8000:8000 test-backend
   ```

## Next Steps After Successful Deployment

1. ✅ Note your Cloud Run service URL
2. ✅ Update CORS_ORIGINS with frontend URLs
3. ✅ Deploy frontends to Firebase
4. ✅ Initialize database
5. ✅ Test all endpoints

---

**Need more help?** Check the full deployment guide: `GCP_DEPLOYMENT_GUIDE.md`

