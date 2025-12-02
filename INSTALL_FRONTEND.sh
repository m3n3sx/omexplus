#!/bin/bash

echo "🚀 Instalacja frontendu OMEX..."
echo ""

cd storefront

echo "📦 Usuwam stare node_modules..."
rm -rf node_modules package-lock.json

echo "📦 Instaluję zależności..."
npm install

echo ""
echo "✅ Instalacja zakończona!"
echo ""
echo "Uruchom frontend:"
echo "  cd storefront"
echo "  npm run dev"
echo ""
echo "Otwórz: http://localhost:8000/pl"
