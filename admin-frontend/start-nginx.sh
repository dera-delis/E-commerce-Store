#!/bin/sh
# Startup script for nginx that reads PORT environment variable

# Get port from environment variable or default to 5030
PORT=${PORT:-5030}

# Replace PORT placeholder in nginx config template
envsubst '${PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# Start nginx
exec nginx -g "daemon off;"

