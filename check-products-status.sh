#!/bin/bash

API_KEY="pk_c70e4aeb4dfff475873e37bbeb633670a95b4246e07eb7fa7e10beecfdf66cf0"
BACKEND="http://localhost:9000"

echo "🔍 Sprawdzam status produktów i kategorii..."
echo ""

# Produkty
echo "📦 PRODUKTY:"
PRODUCTS=$(curl -s -H "x-publishable-api-key: $API_KEY" "$BACKEND/store/products?limit=1")
COUNT=$(echo $PRODUCTS | grep -o '"count":[0-9]*' | grep -o '[0-9]*')
echo "   Łącznie produktów: $COUNT"

# Kategorie
echo ""
echo "📁 KATEGORIE:"
CATEGORIES=$(curl -s -H "x-publishable-api-key: $API_KEY" "$BACKEND/store/product-categories?limit=100")
CAT_COUNT=$(echo $CATEGORIES | grep -o '"product_category_id"' | wc -l)
echo "   Łącznie kategorii: $CAT_COUNT"

# Sprawdź produkty w każdej kategorii
echo ""
echo "📊 PRODUKTY W KATEGORIACH:"
echo "$CATEGORIES" | grep -o '"handle":"[^"]*"' | cut -d'"' -f4 | head -10 | while read handle; do
  if [ ! -z "$handle" ]; then
    PRODS=$(curl -s -H "x-publishable-api-key: $API_KEY" "$BACKEND/store/products?category_id[]=$handle&limit=1")
    PROD_COUNT=$(echo $PRODS | grep -o '"count":[0-9]*' | grep -o '[0-9]*')
    echo "   $handle: $PROD_COUNT produktów"
  fi
done

echo ""
echo "✅ Sprawdzanie zakończone"
