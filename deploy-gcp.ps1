# GCP Deployment Script for E-commerce Store Backend (PowerShell)
# This script builds and deploys the backend to Google Cloud Run

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting GCP Deployment..." -ForegroundColor Green

# Check if gcloud is installed
try {
    $gcloudVersion = gcloud version 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "gcloud not found"
    }
} catch {
    Write-Host "❌ Error: gcloud CLI is not installed" -ForegroundColor Red
    Write-Host "Install it from: https://cloud.google.com/sdk/docs/install" -ForegroundColor Yellow
    exit 1
}

# Get project ID
$PROJECT_ID = gcloud config get-value project 2>&1
if ([string]::IsNullOrWhiteSpace($PROJECT_ID) -or $PROJECT_ID -match "ERROR") {
    Write-Host "❌ Error: No GCP project set" -ForegroundColor Red
    Write-Host "Run: gcloud config set project YOUR_PROJECT_ID" -ForegroundColor Yellow
    exit 1
}

Write-Host "📦 Project ID: $PROJECT_ID" -ForegroundColor Cyan

# Check if user is authenticated
$authStatus = gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>&1
if ([string]::IsNullOrWhiteSpace($authStatus)) {
    Write-Host "❌ Error: Not authenticated with GCP" -ForegroundColor Red
    Write-Host "Run: gcloud auth login" -ForegroundColor Yellow
    exit 1
}

# Enable required APIs
Write-Host "🔧 Enabling required APIs..." -ForegroundColor Yellow
gcloud services enable cloudbuild.googleapis.com --quiet
gcloud services enable run.googleapis.com --quiet
gcloud services enable sqladmin.googleapis.com --quiet

# Build and deploy using Cloud Build
Write-Host "🏗️ Building and deploying backend..." -ForegroundColor Yellow
gcloud builds submit --config cloudbuild.yaml

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "1. Set environment variables in Cloud Run console:"
Write-Host "   - DATABASE_URL"
Write-Host "   - REDIS_URL (optional)"
Write-Host "   - JWT_SECRET_KEY"
Write-Host "   - CORS_ORIGINS"
Write-Host ""
Write-Host "2. Add Cloud SQL connection in Cloud Run service settings"
Write-Host ""
Write-Host "3. Test your deployment:"
Write-Host "   gcloud run services describe ecommerce-backend --region us-central1 --format 'value(status.url)'"
Write-Host ""
Write-Host "4. Visit API docs: https://YOUR-SERVICE-URL.run.app/docs"

