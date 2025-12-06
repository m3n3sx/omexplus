#!/bin/bash

BACKEND="http://localhost:9000"
PASSWORD='CAnabis123#$'

echo "🔐 Logowanie..."
TOKEN=$(curl -s -X POST "$BACKEND/auth/user/emailpass" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"meneswczesny@gmail.com\",\"password\":\"$PASSWORD\"}" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Błąd logowania"
  exit 1
fi

echo "✅ Zalogowano"

# Pobierz region
REGION_ID=$(curl -s "$BACKEND/admin/regions" -H "Authorization: Bearer $TOKEN" | grep -o '"id":"reg_[^"]*"' | head -1 | cut -d'"' -f4)
echo "✅ Region: $REGION_ID"

# Pobierz kategorie
echo "📁 Pobieranie kategorii..."
CATS=$(curl -s "$BACKEND/admin/product-categories?limit=10" -H "Authorization: Bearer $TOKEN")

echo "$CATS" | grep -o '"id":"pcat_[^"]*"' | cut -d'"' -f4 | head -3 | while read CAT_ID; do
  CAT_NAME=$(echo "$CATS" | grep -A 3 "\"id\":\"$CAT_ID\"" | grep -o '"name":"[^"]*"' | head -1 | cut -d'"' -f4)
  
  echo ""
  echo "📂 $CAT_NAME"
  echo "   Dodaję 10 produktów..."
  
  for i in {1..10}; do
    RAND=$((RANDOM % 1000))
    TITLE="Pompa Parker P${RAND} [${CAT_NAME}]"
    SKU="PARK-${RAND}"
    PRICE=$((RANDOM % 450000 + 50000))
    
    RESULT=$(curl -s -X POST "$BACKEND/admin/products" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "{
        \"title\": \"$TITLE\",
        \"description\": \"Wysokiej jakości część\",
        \"status\": \"published\",
        \"category_ids\": [\"$CAT_ID\"],
        \"options\": [{
          \"title\": \"Wersja\",
          \"values\": [\"Standard\"]
        }],
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
      }" 2>&1)
    
    if echo "$RESULT" | grep -q '"id":"prod_'; then
      echo -n "."
    else
      echo -n "x"
    fi
  done
  
  echo " ✅"
done

echo ""
echo "🎉 Zakończono!"
