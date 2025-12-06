#!/bin/bash

echo "🚀 Skrypt wdrożenia backendu Medusa"
echo "===================================="
echo ""

# Kolory
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Sprawdź czy Railway CLI jest zainstalowane
if ! command -v railway &> /dev/null; then
    echo -e "${YELLOW}⚠️  Railway CLI nie jest zainstalowane${NC}"
    echo ""
    echo "Wybierz metodę instalacji:"
    echo "1) Zainstaluj przez curl (zalecane)"
    echo "2) Zainstaluj przez npm"
    echo "3) Pomiń i użyj Railway Dashboard"
    echo ""
    read -p "Wybór (1-3): " choice
    
    case $choice in
        1)
            echo "Instaluję Railway CLI..."
            curl -fsSL https://railway.app/install.sh | sh
            ;;
        2)
            echo "Instaluję Railway CLI przez npm..."
            npm install -g @railway/cli
            ;;
        3)
            echo ""
            echo -e "${YELLOW}📖 Otwórz BACKEND_DEPLOYMENT.md dla instrukcji wdrożenia przez Dashboard${NC}"
            echo ""
            echo "Krótka instrukcja:"
            echo "1. Przejdź na https://railway.app"
            echo "2. Zaloguj się przez GitHub"
            echo "3. Kliknij 'New Project'"
            echo "4. Dodaj PostgreSQL database"
            echo "5. Dodaj GitHub repo lub wdróż z lokalnego folderu"
            echo "6. Ustaw zmienne środowiskowe (patrz BACKEND_DEPLOYMENT.md)"
            exit 0
            ;;
        *)
            echo -e "${RED}Nieprawidłowy wybór${NC}"
            exit 1
            ;;
    esac
fi

echo ""
echo -e "${GREEN}✓ Railway CLI zainstalowane${NC}"
echo ""

# Sprawdź czy użytkownik jest zalogowany
if ! railway whoami &> /dev/null; then
    echo "🔐 Logowanie do Railway..."
    railway login
fi

echo ""
echo -e "${GREEN}✓ Zalogowano do Railway${NC}"
echo ""

# Inicjalizuj projekt
echo "📦 Inicjalizacja projektu Railway..."
railway init

echo ""
echo "🗄️  Dodawanie PostgreSQL..."
railway add --database postgres

echo ""
echo "🔑 Generowanie bezpiecznych sekretów..."

JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
COOKIE_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

echo ""
echo "⚙️  Ustawianie zmiennych środowiskowych..."

railway variables set STORE_CORS=https://lucky-salmiakki-66fc35.netlify.app
railway variables set ADMIN_CORS=https://lucky-salmiakki-66fc35.netlify.app
railway variables set AUTH_CORS=https://lucky-salmiakki-66fc35.netlify.app
railway variables set JWT_SECRET=$JWT_SECRET
railway variables set COOKIE_SECRET=$COOKIE_SECRET

echo ""
echo -e "${GREEN}✓ Zmienne środowiskowe ustawione${NC}"
echo ""

echo "🚀 Wdrażanie backendu..."
railway up

echo ""
echo -e "${GREEN}✅ Backend wdrożony!${NC}"
echo ""

# Pobierz URL
BACKEND_URL=$(railway domain)

echo "📋 Podsumowanie:"
echo "==============="
echo ""
echo "Backend URL: $BACKEND_URL"
echo ""
echo "🔧 Następne kroki:"
echo ""
echo "1. Zaktualizuj URL frontendu w Netlify:"
echo "   cd storefront"
echo "   netlify env:set NEXT_PUBLIC_MEDUSA_BACKEND_URL \"$BACKEND_URL\""
echo "   netlify deploy --prod"
echo ""
echo "2. Przetestuj backend:"
echo "   curl $BACKEND_URL/health"
echo ""
echo "3. Utwórz użytkownika admin:"
echo "   railway run npm run seed"
echo ""
echo -e "${GREEN}🎉 Gotowe!${NC}"
