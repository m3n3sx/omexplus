#!/bin/bash
# OMEX Machines Data - Full Setup Script

set -e

echo "=========================================="
echo "🚀 OMEX MACHINES DATA SETUP"
echo "=========================================="

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 not found. Please install Python 3.8+"
    exit 1
fi

# Create directories
echo ""
echo "📁 Creating directories..."
mkdir -p data/downloads data/processed data/pdfs

# Install dependencies
echo ""
echo "📦 Installing Python dependencies..."
pip install requests beautifulsoup4 pandas psycopg2-binary python-dotenv --quiet

# Step 1: Setup database schema
echo ""
echo "📊 Step 1/5: Setting up database schema..."
PGPASSWORD=postgres psql -h localhost -U postgres -d medusa_db -f scripts/machines-data/setup_db.sql 2>/dev/null || echo "Schema may already exist"

# Step 2: Download from Wikidata
echo ""
echo "🌐 Step 2/5: Downloading from Wikidata..."
python3 scripts/machines-data/1_download_wikidata.py

# Step 3: Scrape 777parts (optional - takes time)
echo ""
echo "🕷️  Step 3/5: Scraping 777parts.net..."
echo "⏳ This may take 5-10 minutes..."
python3 scripts/machines-data/2_scrape_777parts.py || echo "Scraping skipped or failed"

# Step 4: Combine datasets
echo ""
echo "🔗 Step 4/5: Combining datasets..."
python3 scripts/machines-data/3_combine_datasets.py

# Step 5: Import to database
echo ""
echo "💾 Step 5/5: Importing to database..."
python3 scripts/machines-data/4_import_to_db.py

# Validate
echo ""
echo "✅ Validating data..."
python3 scripts/machines-data/5_validate_data.py

echo ""
echo "=========================================="
echo "✅ SETUP COMPLETE!"
echo "=========================================="
echo ""
echo "📊 Check results:"
echo "   - data/processed/validation_report.json"
echo "   - psql -d medusa_db -c 'SELECT COUNT(*) FROM omex.machines;'"
echo ""
