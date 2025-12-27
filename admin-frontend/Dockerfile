# Multi-stage build for production optimization
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies needed for build)
RUN npm install

# Copy source code
COPY . .

# Build the application (this needs dev dependencies like react-scripts)
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx configuration template (nginx:alpine auto-processes .template files)
# It will substitute ${PORT} with the PORT environment variable
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Expose port (Cloud Run will set PORT env var, default to 5030)
EXPOSE 5030

# nginx:alpine automatically processes templates and starts nginx
# No custom CMD needed - default nginx entrypoint handles it
