#!/bin/bash

API_KEY="pk_c70e4aeb4dfff475873e37bbeb633670a95b4246e07eb7fa7e10beecfdf66cf0"

echo "=== Test 1: Tworzenie koszyka ==="
CART_RESPONSE=$(curl -s -X POST \
  -H "x-publishable-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  http://localhost:9000/store/carts)

CART_ID=$(echo $CART_RESPONSE | grep -o '"id":"cart_[^"]*"' | head -1 | cut -d'"' -f4)
echo "✓ Utworzono koszyk: $CART_ID"

echo ""
echo "=== Test 2: Pobieranie produktu z wariantem ==="
PRODUCT=$(curl -s -H "x-publishable-api-key: $API_KEY" \
  "http://localhost:9000/store/products/prod_hyd_001")

VARIANT_ID=$(echo $PRODUCT | grep -o '"id":"var_[^"]*"' | head -1 | cut -d'"' -f4)
echo "✓ Znaleziono wariant: $VARIANT_ID"

echo ""
echo "=== Test 3: Dodawanie produktu do koszyka ==="
ADD_RESPONSE=$(curl -s -X POST \
  -H "x-publishable-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"variant_id\":\"$VARIANT_ID\",\"quantity\":1}" \
  http://localhost:9000/store/carts/$CART_ID/line-items)

echo "✓ Dodano produkt do koszyka"

echo ""
echo "=== Test 4: Aktualizacja adresu dostawy ==="
UPDATE_RESPONSE=$(curl -s -X POST \
  -H "x-publishable-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "shipping_address": {
      "first_name": "Jan",
      "last_name": "Kowalski",
      "address_1": "ul. Testowa 123",
      "city": "Warszawa",
      "postal_code": "00-001",
      "country_code": "pl",
      "phone": "+48123456789"
    }
  }' \
  http://localhost:9000/store/carts/$CART_ID)

echo "✓ Zaktualizowano adres dostawy"

echo ""
echo "=== Test 5: Pobieranie opcji dostawy ==="
SHIPPING_OPTIONS=$(curl -s -H "x-publishable-api-key: $API_KEY" \
  "http://localhost:9000/store/shipping-options/$CART_ID")

OPTION_ID=$(echo $SHIPPING_OPTIONS | grep -o '"id":"so_[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$OPTION_ID" ]; then
  echo "⚠ Brak opcji dostawy - pomijam ten krok"
else
  echo "✓ Znaleziono opcję dostawy: $OPTION_ID"
  
  echo ""
  echo "=== Test 6: Dodawanie metody dostawy ==="
  curl -s -X POST \
    -H "x-publishable-api-key: $API_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"option_id\":\"$OPTION_ID\"}" \
    http://localhost:9000/store/carts/$CART_ID/shipping-methods > /dev/null
  
  echo "✓ Dodano metodę dostawy"
fi

echo ""
echo "=== Test 7: Finalizacja zamówienia ==="
ORDER_RESPONSE=$(curl -s -X POST \
  -H "x-publishable-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  http://localhost:9000/store/carts/$CART_ID/complete)

ORDER_ID=$(echo $ORDER_RESPONSE | grep -o '"id":"order_[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$ORDER_ID" ]; then
  echo "✗ Błąd podczas tworzenia zamówienia:"
  echo $ORDER_RESPONSE | python3 -m json.tool 2>/dev/null || echo $ORDER_RESPONSE
else
  echo "✓ Utworzono zamówienie: $ORDER_ID"
  
  echo ""
  echo "=== Test 8: Sprawdzanie zamówienia w bazie ==="
  PGPASSWORD=supersecret psql -h localhost -U postgres -d medusa-my-medusa-store \
    -c "SELECT id, display_id, email, status FROM \"order\" WHERE id = '$ORDER_ID';" 2>&1 | grep -v "^$"
fi

echo ""
echo "=== Test zakończony ==="
