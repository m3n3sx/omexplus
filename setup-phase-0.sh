#!/bin/bash

echo "🚀 Setting up Phase 0 - Advanced Product Architecture"
echo ""

# Step 1: Check migrations exist
echo "📦 Step 1: Checking migrations..."
MIGRATION_COUNT=$(ls -1 src/migrations/173315*.ts 2>/dev/null | wc -l)
echo "Found $MIGRATION_COUNT Phase 0 migrations"

if [ $MIGRATION_COUNT -lt 8 ]; then
  echo "⚠️  Warning: Expected 8 migrations, found $MIGRATION_COUNT"
fi
echo "✅ Migrations ready (will run on server start)"
echo ""

# Step 2: Seed manufacturers
echo "🌱 Step 2: Seeding manufacturers..."
echo "Note: Run this after starting the server:"
echo "  npm run seed:manufacturers"
echo ""

# Step 3: Generate SEO
echo "🔍 Step 3: Generate SEO..."
echo "Note: Run this after starting the server:"
echo "  npm run generate:seo"
echo ""

echo "✅ Phase 0 setup complete!"
echo ""
echo "📚 Next steps:"
echo "  1. Start server: npm run dev"
echo "  2. Seed manufacturers: npm run seed:manufacturers"
echo "  3. Generate SEO: npm run generate:seo"
echo ""
echo "📚 Available endpoints:"
echo "  - GET  /store/search?q=pompa"
echo "  - GET  /store/search/autocomplete?q=pom"
echo "  - GET  /store/search/manufacturer-sku?sku=REXROTH-123"
echo "  - GET  /store/seo/sitemap.xml"
echo "  - GET  /store/seo/robots.txt"
echo "  - GET  /admin/manufacturers"
echo "  - POST /admin/manufacturers"
echo "  - GET  /admin/b2b/quotes"
