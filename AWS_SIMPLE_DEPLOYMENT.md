# Simple AWS Deployment Guide for E-commerce Store

## Overview
This guide uses AWS's easiest services to deploy your e-commerce app with minimal configuration:
- **AWS App Runner** for backend (super simple, no Docker knowledge needed)
- **AWS Amplify** for frontend (one-click deployment)
- **AWS RDS** for database (managed PostgreSQL)
- **AWS ElastiCache** for Redis (managed Redis)

## Prerequisites
- AWS Account (free tier available)
- GitHub repository with your code
- Basic understanding of environment variables

## Step 1: Deploy Backend with AWS App Runner

### 1.1 Create ECR Repository
1. Open [AWS ECR Console](https://console.aws.amazon.com/ecr/)
2. Click **"Create repository"**
3. **Repository name**: `ecommerce-backend`
4. **Visibility**: Private
5. Click **"Create repository"**

### 1.2 Build and Push Your Docker Image
```bash
# Get your AWS account ID
aws sts get-caller-identity --query Account --output text

# Login to ECR (replace <account-id> with your actual account ID)
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build your backend image
docker build -t ecommerce-backend ./backend

# Tag for ECR
docker tag ecommerce-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/ecommerce-backend:latest

# Push to ECR
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/ecommerce-backend:latest
```

### 1.3 Create App Runner Service
1. Open [AWS App Runner Console](https://console.aws.amazon.com/apprunner/)
2. Click **"Create an App Runner service"**

### 1.4 Configure Source
- **Source**: Choose "Container registry"
- **Provider**: Choose "Amazon ECR"
- **Container image URI**: `<account-id>.dkr.ecr.us-east-1.amazonaws.com/ecommerce-backend:latest`
- **ECR Access Role**: Choose "Create new service role"
- **Deployment trigger**: Manual

### 1.5 Configure Service
- **Service name**: `ecommerce-backend`
- **Virtual CPU**: 0.25 vCPU
- **Virtual memory**: 0.5 GB
- **Environment variables**:
  ```
  DATABASE_URL=postgresql://username:password@your-rds-endpoint:5432/ecommerce
  REDIS_URL=redis://your-redis-endpoint:6379
  JWT_SECRET_KEY=your-super-secret-key-here
  CORS_ORIGINS=https://your-amplify-domain.amplifyapp.com
  ```

### 1.6 Review and Create
- Click **"Create & deploy"**
- Wait for deployment to complete (5-10 minutes)

## Step 2: Deploy Frontend with AWS Amplify

### 2.1 Go to AWS Amplify Console
1. Open [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click **"New app"** → **"Host web app"**

### 2.2 Connect Repository
- **Repository**: Choose "GitHub"
- **Repository name**: Select your GitHub repo
- **Branch**: `main`
- **App build and test settings**: Use default

### 2.3 Configure Build Settings
Create `amplify.yml` in your repo root:
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd frontend
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: frontend/build
    files:
      - '**/*'
  cache:
    paths:
      - frontend/node_modules/**/*
```

### 2.4 Environment Variables
Add these environment variables in Amplify:
```
REACT_APP_API_URL=https://your-app-runner-url.us-east-1.awsapprunner.com
```

### 2.5 Deploy
- Click **"Save and deploy"**
- Wait for deployment (3-5 minutes)

## Step 3: Set Up Database (RDS)

### 3.1 Go to RDS Console
1. Open [AWS RDS Console](https://console.aws.amazon.com/rds/)
2. Click **"Create database"**

### 3.2 Configure Database
- **Engine type**: PostgreSQL
- **Version**: PostgreSQL 15.4
- **Templates**: Free tier
- **DB instance identifier**: `ecommerce-postgres`
- **Master username**: `postgres`
- **Master password**: Create a strong password
- **Instance class**: db.t3.micro
- **Storage**: 20 GB
- **VPC**: Default VPC
- **Subnet group**: Default
- **Public access**: No
- **VPC security groups**: Create new
- **Database name**: `ecommerce`

### 3.3 Create Database
- Click **"Create database"**
- Wait for creation (10-15 minutes)

## Step 4: Set Up Redis (ElastiCache)

### 4.1 Go to ElastiCache Console
1. Open [AWS ElastiCache Console](https://console.aws.amazon.com/elasticache/)
2. Click **"Create cluster"**

### 4.2 Configure Redis
- **Cluster mode**: Disabled
- **Name**: `ecommerce-redis`
- **Node type**: cache.t3.micro
- **Number of nodes**: 1
- **Subnet group**: Default
- **Security groups**: Create new
- **Port**: 6379

### 4.3 Create Cluster
- Click **"Create cluster"**
- Wait for creation (5-10 minutes)

## Step 5: Update Environment Variables

### 5.1 Get Database Endpoint
1. Go to RDS Console
2. Click on your database
3. Copy the **Endpoint** (e.g., `ecommerce-postgres.xxxxx.us-east-1.rds.amazonaws.com`)

### 5.2 Get Redis Endpoint
1. Go to ElastiCache Console
2. Click on your cluster
3. Copy the **Endpoint** (e.g., `ecommerce-redis.xxxxx.cache.amazonaws.com`)

### 5.3 Update App Runner Environment Variables
1. Go to App Runner Console
2. Click on your service
3. Go to **"Configuration"** tab
4. Update environment variables:
```
DATABASE_URL=postgresql://postgres:your-password@your-rds-endpoint:5432/ecommerce
REDIS_URL=redis://your-redis-endpoint:6379
JWT_SECRET_KEY=your-super-secret-key-here
CORS_ORIGINS=https://your-amplify-domain.amplifyapp.com
```

### 5.4 Update Amplify Environment Variables
1. Go to Amplify Console
2. Click on your app
3. Go to **"Environment variables"**
4. Update:
```
REACT_APP_API_URL=https://your-app-runner-url.us-east-1.awsapprunner.com
```

## Step 6: Initialize Database

### 6.1 Connect to Database
Use a database client like pgAdmin or DBeaver:
- **Host**: Your RDS endpoint
- **Port**: 5432
- **Database**: ecommerce
- **Username**: postgres
- **Password**: Your password

### 6.2 Run Initialization Script
Execute the SQL from `backend/init.sql`:
```sql
-- Create admin user
INSERT INTO users (email, password_hash, is_admin, created_at) 
VALUES ('admin@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Qz8K2', true, NOW());

-- Insert sample products
INSERT INTO products (name, description, price, category, image_url, stock_quantity, created_at) VALUES
('Laptop Pro', 'High-performance laptop', 1299.99, 'Electronics', 'https://via.placeholder.com/300x200?text=Laptop', 50, NOW()),
('Wireless Headphones', 'Noise-cancelling headphones', 199.99, 'Electronics', 'https://via.placeholder.com/300x200?text=Headphones', 100, NOW()),
('Coffee Maker', 'Automatic coffee maker', 89.99, 'Home', 'https://via.placeholder.com/300x200?text=Coffee+Maker', 25, NOW());
```

## Step 7: Test Your Deployment

### 7.1 Test Backend
1. Go to your App Runner URL: `https://your-app-runner-url.us-east-1.awsapprunner.com`
2. Add `/docs` to see the API documentation
3. Test the health endpoint: `/health`

### 7.2 Test Frontend
1. Go to your Amplify URL: `https://your-amplify-domain.amplifyapp.com`
2. Check if products load
3. Test admin login with `admin@example.com` / `admin123`

## Step 8: Set Up Custom Domain (Optional)

### 8.1 Add Custom Domain in Amplify
1. Go to Amplify Console
2. Click on your app
3. Go to **"Domain management"**
4. Click **"Add domain"**
5. Enter your domain name
6. Follow the DNS configuration instructions

### 8.2 Update CORS Origins
Update your App Runner environment variables:
```
CORS_ORIGINS=https://your-domain.com,https://admin.your-domain.com
```

## Step 9: Set Up Monitoring (Optional)

### 9.1 CloudWatch Logs
- App Runner automatically sends logs to CloudWatch
- Go to CloudWatch Console to view logs

### 9.2 Set Up Alerts
1. Go to CloudWatch Console
2. Click **"Alarms"**
3. Create alarms for:
   - High CPU usage
   - Database connections
   - Error rates

## Cost Estimation (Monthly)

### Free Tier (First 12 months)
- **App Runner**: 2,000 vCPU minutes free
- **Amplify**: 1,000 build minutes free
- **RDS**: 750 hours of db.t3.micro free
- **ElastiCache**: 750 hours of cache.t3.micro free

### After Free Tier
- **App Runner**: ~$5-10/month
- **Amplify**: ~$1-3/month
- **RDS**: ~$15-20/month
- **ElastiCache**: ~$15-20/month
- **Total**: ~$35-55/month

## Troubleshooting

### Common Issues:

1. **Backend not starting**
   - Check environment variables
   - Check CloudWatch logs
   - Verify database connection

2. **Frontend not loading products**
   - Check CORS settings
   - Verify API URL in environment variables
   - Check browser console for errors

3. **Database connection issues**
   - Check security groups
   - Verify database endpoint
   - Check password and username

### Useful Commands:
```bash
# Check App Runner logs
aws logs describe-log-groups --log-group-name-prefix /aws/apprunner

# Check Amplify build logs
aws amplify list-apps
aws amplify list-jobs --app-id your-app-id
```

## Security Best Practices

1. **Use strong passwords** for database
2. **Enable encryption** for RDS and ElastiCache
3. **Use IAM roles** instead of access keys
4. **Enable VPC** for database and cache
5. **Regular backups** for database

## Next Steps

1. **Set up CI/CD** with GitHub Actions
2. **Add monitoring** with CloudWatch
3. **Implement backup** strategies
4. **Set up staging** environment
5. **Add SSL certificates** for custom domains

## Final URLs
After successful deployment:
- **Frontend**: https://your-amplify-domain.amplifyapp.com
- **Backend API**: https://your-app-runner-url.us-east-1.awsapprunner.com
- **API Docs**: https://your-app-runner-url.us-east-1.awsapprunner.com/docs

## Support
If you get stuck:
1. Check AWS documentation
2. Use AWS Support (free tier includes basic support)
3. Check CloudWatch logs for errors
4. Verify all environment variables are set correctly
