# Fix CORS for backend - Update env var and force redeploy
Write-Host "🔧 Updating CORS_ORIGINS and redeploying backend..." -ForegroundColor Cyan

$CORS_ORIGINS = "https://ecommerce-frontend-192614808954.us-central1.run.app,https://ecommerce-admin-frontend-192614808954.us-central1.run.app"

# Update the environment variable (this will create a new revision)
Write-Host "📝 Setting CORS_ORIGINS environment variable..." -ForegroundColor Yellow
gcloud run services update ecommerce-backend `
    --region us-central1 `
    --update-env-vars "CORS_ORIGINS=$CORS_ORIGINS" `
    --project ecommerce-store-482103

Write-Host ""
Write-Host "✅ Backend updated! A new revision is being deployed." -ForegroundColor Green
Write-Host ""
Write-Host "⏳ Wait 1-2 minutes for the new revision to be ready, then try logging in again." -ForegroundColor Yellow
Write-Host ""
Write-Host "To verify the env var is set:" -ForegroundColor Cyan
Write-Host "  gcloud run services describe ecommerce-backend --region us-central1 --format 'value(spec.template.spec.containers[0].env)'" -ForegroundColor Gray

