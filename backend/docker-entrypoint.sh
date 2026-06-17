#!/bin/sh
set -e

if [ -z "${APP_KEY}" ]; then
    echo "ERROR: APP_KEY is not set. Run 'php artisan key:generate' and set it."
    exit 1
fi

php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

php artisan migrate --force

exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
