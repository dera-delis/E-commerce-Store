# 🔧 Fix Cloud Build Error Code 9

## Problem
Cloud Build is failing with error code 9 (FAILED_PRECONDITION). This means the Cloud Build service account doesn't have permission to deploy to Cloud Run.

## ✅ Quick Fix (GCP Console)

### Step 1: Get Your Project Number
1. Go to [GCP Console](https://console.cloud.google.com)
2. Select your project: `ecommerce-store-482103`
3. Go to **IAM & Admin** → **Settings**
4. Note your **Project Number** (e.g., `192614808954`)

### Step 2: Grant Permissions
1. Go to **IAM & Admin** → **IAM**
2. Find the service account: `192614808954@cloudbuild.gserviceaccount.com`
   - If you don't see it, click **"Grant Access"** and add it
3. Click **"Edit"** (pencil icon) on that service account
4. Click **"Add Another Role"**
5. Add these roles:
   - ✅ **Cloud Run Admin** (`roles/run.admin`)
   - ✅ **Service Account User** (`roles/iam.serviceAccountUser`)
   - ✅ **Cloud Run Invoker** (`roles/run.invoker`)
6. Click **"Save"**

### Step 3: Retry the Build
1. Go to [Cloud Build History](https://console.cloud.google.com/cloud-build/builds)
2. Click **"Retry"** on the failed build
3. Or trigger a new build

---

## ✅ Alternative: Using gcloud CLI

If you have gcloud CLI installed:

```bash
# Set your project
gcloud config set project ecommerce-store-482103

# Get project number
PROJECT_NUMBER=$(gcloud projects describe ecommerce-store-482103 --format="value(projectNumber)")

# Grant permissions
gcloud projects add-iam-policy-binding ecommerce-store-482103 \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding ecommerce-store-482103 \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

gcloud projects add-iam-policy-binding ecommerce-store-482103 \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/run.invoker"
```

Or use the provided scripts:
- **Windows**: `.\fix-cloud-build-permissions.ps1`
- **Linux/Mac**: `./fix-cloud-build-permissions.sh`

---

## 🔍 Verify Permissions

After granting permissions, verify:

1. Go to **IAM & Admin** → **IAM**
2. Find `@cloudbuild.gserviceaccount.com`
3. Should have these roles:
   - Cloud Run Admin
   - Service Account User
   - Cloud Run Invoker

---

## 🚀 After Fixing Permissions

Once permissions are fixed:

1. **Retry the build** in Cloud Build console
2. Or **trigger a new build**:
   ```bash
   gcloud builds submit --config cloudbuild.yaml
   ```

The build should now succeed and deploy to Cloud Run automatically!

---

## 📝 What Was the Issue?

Error code 9 = **FAILED_PRECONDITION**

The Cloud Build service account needs these permissions to deploy to Cloud Run:
- **Cloud Run Admin**: To create/update Cloud Run services
- **Service Account User**: To use service accounts for deployment
- **Cloud Run Invoker**: To invoke Cloud Run services (optional but recommended)

---

**Your Project ID**: `ecommerce-store-482103`  
**Your Project Number**: `192614808954` (from the error log)  
**Service Account**: `192614808954@cloudbuild.gserviceaccount.com`

