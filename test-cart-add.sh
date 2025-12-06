#!/bin/bash

API_KEY="pk_c70e4aeb4dfff475873e37bbeb633670a95b4246e07eb7fa7e10beecfdf66cf0"

echo "=== Test 1: Tworzenie koszyka ==="
CART_RESPONSE=$(curl -s -X POST \
  -H "x-publishable-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  http://localhost:9000/store/carts)

CART_ID=$(echo $CART_RESPONSE | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "Utworzono koszyk: $CART_ID"

echo ""
echo "=== Test 2: Pobieranie produktu ==="
PRODUCT_RESPONSE=$(curl -s \
  -H "x-publishable-api-key: $API_KEY" \
  http://localhost:9000/store/products?limit=1)

VARIANT_ID=$(echo $PRODUCT_RESPONSE | grep -o '"id":"variant_[^"]*"' | head -1 | cut -d'"' -f4)
echo "Znaleziono wariant: $VARIANT_ID"

if [ -z "$VARIANT_ID" ]; then
  echo "BŁĄD: Nie znaleziono wariantu produktu"
  exit 1
fi

echo ""
echo "=== Test 3: Dodawanie produktu do koszyka ==="
ADD_RESPONSE=$(curl -s -X POST \
  -H "x-publishable-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"variant_id\":\"$VARIANT_ID\",\"quantity\":1}" \
  http://localhost:9000/store/carts/$CART_ID/line-items)

echo "Odpowiedź:"
echo $ADD_RESPONSE | head -c 500
echo ""
echo ""
echo "✓ Test zakończony"
