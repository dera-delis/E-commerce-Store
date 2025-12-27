# 🚀 Trigger Frontend Deployment

Since `gcloud` CLI is not installed, here are your options:

## Option 1: Trigger via Cloud Console (Easiest - No CLI needed)

1. **Go to Cloud Build Console:**
   https://console.cloud.google.com/cloud-build/triggers?project=ecommerce-store-482103

2. **Click "Run Trigger"** (if you have a trigger set up) OR

3. **Click "History" → "Run Trigger"** → Select your trigger → "Run"

4. **Or create a new trigger:**
   - Click "Create Trigger"
   - Name: `deploy-frontends`
   - Source: Connect your GitHub repo
   - Configuration: Cloud Build configuration file
   - Location: `cloudbuild-frontend.yaml`
   - Click "Create"
   - Then click "Run" on the new trigger

## Option 2: Install gcloud CLI

1. **Download Google Cloud SDK:**
   https://cloud.google.com/sdk/docs/install

2. **Install and authenticate:**
   ```powershell
   gcloud auth login
   gcloud config set project ecommerce-store-482103
   ```

3. **Then run:**
   ```powershell
   gcloud builds submit --config cloudbuild-frontend.yaml
   ```

## Option 3: Manual Build via Cloud Console

1. **Go to Cloud Build:**
   https://console.cloud.google.com/cloud-build/builds?project=ecommerce-store-482103

2. **Click "Create Build"**

3. **Select "Cloud Build configuration file (yaml or json)"**

4. **Location:** `cloudbuild-frontend.yaml`

5. **Click "Run"**

## Recommended: Set Up Automatic Deployment

Create a Cloud Build trigger so every push to `main` automatically deploys:

1. Go to: https://console.cloud.google.com/cloud-build/triggers?project=ecommerce-store-482103
2. Click "Create Trigger"
3. Fill in:
   - **Name:** `deploy-frontends`
   - **Event:** Push to a branch
   - **Branch:** `^main$`
   - **Configuration:** Cloud Build configuration file
   - **Location:** `cloudbuild-frontend.yaml`
4. Click "Create"

Now every time you push to main, both frontends will automatically deploy! 🎉

