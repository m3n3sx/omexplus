#!/bin/bash

echo "🚀 Instalacja systemu Live Chat z Matrix..."
echo ""

# 1. Zainstaluj zależności
echo "📦 Instalowanie zależności..."
npm install matrix-js-sdk

# 2. Sprawdź konfigurację
echo ""
echo "🔧 Sprawdzanie konfiguracji..."

if grep -q "MATRIX_HOMESERVER_URL" .env; then
    echo "✅ Matrix jest skonfigurowany w .env"
else
    echo "⚠️  Matrix nie jest skonfigurowany"
    echo ""
    echo "Aby włączyć integrację Matrix:"
    echo "1. Załóż konto na https://app.element.io"
    echo "2. Wygeneruj access token (Settings -> Help & About -> Advanced)"
    echo "3. Dodaj do .env:"
    echo ""
    echo "MATRIX_HOMESERVER_URL=https://matrix.org"
    echo "MATRIX_ACCESS_TOKEN=your_token_here"
    echo "MATRIX_USER_ID=@chatbot:matrix.org"
    echo ""
fi

# 3. Build backend
echo ""
echo "🔨 Budowanie backendu..."
npm run build

echo ""
echo "✅ Instalacja zakończona!"
echo ""
echo "📚 Następne kroki:"
echo "1. Uruchom backend: npm run dev"
echo "2. Uruchom storefront: cd storefront && npm run dev"
echo "3. Uruchom admin: cd admin-dashboard && npm run dev"
echo "4. Test systemu: node scripts/test-chat-system.js"
echo ""
echo "📖 Dokumentacja:"
echo "- CHAT_QUICK_START.md - szybki start"
echo "- LIVE_CHAT_SYSTEM.md - pełna dokumentacja"
echo "- MATRIX_INTEGRATION_GUIDE.md - integracja Matrix"
echo ""
