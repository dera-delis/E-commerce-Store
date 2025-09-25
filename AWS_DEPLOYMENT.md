# AWS Deployment Guide for E-commerce Store

## Overview
This guide will deploy your full-stack e-commerce application on AWS using:
- **ECS (Elastic Container Service)** for containerized backend
- **RDS (Relational Database Service)** for PostgreSQL
- **ElastiCache** for Redis
- **S3 + CloudFront** for frontend static hosting
- **Application Load Balancer** for routing
- **Route 53** for domain management

## Prerequisites
- AWS Account with appropriate permissions
- AWS CLI installed and configured
- Docker installed locally
- Domain name (optional, but recommended)

## Step 1: Prepare AWS Infrastructure

### 1.1 Create VPC and Networking
```bash
# Create VPC
aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=ecommerce-vpc}]'

# Create Internet Gateway
aws ec2 create-internet-gateway --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=ecommerce-igw}]'

# Create Public Subnets (for ALB and NAT)
aws ec2 create-subnet --vpc-id vpc-xxxxx --cidr-block 10.0.1.0/24 --availability-zone us-east-1a --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=ecommerce-public-1a}]'
aws ec2 create-subnet --vpc-id vpc-xxxxx --cidr-block 10.0.2.0/24 --availability-zone us-east-1b --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=ecommerce-public-1b}]'

# Create Private Subnets (for ECS tasks)
aws ec2 create-subnet --vpc-id vpc-xxxxx --cidr-block 10.0.3.0/24 --availability-zone us-east-1a --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=ecommerce-private-1a}]'
aws ec2 create-subnet --vpc-id vpc-xxxxx --cidr-block 10.0.4.0/24 --availability-zone us-east-1b --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=ecommerce-private-1b}]'
```

### 1.2 Create Security Groups
```bash
# ALB Security Group
aws ec2 create-security-group --group-name ecommerce-alb-sg --description "Security group for ALB" --vpc-id vpc-xxxxx

# ECS Security Group
aws ec2 create-security-group --group-name ecommerce-ecs-sg --description "Security group for ECS tasks" --vpc-id vpc-xxxxx

# RDS Security Group
aws ec2 create-security-group --group-name ecommerce-rds-sg --description "Security group for RDS" --vpc-id vpc-xxxxx
```

## Step 2: Set Up Database (RDS)

### 2.1 Create RDS Subnet Group
```bash
aws rds create-db-subnet-group \
    --db-subnet-group-name ecommerce-db-subnet-group \
    --db-subnet-group-description "Subnet group for ecommerce database" \
    --subnet-ids subnet-xxxxx subnet-yyyyy
```

### 2.2 Create PostgreSQL Database
```bash
aws rds create-db-instance \
    --db-instance-identifier ecommerce-postgres \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --engine-version 15.4 \
    --master-username postgres \
    --master-user-password YourSecurePassword123! \
    --allocated-storage 20 \
    --storage-type gp2 \
    --vpc-security-group-ids sg-xxxxx \
    --db-subnet-group-name ecommerce-db-subnet-group \
    --backup-retention-period 7 \
    --multi-az \
    --publicly-accessible false
```

## Step 3: Set Up Redis (ElastiCache)

### 3.1 Create ElastiCache Subnet Group
```bash
aws elasticache create-cache-subnet-group \
    --cache-subnet-group-name ecommerce-redis-subnet-group \
    --cache-subnet-group-description "Subnet group for Redis" \
    --subnet-ids subnet-xxxxx subnet-yyyyy
```

### 3.2 Create Redis Cluster
```bash
aws elasticache create-cache-cluster \
    --cache-cluster-id ecommerce-redis \
    --cache-node-type cache.t3.micro \
    --engine redis \
    --num-cache-nodes 1 \
    --cache-subnet-group-name ecommerce-redis-subnet-group \
    --security-group-ids sg-xxxxx
```

## Step 4: Create ECR Repositories

### 4.1 Create ECR Repositories
```bash
# Create repositories
aws ecr create-repository --repository-name ecommerce-backend
aws ecr create-repository --repository-name ecommerce-frontend
aws ecr create-repository --repository-name ecommerce-admin

# Get login token
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
```

## Step 5: Build and Push Docker Images

### 5.1 Build Backend Image
```bash
# Build backend
docker build -t ecommerce-backend ./backend

# Tag for ECR
docker tag ecommerce-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/ecommerce-backend:latest

# Push to ECR
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/ecommerce-backend:latest
```

### 5.2 Build Frontend Images
```bash
# Build frontend
docker build -t ecommerce-frontend ./frontend
docker tag ecommerce-frontend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/ecommerce-frontend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/ecommerce-frontend:latest

# Build admin frontend
docker build -t ecommerce-admin ./admin-frontend
docker tag ecommerce-admin:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/ecommerce-admin:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/ecommerce-admin:latest
```

