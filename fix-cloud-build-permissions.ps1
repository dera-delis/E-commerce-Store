# Fix Cloud Build permissions for Cloud Run deployment (PowerShell)
# Run this script once to grant necessary permissions

$ErrorActionPreference = "Stop"

$PROJECT_ID = "ecommerce-store-482103"

Write-Host "🔧 Fixing Cloud Build permissions for project: $PROJECT_ID" -ForegroundColor Cyan

# Get project number
$PROJECT_NUMBER = gcloud projects describe $PROJECT_ID --format="value(projectNumber)"

Write-Host "📦 Project Number: $PROJECT_NUMBER" -ForegroundColor Yellow

# Cloud Build service account
$CLOUD_BUILD_SA = "${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"

Write-Host "🔐 Granting permissions to: $CLOUD_BUILD_SA" -ForegroundColor Yellow

# Grant Cloud Build Service Account role (CRITICAL - allows Cloud Build to create builds)
Write-Host "1. Granting Cloud Build Service Account role..." -ForegroundColor Green
gcloud projects add-iam-policy-binding $PROJECT_ID `
  --member="serviceAccount:${CLOUD_BUILD_SA}" `
  --role="roles/cloudbuild.builds.builder"

# Grant Cloud Run Admin role
Write-Host "2. Granting Cloud Run Admin role..." -ForegroundColor Green
gcloud projects add-iam-policy-binding $PROJECT_ID `
  --member="serviceAccount:${CLOUD_BUILD_SA}" `
  --role="roles/run.admin"

# Grant Service Account User role (needed to deploy)
Write-Host "3. Granting Service Account User role..." -ForegroundColor Green
gcloud projects add-iam-policy-binding $PROJECT_ID `
  --member="serviceAccount:${CLOUD_BUILD_SA}" `
  --role="roles/iam.serviceAccountUser"

# Grant Cloud Run Invoker role (if needed)
Write-Host "4. Granting Cloud Run Invoker role..." -ForegroundColor Green
gcloud projects add-iam-policy-binding $PROJECT_ID `
  --member="serviceAccount:${CLOUD_BUILD_SA}" `
  --role="roles/run.invoker"

# Grant Storage Admin (needed to push images to Container Registry)
Write-Host "5. Granting Storage Admin role..." -ForegroundColor Green
gcloud projects add-iam-policy-binding $PROJECT_ID `
  --member="serviceAccount:${CLOUD_BUILD_SA}" `
  --role="roles/storage.admin"

Write-Host "✅ Permissions granted!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Now you can run: gcloud builds submit --config cloudbuild.yaml" -ForegroundColor Cyan

