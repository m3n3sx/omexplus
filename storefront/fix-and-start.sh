#!/bin/bash

echo "🔧 Fixing Next.js Storefront..."
echo ""

# Step 1: Clean build cache
echo "1️⃣ Cleaning build cache..."
rm -rf .next
rm -rf node_modules/.cache
echo "✅ Cache cleared"
echo ""

# Step 2: Install missing dependencies
echo "2️⃣ Checking dependencies..."
if ! npm list @medusajs/medusa-js > /dev/null 2>&1; then
  echo "Installing @medusajs/medusa-js..."
  npm install @medusajs/medusa-js
else
  echo "✅ @medusajs/medusa-js already installed"
fi
echo ""

# Step 3: Check environment variables
echo "3️⃣ Checking environment variables..."
if [ -f .env.local ]; then
  echo "✅ .env.local exists"
  if grep -q "NEXT_PUBLIC_MEDUSA_BACKEND_URL" .env.local; then
    echo "✅ NEXT_PUBLIC_MEDUSA_BACKEND_URL configured"
  else
    echo "⚠️  NEXT_PUBLIC_MEDUSA_BACKEND_URL not found in .env.local"
  fi
else
  echo "⚠️  .env.local not found"
  echo "Creating .env.local..."
  cat > .env.local << 'EOF'
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_storefront_2024_token
EOF
  echo "✅ Created .env.local"
fi
echo ""

# Step 4: Test backend connection
echo "4️⃣ Testing backend connection..."
if curl -s http://localhost:9000/health > /dev/null 2>&1; then
  echo "✅ Backend is running on port 9000"
else
  echo "⚠️  Backend not responding on port 9000"
  echo "   Make sure to run 'npm run dev' in the root directory"
fi
echo ""

# Step 5: Start development server
echo "5️⃣ Starting Next.js development server..."
echo ""
echo "🚀 Starting on http://localhost:3000"
echo ""

npm run dev
