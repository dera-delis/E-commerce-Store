# PowerShell script to automatically set up Google Cloud Storage for permanent image storage
# This will prevent images from being lost when Cloud Run containers restart

Write-Host "🚀 Setting up Permanent Image Storage (Google Cloud Storage)..." -ForegroundColor Cyan
Write-Host ""

# Check if gcloud is installed
$gcloudPath = Get-Command gcloud -ErrorAction SilentlyContinue
if (-not $gcloudPath) {
    Write-Host "❌ ERROR: gcloud CLI is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Google Cloud SDK:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://cloud.google.com/sdk/docs/install" -ForegroundColor Yellow
    Write-Host "2. Run the installer" -ForegroundColor Yellow
    Write-Host "3. Run this script again" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

Write-Host "✅ gcloud CLI found" -ForegroundColor Green

# Set project
$PROJECT_ID = "ecommerce-store-482103"
$BUCKET_NAME = "ecommerce-store-uploads"
$REGION = "us-central1"
$SERVICE_NAME = "ecommerce-backend"

Write-Host ""
Write-Host "📋 Configuration:" -ForegroundColor Cyan
Write-Host "  Project ID: $PROJECT_ID"
Write-Host "  Bucket Name: $BUCKET_NAME"
Write-Host "  Region: $REGION"
Write-Host "  Service: $SERVICE_NAME"
Write-Host ""

# Check if user is authenticated
Write-Host "🔐 Checking authentication..." -ForegroundColor Cyan
$currentAccount = gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>&1
if (-not $currentAccount) {
    Write-Host "❌ Not authenticated. Please login..." -ForegroundColor Yellow
    gcloud auth login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Authentication failed!" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Authenticated as: $currentAccount" -ForegroundColor Green

# Set project
Write-Host ""
Write-Host "📦 Setting project..." -ForegroundColor Cyan
gcloud config set project $PROJECT_ID
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to set project!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Project set to $PROJECT_ID" -ForegroundColor Green

# Check if bucket already exists
Write-Host ""
Write-Host "🪣 Checking if bucket exists..." -ForegroundColor Cyan
$bucketExists = gsutil ls -b gs://$BUCKET_NAME 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Bucket already exists: gs://$BUCKET_NAME" -ForegroundColor Green
} else {
    Write-Host "📦 Creating bucket..." -ForegroundColor Cyan
    gsutil mb -p $PROJECT_ID -c STANDARD -l $REGION gs://$BUCKET_NAME
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to create bucket!" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Bucket created: gs://$BUCKET_NAME" -ForegroundColor Green
}

# Make bucket public for image viewing
Write-Host ""
Write-Host "🌐 Making bucket public (for image viewing)..." -ForegroundColor Cyan
gsutil iam ch allUsers:objectViewer gs://$BUCKET_NAME
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Warning: Failed to make bucket public. You may need to do this manually." -ForegroundColor Yellow
} else {
    Write-Host "✅ Bucket is now public" -ForegroundColor Green
}

# Get Cloud Run service account
Write-Host ""
Write-Host "🔑 Getting Cloud Run service account..." -ForegroundColor Cyan
$PROJECT_NUMBER = gcloud projects describe $PROJECT_ID --format="value(projectNumber)"
if (-not $PROJECT_NUMBER) {
    Write-Host "❌ Failed to get project number!" -ForegroundColor Red
    exit 1
}

$SERVICE_ACCOUNT = "$PROJECT_NUMBER-compute@developer.gserviceaccount.com"
Write-Host "✅ Service account: $SERVICE_ACCOUNT" -ForegroundColor Green

# Grant Storage Admin role to Cloud Run service account
Write-Host ""
Write-Host "🔐 Granting Storage Admin permissions..." -ForegroundColor Cyan
gcloud projects add-iam-policy-binding $PROJECT_ID `
    --member="serviceAccount:$SERVICE_ACCOUNT" `
    --role="roles/storage.admin"
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Warning: Failed to grant permissions. You may need to do this manually." -ForegroundColor Yellow
    Write-Host "   Go to: https://console.cloud.google.com/iam-admin/iam?project=$PROJECT_ID" -ForegroundColor Yellow
} else {
    Write-Host "✅ Permissions granted" -ForegroundColor Green
}

# Set environment variable in Cloud Run
Write-Host ""
Write-Host "⚙️ Setting GCS_BUCKET_NAME environment variable in Cloud Run..." -ForegroundColor Cyan
gcloud run services update $SERVICE_NAME `
    --region $REGION `
    --update-env-vars "GCS_BUCKET_NAME=$BUCKET_NAME"
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to set environment variable!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please set it manually:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://console.cloud.google.com/run/detail/$REGION/$SERVICE_NAME?project=$PROJECT_ID" -ForegroundColor Yellow
    Write-Host "2. Click 'Edit & Deploy New Revision'" -ForegroundColor Yellow
    Write-Host "3. Go to 'Variables & Secrets' tab" -ForegroundColor Yellow
    Write-Host "4. Add: GCS_BUCKET_NAME = $BUCKET_NAME" -ForegroundColor Yellow
    Write-Host "5. Click 'Deploy'" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Environment variable set" -ForegroundColor Green

# Summary
Write-Host ""
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "✅ SETUP COMPLETE!" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Summary:" -ForegroundColor Cyan
Write-Host "  ✅ Bucket created: gs://$BUCKET_NAME" -ForegroundColor Green
Write-Host "  ✅ Bucket is public" -ForegroundColor Green
Write-Host "  ✅ Permissions granted" -ForegroundColor Green
Write-Host "  ✅ Environment variable set" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 All images uploaded from now on will be stored permanently!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Wait 2-3 minutes for Cloud Run to redeploy" -ForegroundColor Yellow
Write-Host "  2. Go to Admin Products page" -ForegroundColor Yellow
Write-Host "  3. Re-upload your product images" -ForegroundColor Yellow
Write-Host "  4. Images will now persist forever! 🎉" -ForegroundColor Yellow
Write-Host ""
Write-Host "🔗 View your bucket:" -ForegroundColor Cyan
Write-Host "  https://console.cloud.google.com/storage/browser/$BUCKET_NAME?project=$PROJECT_ID" -ForegroundColor Blue
Write-Host ""

