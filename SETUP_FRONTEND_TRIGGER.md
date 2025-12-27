# 🚀 Set Up Automatic Frontend Deployment

## Why This Option?
✅ **Automatic** - Deploys on every push to `main`  
✅ **Professional** - Industry-standard CI/CD  
✅ **No Manual Steps** - Just push code, it deploys  
✅ **Same as Backend** - Consistent deployment process  

## ⚠️ IMPORTANT: Set Up Service Account First!

**Before creating the trigger, you MUST grant permissions to the Cloud Build service account.**

👉 **See `SETUP_SERVICE_ACCOUNT.md` for detailed instructions**

**Quick version:**
1. Go to: https://console.cloud.google.com/iam-admin/iam?project=ecommerce-store-482103
2. Find: `PROJECT_NUMBER@cloudbuild.gserviceaccount.com` (replace PROJECT_NUMBER with your actual number)
3. Grant these roles:
   - `Cloud Run Admin`
   - `Service Account User`
   - `Storage Admin`

## Step-by-Step Setup

### 1. Go to Cloud Build Triggers
**Direct Link:** https://console.cloud.google.com/cloud-build/triggers?project=ecommerce-store-482103

### 2. Create New Trigger
- Click **"Create Trigger"** button (top of page)

### 3. Configure Trigger

**Name:**
```
deploy-frontends
```

**Event:**
- Select **"Push to a branch"**
- Branch: `^main$` (regex pattern for main branch)

**Source:**
- Repository: Select your GitHub repo (`dera-delis/E-commerce-Store`)
- If not connected, click "Connect Repository" first

**Configuration:**
- Select **"Cloud Build configuration file (yaml or json)"**
- Location: `cloudbuild-frontend.yaml`

**Advanced (optional):**
- You can leave defaults

### 4. Create & Test
- Click **"Create"**
- The trigger is now set up!

### 5. Test It
You can test immediately:
- Click on your new trigger
- Click **"Run"** button
- Select branch: `main`
- Click **"Run"**

Or just push a commit to `main` and it will auto-deploy!

## What Happens Next?

Every time you push to `main`:
1. ✅ Cloud Build detects the push
2. ✅ Builds customer frontend Docker image
3. ✅ Deploys customer frontend to Cloud Run
4. ✅ Builds admin frontend Docker image  
5. ✅ Deploys admin frontend to Cloud Run
6. ✅ Both frontends are live!

## View Build Status

Monitor builds here:
https://console.cloud.google.com/cloud-build/builds?project=ecommerce-store-482103

---

**Ready?** Go to the link above and create the trigger! 🎯

