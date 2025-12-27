#!/bin/bash

# Fix Cloud Build permissions for Cloud Run deployment
# Run this script once to grant necessary permissions

set -e

PROJECT_ID="ecommerce-store-482103"

echo "🔧 Fixing Cloud Build permissions for project: $PROJECT_ID"

# Get project number
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")

echo "📦 Project Number: $PROJECT_NUMBER"

# Cloud Build service account
CLOUD_BUILD_SA="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"

echo "🔐 Granting permissions to: $CLOUD_BUILD_SA"

# Grant Cloud Build Service Account role (CRITICAL - allows Cloud Build to create builds)
echo "1. Granting Cloud Build Service Account role..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${CLOUD_BUILD_SA}" \
  --role="roles/cloudbuild.builds.builder"

# Grant Cloud Run Admin role
echo "2. Granting Cloud Run Admin role..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${CLOUD_BUILD_SA}" \
  --role="roles/run.admin"

# Grant Service Account User role (needed to deploy)
echo "3. Granting Service Account User role..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${CLOUD_BUILD_SA}" \
  --role="roles/iam.serviceAccountUser"

# Grant Cloud Run Invoker role (if needed)
echo "4. Granting Cloud Run Invoker role..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${CLOUD_BUILD_SA}" \
  --role="roles/run.invoker"

# Grant Storage Admin (needed to push images to Container Registry)
echo "5. Granting Storage Admin role..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${CLOUD_BUILD_SA}" \
  --role="roles/storage.admin"

echo "✅ Permissions granted!"
echo ""
echo "🚀 Now you can run: gcloud builds submit --config cloudbuild.yaml"

