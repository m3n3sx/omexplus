#!/bin/bash

echo "🚀 Wdrażanie sklepu OMEX na Netlify..."

# Użyj Node 22
export PATH="/usr/bin:$PATH"

# Sprawdź czy build istnieje
if [ ! -d ".next" ]; then
  echo "❌ Brak folderu .next - uruchom najpierw 'npm run build'"
  exit 1
fi

echo "✅ Build znaleziony"
echo "📦 Wdrażanie na Netlify..."

# Wdróż używając npx z Node 22
/usr/bin/node-22 $(which npx) netlify-cli deploy --prod --dir=.next

echo "✅ Wdrożenie zakończone!"
echo "🌐 Twój sklep: https://lucky-salmiakki-66fc35.netlify.app"
