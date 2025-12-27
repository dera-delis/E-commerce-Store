#!/bin/sh
set -e  # Exit on any error

# Get port from environment variable or default to 3000
PORT=${PORT:-3000}

# Export PORT so envsubst can use it
export PORT

# Debug logging (write to stderr so it shows in Cloud Run logs)
echo "🚀 Starting nginx startup script" >&2
echo "📋 PORT environment variable: $PORT" >&2
echo "📋 Template file path: /etc/nginx/templates/default.conf.template" >&2

# Check if template exists
if [ ! -f /etc/nginx/templates/default.conf.template ]; then
    echo "❌ ERROR: Template file not found!" >&2
    ls -la /etc/nginx/templates/ >&2 || true
    exit 1
fi

echo "✅ Template file found" >&2

# Replace PORT placeholder in nginx config template
# Use explicit 0.0.0.0 binding for Cloud Run compatibility
echo "🔄 Processing template with envsubst..." >&2
envsubst '${PORT}' < /etc/nginx/templates/default.conf.template | sed "s/listen ${PORT};/listen 0.0.0.0:${PORT};/" > /etc/nginx/conf.d/default.conf

# Verify config was created
if [ ! -f /etc/nginx/conf.d/default.conf ]; then
    echo "❌ ERROR: Failed to create nginx config file" >&2
    exit 1
fi

echo "✅ Config file created" >&2
echo "📄 Config file contents:" >&2
cat /etc/nginx/conf.d/default.conf >&2

# Test nginx config
echo "🔍 Testing nginx configuration..." >&2
if ! nginx -t; then
    echo "❌ ERROR: Nginx configuration test failed" >&2
    exit 1
fi

echo "✅ Nginx configuration is valid" >&2
echo "🌐 Starting nginx on port $PORT..." >&2

# Start nginx in foreground (this should not return unless nginx crashes)
exec nginx -g "daemon off;"

