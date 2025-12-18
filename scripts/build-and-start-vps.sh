#!/bin/bash

# Build and start script for VPS
cd /www/wwwroot/ooxo.pl

echo "=== Stopping old processes ==="
pkill -f 'next|npm' || true
sleep 2

echo "=== Building Admin Dashboard ==="
cd /www/wwwroot/ooxo.pl/admin-dashboard
rm -rf .next
npm run build

echo "=== Building Storefront ==="
cd /www/wwwroot/ooxo.pl/storefront
rm -rf .next
npm run build

echo "=== Starting Backend ==="
cd /www/wwwroot/ooxo.pl
./node_modules/.bin/medusa start > /tmp/backend.log 2>&1 &
echo "Backend PID: $!"

sleep 5

echo "=== Starting Storefront ==="
cd /www/wwwroot/ooxo.pl/storefront
PORT=3000 npm start > /tmp/storefront.log 2>&1 &
echo "Storefront PID: $!"

echo "=== Starting Admin Dashboard ==="
cd /www/wwwroot/ooxo.pl/admin-dashboard
PORT=7001 npm start > /tmp/admin.log 2>&1 &
echo "Admin PID: $!"

sleep 3

echo "=== Services Status ==="
ps aux | grep -E '(medusa|next|npm)' | grep -v grep

echo "=== Done ==="
echo "Backend: http://localhost:9000"
echo "Storefront: http://localhost:3000"
echo "Admin: http://localhost:7001"
