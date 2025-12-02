#!/bin/bash

echo "🚀 Setting up Bulk Product Import System..."
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run migrations
echo "🗄️  Running database migrations..."
npm run build
npx medusa migrations run

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Start Medusa: npm run dev"
echo "2. Test import: curl -X POST http://localhost:9000/admin/products/import -F 'file=@sample-products-120.csv'"
echo ""
echo "📖 Read BULK_IMPORT_README.md for full documentation"
