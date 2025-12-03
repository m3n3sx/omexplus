#!/bin/bash

echo "🔧 Naprawianie stron - usuwanie starych Header/Footer..."
echo ""

# Lista plików do naprawienia
files=(
  "storefront/app/[locale]/orders/[id]/page.tsx"
  "storefront/app/[locale]/order-success/page.tsx"
  "storefront/app/[locale]/o-nas/page.tsx"
  "storefront/app/[locale]/kontakt/page.tsx"
  "storefront/app/[locale]/faq/page.tsx"
  "storefront/app/[locale]/logowanie/page.tsx"
  "storefront/app/[locale]/orders/page.tsx"
  "storefront/app/[locale]/rejestracja/page.tsx"
  "storefront/app/[locale]/checkout/page.tsx"
  "storefront/app/[locale]/products/page.tsx"
  "storefront/app/[locale]/products/[id]/page.tsx"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Naprawianie: $file"
    
    # Usuń importy Header i Footer
    sed -i '/import Header from/d' "$file"
    sed -i '/import Footer from/d' "$file"
    
    # Usuń <Header /> i <Footer />
    sed -i '/<Header \/>/d' "$file"
    sed -i '/<Footer \/>/d' "$file"
    
    echo "✅ $file"
  fi
done

echo ""
echo "🎉 Gotowe! Wszystkie strony naprawione."
echo ""
echo "Teraz uruchom:"
echo "cd storefront && ./restart.sh"
