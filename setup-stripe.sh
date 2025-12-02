#!/bin/bash

echo "🚀 Setting up Stripe Payment Integration for OMEX"
echo "=================================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file"
    echo "⚠️  Please add your Stripe keys to .env before continuing"
    exit 1
fi

# Check if Stripe keys are configured
if ! grep -q "sk_test_" .env && ! grep -q "sk_live_" .env; then
    echo "⚠️  Stripe keys not configured in .env"
    echo ""
    echo "Please add your Stripe keys:"
    echo "1. Go to https://dashboard.stripe.com/test/apikeys"
    echo "2. Copy your keys and add to .env:"
    echo "   STRIPE_SECRET_KEY=sk_test_..."
    echo "   STRIPE_PUBLISHABLE_KEY=pk_test_..."
    echo "3. Setup webhook at https://dashboard.stripe.com/test/webhooks"
    echo "   STRIPE_WEBHOOK_SECRET=whsec_..."
    exit 1
fi

echo "📦 Installing backend dependencies..."
npm install

echo ""
echo "📦 Installing frontend dependencies..."
cd storefront
npm install
cd ..

echo ""
echo "🧪 Testing Stripe connection..."
npx ts-node src/scripts/test-stripe-payment.ts

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Stripe integration setup complete!"
    echo ""
    echo "Next steps:"
    echo "1. Start backend: npm run dev"
    echo "2. Start frontend: cd storefront && npm run dev"
    echo "3. Test payment: http://localhost:3000/checkout/payment"
    echo ""
    echo "Test cards:"
    echo "  Success: 4242 4242 4242 4242"
    echo "  3D Secure: 4000 0025 0000 3155"
    echo "  Declined: 4000 0000 0000 0002"
    echo ""
    echo "📖 Read STRIPE_SETUP_GUIDE.md for detailed instructions"
else
    echo ""
    echo "❌ Stripe test failed. Please check your configuration."
    exit 1
fi
