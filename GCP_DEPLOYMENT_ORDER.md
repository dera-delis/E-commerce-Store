# 🚀 GCP Deployment Order - Step by Step

## ✅ Recommended Deployment Order

### **Step 1: Deploy Backend First** (Required First)
**Why:** Frontends need the backend URL to be configured before they can be built.

1. Deploy backend to Cloud Run
2. **Get the backend URL** (e.g., `https://ecommerce-backend-xxxxx.run.app`)
3. Test backend is working:
   ```bash
   curl https://YOUR-BACKEND-URL.run.app/health
   ```

### **Step 2: Update Frontend Configuration**
Before building frontends, you need to set the backend URL.

**For Customer Frontend:**
- Update `frontend/src/api/api.js` or use `.env.production`
- Set `REACT_APP_API_URL` environment variable

**For Admin Frontend:**
- Already uses `REACT_APP_API_URL` ✅
- Just need to set it during build

### **Step 3: Deploy Customer Frontend**
Build and deploy with the backend URL configured.

### **Step 4: Deploy Admin Frontend**
Build and deploy with the backend URL configured.

### **Step 5: Update Backend CORS**
Update `CORS_ORIGINS` in Cloud Run to include both frontend URLs.

---

## 📋 Detailed Deployment Steps

### Phase 1: Backend Deployment

```bash
# 1. Deploy backend
gcloud builds submit --config cloudbuild.yaml

# 2. Get backend URL
BACKEND_URL=$(gcloud run services describe ecommerce-backend \
  --region us-central1 \
  --format 'value(status.url)')

echo "Backend URL: $BACKEND_URL"

# 3. Set environment variables
gcloud run services update ecommerce-backend \
  --region us-central1 \
  --set-env-vars DATABASE_URL=postgresql://postgres:PASSWORD@IP:5432/ecommerce \
  --set-env-vars JWT_SECRET_KEY=your-secret-key

# 4. Test backend
curl $BACKEND_URL/health
```

**Save the backend URL!** You'll need it for frontend deployment.

---

### Phase 2: Frontend Deployment

#### Customer Frontend

**Option A: Using Environment Variable (Recommended)**

1. Create `frontend/.env.production`:
   ```
   REACT_APP_API_URL=https://YOUR-BACKEND-URL.run.app
   ```

2. Build and deploy:
   ```bash
   cd frontend
   npm install
   npm run build
   firebase deploy --only hosting
   ```

**Option B: Update api.js directly**

Update `frontend/src/api/api.js` line 11:
```javascript
const baseURL = isLocal
  ? 'http://localhost:8000'
  : 'https://YOUR-BACKEND-URL.run.app';  // Update this
```

#### Admin Frontend

1. Create `admin-frontend/.env.production`:
   ```
   REACT_APP_API_URL=https://YOUR-BACKEND-URL.run.app
   ```

2. Build and deploy:
   ```bash
   cd admin-frontend
   npm install
   npm run build
   firebase deploy --only hosting
   ```

---

### Phase 3: Final Configuration

1. **Get frontend URLs:**
   - Customer: `https://your-customer-project.web.app`
   - Admin: `https://your-admin-project.web.app`

2. **Update backend CORS:**
   ```bash
   gcloud run services update ecommerce-backend \
     --region us-central1 \
     --set-env-vars CORS_ORIGINS=https://your-customer-project.web.app,https://your-admin-project.web.app
   ```

---

## ⚠️ What Happens If You Deploy Frontends First?

If you deploy frontends before backend:

1. ❌ Frontends won't work (no backend to connect to)
2. ❌ You'll need to rebuild frontends with correct backend URL
3. ❌ You'll need to redeploy frontends
4. ❌ More steps and potential errors

**Result:** You'll end up doing the work twice!

---

## ✅ Correct Order Summary

```
1. Deploy Backend → Get Backend URL
2. Configure Frontends with Backend URL
3. Deploy Customer Frontend
4. Deploy Admin Frontend  
5. Update Backend CORS with Frontend URLs
```

---

## 🎯 Quick Reference

**Backend URL Format:**
```
https://SERVICE-NAME-XXXXX.run.app
```

**Frontend URLs Format:**
```
https://PROJECT-ID.web.app
```

**Environment Variables Needed:**

**Backend (Cloud Run):**
- `DATABASE_URL`
- `JWT_SECRET_KEY`
- `CORS_ORIGINS` (set after frontends are deployed)

**Customer Frontend (Build time):**
- `REACT_APP_API_URL`

**Admin Frontend (Build time):**
- `REACT_APP_API_URL`

---

## 📝 Deployment Checklist

- [ ] Backend deployed to Cloud Run
- [ ] Backend URL saved
- [ ] Backend health check passes
- [ ] Customer frontend `.env.production` created with backend URL
- [ ] Customer frontend built and deployed
- [ ] Admin frontend `.env.production` created with backend URL
- [ ] Admin frontend built and deployed
- [ ] Backend CORS_ORIGINS updated with both frontend URLs
- [ ] All services tested and working

---

**Remember:** Backend first, then frontends! 🚀

