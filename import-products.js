const fs = require('fs');
const { parse } = require('csv-parse/sync');

console.log('🚀 Starting Product Import...\n');

try {
  // Read CSV
  const fileContent = fs.readFileSync('./sample-products-120.csv', 'utf-8');
  
  // Parse CSV
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  console.log(`📊 Total products: ${records.length}\n`);

  let successCount = 0;
  let errorCount = 0;
  const errors = [];

  // Process each product
  records.forEach((row, index) => {
    const lineNumber = index + 2;

    try {
      // Validate SKU
      if (!row.sku || !/^[A-Z]{3}-\d{3}$/.test(row.sku)) {
        throw new Error(`Invalid SKU: ${row.sku}`);
      }

      // Validate required fields
      if (!row.name_pl || !row.price || !row.category_id) {
        throw new Error('Missing required fields');
      }

      // Validate price
      const price = parseFloat(row.price);
      if (isNaN(price) || price < 0) {
        throw new Error(`Invalid price: ${row.price}`);
      }

      // Parse technical specs
      let technicalSpecs = {};
      if (row.technical_specs_json && row.technical_specs_json.trim() !== '') {
        try {
          technicalSpecs = JSON.parse(row.technical_specs_json);
        } catch {
          throw new Error('Invalid JSON');
        }
      }

      // Create product
      const product = {
        sku: row.sku,
        title: row.name_pl,
        price: price,
        cost: row.cost ? parseFloat(row.cost) : 0,
        category_id: row.category_id,
        equipment_type: row.equipment_type || '',
        min_order_qty: row.min_order_qty ? parseInt(row.min_order_qty) : 1,
        technical_specs: technicalSpecs,
        translations: {
          pl: { title: row.name_pl, description: row.desc_pl || '' },
          en: { title: row.name_en || row.name_pl, description: row.desc_en || row.desc_pl || '' },
          de: { title: row.name_de || row.name_pl, description: row.desc_de || row.desc_pl || '' },
        },
      };

      console.log(`✓ [${successCount + 1}/${records.length}] ${product.sku} - ${product.title} (${product.price} PLN)`);
      successCount++;

      // Progress every 20 products
      if (successCount % 20 === 0) {
        console.log(`\n📈 Progress: ${successCount}/${records.length} (${Math.round((successCount/records.length)*100)}%)\n`);
      }

    } catch (error) {
      errorCount++;
      errors.push({ line: lineNumber, sku: row.sku, error: error.message });
      console.log(`✗ [Line ${lineNumber}] ${row.sku} - ERROR: ${error.message}`);
    }
  });

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 IMPORT SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${errorCount}`);
  console.log(`📦 Total: ${records.length}`);
  console.log(`⏱️  Success Rate: ${((successCount/records.length)*100).toFixed(2)}%`);
  console.log('='.repeat(60));

  if (errors.length > 0) {
    console.log('\n⚠️  Errors:');
    errors.forEach(err => {
      console.log(`  Line ${err.line}: ${err.sku} - ${err.error}`);
    });
  }

  // Category breakdown
  const categories = new Map();
  records.forEach(row => {
    const count = categories.get(row.category_id) || 0;
    categories.set(row.category_id, count + 1);
  });

  console.log('\n📦 Products by Category:');
  categories.forEach((count, category) => {
    console.log(`  ${category}: ${count} products`);
  });

  console.log('\n✅ Import validation completed!');
  console.log('\n💡 To import to database:');
  console.log('   1. Start Medusa: npm run dev');
  console.log('   2. Use API: curl -X POST http://localhost:9000/admin/products/import -F "file=@sample-products-120.csv"');

} catch (error) {
  console.error('❌ Import failed:', error.message);
  process.exit(1);
}
