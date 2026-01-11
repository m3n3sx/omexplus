#!/bin/bash
set -e

EC2_HOST="54.173.61.97"
EC2_USER="ubuntu"
KEY_FILE="klucze/klucze.pem"
APP_DIR="/var/www/ooxo"

echo "=== Przygotowanie plików do deploymentu ==="

# Tworzenie archiwum (bez node_modules i .next)
tar --exclude='node_modules' \
    --exclude='.next' \
    --exclude='.git' \
    --exclude='.venv' \
    --exclude='dist' \
    --exclude='backups' \
    --exclude='.medusa' \
    -czvf /tmp/ooxo-deploy.tar.gz \
    package.json package-lock.json tsconfig.json medusa-config.ts \
    src/ storefront/ admin-dashboard/ scripts/ .env

echo "=== Wysyłanie plików na EC2 ==="
scp -i $KEY_FILE -o StrictHostKeyChecking=no /tmp/ooxo-deploy.tar.gz $EC2_USER@$EC2_HOST:/tmp/

echo "=== Rozpakowywanie i instalacja na EC2 ==="
ssh -i $KEY_FILE -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST << 'ENDSSH'
set -e

APP_DIR="/var/www/ooxo"

# Rozpakowanie
cd $APP_DIR
sudo tar -xzvf /tmp/ooxo-deploy.tar.gz

# Aktualizacja .env dla produkcji
sudo sed -i 's|DATABASE_URL=.*|DATABASE_URL=postgres://medusa:medusa_password@localhost/medusa_db|' .env

# Instalacja zależności Medusa backend
echo "=== Instalacja Medusa backend ==="
npm ci --production

# Build Medusa
echo "=== Build Medusa ==="
npm run build

# Instalacja storefront
echo "=== Instalacja Storefront ==="
cd storefront
npm ci --production
npm run build
cd ..

# Instalacja admin-dashboard
echo "=== Instalacja Admin Dashboard ==="
cd admin-dashboard
npm ci --production
npm run build
cd ..

# Konfiguracja PM2
echo "=== Konfiguracja PM2 ==="
pm2 delete all 2>/dev/null || true

pm2 start npm --name "medusa" -- start
pm2 start npm --name "storefront" --cwd ./storefront -- start
pm2 start npm --name "admin" --cwd ./admin-dashboard -- start

pm2 save
pm2 startup

echo "=== Deployment zakończony! ==="
pm2 list
ENDSSH

echo "=== Gotowe! ==="
