#!/bin/bash
# Skrypt do czyszczenia cache nginx
# Uruchamiany przez cron

# Ścieżki cache nginx (dostosuj do swojej konfiguracji)
CACHE_PATHS=(
    "/www/server/nginx/proxy_cache_dir"
    "/www/server/nginx/fastcgi_cache"
    "/var/cache/nginx"
)

LOG_FILE="/var/log/nginx-cache-clear.log"

echo "$(date '+%Y-%m-%d %H:%M:%S') - Czyszczenie cache nginx..." >> $LOG_FILE

for CACHE_PATH in "${CACHE_PATHS[@]}"; do
    if [ -d "$CACHE_PATH" ]; then
        rm -rf "$CACHE_PATH"/*
        echo "$(date '+%Y-%m-%d %H:%M:%S') - Wyczyszczono: $CACHE_PATH" >> $LOG_FILE
    fi
done

# Przeładuj nginx (opcjonalnie)
# nginx -s reload

echo "$(date '+%Y-%m-%d %H:%M:%S') - Cache wyczyszczony" >> $LOG_FILE
