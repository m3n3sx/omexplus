#!/bin/bash

BACKEND="http://localhost:9000"
EMAIL="meneswczesny@gmail.com"
PASSWORD='CAnabis123#$'

echo "🔐 Logowanie..."
TOKEN=$(curl -s -X POST "$BACKEND/auth/user/emailpass" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Nie udało się zalogować"
  exit 1
fi

echo "✅ Zalogowano"

# Pobierz region
echo "📍 Pobieranie regionu..."
REGION_ID=$(curl -s "$BACKEND/admin/regions" \
  -H "Authorization: Bearer $TOKEN" | grep -o '"id":"reg_[^"]*"' | head -1 | cut -d'"' -f4)

echo "✅ Region ID: $REGION_ID"

# Pobierz kategorie
echo "📁 Pobieranie kategorii..."
CATEGORIES=$(curl -s "$BACKEND/admin/product-categories?limit=20" \
  -H "Authorization: Bearer $TOKEN")

echo "$CATEGORIES" | grep -o '"id":"pcat_[^"]*"' | cut -d'"' -f4 | head -5 | while read CAT_ID; do
  CAT_NAME=$(echo "$CATEGORIES" | grep -A 5 "\"id\":\"$CAT_ID\"" | grep -o '"name":"[^"]*"' | head -1 | cut -d'"' -f4)
  
  echo ""
  echo "📂 Kategoria: $CAT_NAME ($CAT_ID)"
  echo "   Tworzę 5 produktów testowych..."
  
  for i in {1..5}; do
    TITLE="Pompa hydrauliczna Parker P$i [$CAT_NAME]"
    SKU="PARK-P$i-$(date +%s)"
    PRICE=$((RANDOM % 450000 + 50000))
    
    RESULT=$(curl -s -X POST "$BACKEND/admin/products" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "{
        \"title\": \"$TITLE\",
        \"description\": \"Wysokiej jakości pompa hydrauliczna\",
        \"status\": \"published\",
        \"category_ids\": [\"$CAT_ID\"],
        \"variants\": [{
          \"title\": \"Standard\",
          \"sku\": \"$SKU\",
          \"manage_inventory\": true,
          \"inventory_quantity\": 50,
          \"prices\": [{
            \"amount\": $PRICE,
            \"currency_code\": \"pln\",
            \"region_id\": \"$REGION_ID\"
          }]
        }]
      }")
    
    if echo "$RESULT" | grep -q '"id"'; then
      echo "   ✓ Produkt $i utworzony"
    else
      echo "   ✗ Błąd produktu $i"
    fi
  done
done

echo ""
echo "🎉 Zakończono!"