## Step 6: Create ECS Cluster and Task Definitions

### 6.1 Create ECS Cluster
```bash
aws ecs create-cluster --cluster-name ecommerce-cluster
```

### 6.2 Create Task Definition for Backend
```json
{
  "family": "ecommerce-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::<account-id>:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "<account-id>.dkr.ecr.us-east-1.amazonaws.com/ecommerce-backend:latest",
      "portMappings": [
        {
          "containerPort": 8000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "DATABASE_URL",
          "value": "postgresql://postgres:YourSecurePassword123!@<rds-endpoint>:5432/ecommerce"
        },
        {
          "name": "REDIS_URL",
          "value": "redis://<redis-endpoint>:6379"
        },
        {
          "name": "JWT_SECRET_KEY",
          "value": "your-super-secret-jwt-key-here"
        },
        {
          "name": "CORS_ORIGINS",
          "value": "https://your-domain.com,https://admin.your-domain.com"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/ecommerce-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

## Step 7: Create S3 Buckets for Frontend

### 7.1 Create S3 Buckets
```bash
# Create buckets
aws s3 mb s3://ecommerce-frontend-prod
aws s3 mb s3://ecommerce-admin-prod

# Configure for static website hosting
aws s3 website s3://ecommerce-frontend-prod --index-document index.html --error-document index.html
aws s3 website s3://ecommerce-admin-prod --index-document index.html --error-document index.html
```

### 7.2 Build and Upload Frontend
```bash
# Build frontend
cd frontend
npm run build

# Upload to S3
aws s3 sync build/ s3://ecommerce-frontend-prod --delete

# Build admin frontend
cd ../admin-frontend
npm run build

# Upload to S3
aws s3 sync build/ s3://ecommerce-admin-prod --delete
```

## Step 8: Set Up CloudFront Distributions

### 8.1 Create CloudFront Distribution for Frontend
```bash
aws cloudfront create-distribution --distribution-config '{
  "CallerReference": "ecommerce-frontend-1",
  "Comment": "E-commerce Frontend Distribution",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-ecommerce-frontend-prod",
        "DomainName": "ecommerce-frontend-prod.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-ecommerce-frontend-prod",
    "ViewerProtocolPolicy": "redirect-to-https",
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {
        "Forward": "none"
      }
    },
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000
  },
  "Enabled": true,
  "PriceClass": "PriceClass_100"
}'
```

## Step 9: Create Application Load Balancer

### 9.1 Create ALB
```bash
aws elbv2 create-load-balancer \
    --name ecommerce-alb \
    --subnets subnet-xxxxx subnet-yyyyy \
    --security-groups sg-xxxxx \
    --scheme internet-facing \
    --type application \
    --ip-address-type ipv4
```

### 9.2 Create Target Groups
```bash
# Backend target group
aws elbv2 create-target-group \
    --name ecommerce-backend-tg \
    --protocol HTTP \
    --port 8000 \
    --vpc-id vpc-xxxxx \
    --target-type ip \
    --health-check-path /health \
    --health-check-interval-seconds 30 \
    --health-check-timeout-seconds 5 \
    --healthy-threshold-count 2 \
    --unhealthy-threshold-count 3
```

### 9.3 Create Listeners
```bash
# Create listener for backend
aws elbv2 create-listener \
    --load-balancer-arn arn:aws:elasticloadbalancing:us-east-1:<account-id>:loadbalancer/app/ecommerce-alb/xxxxx \
    --protocol HTTP \
    --port 80 \
    --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:us-east-1:<account-id>:targetgroup/ecommerce-backend-tg/xxxxx
```

## Step 10: Create ECS Service

### 10.1 Create ECS Service
```bash
aws ecs create-service \
    --cluster ecommerce-cluster \
    --service-name ecommerce-backend-service \
    --task-definition ecommerce-backend:1 \
    --desired-count 2 \
    --launch-type FARGATE \
    --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxx,subnet-yyyyy],securityGroups=[sg-xxxxx],assignPublicIp=DISABLED}" \
    --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:us-east-1:<account-id>:targetgroup/ecommerce-backend-tg/xxxxx,containerName=backend,containerPort=8000"
```

## Step 11: Set Up Domain and SSL

### 11.1 Request SSL Certificate
```bash
aws acm request-certificate \
    --domain-name your-domain.com \
    --subject-alternative-names www.your-domain.com admin.your-domain.com \
    --validation-method DNS
```

### 11.2 Create Route 53 Hosted Zone
```bash
aws route53 create-hosted-zone \
    --name your-domain.com \
    --caller-reference $(date +%s)
