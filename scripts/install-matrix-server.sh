#!/bin/bash

# Skrypt instalacji serwera Matrix na VPS
# Użycie: bash install-matrix-server.sh chat.twojadomena.pl

set -e

DOMAIN=$1
POSTGRES_PASSWORD=$(openssl rand -base64 32)

if [ -z "$DOMAIN" ]; then
    echo "❌ Błąd: Podaj domenę"
    echo "Użycie: bash install-matrix-server.sh chat.twojadomena.pl"
    exit 1
fi

echo "🚀 Instalacja serwera Matrix dla domeny: $DOMAIN"
echo ""

# 1. Aktualizacja systemu
echo "📦 Aktualizacja systemu..."
apt update && apt upgrade -y

# 2. Instalacja Docker
echo "🐳 Instalacja Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
fi

# 3. Instalacja Docker Compose
echo "📦 Instalacja Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    apt install docker-compose -y
fi

# 4. Instalacja Nginx i Certbot
echo "🌐 Instalacja Nginx i Certbot..."
apt install nginx certbot python3-certbot-nginx -y

# 5. Tworzenie struktury katalogów
echo "📁 Tworzenie katalogów..."
mkdir -p /opt/matrix/data
mkdir -p /opt/matrix/postgres
cd /opt/matrix

# 6. Tworzenie docker-compose.yml
echo "📝 Tworzenie docker-compose.yml..."
cat > docker-compose.yml << EOF
version: '3.8'

services:
  synapse:
    image: matrixdotorg/synapse:latest
    container_name: matrix-synapse
    restart: unless-stopped
    ports:
      - "8008:8008"
    volumes:
      - ./data:/data
    environment:
      - SYNAPSE_SERVER_NAME=$DOMAIN
      - SYNAPSE_REPORT_STATS=no
      - SYNAPSE_NO_TLS=true
    networks:
      - matrix-net
    depends_on:
      - postgres

  postgres:
    image: postgres:15-alpine
    container_name: matrix-postgres
    restart: unless-stopped
    environment:
      - POSTGRES_USER=synapse
      - POSTGRES_PASSWORD=$POSTGRES_PASSWORD
      - POSTGRES_DB=synapse
      - POSTGRES_INITDB_ARGS=--encoding=UTF-8 --lc-collate=C --lc-ctype=C
    volumes:
      - ./postgres:/var/lib/postgresql/data
    networks:
      - matrix-net

networks:
  matrix-net:
    driver: bridge
EOF

# 7. Generowanie konfiguracji Synapse
echo "⚙️  Generowanie konfiguracji Synapse..."
docker run -it --rm \
  -v $(pwd)/data:/data \
  -e SYNAPSE_SERVER_NAME=$DOMAIN \
  -e SYNAPSE_REPORT_STATS=no \
  matrixdotorg/synapse:latest generate

# 8. Konfiguracja bazy danych w homeserver.yaml
echo "🔧 Konfiguracja bazy danych..."
cat > data/homeserver.yaml.tmp << EOF
# Podstawowa konfiguracja - reszta zostanie z wygenerowanego pliku
database:
  name: psycopg2
  args:
    user: synapse
    password: $POSTGRES_PASSWORD
    database: synapse
    host: postgres
    port: 5432
    cp_min: 5
    cp_max: 10

enable_registration: false
enable_registration_without_verification: false
EOF

# Merge konfiguracji (uproszczone - w produkcji użyj yq lub ręcznie)
echo "⚠️  UWAGA: Musisz ręcznie edytować data/homeserver.yaml"
echo "   Zmień sekcję 'database' na PostgreSQL (szczegóły w MATRIX_SERVER_SETUP.md)"

# 9. Konfiguracja Nginx
echo "🌐 Konfiguracja Nginx..."
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
    }
}
EOF

ln -sf /etc/nginx/sites-available/matrix /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

# 10. Uruchomienie kontenerów
echo "🚀 Uruchomienie kontenerów..."
docker-compose up -d

# 11. Czekaj na start Synapse
echo "⏳ Czekanie na start Synapse..."
sleep 10

# 12. Certyfikat SSL
echo "🔒 Instalacja certyfikatu SSL..."
echo "⚠️  UWAGA: Upewnij się że DNS jest skonfigurowane!"
read -p "Czy DNS jest skonfigurowane? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
fi

# 13. Zapisz dane
echo ""
echo "✅ Instalacja zakończona!"
echo ""
echo "📝 Zapisz te dane:"
echo "================================"
echo "Domena: $DOMAIN"
echo "PostgreSQL Password: $POSTGRES_PASSWORD"
echo "================================"
echo ""
echo "🔧 Następne kroki:"
echo "1. Edytuj /opt/matrix/data/homeserver.yaml (zmień database na PostgreSQL)"
echo "2. Zrestartuj: cd /opt/matrix && docker-compose restart"
echo "3. Utwórz konto bota:"
echo "   docker exec -it matrix-synapse register_new_matrix_user -c /data/homeserver.yaml http://localhost:8008"
echo "4. Wygeneruj access token (szczegóły w MATRIX_SERVER_SETUP.md)"
echo "5. Skonfiguruj backend (.env):"
echo "   MATRIX_HOMESERVER_URL=https://$DOMAIN"
echo "   MATRIX_ACCESS_TOKEN=..."
echo "   MATRIX_USER_ID=@chatbot:$DOMAIN"
echo ""
echo "📚 Pełna dokumentacja: MATRIX_SERVER_SETUP.md"
