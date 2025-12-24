# ☁️ Google Cloud Platform (GCP) Free Tier Deployment Guide

Complete guide to deploy your E-Commerce Store to GCP using **FREE TIER** services.

## 🎯 Overview

This guide deploys your application using:
- **Cloud Run** - Backend API (FREE: 2 million requests/month)
- **Firebase Hosting** - Both Frontends (FREE: 10 GB storage, 360 MB/day)
- **Cloud SQL** - PostgreSQL Database (FREE tier available)
- **Cloud Memorystore** - Redis (Optional, can skip to save costs)

**Total Cost: $0/month for first 12 months!** 🎉

## 📋 Prerequisites

- Google Cloud Account (create at https://cloud.google.com)
- GitHub repository with your code (already done ✅)
- Google Cloud CLI installed (optional, for easier deployment)
- Credit card (required for account, but won't be charged if you stay in free tier)

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐
│ Customer        │     │ Admin           │
│ Frontend        │     │ Frontend        │
│ (Firebase)      │     │ (Firebase)      │
└────────┬────────┘     └────────┬────────┘
         │                        │
         └────────────┬───────────┘
                      │
              ┌───────▼───────┐
              │ Backend API   │
              │ (Cloud Run)   │
              └───────┬───────┘
                      │
         ┌────────────┼────────────┐
         │                        │
    ┌────▼────┐            ┌──────▼──────┐
    │ Cloud   │            │ Memorystore │
    │ SQL     │            │ Redis       │
    │ Postgres│            │ (Optional)  │
    └─────────┘            └─────────────┘
```

## 🚀 Step-by-Step Deployment

### Step 1: Set Up GCP Project

1. **Create GCP Account**
   - Go to https://cloud.google.com
   - Click "Get started for free"
   - Complete signup (requires credit card, but free tier won't charge)

2. **Create New Project**
   - Go to [GCP Console](https://console.cloud.google.com)
   - Click project dropdown → "New Project"
   - **Project name**: `ecommerce-store`
   - **Project ID**: `ecommerce-store-xxxxx` (auto-generated)
   - Click "Create"
   - **Select the project** from dropdown

3. **Enable Required APIs**
   - Go to [APIs & Services](https://console.cloud.google.com/apis/library)
   - Enable these APIs:
     - ✅ Cloud Run API
     - ✅ Cloud SQL Admin API
     - ✅ Cloud Build API
     - ✅ Firebase Hosting API
     - ✅ Cloud Memorystore for Redis API (if using Redis)

---

### Step 2: Set Up PostgreSQL Database (Cloud SQL)

1. **Go to Cloud SQL Console**
   - Open [Cloud SQL Console](https://console.cloud.google.com/sql)
   - Click **"Create Instance"**

2. **Choose Database Engine**
   - Select **PostgreSQL**

3. **Configure Instance**
   - **Instance ID**: `ecommerce-postgres`
   - **Password**: Create a **strong password** (save it!)
   - **Database version**: PostgreSQL 15
   - **Region**: Choose closest region (e.g., `us-central1`)
   - **Zonal availability**: Single zone (cheaper)

4. **Configure Machine**
   - **Machine type**: **Shared core** → **db-f1-micro** (free tier eligible)
   - **Storage**: 
     - **Type**: SSD
     - **Capacity**: 10 GB (minimum, free tier)
   - **Enable backups**: Yes (recommended)

5. **Configure Connections**
   - **Public IP**: ✅ Enable
   - **Private IP**: Leave disabled (unless using VPC)
   - **Authorized networks**: 
     - Click "Add network"
     - **Name**: `all`
     - **Network**: `0.0.0.0/0` (for Cloud Run access)
     - Click "Done"

6. **Create Database**
   - Scroll down to **"Database flags"** (optional)
   - Click **"Create Instance"**
   - Wait 5-10 minutes for creation

7. **Create Database**
   - Once instance is ready, click on it
   - Go to **"Databases"** tab
   - Click **"Create database"**
   - **Database name**: `ecommerce`
   - Click "Create"

8. **Note Connection Details**
   - Go to **"Overview"** tab
   - Note the **Public IP address**
   - Connection name format: `PROJECT_ID:REGION:INSTANCE_ID`

---

### Step 3: Set Up Redis (Cloud Memorystore) - Optional

**Skip this step if you want to save costs. Redis is optional.**

1. **Go to Memorystore Console**
   - Open [Memorystore Console](https://console.cloud.google.com/memorystore)
   - Click **"Create Instance"**

2. **Configure Redis**
   - **Instance ID**: `ecommerce-redis`
   - **Version**: Redis 7.x
   - **Region**: Same as Cloud SQL
   - **Tier**: Basic (cheaper)
   - **Capacity**: 1 GB (minimum)
   - **Network**: Default

3. **Create Instance**
   - Click **"Create"**
   - Wait 5-10 minutes
   - **Note the IP address**

---

### Step 4: Deploy Backend with Cloud Run

#### Option A: Using GCP Console (Easier)

1. **Go to Cloud Run Console**
   - Open [Cloud Run Console](https://console.cloud.google.com/run)
   - Click **"Create Service"**

2. **Deploy from Source**
   - **Deploy one revision from a source repository**
   - **Repository**: GitHub
   - **Authorize** GCP to access GitHub
   - **Repository**: Select `dera-delis/E-commerce-Store`
   - **Branch**: `main`
   - **Build type**: Dockerfile
   - **Dockerfile path**: `backend/Dockerfile`
   - **Docker context**: `backend/`

3. **Configure Service**
   - **Service name**: `ecommerce-backend`
   - **Region**: Same as Cloud SQL
   - **CPU allocation**: CPU is only allocated during request processing
   - **CPU**: 1
   - **Memory**: 512 MiB
   - **Minimum instances**: 0 (to stay in free tier)
   - **Maximum instances**: 1
   - **Request timeout**: 300 seconds

4. **Environment Variables**
   Click "Variables & Secrets" and add:
   ```
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@YOUR_CLOUD_SQL_IP:5432/ecommerce
   REDIS_URL=redis://YOUR_REDIS_IP:6379
   JWT_SECRET_KEY=your-super-secret-key-change-this-in-production
   JWT_ALGORITHM=HS256
   JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
   CORS_ORIGINS=https://your-customer-frontend.web.app,https://your-admin-frontend.web.app
   ENVIRONMENT=production
   DEBUG=false
   PORT=8080
   ```
   **Note:** 
   - Replace placeholders with actual values
   - Cloud Run uses PORT 8080 by default
   - Update CORS_ORIGINS after deploying frontends

5. **Cloud SQL Connection**
   - Under **"Connections"**, click **"Add connection"**
   - Select your Cloud SQL instance
   - Click "Create"

6. **Deploy**
   - Click **"Create"**
   - Wait 5-10 minutes for build and deployment
   - **Note the service URL** (e.g., `https://ecommerce-backend-xxxxx.run.app`)

#### Option B: Using gcloud CLI (Advanced)

```bash
# Install gcloud CLI (if not installed)
# https://cloud.google.com/sdk/docs/install

# Login
gcloud auth login

# Set project
gcloud config set project YOUR_PROJECT_ID

# Build and deploy
gcloud run deploy ecommerce-backend \
  --source ./backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars DATABASE_URL=postgresql://postgres:PASSWORD@IP:5432/ecommerce \
  --set-env-vars REDIS_URL=redis://REDIS_IP:6379 \
  --set-env-vars JWT_SECRET_KEY=your-secret-key \
  --set-env-vars CORS_ORIGINS=https://your-frontend.web.app \
  --add-cloudsql-instances PROJECT_ID:REGION:INSTANCE_ID \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 1
```

---

### Step 5: Update Backend for Cloud Run

Cloud Run expects the app to listen on the PORT environment variable. Let's check if the backend handles this:

The backend should already work, but let's verify the main.py uses the PORT env var. If not, we may need a small update.

---

### Step 6: Deploy Customer Frontend (Firebase Hosting)

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Initialize Firebase in Project**
   ```bash
   cd frontend
   firebase init hosting
   ```
   
   **Configuration:**
   - **Select Firebase project**: Create new project or select existing
   - **Project name**: `ecommerce-customer` (or your choice)
   - **Public directory**: `build`
   - **Single-page app**: Yes
   - **Automatic builds**: No (we'll build manually)
   - **Overwrite index.html**: No

3. **Create firebase.json**
   Create `frontend/firebase.json`:
   ```json
   {
     "hosting": {
       "public": "build",
       "ignore": [
         "firebase.json",
         "**/.*",
         "**/node_modules/**"
       ],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ],
       "headers": [
         {
           "source": "**/*.@(js|css)",
           "headers": [
             {
               "key": "Cache-Control",
               "value": "max-age=31536000"
             }
           ]
         }
       ]
     }
   }
   ```

4. **Create .env.production**
   Create `frontend/.env.production`:
   ```
   REACT_APP_API_URL=https://your-cloud-run-url.run.app
   REACT_APP_ENVIRONMENT=production
   ```

5. **Build and Deploy**
   ```bash
   cd frontend
   npm install
   npm run build
   firebase deploy --only hosting
   ```

6. **Note the URL**
   - Firebase will provide a URL like: `https://your-project.web.app`
   - Or custom domain if configured

---

### Step 7: Deploy Admin Frontend (Firebase Hosting)

1. **Create Separate Firebase Project (Recommended)**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Click "Add project"
   - **Project name**: `ecommerce-admin`
   - Click "Create project"

2. **Initialize Firebase for Admin**
   ```bash
   cd admin-frontend
   firebase init hosting
   ```
   
   **Configuration:**
   - **Select Firebase project**: Select `ecommerce-admin`
   - **Public directory**: `build`
   - **Single-page app**: Yes
   - **Automatic builds**: No

3. **Create firebase.json**
   Create `admin-frontend/firebase.json`:
   ```json
   {
     "hosting": {
       "public": "build",
       "ignore": [
         "firebase.json",
         "**/.*",
         "**/node_modules/**"
       ],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

4. **Create .env.production**
   Create `admin-frontend/.env.production`:
   ```
   REACT_APP_API_URL=https://your-cloud-run-url.run.app
   REACT_APP_ENVIRONMENT=production
   ```

5. **Build and Deploy**
   ```bash
   cd admin-frontend
   npm install
   npm run build
   firebase deploy --only hosting
   ```

6. **Note the Admin URL**
   - URL like: `https://ecommerce-admin.web.app`

---

### Step 8: Update CORS Origins

1. **Go to Cloud Run Console**
   - Open your `ecommerce-backend` service
   - Click **"Edit & Deploy New Revision"**

2. **Update Environment Variables**
   - Find `CORS_ORIGINS`
   - Update to:
   ```
   CORS_ORIGINS=https://your-customer-frontend.web.app,https://your-admin-frontend.web.app
   ```

3. **Deploy Revision**
   - Click **"Deploy"**
   - Wait for deployment

---

### Step 9: Initialize Database

1. **Connect to Cloud SQL**
   
   **Option A: Using Cloud SQL Proxy (Recommended)**
   ```bash
   # Install Cloud SQL Proxy
   # https://cloud.google.com/sql/docs/postgres/connect-admin-proxy
   
   # Download proxy
   wget https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64 -O cloud_sql_proxy
   chmod +x cloud_sql_proxy
   
   # Run proxy
   ./cloud_sql_proxy -instances=PROJECT_ID:REGION:INSTANCE_ID=tcp:5432
   
   # In another terminal, connect
   psql -h 127.0.0.1 -U postgres -d ecommerce
   ```

   **Option B: Using Cloud Shell**
   - Go to [Cloud Shell](https://shell.cloud.google.com)
   - Run:
   ```bash
   gcloud sql connect ecommerce-postgres --user=postgres
   ```

2. **Run Initialization Script**
   - Execute SQL from `backend/init.sql`
   - Or manually:
   ```sql
   INSERT INTO users (id, email, name, password_hash, role, created_at, updated_at) 
   VALUES (
       'admin-001',
       'admin@ecommerce.com',
       'Admin User',
       '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Qz8Qz8',
       'admin',
       NOW(),
       NOW()
   ) ON CONFLICT (email) DO NOTHING;
   ```

---

## ✅ Verification & Testing

### Test Backend
1. Visit: `https://your-cloud-run-url.run.app/docs`
2. You should see Swagger API documentation
3. Test health endpoint: `/health`

### Test Customer Frontend
1. Visit your Firebase Hosting URL
2. Check if products load
3. Test login/signup
4. Test cart functionality

### Test Admin Frontend
1. Visit your admin Firebase Hosting URL
2. Login with:
   - **Email:** `admin@ecommerce.com`
   - **Password:** `admin123`
3. Test product management
4. Test order management

---

## 💰 Cost Breakdown (Free Tier)

### Always Free Tier ✅
- **Cloud Run**: 
  - 2 million requests/month FREE
  - 360,000 GB-seconds memory FREE
  - 180,000 vCPU-seconds FREE
- **Firebase Hosting**: 
  - 10 GB storage FREE
  - 360 MB/day transfer FREE
- **Cloud SQL**: 
  - db-f1-micro: Limited free tier
  - Check current free tier limits

### Free Trial ($300 Credit)
- **First 90 days**: $300 free credit
- Use this for any services beyond free tier

### After Free Tier (Estimated)
- **Cloud Run**: ~$5-15/month (pay per use)
- **Firebase Hosting**: ~$1-5/month
- **Cloud SQL**: ~$10-20/month
- **Total**: ~$15-40/month

---

## 🔧 Troubleshooting

### Backend Issues

**Problem:** Backend won't start
- ✅ Check environment variables
- ✅ Verify DATABASE_URL format
- ✅ Check Cloud Run logs: Cloud Run → Logs

**Problem:** Database connection failed
- ✅ Check Cloud SQL authorized networks
- ✅ Verify Cloud SQL connection in Cloud Run
- ✅ Check database credentials

**Problem:** PORT not found
- ✅ Cloud Run uses PORT env var (default 8080)
- ✅ Update backend to use `os.getenv('PORT', '8000')`

### Frontend Issues

**Problem:** Frontend can't connect to backend
- ✅ Verify REACT_APP_API_URL is correct
- ✅ Check CORS_ORIGINS includes frontend URL
- ✅ Check browser console for errors

**Problem:** Build fails
- ✅ Check Firebase build logs
- ✅ Verify npm install completes
- ✅ Check for missing dependencies

### Database Issues

**Problem:** Can't connect to database
- ✅ Check authorized networks in Cloud SQL
- ✅ Verify connection name format
- ✅ Check username and password

---

## 🔐 Security Best Practices

1. **Change Default Passwords**
   - Change admin password immediately
   - Use strong passwords for database

2. **Update CORS Origins**
   - Only include your actual frontend URLs
   - Don't use wildcards in production

3. **Cloud SQL Security**
   - Use authorized networks
   - Consider private IP (requires VPC)
   - Enable SSL connections

4. **Environment Variables**
   - Never commit secrets to GitHub
   - Use Secret Manager for sensitive data

5. **Firebase Security Rules**
   - Configure Firebase security rules
   - Restrict access to admin panel

---

## 📊 Monitoring

### Cloud Run Logs
- **View logs**: Cloud Run → Your service → Logs
- **Set up alerts**: Cloud Monitoring → Alerting

### Firebase Analytics
- **Enable**: Firebase Console → Analytics
- **View**: Firebase Console → Analytics dashboard

### Cloud SQL Monitoring
- **View**: Cloud SQL → Your instance → Monitoring
- **Set up alerts**: Cloud Monitoring

---

## 🎯 Next Steps

1. **Set Up Custom Domains**
   - Add custom domain in Firebase Hosting
   - Update CORS_ORIGINS

2. **Enable Backups**
   - Configure automated backups for Cloud SQL
   - Set backup retention period

3. **Set Up CI/CD**
   - Use Cloud Build for automatic deployments
   - Connect to GitHub

4. **Add Monitoring**
   - Set up Cloud Monitoring alerts
   - Monitor costs in GCP Billing

5. **Optimize Costs**
   - Monitor usage
   - Set up billing alerts
   - Use committed use discounts after free tier

---

## 📝 Quick Reference

### Service URLs
After deployment:
- **Backend API**: `https://xxxxx.run.app`
- **Customer Frontend**: `https://xxxxx.web.app`
- **Admin Frontend**: `https://xxxxx.web.app`
- **API Docs**: `https://xxxxx.run.app/docs`

### Default Credentials
- **Email:** `admin@ecommerce.com`
- **Password:** `admin123`
- **⚠️ Change these immediately!**

### Important Commands
```bash
# Deploy backend
gcloud run deploy ecommerce-backend --source ./backend

# Deploy frontend
cd frontend && npm run build && firebase deploy

# Connect to database
gcloud sql connect ecommerce-postgres --user=postgres
```

---

## 🆘 Support

If you get stuck:
1. Check GCP documentation
2. Review Cloud Run logs
3. Check Firebase build logs
4. Verify all environment variables
5. GCP Support (free tier includes basic support)

---

## 🎉 Success!

Your e-commerce store is now deployed on GCP using the free tier!

**Remember:**
- Monitor your usage to stay within free tier limits
- Set up billing alerts
- Change default passwords
- Enable backups

**Happy Deploying! ☁️**

