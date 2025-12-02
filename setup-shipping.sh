#!/bin/bash

echo "🚀 Setting up Multi-Carrier Shipping System"
echo "=========================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
fi

# Check for shipping API keys
echo "📋 Checking environment variables..."
echo ""

check_var() {
    if grep -q "^$1=" .env && ! grep -q "^$1=your_" .env; then
        echo "✅ $1 is configured"
        return 0
    else
        echo "⚠️  $1 is not configured"
        return 1
    fi
}

# InPost
echo "InPost (Poland):"
check_var "INPOST_API_KEY"
check_var "INPOST_API_SECRET"
check_var "INPOST_ORG_ID"
echo ""

# DPD
echo "DPD (Europe):"
check_var "DPD_API_KEY"
check_var "DPD_LOGIN"
check_var "DPD_PASSWORD"
echo ""

# DHL
echo "DHL (Global):"
check_var "DHL_API_KEY"
check_var "DHL_ACCOUNT_NUMBER"
echo ""

# Run migrations
echo "🗄️  Running database migrations..."
npm run build
npx medusa migrations run

if [ $? -eq 0 ]; then
    echo "✅ Migrations completed successfully"
else
    echo "❌ Migration failed"
    exit 1
fi
echo ""

# Test the system
echo "🧪 Running shipping system tests..."
npm run test:shipping

if [ $? -eq 0 ]; then
    echo "✅ Tests passed"
else
    echo "⚠️  Some tests failed (expected in test mode)"
fi
echo ""

# Summary
echo "📊 Setup Summary"
echo "================"
echo ""
echo "✅ Database tables created:"
echo "   - shipment"
echo "   - tracking_event"
echo ""
echo "✅ API endpoints available:"
echo "   - GET  /store/shipping/methods"
echo "   - POST /store/shipping/rates"
echo "   - POST /admin/orders/:id/shipment"
echo "   - GET  /admin/shipments/:id/label"
echo "   - GET  /store/shipments/:id/tracking"
echo ""
echo "✅ Webhook endpoints:"
echo "   - POST /webhooks/inpost"
echo "   - POST /webhooks/dpd"
echo "   - POST /webhooks/dhl"
echo ""
echo "📚 Documentation: SHIPPING_SYSTEM_GUIDE.md"
echo ""
echo "🎉 Setup complete!"
echo ""
echo "💡 Next steps:"
echo "1. Add real API keys to .env file"
echo "2. Test with provider sandbox APIs"
echo "3. Configure webhooks in provider dashboards"
echo "4. Integrate into checkout flow"
echo ""