```

### 11.3 Create DNS Records
```bash
# Create A record for ALB
aws route53 change-resource-record-sets \
    --hosted-zone-id Z123456789 \
    --change-batch '{
        "Changes": [{
            "Action": "CREATE",
            "ResourceRecordSet": {
                "Name": "api.your-domain.com",
                "Type": "A",
                "AliasTarget": {
                    "DNSName": "ecommerce-alb-xxxxx.us-east-1.elb.amazonaws.com",
                    "EvaluateTargetHealth": false,
                    "HostedZoneId": "Z35SXDOTRQ7X7K"
                }
            }
        }]
    }'
```

## Step 12: Environment Variables and Configuration

### 12.1 Update Frontend Environment
Create `frontend/.env.production`:
```env
REACT_APP_API_URL=https://api.your-domain.com
```

### 12.2 Update Backend CORS
Update `backend/app/config.py`:
```python
CORS_ORIGINS = [
    "https://your-domain.com",
    "https://www.your-domain.com", 
    "https://admin.your-domain.com",
    "https://your-cloudfront-domain.cloudfront.net"
]
```

## Step 13: Database Initialization

### 13.1 Connect to RDS and Initialize
```bash
# Connect to RDS instance
psql -h <rds-endpoint> -U postgres -d postgres

# Create database
CREATE DATABASE ecommerce;

# Run initialization script
\c ecommerce
\i backend/init.sql
```

## Step 14: Monitoring and Logging

### 14.1 Create CloudWatch Log Groups
```bash
aws logs create-log-group --log-group-name /ecs/ecommerce-backend
aws logs create-log-group --log-group-name /ecs/ecommerce-frontend
aws logs create-log-group --log-group-name /ecs/ecommerce-admin
```

### 14.2 Set Up CloudWatch Alarms
```bash
# High CPU alarm
aws cloudwatch put-metric-alarm \
    --alarm-name "ECS-High-CPU" \
    --alarm-description "Alert when CPU exceeds 80%" \
    --metric-name CPUUtilization \
    --namespace AWS/ECS \
    --statistic Average \
    --period 300 \
    --threshold 80 \
    --comparison-operator GreaterThanThreshold \
    --evaluation-periods 2
```

## Step 15: CI/CD Pipeline (Optional)

### 15.1 Create CodePipeline
```bash
aws codepipeline create-pipeline --pipeline '{
  "name": "ecommerce-pipeline",
  "roleArn": "arn:aws:iam::<account-id>:role/CodePipelineServiceRole",
  "artifactStore": {
    "type": "S3",
    "location": "ecommerce-codepipeline-artifacts"
  },
  "stages": [
    {
      "name": "Source",
      "actions": [
        {
          "name": "SourceAction",
          "actionTypeId": {
            "category": "Source",
            "owner": "AWS",
            "provider": "S3",
            "version": "1"
          },
          "configuration": {
            "S3Bucket": "your-source-bucket",
            "S3ObjectKey": "source.zip"
          },
          "outputArtifacts": [
            {
              "name": "SourceOutput"
            }
          ]
        }
      ]
    }
  ]
}'
```

## Cost Optimization Tips

1. **Use Spot Instances** for non-critical workloads
2. **Set up Auto Scaling** to handle traffic spikes
3. **Use S3 Intelligent Tiering** for static assets
4. **Enable CloudFront caching** to reduce origin requests
5. **Monitor costs** with AWS Cost Explorer

## Security Best Practices

1. **Use IAM roles** instead of access keys
2. **Enable VPC Flow Logs** for network monitoring
3. **Use AWS Secrets Manager** for sensitive data
4. **Enable AWS Config** for compliance monitoring
5. **Use AWS WAF** for web application firewall

## Troubleshooting

### Common Issues:
1. **ECS tasks not starting**: Check security groups and IAM roles
2. **Database connection issues**: Verify security groups allow traffic
3. **CORS errors**: Update CORS_ORIGINS in backend config
4. **SSL certificate issues**: Ensure DNS validation is complete

### Useful Commands:
```bash
# Check ECS service status
aws ecs describe-services --cluster ecommerce-cluster --services ecommerce-backend-service

# View logs
aws logs get-log-events --log-group-name /ecs/ecommerce-backend --log-stream-name <stream-name>

# Check ALB health
aws elbv2 describe-target-health --target-group-arn <target-group-arn>
```

## Final URLs
After successful deployment:
- **Frontend**: https://your-domain.com
- **Admin Panel**: https://admin.your-domain.com  
- **API**: https://api.your-domain.com
- **API Docs**: https://api.your-domain.com/docs

## Next Steps
1. Set up monitoring with CloudWatch
2. Configure backup strategies for RDS
3. Implement CI/CD pipeline
4. Set up staging environment
5. Configure custom domain and SSL
