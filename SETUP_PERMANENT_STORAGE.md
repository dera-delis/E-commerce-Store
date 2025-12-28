# 🚀 Quick Setup: Permanent Image Storage

## Why You Need This

**Without this setup, your images will disappear** when Cloud Run containers restart. This setup uses Google Cloud Storage (GCS) to store images permanently.

## ⚡ Quick Setup (Automated)

### Option 1: Run the Automated Script (Easiest)

1. **Make sure you have Google Cloud SDK installed:**
   - Download: https://cloud.google.com/sdk/docs/install
   - Install it
   - Open PowerShell

2. **Run the setup script:**
   ```powershell
   .\setup-permanent-storage.ps1
   ```

3. **That's it!** The script will:
   - Create the GCS bucket
   - Make it public
   - Grant permissions
   - Set the environment variable
   - Configure everything automatically

### Option 2: Manual Setup (If script doesn't work)

If you don't have `gcloud` CLI or the script fails, follow these steps:

#### Step 1: Create GCS Bucket

1. Go to: https://console.cloud.google.com/storage/browser?project=ecommerce-store-482103
2. Click **"Create Bucket"**
3. Settings:
   - **Name:** `ecommerce-store-uploads`
   - **Location:** `us-central1`
   - **Storage class:** Standard
   - **Access control:** Uniform
   - **Public access:** ✅ Allow
4. Click **"Create"**

#### Step 2: Make Bucket Public

1. Click on your bucket: `ecommerce-store-uploads`
2. Go to **"Permissions"** tab
3. Click **"Grant Access"**
4. Add:
   - **Principal:** `allUsers`
   - **Role:** `Storage Object Viewer`
5. Click **"Save"**

#### Step 3: Grant Permissions

1. Go to: https://console.cloud.google.com/iam-admin/iam?project=ecommerce-store-482103
2. Find: `192614808954-compute@developer.gserviceaccount.com`
3. Click edit (pencil icon)
4. Add role: **Storage Admin** (`roles/storage.admin`)
5. Click **"Save"**

#### Step 4: Set Environment Variable

1. Go to: https://console.cloud.google.com/run/detail/us-central1/ecommerce-backend?project=ecommerce-store-482103
2. Click **"Edit & Deploy New Revision"**
3. Go to **"Variables & Secrets"** tab
4. Click **"Add Variable"**
5. Add:
   - **Name:** `GCS_BUCKET_NAME`
   - **Value:** `ecommerce-store-uploads`
6. Click **"Deploy"**

## ✅ Verify It's Working

1. Wait 2-3 minutes for deployment
2. Go to Admin Products page
3. Upload a new product image
4. Check the image URL - it should start with `https://storage.googleapis.com/...`
5. The image will persist forever! 🎉

## 📝 Important Notes

- **Old images are gone** - They were in the ephemeral filesystem
- **New uploads will persist** - Once GCS is set up, all new images are permanent
- **No more lost images** - This setup prevents future image loss

## 🔗 Useful Links

- **Bucket Console:** https://console.cloud.google.com/storage/browser/ecommerce-store-uploads?project=ecommerce-store-482103
- **Cloud Run Console:** https://console.cloud.google.com/run/detail/us-central1/ecommerce-backend?project=ecommerce-store-482103
- **IAM Console:** https://console.cloud.google.com/iam-admin/iam?project=ecommerce-store-482103

