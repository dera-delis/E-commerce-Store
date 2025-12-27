# 🔐 Set Up Service Account Permissions for Frontend Deployment

## Why This is Needed

Cloud Build needs permissions to:
- ✅ Build Docker images
- ✅ Push images to Container Registry
- ✅ Deploy services to Cloud Run

## Quick Setup via Cloud Console (No CLI Needed)

### Step 1: Get Your Project Number

1. Go to: https://console.cloud.google.com/home/dashboard?project=ecommerce-store-482103
2. Your **Project Number** is shown at the top (it's a long number like `192614808954`)

### Step 2: Find Cloud Build Service Account

The service account format is: `PROJECT_NUMBER@cloudbuild.gserviceaccount.com`

Example: `192614808954@cloudbuild.gserviceaccount.com`

### Step 3: Grant Permissions

Go to IAM & Admin: https://console.cloud.google.com/iam-admin/iam?project=ecommerce-store-482103

1. **Find the Cloud Build service account:**
   - Search for: `@cloudbuild.gserviceaccount.com`
   - Or look for: `Cloud Build Service Account`

2. **Click the pencil icon (Edit)** next to it

3. **Add these roles** (click "ADD ANOTHER ROLE" for each):
   
   **Required Roles:**
   - ✅ `Cloud Run Admin` (`roles/run.admin`) - Deploy to Cloud Run
   - ✅ `Service Account User` (`roles/iam.serviceAccountUser`) - Use service accounts
   - ✅ `Storage Admin` (`roles/storage.admin`) - Push images to Container Registry
   - ✅ `Cloud Build Service Account` (`roles/cloudbuild.builds.builder`) - Usually already granted

4. **Click "SAVE"**

## Alternative: Grant via Cloud Console (Step-by-Step)

### Method 1: Via IAM Page

1. Go to: https://console.cloud.google.com/iam-admin/iam?project=ecommerce-store-482103
2. Click **"GRANT ACCESS"** (top of page)
3. In "New principals", enter: `PROJECT_NUMBER@cloudbuild.gserviceaccount.com`
   - Replace `PROJECT_NUMBER` with your actual project number
4. Select roles:
   - `Cloud Run Admin`
   - `Service Account User`
   - `Storage Admin`
5. Click **"SAVE"**

### Method 2: Via Cloud Build Settings

1. Go to: https://console.cloud.google.com/cloud-build/settings?project=ecommerce-store-482103
2. Check "Service account permissions"
3. Ensure Cloud Build has access to Cloud Run

## Verify Permissions

After granting permissions, test by:
1. Creating a Cloud Build trigger (see `SETUP_FRONTEND_TRIGGER.md`)
2. Running the trigger
3. Check if deployment succeeds

## If You Have gcloud CLI (Optional)

If you install gcloud CLI later, you can run:

```powershell
.\fix-cloud-build-permissions.ps1
```

Or manually:
```powershell
$PROJECT_ID = "ecommerce-store-482103"
$PROJECT_NUMBER = gcloud projects describe $PROJECT_ID --format="value(projectNumber)"
$CLOUD_BUILD_SA = "${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"

# Grant permissions
gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:${CLOUD_BUILD_SA}" --role="roles/run.admin"
gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:${CLOUD_BUILD_SA}" --role="roles/iam.serviceAccountUser"
gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:${CLOUD_BUILD_SA}" --role="roles/storage.admin"
```

## Summary

**Required Permissions:**
- ✅ `Cloud Run Admin` - Deploy services
- ✅ `Service Account User` - Use service accounts  
- ✅ `Storage Admin` - Push Docker images
- ✅ `Cloud Build Service Account` - Run builds (usually auto-granted)

**Service Account:** `PROJECT_NUMBER@cloudbuild.gserviceaccount.com`

Once permissions are set, you can create the Cloud Build trigger and deploy! 🚀

