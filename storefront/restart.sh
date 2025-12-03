#!/bin/bash

echo "🔄 Czyszczenie cache i restart Next.js..."
echo ""

# Wyczyść cache
echo "1️⃣ Czyszczenie .next..."
rm -rf .next

echo "2️⃣ Czyszczenie node_modules/.cache..."
rm -rf node_modules/.cache

echo ""
echo "✅ Cache wyczyszczony!"
echo ""
echo "🚀 Uruchamianie dev server..."
echo ""

npm run dev
