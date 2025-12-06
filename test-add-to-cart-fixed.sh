#!/bin/bash
API_KEY="pk_c70e4aeb4dfff475873e37bbeb633670a95b4246e07eb7fa7e10beecfdf66cf0"

echo "=== Tworzenie koszyka ==="
CART=$(curl -s -X POST -H "x-publishable-api-key: $API_KEY" -H "Content-Type: application/json" http://localhost:9000/store/carts)
CART_ID=$(echo $CART | python3 -c "import sys, json; print(json.load(sys.stdin)['cart']['id'])")
echo "Koszyk: $CART_ID"

echo ""
echo "=== Dodawanie produktu do koszyka ==="
ADD=$(curl -s -X POST \
  -H "x-publishable-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"variant_id":"var_hyd_001","quantity":1}' \
  http://localhost:9000/store/carts/$CART_ID/line-items)

echo $ADD | python3 -m json.tool | head -50
echo ""
echo "✓ Test zakończony - sprawdź czy produkt został dodany"
