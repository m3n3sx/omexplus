#!/bin/bash
echo "🚀 Deploying to VPS..."

# Wyślij skrypt na VPS
cat > /tmp/vps-deploy.sh << 'SCRIPT_END'
#!/bin/bash
echo "Stopping services..."
pkill -f medusa
pkill -f next
sleep 3

echo "Backing up old version..."
cd /www/wwwroot
sudo mv ooxo.pl ooxo.pl.backup.$(date +%Y%m%d_%H%M%S)

echo "Copying new version..."
sudo cp -r /tmp/ooxo-new ooxo.pl
sudo chown -R www:www ooxo.pl

echo "Copying .env file..."
sudo cp ooxo.pl.backup.*/. env ooxo.pl/.env 2>/dev/null || true

echo "Installing dependencies..."
cd ooxo.pl
npm install --production

cd storefront
npm install --production

cd ../admin-dashboard  
npm install --production

echo "Building backend..."
cd /www/wwwroot/ooxo.pl
npm run build

echo "Building storefront..."
cd storefront
npm run build

echo "Starting services..."
cd /www/wwwroot/ooxo.pl
sudo -u www nohup npm start > /tmp/backend.log 2>&1 &
sleep 5

cd storefront
sudo -u www nohup npm start > /tmp/storefront.log 2>&1 &
sleep 5

cd ../admin-dashboard
sudo -u www PORT=7001 nohup npm run dev > /tmp/admin.log 2>&1 &

echo "✅ Deployment complete!"
echo "Check logs:"
echo "  tail -f /tmp/backend.log"
echo "  tail -f /tmp/storefront.log"
echo "  tail -f /tmp/admin.log"
SCRIPT_END

scp /tmp/vps-deploy.sh menes@vps:/tmp/
ssh menes@vps "chmod +x /tmp/vps-deploy.sh && /tmp/vps-deploy.sh"
