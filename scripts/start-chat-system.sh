#!/bin/bash

echo "🚀 Uruchamianie systemu Live Chat z Matrix..."
echo ""

# 1. Sprawdź czy matrix-js-sdk jest zainstalowany
echo "1️⃣ Sprawdzanie matrix-js-sdk..."
if npm list matrix-js-sdk > /dev/null 2>&1; then
    echo "✅ matrix-js-sdk zainstalowany"
else
    echo "📦 Instalowanie matrix-js-sdk..."
    npm install matrix-js-sdk
fi

# 2. Sprawdź konfigurację
echo ""
echo "2️⃣ Sprawdzanie konfiguracji..."
if grep -q "MATRIX_HOMESERVER_URL=https://chat.ooxo.pl" .env; then
    echo "✅ Matrix skonfigurowany w .env"
else
    echo "⚠️  Matrix nie jest skonfigurowany w .env"
    echo "   Dodaj:"
    echo "   MATRIX_HOMESERVER_URL=https://chat.ooxo.pl"
    echo "   MATRIX_ACCESS_TOKEN=syt_Y2hhdGJvdA_KmDQQticWraPUHftWsQO_20j3mw"
    echo "   MATRIX_USER_ID=@chatbot:ooxo.pl"
fi

# 3. Build backend
echo ""
echo "3️⃣ Budowanie backendu..."
npm run build

# 4. Informacje
echo ""
echo "✅ Gotowe do uruchomienia!"
echo ""
echo "📍 Następne kroki:"
echo "================================"
echo "1. Uruchom backend:"
echo "   npm run dev"
echo ""
echo "2. W nowym terminalu uruchom storefront:"
echo "   cd storefront && npm run dev"
echo ""
echo "3. W nowym terminalu uruchom admin:"
echo "   cd admin-dashboard && npm run dev"
echo ""
echo "4. Otwórz w przeglądarce:"
echo "   • Storefront: http://localhost:3000"
echo "   • Admin: http://localhost:3001/chat"
echo ""
echo "5. Test:"
echo "   • Kliknij widget czatu (prawy dolny róg)"
echo "   • Napisz wiadomość"
echo "   • Bot odpowie!"
echo ""
echo "📱 Element (dla konsultantów):"
echo "   • Pobierz: https://element.io/download"
echo "   • Homeserver: https://chat.ooxo.pl"
echo "   • Username: @admin:ooxo.pl"
echo "   • Password: admin123"
echo ""
echo "📚 Dokumentacja: FINAL_SETUP_COMPLETE.md"
echo ""
