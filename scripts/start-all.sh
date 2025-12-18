#!/bin/bash

# Skrypt uruchamiający cały system Live Chat
# Użycie: bash start-all.sh

echo "🚀 Uruchamianie systemu Live Chat..."
echo ""

# Sprawdź czy matrix-js-sdk jest zainstalowany
if ! npm list matrix-js-sdk > /dev/null 2>&1; then
    echo "📦 Instalowanie matrix-js-sdk..."
    npm install matrix-js-sdk
fi

# Zbuduj backend
echo "🔨 Budowanie backendu..."
npm run build

echo ""
echo "✅ Gotowe do uruchomienia!"
echo ""
echo "📋 Otwórz 3 terminale i uruchom:"
echo ""
echo "Terminal 1 (Backend):"
echo "  npm run dev"
echo ""
echo "Terminal 2 (Storefront):"
echo "  cd storefront && npm run dev"
echo ""
echo "Terminal 3 (Admin Dashboard):"
echo "  cd admin-dashboard && npm run dev"
echo ""
echo "Lub użyj PM2 (zalecane dla produkcji):"
echo "  pm2 start npm --name medusa -- run dev"
echo "  pm2 start npm --name storefront --cwd storefront -- run dev"
echo "  pm2 start npm --name admin --cwd admin-dashboard -- run dev"
echo ""
echo "📚 Pełna dokumentacja: START_EVERYTHING.md"
