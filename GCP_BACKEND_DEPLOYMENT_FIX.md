# 🔧 GCP Backend Deployment Fix Guide

This guide addresses common issues when deploying the backend to Google Cloud Platform (GCP) Cloud Run.

## ✅ What Was Fixed

### 1. Environment Variable Handling
- **Issue**: `config.py` wasn't properly reading environment variables from Cloud Run
- **Fix**: Updated `config.py` to use `os.getenv()` directly for all environment variables
- **Files Changed**: `backend/app/config.py`

### 2. Cloud Build Configuration
- **Issue**: `cloudbuild.yaml` only built the image but didn't deploy it
- **Fix**: Added deployment step to automatically deploy to Cloud Run after build
- **Files Changed**: `cloudbuild.yaml`

### 3. Dockerfile Port Configuration
- **Issue**: Port handling could be improved for Cloud Run
- **Fix**: Updated to default to port 8080 (Cloud Run's default) while maintaining backward compatibility
- **Files Changed**: `backend/Dockerfile`

## 🚀 Quick Deployment Steps

### Option 1: Using the Deployment Script (Recommended)

**For Linux/Mac:**
```bash
chmod +x deploy-gcp.sh
./deploy-gcp.sh
```

**For Windows (PowerShell):**
```powershell
.\deploy-gcp.ps1
```

### Option 2: Manual Deployment

1. **Set your GCP project:**
   ```bash
   gcloud config set project YOUR_PROJECT_ID
   ```

2. **Enable required APIs:**
   ```bash
   gcloud services enable cloudbuild.googleapis.com
   gcloud services enable run.googleapis.com
   gcloud services enable sqladmin.googleapis.com
   ```

3. **Build and deploy:**
   ```bash
   gcloud builds submit --config cloudbuild.yaml
   ```

4. **Set environment variables:**
   ```bash
   gcloud run services update ecommerce-backend \
     --region us-central1 \
     --set-env-vars DATABASE_URL=postgresql://postgres:PASSWORD@IP:5432/ecommerce \
     --set-env-vars JWT_SECRET_KEY=your-secret-key \
     --set-env-vars CORS_ORIGINS=https://your-frontend.web.app
   ```

## 🔍 Troubleshooting Common Issues

### Issue 1: "Backend won't start" or "Placeholder message"

**Symptoms:**
- Cloud Run shows "Sorry, this is just a placeholder..."
- Service URL returns error

**Solutions:**

1. **Check Cloud Build logs:**
   - Go to [Cloud Build History](https://console.cloud.google.com/cloud-build/builds)
   - Find the latest build
   - Check for errors in build logs

2. **Check Cloud Run logs:**
   - Go to [Cloud Run Console](https://console.cloud.google.com/run)
   - Click on `ecommerce-backend` service
   - Go to "Logs" tab
   - Look for startup errors

3. **Verify environment variables:**
   - Go to Cloud Run service → "Edit & Deploy New Revision"
   - Check "Variables & Secrets" tab
   - Ensure all required variables are set:
     - `DATABASE_URL`
     - `JWT_SECRET_KEY`
     - `CORS_ORIGINS`
     - `PORT` (optional, Cloud Run sets this automatically)

### Issue 2: "Database connection failed"

**Symptoms:**
- Backend starts but can't connect to database
- Errors in logs about database connection

**Solutions:**

1. **Check Cloud SQL connection:**
   - Go to Cloud Run service → "Connections" tab
   - Ensure Cloud SQL instance is connected
   - Connection name format: `PROJECT_ID:REGION:INSTANCE_ID`

2. **Verify DATABASE_URL format:**
   - For Cloud SQL connection: `postgresql://postgres:PASSWORD@/ecommerce?host=/cloudsql/PROJECT_ID:REGION:INSTANCE_ID`
   - For public IP: `postgresql://postgres:PASSWORD@PUBLIC_IP:5432/ecommerce`

3. **Check authorized networks:**
   - Go to Cloud SQL instance → "Connections"
   - Ensure Cloud Run service account has access
   - Or add `0.0.0.0/0` to authorized networks (less secure)

### Issue 3: "Port already in use" or "Port binding error"

**Symptoms:**
- Container fails to start
- Port-related errors in logs

**Solutions:**

1. **Verify PORT environment variable:**
   - Cloud Run automatically sets `PORT=8080`
   - The Dockerfile now defaults to 8080
   - Don't manually set PORT unless necessary

2. **Check Dockerfile CMD:**
   - Should be: `uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080}`
   - This uses PORT env var if set, otherwise defaults to 8080

### Issue 4: "CORS errors" in frontend

**Symptoms:**
- Frontend can't make API requests
- Browser console shows CORS errors

**Solutions:**

1. **Update CORS_ORIGINS:**
   ```bash
   gcloud run services update ecommerce-backend \
     --region us-central1 \
     --set-env-vars CORS_ORIGINS=https://your-customer-frontend.web.app,https://your-admin-frontend.web.app
   ```

2. **Verify CORS_ORIGINS format:**
   - Comma-separated list of URLs
   - No spaces after commas
   - Include `https://` protocol
   - No trailing slashes

3. **Check backend logs:**
   - Look for CORS-related errors
   - Verify allowed_origins is being parsed correctly

### Issue 5: "Build fails" or "Dockerfile not found"

**Symptoms:**
- Cloud Build fails
- Error: "unable to prepare context" or "Dockerfile not found"

**Solutions:**

1. **Verify file structure:**
   - `cloudbuild.yaml` should be in root directory
   - `backend/Dockerfile` should exist
   - `backend/requirements.txt` should exist

2. **Check cloudbuild.yaml:**
   - Dockerfile path: `backend/Dockerfile`
   - Build context: `backend`

3. **Manual build test:**
   ```bash
   cd backend
   docker build -t test-backend .
   docker run -p 8080:8080 test-backend
   ```

## 📋 Required Environment Variables

Set these in Cloud Run console or via gcloud CLI:

```bash
DATABASE_URL=postgresql://postgres:PASSWORD@IP:5432/ecommerce
REDIS_URL=redis://IP:6379  # Optional
JWT_SECRET_KEY=your-super-secret-key-change-this
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=https://your-customer-frontend.web.app,https://your-admin-frontend.web.app
ENVIRONMENT=production
DEBUG=false
PORT=8080  # Usually set automatically by Cloud Run
```

## 🔐 Security Checklist

- [ ] Change default JWT_SECRET_KEY
- [ ] Use strong database password
- [ ] Update CORS_ORIGINS with actual frontend URLs
- [ ] Enable Cloud SQL private IP (if using VPC)
- [ ] Set up Cloud SQL authorized networks
- [ ] Enable SSL for database connections
- [ ] Review Cloud Run IAM permissions
- [ ] Set up monitoring and alerts

## 📊 Verification Steps

After deployment, verify everything works:

1. **Health Check:**
   ```bash
   curl https://YOUR-SERVICE-URL.run.app/health
   ```
   Should return: `{"status": "healthy"}`

2. **API Docs:**
   - Visit: `https://YOUR-SERVICE-URL.run.app/docs`
   - Should show Swagger UI

3. **Database Connection:**
   - Check Cloud Run logs for database initialization
   - Should see: "✅ Database initialized with sample data"

4. **Test API Endpoint:**
   ```bash
   curl https://YOUR-SERVICE-URL.run.app/api/v1/products
   ```
   Should return product list

## 🆘 Still Having Issues?

1. **Check Cloud Build logs:**
   - [Cloud Build History](https://console.cloud.google.com/cloud-build/builds)

2. **Check Cloud Run logs:**
   - Cloud Run service → "Logs" tab

3. **Check Cloud SQL logs:**
   - Cloud SQL instance → "Logs" tab

4. **Review deployment guide:**
   - See `GCP_DEPLOYMENT_GUIDE.md` for detailed steps

5. **Test locally first:**
   ```bash
   cd backend
   docker build -t test-backend .
   docker run -p 8080:8080 \
     -e DATABASE_URL=your-db-url \
     -e JWT_SECRET_KEY=test-key \
     test-backend
   ```

## 📝 Next Steps After Successful Deployment

1. ✅ Note your Cloud Run service URL
2. ✅ Update frontend `.env.production` files with backend URL
3. ✅ Deploy frontends to Firebase Hosting
4. ✅ Update CORS_ORIGINS with frontend URLs
5. ✅ Initialize database (if not auto-initialized)
6. ✅ Test all API endpoints
7. ✅ Set up monitoring and alerts

---

**Last Updated:** 2024
**Status:** ✅ Backend deployment issues fixed

