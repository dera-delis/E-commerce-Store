#!/bin/sh
# Startup script for nginx that reads PORT environment variable

# Get port from environment variable or default to 5030
PORT=${PORT:-5030}

# Export PORT so envsubst can use it
export PORT

# Debug logging
echo "🚀 Starting nginx on port: $PORT" >&2
echo "📋 Template file exists: $(test -f /etc/nginx/templates/default.conf.template && echo 'yes' || echo 'no')" >&2

# Replace PORT placeholder in nginx config template
envsubst '${PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# Verify config was created
if [ ! -f /etc/nginx/conf.d/default.conf ]; then
    echo "❌ ERROR: Failed to create nginx config" >&2
    exit 1
fi

# Test nginx config
echo "🔍 Testing nginx configuration..." >&2
nginx -t || {
    echo "❌ ERROR: Nginx configuration test failed" >&2
    cat /etc/nginx/conf.d/default.conf >&2
    exit 1
}

echo "✅ Nginx configuration is valid" >&2
echo "🌐 Starting nginx on port $PORT..." >&2

# Start nginx in foreground
exec nginx -g "daemon off;"

