#!/bin/bash

BACKEND="http://localhost:9000"
PASSWORD='CAnabis123#$'

# Zaloguj
TOKEN=$(curl -s -X POST "$BACKEND/auth/user/emailpass" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"meneswczesny@gmail.com\",\"password\":\"$PASSWORD\"}" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo "Token: ${TOKEN:0:50}..."

# Pobierz region
REGION=$(curl -s "$BACKEND/admin/regions" -H "Authorization: Bearer $TOKEN")
echo "Region response:"
echo "$REGION" | head -20

# Pobierz kategorię
CATEGORY=$(curl -s "$BACKEND/admin/product-categories?limit=1" -H "Authorization: Bearer $TOKEN")
echo ""
echo "Category response:"
echo "$CATEGORY" | head -20

# Spróbuj stworzyć produkt
echo ""
echo "Tworzę produkt..."
curl -s -X POST "$BACKEND/admin/products" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Pompa",
    "description": "Test",
    "status": "published"
  }' | head -50
