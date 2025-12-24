#!/bin/bash

# GCP Deployment Script for E-commerce Store Backend
# This script builds and deploys the backend to Google Cloud Run

set -e  # Exit on error

echo "🚀 Starting GCP Deployment..."

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Error: gcloud CLI is not installed"
    echo "Install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Get project ID
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
    echo "❌ Error: No GCP project set"
    echo "Run: gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

echo "📦 Project ID: $PROJECT_ID"

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "❌ Error: Not authenticated with GCP"
    echo "Run: gcloud auth login"
    exit 1
fi

# Enable required APIs
echo "🔧 Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com --quiet
gcloud services enable run.googleapis.com --quiet
gcloud services enable sqladmin.googleapis.com --quiet

# Build and deploy using Cloud Build
echo "🏗️ Building and deploying backend..."
gcloud builds submit --config cloudbuild.yaml

echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Set environment variables in Cloud Run console:"
echo "   - DATABASE_URL"
echo "   - REDIS_URL (optional)"
echo "   - JWT_SECRET_KEY"
echo "   - CORS_ORIGINS"
echo ""
echo "2. Add Cloud SQL connection in Cloud Run service settings"
echo ""
echo "3. Test your deployment:"
echo "   gcloud run services describe ecommerce-backend --region us-central1 --format 'value(status.url)'"
echo ""
echo "4. Visit API docs: https://YOUR-SERVICE-URL.run.app/docs"

