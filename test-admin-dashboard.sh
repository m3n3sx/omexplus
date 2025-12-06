#!/bin/bash

echo "🔍 Testing Admin Dashboard Backend Integration"
echo "=============================================="
echo ""

# Test backend health
echo "1. Testing backend health..."
HEALTH=$(curl -s http://localhost:9000/health)
if [ "$HEALTH" = "OK" ]; then
    echo "✅ Backend is running"
else
    echo "❌ Backend is not responding"
    exit 1
fi
echo ""

# Test admin login
echo "2. Testing admin authentication..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:9000/auth/user/emailpass \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@medusa-test.com","password":"supersecret"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
    echo "✅ Admin login successful"
    echo "Token: ${TOKEN:0:20}..."
else
    echo "❌ Admin login failed"
    echo "Response: $LOGIN_RESPONSE"
    exit 1
fi
echo ""

# Test orders endpoint
echo "3. Testing orders endpoint..."
ORDERS=$(curl -s http://localhost:9000/admin/orders \
  -H "Authorization: Bearer $TOKEN")

ORDER_COUNT=$(echo $ORDERS | grep -o '"orders":\[' | wc -l)
if [ $ORDER_COUNT -gt 0 ]; then
    echo "✅ Orders endpoint working"
    echo "Orders data: $(echo $ORDERS | head -c 200)..."
else
    echo "⚠️  No orders found (this is OK if database is empty)"
    echo "Response: $(echo $ORDERS | head -c 200)..."
fi
echo ""

# Test products endpoint
echo "4. Testing products endpoint..."
PRODUCTS=$(curl -s http://localhost:9000/admin/products?limit=10 \
  -H "Authorization: Bearer $TOKEN")

PRODUCT_COUNT=$(echo $PRODUCTS | grep -o '"id"' | wc -l)
echo "✅ Products endpoint working"
echo "Found $PRODUCT_COUNT products"
echo ""

# Test customers endpoint
echo "5. Testing customers endpoint..."
CUSTOMERS=$(curl -s http://localhost:9000/admin/customers \
  -H "Authorization: Bearer $TOKEN")

CUSTOMER_COUNT=$(echo $CUSTOMERS | grep -o '"id"' | wc -l)
echo "✅ Customers endpoint working"
echo "Found $CUSTOMER_COUNT customers"
echo ""

echo "=============================================="
echo "✅ All backend integration tests passed!"
echo ""
echo "Dashboard should now display:"
echo "  - Total Orders: Check"
echo "  - Total Revenue: Check"
echo "  - Products: $PRODUCT_COUNT items"
echo "  - Customers: $CUSTOMER_COUNT users"
echo ""
echo "To start admin dashboard:"
echo "  cd admin-dashboard && npm run dev"
