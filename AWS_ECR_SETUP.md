# Quick ECR Setup for AWS App Runner

## Step 1: Create ECR Repository

### 1.1 Go to ECR Console
1. Open [AWS ECR Console](https://console.aws.amazon.com/ecr/)
2. Click **"Create repository"**

### 1.2 Configure Repository
- **Repository name**: `ecommerce-backend`
- **Visibility**: Private
- **Scan on push**: Enable
- Click **"Create repository"**

## Step 2: Build and Push Your Image

### 2.1 Get Login Token
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <your-account-id>.dkr.ecr.us-east-1.amazonaws.com
```

### 2.2 Build Your Image
```bash
# Build the image
docker build -t ecommerce-backend ./backend

# Tag for ECR
docker tag ecommerce-backend:latest <your-account-id>.dkr.ecr.us-east-1.amazonaws.com/ecommerce-backend:latest
```

### 2.3 Push to ECR
```bash
# Push the image
docker push <your-account-id>.dkr.ecr.us-east-1.amazonaws.com/ecommerce-backend:latest
```

## Step 3: Use in App Runner

### 3.1 Container Image URI
Use this format:
```
<your-account-id>.dkr.ecr.us-east-1.amazonaws.com/ecommerce-backend:latest
```

### 3.2 ECR Access Role
- Choose **"Create new service role"**
- App Runner will automatically create the role with ECR permissions
