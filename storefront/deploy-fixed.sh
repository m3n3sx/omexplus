#!/bin/bash

echo "🚀 Wdrażanie sklepu OMEX na Netlify (poprawiona wersja)..."

# Sprawdź czy build istnieje
if [ ! -d ".next" ]; then
  echo "❌ Brak folderu .next - uruchamiam build..."
  npm run build
fi

echo "✅ Build gotowy"
echo "📦 Wdrażanie na Netlify..."

# Wdróż używając Netlify CLI
# Plugin @netlify/plugin-nextjs automatycznie obsłuży Next.js
npx netlify-cli deploy --prod --build

echo ""
echo "✅ Wdrożenie zakończone!"
echo "🌐 Sprawdź sklep: https://lucky-salmiakki-66fc35.netlify.app"
