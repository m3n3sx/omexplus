#!/bin/bash

# Skrypt pomocniczy do wdrożenia na Netlify
# Użycie: ./deploy-to-netlify.sh [preview|prod]

set -e

echo "🚀 Netlify Deployment Script"
echo "=============================="
echo ""

# Sprawdź czy netlify CLI jest zainstalowane
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI nie jest zainstalowane!"
    echo "Zainstaluj: npm install -g netlify-cli"
    exit 1
fi

# Sprawdź czy jesteś zalogowany
echo "📋 Sprawdzam status Netlify..."
if ! netlify status &> /dev/null; then
    echo "❌ Nie jesteś zalogowany do Netlify!"
    echo "Zaloguj się: netlify login"
    exit 1
fi

echo "✅ Zalogowany do Netlify"
echo ""

# Sprawdź czy strona jest zainicjowana
if [ ! -f ".netlify/state.json" ]; then
    echo "⚠️  Strona nie jest jeszcze zainicjowana"
    echo "Uruchom: netlify init"
    exit 1
fi

echo "✅ Strona jest zainicjowana"
echo ""

# Sprawdź zmienne środowiskowe
echo "📋 Sprawdzam zmienne środowiskowe..."
netlify env:list

echo ""
echo "⚠️  WAŻNE: Upewnij się, że NEXT_PUBLIC_MEDUSA_BACKEND_URL wskazuje na produkcyjny backend!"
echo ""

# Wybierz typ wdrożenia
DEPLOY_TYPE=${1:-preview}

if [ "$DEPLOY_TYPE" = "prod" ]; then
    echo "🚀 Wdrażam na PRODUKCJĘ..."
    read -p "Czy na pewno chcesz wdrożyć na produkcję? (tak/nie): " confirm
    if [ "$confirm" != "tak" ]; then
        echo "Anulowano."
        exit 0
    fi
    netlify deploy --prod
else
    echo "🧪 Wdrażam wersję TESTOWĄ (preview)..."
    netlify deploy
fi

echo ""
echo "✅ Wdrożenie zakończone!"
echo ""
echo "Przydatne komendy:"
echo "  netlify open       - Otwórz panel Netlify"
echo "  netlify logs       - Zobacz logi"
echo "  netlify status     - Sprawdź status"
