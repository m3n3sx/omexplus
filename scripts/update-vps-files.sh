#!/bin/bash

# Skrypt aktualizujący pliki na VPS

echo "🚀 Aktualizacja plików na VPS..."

# Skopiuj tylko zmienione pliki
scp src/api/admin/orders/\[id\]/route.ts menes@vps:/tmp/route.ts
scp src/api/admin/orders/\[id\]/update-payment/route.ts menes@vps:/tmp/update-payment-route.ts
scp src/api/admin/orders/\[id\]/update-status/route.ts menes@vps:/tmp/update-status-route.ts
scp admin-dashboard/app/orders/\[id\]/page.tsx menes@vps:/tmp/orders-page.tsx
scp admin-dashboard/lib/utils.ts menes@vps:/tmp/utils.ts
scp admin-dashboard/lib/api-client.ts menes@vps:/tmp/api-client.ts

echo "✅ Pliki skopiowane do /tmp na VPS"
echo ""
echo "Teraz zaloguj się na VPS i uruchom:"
echo "ssh menes@vps"
echo "sudo cp /tmp/route.ts /www/wwwroot/ooxo.pl/src/api/admin/orders/[id]/route.ts"
echo "sudo cp /tmp/update-payment-route.ts /www/wwwroot/ooxo.pl/src/api/admin/orders/[id]/update-payment/route.ts"
echo "sudo cp /tmp/update-status-route.ts /www/wwwroot/ooxo.pl/src/api/admin/orders/[id]/update-status/route.ts"
echo "sudo cp /tmp/orders-page.tsx /www/wwwroot/ooxo.pl/admin-dashboard/app/orders/[id]/page.tsx"
echo "sudo cp /tmp/utils.ts /www/wwwroot/ooxo.pl/admin-dashboard/lib/utils.ts"
echo "sudo cp /tmp/api-client.ts /www/wwwroot/ooxo.pl/admin-dashboard/lib/api-client.ts"
echo "sudo chown -R www:www /www/wwwroot/ooxo.pl/src /www/wwwroot/ooxo.pl/admin-dashboard"
echo "cd /www/wwwroot/ooxo.pl && npm run build"
echo "pkill -f medusa && pkill -f next"
echo "cd /www/wwwroot/ooxo.pl && npm start &"
echo "cd /www/wwwroot/ooxo.pl/storefront && npm start &"
echo "cd /www/wwwroot/ooxo.pl/admin-dashboard && PORT=7001 npm run dev &"
