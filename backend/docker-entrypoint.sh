#!/bin/sh
set -e

if [ -z "${APP_KEY}" ]; then
    echo "ERROR: APP_KEY is not set."
    exit 1
fi

echo "Running Laravel artisan commands..."
php artisan optimize:clear || echo "WARN: optimize:clear failed"
php artisan config:cache || echo "WARN: config:cache failed"
php artisan route:cache || echo "WARN: route:cache failed"
php artisan view:cache || echo "WARN: view:cache failed"

php artisan migrate --force || echo "WARN: migrate failed, continuing..."

echo "Starting supervisord..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
