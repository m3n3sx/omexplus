#!/bin/bash

BASE_URL="http://localhost:9000"

echo "🧪 Testing Phase 0 Endpoints"
echo ""

# Test 1: Search
echo "1️⃣ Testing search..."
curl -s "$BASE_URL/store/search?q=pompa" | jq '.products | length'
echo ""

# Test 2: Autocomplete
echo "2️⃣ Testing autocomplete..."
curl -s "$BASE_URL/store/search/autocomplete?q=pom" | jq '.suggestions'
echo ""

# Test 3: Manufacturer SKU search
echo "3️⃣ Testing manufacturer SKU search..."
curl -s "$BASE_URL/store/search/manufacturer-sku?sku=REXROTH-123" | jq '.count'
echo ""

# Test 4: Sitemap
echo "4️⃣ Testing sitemap..."
curl -s "$BASE_URL/store/seo/sitemap.xml" | head -n 5
echo ""

# Test 5: Robots.txt
echo "5️⃣ Testing robots.txt..."
curl -s "$BASE_URL/store/seo/robots.txt"
echo ""

# Test 6: List manufacturers
echo "6️⃣ Testing manufacturers list..."
curl -s "$BASE_URL/admin/manufacturers" | jq '.manufacturers | length'
echo ""

echo "✅ All tests complete"
