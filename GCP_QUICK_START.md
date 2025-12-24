# 🚀 GCP Deployment Quick Start Checklist

Use this checklist to deploy your e-commerce store to GCP (FREE TIER).

## ✅ Pre-Deployment Checklist

- [ ] GCP Account created (https://cloud.google.com)
- [ ] GitHub repository is up to date
- [ ] Firebase CLI installed (`npm install -g firebase-tools`)
- [ ] You have 30-60 minutes for setup

## 📋 Deployment Order

Follow this exact order for best results:

### 1. GCP Project Setup (5 minutes)
- [ ] Create GCP project
- [ ] Enable required APIs:
  - Cloud Run API
  - Cloud SQL Admin API
  - Cloud Build API
  - Firebase Hosting API

### 2. Database Setup (10 minutes)
- [ ] Create Cloud SQL PostgreSQL instance
- [ ] Note database endpoint and IP
- [ ] Create database: `ecommerce`
- [ ] Configure authorized networks
- [ ] **Wait for database to be available**

### 3. Backend Deployment (10 minutes)
- [ ] Create Cloud Run service
- [ ] Deploy from GitHub source
- [ ] Configure environment variables
- [ ] Add Cloud SQL connection
- [ ] **Wait for backend to deploy**
- [ ] Note backend URL

### 4. Customer Frontend (5 minutes)
- [ ] Initialize Firebase in `frontend/` directory
- [ ] Create `.env.production` with backend URL
- [ ] Build: `npm run build`
- [ ] Deploy: `firebase deploy`
- [ ] **Wait for deployment**
- [ ] Note customer frontend URL

### 5. Admin Frontend (5 minutes)
- [ ] Create separate Firebase project for admin
- [ ] Initialize Firebase in `admin-frontend/` directory
- [ ] Create `.env.production` with backend URL
- [ ] Build: `npm run build`
- [ ] Deploy: `firebase deploy`
- [ ] **Wait for deployment**
- [ ] Note admin frontend URL

### 6. Final Configuration (5 minutes)
- [ ] Update CORS_ORIGINS in Cloud Run with both frontend URLs
- [ ] Initialize database (run `backend/init.sql`)
- [ ] Test all services

## 🔗 Important URLs to Save

After deployment, save these URLs:

```
Backend API: https://________________.run.app
Customer Frontend: https://________________.web.app
Admin Frontend: https://________________.web.app
Database IP: ________________
```

## 🔐 Credentials to Save

```
Database Username: postgres
Database Password: ________________
Admin Email: admin@ecommerce.com
Admin Password: admin123 (CHANGE THIS!)
```

## 📚 Full Guide

For detailed step-by-step instructions, see: **GCP_DEPLOYMENT_GUIDE.md**

## ⚠️ Important Notes

1. **Free Tier Limits:**
   - Cloud Run: 2 million requests/month
   - Firebase Hosting: 10 GB storage, 360 MB/day
   - Cloud SQL: Check current free tier limits
   - Monitor usage in GCP Billing

2. **Security:**
   - Change admin password immediately
   - Update CORS_ORIGINS with actual URLs
   - Don't commit secrets to GitHub

3. **Costs:**
   - First 90 days: $300 free credit
   - Always free tier: $0/month (within limits)
   - After free tier: ~$15-40/month

## 🆘 Need Help?

- Check `GCP_DEPLOYMENT_GUIDE.md` for detailed instructions
- Review Cloud Run logs for errors
- Check Firebase build logs
- Verify all environment variables are set

---

**Ready to deploy?** Open `GCP_DEPLOYMENT_GUIDE.md` and follow the steps! 🚀

