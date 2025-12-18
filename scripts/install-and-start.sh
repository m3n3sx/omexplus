#!/bin/bash

echo "🚀 Instalacja i uruchomienie systemu Live Chat z Matrix"
echo ""

# 1. Instalacja matrix-js-sdk
echo "1️⃣ Instalowanie matrix-js-sdk..."
npm install matrix-js-sdk --legacy-peer-deps

if [ $? -eq 0 ]; then
    echo "✅ matrix-js-sdk zainstalowany"
else
    echo "❌ Błąd instalacji matrix-js-sdk"
    echo "   Spróbuj ręcznie: npm install matrix-js-sdk --legacy-peer-deps"
    exit 1
fi

# 2. Build backend
echo ""
echo "2️⃣ Budowanie backendu..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Backend zbudowany"
else
    echo "❌ Błąd budowania backendu"
    exit 1
fi

# 3. Informacje
echo ""
echo "✅ Wszystko gotowe!"
echo ""
echo "🚀 Uruchom teraz:"
echo "================================"
echo ""
echo "Terminal 1 (Backend):"
echo "  npm run dev"
echo ""
echo "Terminal 2 (Storefront):"
echo "  cd storefront && npm run dev"
echo ""
echo "Terminal 3 (Admin):"
echo "  cd admin-dashboard && npm run dev"
echo ""
echo "================================"
echo ""
echo "📍 Po uruchomieniu:"
echo "• Storefront: http://localhost:3000"
echo "• Admin: http://localhost:3001/chat"
echo "• Widget czatu: prawy dolny róg na storefront"
echo ""
echo "📱 Element (konsultanci):"
echo "• Pobierz: https://element.io/download"
echo "• Homeserver: https://chat.ooxo.pl"
echo "• Username: @admin:ooxo.pl"
echo "• Password: admin123"
echo ""
echo "🔍 Szukaj w logach backendu:"
echo "  [Matrix Bridge] Połączono z serwerem Matrix"
echo ""
echo "📚 Dokumentacja: FINAL_SETUP_COMPLETE.md"
