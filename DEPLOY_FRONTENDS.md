# 🚀 Deploy Both Frontends to Cloud Run

## Quick Deploy

Deploy both customer and admin frontends with one command:

```bash
gcloud builds submit --config cloudbuild-frontend.yaml
```

This will:
1. ✅ Build customer frontend (`ecommerce-frontend`)
2. ✅ Deploy customer frontend to Cloud Run (port 3000)
3. ✅ Build admin frontend (`ecommerce-admin-frontend`)
4. ✅ Deploy admin frontend to Cloud Run (port 5030)

## What Gets Deployed

### Customer Frontend
- **Service Name:** `ecommerce-frontend`
- **Port:** 3000
- **URL:** `https://ecommerce-frontend-XXXXX.us-central1.run.app`
- **API URL:** Points to `https://ecommerce-backend-192614808954.us-central1.run.app`

### Admin Frontend
- **Service Name:** `ecommerce-admin-frontend`
- **Port:** 5030
- **URL:** `https://ecommerce-admin-frontend-XXXXX.us-central1.run.app`
- **API URL:** Points to `https://ecommerce-backend-192614808954.us-central1.run.app`

## After Deployment

1. **Get the frontend URLs:**
   ```bash
   # Customer frontend
   gcloud run services describe ecommerce-frontend --region us-central1 --format 'value(status.url)'
   
   # Admin frontend
   gcloud run services describe ecommerce-admin-frontend --region us-central1 --format 'value(status.url)'
   ```

2. **Update backend CORS settings:**
   Add the new frontend URLs to your backend's `CORS_ORIGINS` environment variable:
   ```bash
   gcloud run services update ecommerce-backend \
     --region us-central1 \
     --update-env-vars CORS_ORIGINS="https://ecommerce-frontend-XXXXX.us-central1.run.app,https://ecommerce-admin-frontend-XXXXX.us-central1.run.app"
   ```

## Automatic Deployment

Set up Cloud Build trigger for automatic deployments:

1. Go to: https://console.cloud.google.com/cloud-build/triggers
2. Click "Create Trigger"
3. Source: GitHub (connect your repo)
4. Configuration: Cloud Build configuration file
5. Location: `cloudbuild-frontend.yaml`
6. Click "Create"

Now every push to main will automatically deploy both frontends!

