#!/bin/bash

# 🔄 Migracja do Zunifikowanej Architektury
# Automatycznie migruje projekt do nowej architektury dostępu do danych

set -e

echo "🚀 Migracja do Zunifikowanej Architektury"
echo "=========================================="
echo ""

# Kolory
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Funkcja do wyświetlania kroków
step() {
    echo -e "${GREEN}✓${NC} $1"
}

warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

error() {
    echo -e "${RED}✗${NC} $1"
}

# Sprawdź czy jesteśmy w głównym katalogu projektu
if [ ! -f "package.json" ] || [ ! -d "storefront" ] || [ ! -d "admin-dashboard" ]; then
    error "Uruchom skrypt z głównego katalogu projektu!"
    exit 1
fi

echo "Krok 1: Backup obecnej konfiguracji"
echo "-----------------------------------"

# Backup storefront
if [ -f "storefront/next.config.js" ]; then
    cp storefront/next.config.js storefront/next.config.js.backup
    step "Backup storefront/next.config.js"
fi

if [ -f "storefront/lib/api-client.ts" ]; then
    cp storefront/lib/api-client.ts storefront/lib/api-client.ts.backup
    step "Backup storefront/lib/api-client.ts"
fi

# Backup admin-dashboard
if [ -f "admin-dashboard/next.config.js" ]; then
    cp admin-dashboard/next.config.js admin-dashboard/next.config.js.backup
    step "Backup admin-dashboard/next.config.js"
fi

if [ -f "admin-dashboard/lib/api-client.ts" ]; then
    cp admin-dashboard/lib/api-client.ts admin-dashboard/lib/api-client.ts.backup
    step "Backup admin-dashboard/lib/api-client.ts"
fi

echo ""
echo "Krok 2: Zastosuj nową konfigurację"
echo "----------------------------------"

# Zastąp next.config.js
if [ -f "storefront/next.config.unified.js" ]; then
    mv storefront/next.config.unified.js storefront/next.config.js
    step "Zaktualizowano storefront/next.config.js"
else
    warning "Nie znaleziono storefront/next.config.unified.js"
fi

if [ -f "admin-dashboard/next.config.unified.js" ]; then
    mv admin-dashboard/next.config.unified.js admin-dashboard/next.config.js
    step "Zaktualizowano admin-dashboard/next.config.js"
else
    warning "Nie znaleziono admin-dashboard/next.config.unified.js"
fi

echo ""
echo "Krok 3: Aktualizacja zmiennych środowiskowych"
echo "---------------------------------------------"

# Generuj losowy secret
REVALIDATE_SECRET=$(openssl rand -hex 32 2>/dev/null || echo "change-this-secret-in-production")

# Aktualizuj storefront/.env.local
if [ -f "storefront/.env.local" ]; then
    if ! grep -q "REVALIDATE_SECRET" storefront/.env.local; then
        echo "" >> storefront/.env.local
        echo "# Revalidation Secret" >> storefront/.env.local
        echo "REVALIDATE_SECRET=$REVALIDATE_SECRET" >> storefront/.env.local
        step "Dodano REVALIDATE_SECRET do storefront/.env.local"
    else
        warning "REVALIDATE_SECRET już istnieje w storefront/.env.local"
    fi
else
    warning "Nie znaleziono storefront/.env.local"
fi

# Aktualizuj admin-dashboard/.env.local
if [ -f "admin-dashboard/.env.local" ]; then
    if ! grep -q "REVALIDATE_SECRET" admin-dashboard/.env.local; then
        echo "" >> admin-dashboard/.env.local
        echo "# Revalidation Secret" >> admin-dashboard/.env.local
        echo "REVALIDATE_SECRET=$REVALIDATE_SECRET" >> admin-dashboard/.env.local
        step "Dodano REVALIDATE_SECRET do admin-dashboard/.env.local"
    else
        warning "REVALIDATE_SECRET już istnieje w admin-dashboard/.env.local"
    fi
    
    if ! grep -q "NEXT_PUBLIC_STOREFRONT_URL" admin-dashboard/.env.local; then
        echo "NEXT_PUBLIC_STOREFRONT_URL=http://localhost:3000" >> admin-dashboard/.env.local
        step "Dodano NEXT_PUBLIC_STOREFRONT_URL do admin-dashboard/.env.local"
    else
        warning "NEXT_PUBLIC_STOREFRONT_URL już istnieje w admin-dashboard/.env.local"
    fi
else
    warning "Nie znaleziono admin-dashboard/.env.local"
fi

echo ""
echo "Krok 4: Weryfikacja plików"
echo "--------------------------"

# Sprawdź czy nowe pliki istnieją
files_to_check=(
    "storefront/lib/unified-api-client.ts"
    "admin-dashboard/lib/unified-admin-client.ts"
    "storefront/app/api/revalidate/route.ts"
    "admin-dashboard/app/api/revalidate/route.ts"
)

all_files_exist=true
for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        step "✓ $file"
    else
        error "✗ $file - BRAK!"
        all_files_exist=false
    fi
done

echo ""
echo "=========================================="
echo ""

if [ "$all_files_exist" = true ]; then
    echo -e "${GREEN}✅ Migracja zakończona pomyślnie!${NC}"
    echo ""
    echo "Następne kroki:"
    echo "1. Przejrzyj UNIFIED_ARCHITECTURE.md"
    echo "2. Zaktualizuj komponenty używając nowych API clients"
    echo "3. Restart aplikacji:"
    echo ""
    echo "   cd storefront && npm run dev"
    echo "   cd admin-dashboard && npm run dev"
    echo ""
    echo "4. Test revalidation:"
    echo ""
    echo "   curl -X POST http://localhost:3000/api/revalidate \\"
    echo "     -H 'Content-Type: application/json' \\"
    echo "     -d '{\"tags\":[\"products\"],\"secret\":\"$REVALIDATE_SECRET\"}'"
    echo ""
    echo "Backup plików znajduje się w *.backup"
else
    error "❌ Migracja niekompletna - brakuje niektórych plików"
    echo ""
    echo "Sprawdź czy wszystkie pliki zostały utworzone:"
    echo "- storefront/lib/unified-api-client.ts"
    echo "- admin-dashboard/lib/unified-admin-client.ts"
    echo "- storefront/app/api/revalidate/route.ts"
    echo "- admin-dashboard/app/api/revalidate/route.ts"
    exit 1
fi
