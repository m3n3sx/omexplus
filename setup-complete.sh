#!/bin/bash

echo "🚀 Kompletna konfiguracja produktów dla Medusa"
echo ""

# Kolory
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Sprawdź backend
echo "🔍 Sprawdzam backend..."
if curl -s http://localhost:9000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend działa${NC}"
else
    echo -e "${RED}❌ Backend nie działa. Uruchom: npm run dev${NC}"
    exit 1
fi

# Sprawdź bazę danych
echo ""
echo "🔍 Sprawdzam bazę danych..."
DB_URL=${DATABASE_URL:-"postgresql://postgres:postgres@localhost:5432/medusa-store"}

if psql "$DB_URL" -c "SELECT 1" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Baza danych dostępna${NC}"
else
    echo -e "${RED}❌ Nie można połączyć z bazą danych${NC}"
    echo "Sprawdź DATABASE_URL: $DB_URL"
    exit 1
fi

# Utwórz użytkownika admin
echo ""
echo "👤 Tworzę użytkownika admin..."
psql "$DB_URL" << 'EOF' 2>/dev/null
INSERT INTO "user" (id, email, password_hash, first_name, last_name, role, created_at, updated_at)
VALUES (
  'user_admin_001',
  'admin@medusa-test.com',
  '$2b$10$rKqpHd0VqZfqVqVqVqVqVeKqpHd0VqZfqVqVqVqVqVqVqVqVqVqVq',
  'Admin',
  'User',
  'admin',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET updated_at = NOW();
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Użytkownik admin utworzony${NC}"
    echo "   Email: admin@medusa-test.com"
    echo "   Hasło: supersecret"
else
    echo -e "${YELLOW}⚠️  Użytkownik może już istnieć${NC}"
fi

# Testuj logowanie
echo ""
echo "🔐 Testuję logowanie..."
TOKEN=$(curl -s -X POST http://localhost:9000/admin/auth \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@medusa-test.com","password":"supersecret"}' \
  | grep -o '"api_token":"[^"]*"' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
    echo -e "${GREEN}✅ Logowanie działa!${NC}"
    echo "   Token: ${TOKEN:0:20}..."
    
    # Uruchom skrypt dodawania produktów
    echo ""
    echo "📦 Dodaję produkty..."
    node add-products-to-medusa.js
    
else
    echo -e "${RED}❌ Logowanie nie działa${NC}"
    echo "Spróbuj ręcznie:"
    echo "  psql $DB_URL -f create-admin-and-products.sql"
    exit 1
fi

echo ""
echo -e "${GREEN}✨ Gotowe!${NC}"
echo ""
echo "📊 Sprawdź produkty:"
echo "   Frontend: http://localhost:3000/pl/products"
echo "   API: http://localhost:9000/store/products"
echo "   Admin: http://localhost:7001"
