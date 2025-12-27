#!/bin/sh

# Get port from environment variable or default to 3000
PORT=${PORT:-3000}

# Debug logging
echo "🚀 Starting nginx on port: $PORT" >&2
echo "📋 PORT environment variable: $PORT" >&2

# Write nginx config directly (no template needed)
cat > /etc/nginx/conf.d/default.conf <<EOF
server {
    listen 0.0.0.0:${PORT};
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Handle React Router
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

echo "✅ Nginx config created" >&2
echo "📄 Config file contents:" >&2
cat /etc/nginx/conf.d/default.conf >&2

# Test nginx config
echo "🔍 Testing nginx configuration..." >&2
if ! nginx -t 2>&1; then
    echo "❌ ERROR: Nginx configuration test failed" >&2
    exit 1
fi

echo "✅ Nginx configuration is valid" >&2
echo "🌐 Starting nginx on 0.0.0.0:${PORT}..." >&2

# Start nginx in foreground
exec nginx -g "daemon off;"
