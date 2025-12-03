#!/bin/bash

echo "🚀 Szybkie seedowanie produktów"
echo ""

# Sprawdź czy backend działa
echo "🔍 Sprawdzam backend..."
if curl -s http://localhost:9000/health > /dev/null; then
    echo "✅ Backend działa"
else
    echo "❌ Backend nie działa. Uruchom: cd my-medusa-store && npm run dev"
    exit 1
fi

# Sprawdź czy node_modules są zainstalowane
if [ ! -d "node_modules" ]; then
    echo "📦 Instaluję zależności..."
    npm install axios pg
fi

# Uruchom skrypt
echo ""
echo "📦 Dodaję produkty..."
node add-products-to-medusa.js

echo ""
echo "✨ Gotowe!"
echo ""
echo "📊 Sprawdź produkty:"
echo "   Frontend: http://localhost:3000/pl/products"
echo "   API: http://localhost:9000/store/products"
