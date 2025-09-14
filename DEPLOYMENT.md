# 🚀 **Northflank Deployment Guide**

## 📋 **Prerequisites**

- [Northflank Account](https://northflank.com) (Free tier available)
- GitHub repository with your code
- Domain name (optional, Northflank provides subdomains)

## 🎯 **Deployment Steps**

### **Step 1: Prepare Your Repository**

1. **Ensure all files are committed and pushed to GitHub:**
   ```bash
   git add .
   git commit -m "Add Northflank deployment configuration"
   git push origin main
   ```

2. **Verify your repository structure:**
   ```
   E-commerce-Store/
   ├── backend/
   │   ├── Dockerfile
   │   ├── requirements.txt
   │   └── app/
   ├── frontend/
   │   ├── Dockerfile
   │   └── src/
   ├── admin-frontend/
   │   ├── Dockerfile
   │   └── src/
   ├── docker-compose.yml
   ├── northflank.yaml
   └── env.production.template
   ```

### **Step 2: Create Northflank Project**

1. **Go to [Northflank Dashboard](https://app.northflank.com)**
2. **Click "New Project"**
3. **Choose "From Git Repository"**
4. **Connect your GitHub account**
5. **Select your repository**: `dera-delis/E-commerce-Store`
6. **Name your project**: `ecommerce-store`

### **Step 3: Configure Services**

#### **3.1 Database Service (PostgreSQL)**

1. **Add New Service → Database → PostgreSQL**
2. **Configuration:**
   - **Name**: `postgres`
   - **Version**: `15`
   - **Database Name**: `ecommerce`
   - **Username**: `postgres`
   - **Password**: Generate secure password (save it!)
   - **Storage**: `10GB` (free tier)

#### **3.2 Cache Service (Redis)**

1. **Add New Service → Database → Redis**
2. **Configuration:**
   - **Name**: `redis`
   - **Version**: `7-alpine`
   - **Storage**: `1GB` (free tier)

#### **3.3 Backend Service (FastAPI)**

1. **Add New Service → Compute → Service**
2. **Configuration:**
   - **Name**: `backend`
   - **Source**: `Git Repository`
   - **Repository**: `dera-delis/E-commerce-Store`
   - **Build Context**: `./backend`
   - **Dockerfile**: `Dockerfile`
   - **Port**: `8000`

3. **Environment Variables:**
   ```
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@postgres:5432/ecommerce
   REDIS_URL=redis://redis:6379
   JWT_SECRET_KEY=your_very_long_and_secure_jwt_secret_key
   JWT_ALGORITHM=HS256
   JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
   CORS_ORIGINS=https://your-frontend-url.northflank.app,https://your-admin-url.northflank.app
   ```

4. **Dependencies:**
   - `postgres`
   - `redis`

#### **3.4 Frontend Service (React)**

1. **Add New Service → Compute → Service**
2. **Configuration:**
   - **Name**: `frontend`
   - **Source**: `Git Repository`
   - **Repository**: `dera-delis/E-commerce-Store`
   - **Build Context**: `./frontend`
   - **Dockerfile**: `Dockerfile`
   - **Port**: `3000`

3. **Environment Variables:**
   ```
   REACT_APP_API_URL=https://your-backend-url.northflank.app
   ```

4. **Dependencies:**
   - `backend`

#### **3.5 Admin Service (React Admin Panel)**

1. **Add New Service → Compute → Service**
2. **Configuration:**
   - **Name**: `admin`
   - **Source**: `Git Repository`
   - **Repository**: `dera-delis/E-commerce-Store`
   - **Build Context**: `./admin-frontend`
   - **Dockerfile**: `Dockerfile`
   - **Port**: `5030`

3. **Environment Variables:**
   ```
   REACT_APP_API_URL=https://your-backend-url.northflank.app
   ```

4. **Dependencies:**
   - `backend`

### **Step 4: Configure Domains**

1. **Go to each service → Settings → Domains**
2. **Enable custom domains** (Northflank provides free subdomains)
3. **Note down the URLs:**
   - Frontend: `https://frontend-xxxxx.northflank.app`
   - Admin: `https://admin-xxxxx.northflank.app`
   - Backend: `https://backend-xxxxx.northflank.app`

### **Step 5: Update CORS Configuration**

1. **Go to Backend service → Environment Variables**
2. **Update CORS_ORIGINS with your actual URLs:**
   ```
   CORS_ORIGINS=https://frontend-xxxxx.northflank.app,https://admin-xxxxx.northflank.app
   ```

### **Step 6: Deploy Services**

1. **Deploy in this order:**
   - ✅ **PostgreSQL** (first)
   - ✅ **Redis** (second)
   - ✅ **Backend** (third)
   - ✅ **Frontend** (fourth)
   - ✅ **Admin** (last)

2. **Wait for each service to be "Running" before deploying the next**

### **Step 7: Initialize Database**

1. **Go to Backend service → Logs**
2. **Check that database tables are created**
3. **If needed, run database initialization:**
   ```bash
   # Connect to backend service terminal
   python -c "from app.database import init_db; init_db()"
   ```

### **Step 8: Test Your Deployment**

1. **Frontend**: Visit your frontend URL
2. **Admin Panel**: Visit your admin URL
3. **API Docs**: Visit `https://your-backend-url.northflank.app/docs`

## 🔧 **Troubleshooting**

### **Common Issues:**

1. **CORS Errors:**
   - Update CORS_ORIGINS with correct URLs
   - Restart backend service

2. **Database Connection Issues:**
   - Check DATABASE_URL format
   - Ensure PostgreSQL is running
   - Verify password is correct

3. **Build Failures:**
   - Check Dockerfile syntax
   - Verify all dependencies in requirements.txt
   - Check build logs for specific errors

4. **Environment Variables:**
   - Ensure all required variables are set
   - Check variable names match exactly
   - Restart services after changes

### **Useful Commands:**

```bash
# Check service logs
northflank logs backend

# Restart service
northflank restart backend

# Check service status
northflank status
```

## 📊 **Monitoring**

1. **Go to each service → Monitoring**
2. **Check:**
   - CPU usage
   - Memory usage
   - Request logs
   - Error logs

## 🔒 **Security Best Practices**

1. **Use strong passwords** for database
2. **Generate secure JWT secret** (32+ characters)
3. **Enable HTTPS** (automatic with Northflank)
4. **Regular backups** of database
5. **Monitor logs** for suspicious activity

## 💰 **Cost Optimization**

1. **Free Tier Limits:**
   - 1GB RAM per service
   - 10GB storage
   - 1 CPU core per service

2. **Optimize for free tier:**
   - Use smaller Docker images
   - Optimize React builds
   - Enable compression

## 🎉 **Success!**

Your e-commerce application is now live on Northflank with:
- ✅ **Production Database** - PostgreSQL with persistent storage
- ✅ **Caching Layer** - Redis for performance
- ✅ **Backend API** - FastAPI with all endpoints
- ✅ **Frontend** - React customer interface
- ✅ **Admin Panel** - React admin interface
- ✅ **Custom Domains** - Professional URLs
- ✅ **HTTPS** - Secure connections
- ✅ **Monitoring** - Real-time metrics

## 🔗 **Your Live URLs:**

- **Frontend**: `https://frontend-xxxxx.northflank.app`
- **Admin Panel**: `https://admin-xxxxx.northflank.app`
- **API Documentation**: `https://backend-xxxxx.northflank.app/docs`

**Congratulations! Your e-commerce application is now live in production!** 🚀✨
