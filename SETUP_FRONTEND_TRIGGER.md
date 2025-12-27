# 🚀 Set Up Automatic Frontend Deployment

## Why This Option?
✅ **Automatic** - Deploys on every push to `main`  
✅ **Professional** - Industry-standard CI/CD  
✅ **No Manual Steps** - Just push code, it deploys  
✅ **Same as Backend** - Consistent deployment process  

## ⚠️ IMPORTANT: Set Up Service Account First!

**Before creating the trigger, you MUST grant permissions to the Cloud Build service account.**

### Step 0: Grant Service Account Permissions

#### Option A: Using Cloud Console (No CLI needed)

1. **Go to IAM & Admin:**
   https://console.cloud.google.com/iam-admin/iam?project=ecommerce-store-482103

2. **Find your Project Number:**
   - Look at the top of the page or go to: https://console.cloud.google.com/home/dashboard?project=ecommerce-store-482103
   - Your Project Number is shown (e.g., `192614808954`)

3. **Find the Cloud Build Service Account:**
   - In the IAM page, look for: `PROJECT_NUMBER@cloudbuild.gserviceaccount.com`
   - Example: `192614808954@cloudbuild.gserviceaccount.com`
   - If you don't see it, click "Grant Access" and search for it

4. **Grant Required Roles:**
   Click the edit icon (pencil) next to the service account, then add these roles:
   - ✅ **Cloud Run Admin** (`roles/run.admin`) - Allows deploying to Cloud Run
   - ✅ **Service Account User** (`roles/iam.serviceAccountUser`) - Allows using service accounts
   - ✅ **Storage Admin** (`roles/storage.admin`) - Allows pushing Docker images
   - ✅ **Cloud Build Service Account** (`roles/cloudbuild.builds.builder`) - Allows building

5. **Save** the changes

#### Option B: Using PowerShell Script (If you have gcloud CLI)

If you have `gcloud` CLI installed, you can run:
```powershell
.\fix-cloud-build-permissions.ps1
```

This script will automatically grant all required permissions.

---

## Step-by-Step Setup

### 1. Go to Cloud Build Triggers
**Direct Link:** https://console.cloud.google.com/cloud-build/triggers?project=ecommerce-store-482103

### 2. Create New Trigger
- Click **"Create Trigger"** button (top of page)

### 3. Configure Trigger (Customer Frontend)

**Name:**
```
deploy-customer-frontend
```

**Event:**
- Select **"Push to a branch"**
- Branch: `^main$` (regex pattern for main branch)

**Source:**
- Repository: Select your GitHub repo (`dera-delis/E-commerce-Store`)
- If not connected, click "Connect Repository" first

**Configuration:**
- Select **"Cloud Build configuration file (yaml or json)"**
- Location: `cloudbuild-customer-frontend.yaml` (for customer frontend)
- OR `cloudbuild-admin-frontend.yaml` (for admin frontend)

**Note:** You'll need to create TWO separate triggers:
1. One for customer frontend using `cloudbuild-customer-frontend.yaml`
2. One for admin frontend using `cloudbuild-admin-frontend.yaml`

**Advanced (optional):**
- You can leave defaults

### 4. Create & Test
- Click **"Create"**
- The trigger is now set up!

### 5. Create Second Trigger (Admin Frontend)

Repeat steps 2-4, but with:
- **Name:** `deploy-admin-frontend`
- **Configuration Location:** `cloudbuild-admin-frontend.yaml`

### 6. Test It
You can test immediately:
- Click on each trigger
- Click **"Run"** button
- Select branch: `main`
- Click **"Run"**

Or just push a commit to `main` and both will auto-deploy!

## What Happens Next?

Every time you push to `main`:
1. ✅ **Customer Frontend Trigger:**
   - Builds customer frontend Docker image
   - Deploys to `ecommerce-frontend` service
   - Gets its own URL: `https://ecommerce-frontend-XXXXX.us-central1.run.app`

2. ✅ **Admin Frontend Trigger:**
   - Builds admin frontend Docker image
   - Deploys to `ecommerce-admin-frontend` service
   - Gets its own URL: `https://ecommerce-admin-frontend-XXXXX.us-central1.run.app`

3. ✅ Both frontends are live with separate URLs!

## View Build Status

Monitor builds here:
https://console.cloud.google.com/cloud-build/builds?project=ecommerce-store-482103

---

**Ready?** Go to the link above and create the trigger! 🎯

