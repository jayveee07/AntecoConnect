FROM php:8.3-fpm AS base

RUN apt-get update && apt-get install -y \
    nginx \
    libpq-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    libonig-dev \
    libxml2-dev \
    libcurl4-openssl-dev \
    libicu-dev \
    unzip \
    curl \
    git \
    supervisor \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo_pgsql \
        pgsql \
        mbstring \
        xml \
        curl \
        gd \
        zip \
        bcmath \
        intl \
    && mkdir -p /var/run /var/log/php \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN echo "listen = /var/run/php-fpm.sock" >> /usr/local/etc/php-fpm.d/zz-www.conf \
    && echo "listen.owner = www-data" >> /usr/local/etc/php-fpm.d/zz-www.conf \
    && echo "listen.group = www-data" >> /usr/local/etc/php-fpm.d/zz-www.conf \
    && echo "listen.mode = 0666" >> /usr/local/etc/php-fpm.d/zz-www.conf \
    && echo "pm = dynamic" >> /usr/local/etc/php-fpm.d/zz-www.conf \
    && echo "pm.max_children = 50" >> /usr/local/etc/php-fpm.d/zz-www.conf \
    && echo "pm.start_servers = 4" >> /usr/local/etc/php-fpm.d/zz-www.conf \
    && echo "pm.min_spare_servers = 2" >> /usr/local/etc/php-fpm.d/zz-www.conf \
    && echo "pm.max_spare_servers = 8" >> /usr/local/etc/php-fpm.d/zz-www.conf

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY . .

RUN composer install --no-dev --optimize-autoloader --no-interaction

RUN chown -R www-data:www-data /app/storage /app/bootstrap/cache \
    && chmod -R 775 /app/storage /app/bootstrap/cache

COPY nginx.conf /etc/nginx/nginx.conf
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["docker-entrypoint.sh"]
