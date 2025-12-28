# 🚀 Trigger Backend Deployment (URGENT - Fix CORS)

The backend needs to be redeployed to pick up the CORS fixes.

## Quick Fix: Manual Trigger via Cloud Console

### Option 1: Use Existing Trigger (Fastest)

1. **Go to Cloud Build Triggers:**
   https://console.cloud.google.com/cloud-build/triggers?project=ecommerce-store-482103

2. **Find your backend trigger** (should be named something like `deploy-backend` or `ecommerce-backend`)

3. **Click "Run"** on the trigger

4. **Select branch:** `main`

5. **Click "Run"**

6. **Wait 3-5 minutes** for the build to complete

### Option 2: Manual Build via Cloud Build

1. **Go to Cloud Build:**
   https://console.cloud.google.com/cloud-build/builds?project=ecommerce-store-482103

2. **Click "Create Build"** (top of page)

3. **Select "Cloud Build configuration file (yaml or json)"**

4. **Location:** `cloudbuild.yaml`

5. **Click "Run"**

6. **Wait 3-5 minutes** for the build to complete

### Option 3: Direct Cloud Run Redeploy (Fastest - No Build)

If you just want to redeploy the existing image with new environment variables:

1. **Go to Cloud Run:**
   https://console.cloud.google.com/run/detail/us-central1/ecommerce-backend?project=ecommerce-store-482103

2. **Click "EDIT & DEPLOY NEW REVISION"**

3. **Click "DEPLOY"** (no changes needed - this will pull the latest code from GitHub)

**Note:** This option only works if you have a trigger set up. Otherwise, use Option 1 or 2.

---

## After Deployment

Once the backend redeploys (check the build status), try logging in again. The CORS error should be fixed!

**Check deployment status:**
https://console.cloud.google.com/cloud-build/builds?project=ecommerce-store-482103

