#!/bin/bash

# Skrypt zabezpieczenia Matrix Synapse
# Użycie: bash secure-matrix.sh chat.ooxo.pl

set -e

DOMAIN=$1

if [ -z "$DOMAIN" ]; then
    echo "❌ Błąd: Podaj domenę"
    echo "Użycie: bash secure-matrix.sh chat.ooxo.pl"
    exit 1
fi

echo "🔒 Zabezpieczanie Matrix Synapse dla domeny: $DOMAIN"
echo ""

# 1. Sprawdź czy Synapse działa
echo "1️⃣ Sprawdzanie Synapse..."
if ! docker ps | grep -q matrix-synapse; then
    echo "❌ Synapse nie działa!"
    echo "   Uruchom: docker start matrix-synapse"
    exit 1
fi
echo "✅ Synapse działa"

# 2. Instalacja Nginx i Certbot
echo ""
echo "2️⃣ Instalacja Nginx i Certbot..."
apt update
apt install nginx certbot python3-certbot-nginx -y
echo "✅ Nginx i Certbot zainstalowane"

# 3. Konfiguracja Nginx
echo ""
echo "3️⃣ Konfiguracja Nginx..."
cat > /etc/nginx/sites-available/matrix << EOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN;

    location /.well-known/matrix/server {
        return 200 '{"m.server": "$DOMAIN:443"}';
        default_type application/json;
        add_header Access-Control-Allow-Origin *;
    }

    location /.well-known/matrix/client {
        return 200 '{"m.homeserver": {"base_url": "https://$DOMAIN"}}';
        default_type application/json;
        add_header Access-Control-Allow-Origin *;
    }

    location / {
        proxy_pass http://localhost:8008;
        proxy_set_header X-Forwarded-For \$remote_addr;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Host \$host;
        
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF

ln -sf /etc/nginx/sites-available/matrix /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
echo "✅ Nginx skonfigurowany"

# 4. Sprawdź DNS
echo ""
echo "4️⃣ Sprawdzanie DNS..."
if ! nslookup $DOMAIN > /dev/null 2>&1; then
    echo "⚠️  UWAGA: DNS nie jest skonfigurowane!"
    echo "   Dodaj rekord A: $DOMAIN → IP serwera"
    echo "   Poczekaj 5-10 minut i uruchom ponownie"
    exit 1
fi
echo "✅ DNS skonfigurowane"

# 5. Certyfikat SSL
echo ""
echo "5️⃣ Instalacja certyfikatu SSL..."
read -p "Czy chcesz zainstalować certyfikat SSL? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN --redirect
    echo "✅ SSL zainstalowany"
else
    echo "⚠️  Pomiń SSL (tylko dla testów!)"
fi

# 6. Firewall
echo ""
echo "6️⃣ Konfiguracja firewall..."
if ! command -v ufw &> /dev/null; then
    apt install ufw -y
fi

ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 9000/tcp  # Backend
ufw deny 8008/tcp   # Zablokuj bezpośredni dostęp do Synapse
ufw --force enable

echo "✅ Firewall skonfigurowany"

# 7. Wyłącz publiczną rejestrację
echo ""
echo "7️⃣ Wyłączanie publicznej rejestracji..."
if [ -f /opt/matrix/data/homeserver.yaml ]; then
    sed -i 's/enable_registration: true/enable_registration: false/' /opt/matrix/data/homeserver.yaml
    docker restart matrix-synapse
    echo "✅ Publiczna rejestracja wyłączona"
else
    echo "⚠️  Nie znaleziono homeserver.yaml"
fi

# 8. Podsumowanie
echo ""
echo "✅ Zabezpieczenie zakończone!"
echo ""
echo "📝 Następne kroki:"
echo "================================"
echo "1. Zmień hasło admina:"
echo "   docker exec -it matrix-synapse reset-password @admin:$DOMAIN"
echo ""
echo "2. Utwórz konto bota:"
echo "   docker exec -it matrix-synapse register_new_matrix_user -c /data/homeserver.yaml http://localhost:8008"
echo "   Username: chatbot"
echo "   Password: [SILNE HASŁO]"
echo "   Make admin? no"
echo ""
echo "3. Wygeneruj access token:"
echo "   curl -X POST https://$DOMAIN/_matrix/client/r0/login \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"type\":\"m.login.password\",\"user\":\"chatbot\",\"password\":\"HASLO\"}'"
echo ""
echo "4. Skonfiguruj backend (.env):"
echo "   MATRIX_HOMESERVER_URL=https://$DOMAIN"
echo "   MATRIX_ACCESS_TOKEN=..."
echo "   MATRIX_USER_ID=@chatbot:$DOMAIN"
echo ""
echo "5. Zainstaluj SDK i uruchom:"
echo "   npm install matrix-js-sdk"
echo "   npm run build"
echo "   npm run dev"
echo ""
echo "📚 Pełna dokumentacja: MATRIX_SECURE_NOW.md"
