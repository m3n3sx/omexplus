const fs = require('fs');
const { parse } = require('csv-parse/sync');
const { Client } = require('pg');

async function importProducts() {
  console.log('🚀 Starting Direct Database Import...\n');

  const client = new Client({
    connectionString: 'postgres://postgres@localhost/medusa-my-medusa-store'
  });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Read CSV
    const fileContent = fs.readFileSync('./sample-products-120.csv', 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    console.log(`📊 Found ${records.length} products to import\n`);

    // Debug first row
    if (records.length > 0) {
      console.log('First row keys:', Object.keys(records[0]));
      console.log('First row:', records[0]);
      console.log('');
    }

    let successCount = 0;
    let errorCount = 0;

    for (const row of records) {
      try {
        // Skip if no SKU
        if (!row.sku || !row.SKU) {
          console.log(`⏭️  Skipping row without SKU`);
          continue;
        }

        const sku = row.sku || row.SKU;
        
        // Parse technical specs
        let specs = {};
        if (row.technical_specs_json) {
          try {
            specs = JSON.parse(row.technical_specs_json);
          } catch (e) {
            // Skip invalid JSON
          }
        }

        const productId = `prod_${sku.toLowerCase().replace('-', '_')}`;
        const variantId = `var_${sku.toLowerCase().replace('-', '_')}`;
        const priceId = `price_${sku.toLowerCase().replace('-', '_')}`;

        // Check if product already exists
        const existing = await client.query(
          'SELECT id FROM product WHERE id = $1',
          [productId]
        );

        if (existing.rows.length > 0) {
          console.log(`⏭️  ${sku} - Already exists, skipping`);
          continue;
        }

        // Insert product
        await client.query(`
          INSERT INTO product (id, title, handle, status, created_at, updated_at, metadata)
          VALUES ($1, $2, $3, $4, NOW(), NOW(), $5::jsonb)
        `, [
          productId,
          row.name_pl,
          sku.toLowerCase(),
          'published',
          JSON.stringify({
            sku: sku,
            name_en: row.name_en || row.name_pl,
            name_de: row.name_de || row.name_pl,
            desc_pl: row.desc_pl || '',
            desc_en: row.desc_en || row.desc_pl || '',
            desc_de: row.desc_de || row.desc_pl || '',
            category_id: row.category_id,
            equipment_type: row.equipment_type || '',
            min_order_qty: parseInt(row.min_order_qty) || 1,
            cost: parseFloat(row.cost) || 0,
            technical_specs: specs,
          })
        ]);

        // Insert variant
        await client.query(`
          INSERT INTO product_variant (id, product_id, title, sku, manage_inventory, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        `, [
          variantId,
          productId,
          'Default',
          sku,
          false
        ]);

        // Insert price
        const priceAmount = Math.round(parseFloat(row.price) * 100); // Convert to cents
        await client.query(`
          INSERT INTO price (id, variant_id, amount, currency_code, created_at, updated_at)
          VALUES ($1, $2, $3, $4, NOW(), NOW())
        `, [
          priceId,
          variantId,
          priceAmount,
          'pln'
        ]);

        successCount++;
        console.log(`✓ [${successCount}/${records.length}] ${sku} - ${row.name_pl} (${row.price} PLN)`);

        // Progress every 20 products
        if (successCount % 20 === 0) {
          console.log(`\n📈 Progress: ${successCount}/${records.length} (${Math.round((successCount/records.length)*100)}%)\n`);
        }

      } catch (error) {
        errorCount++;
        const sku = row.sku || row.SKU || 'unknown';
        console.log(`✗ ${sku} - ERROR: ${error.message}`);
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 IMPORT SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);
    console.log(`📦 Total: ${records.length}`);
    console.log(`⏱️  Success Rate: ${((successCount/records.length)*100).toFixed(2)}%`);
    console.log('='.repeat(60));

    // Verify
    const result = await client.query('SELECT COUNT(*) FROM product');
    console.log(`\n✅ Total products in database: ${result.rows[0].count}`);

    await client.end();
    console.log('\n✅ Import completed!');

  } catch (error) {
    console.error('❌ Import failed:', error.message);
    await client.end();
    process.exit(1);
  }
}

importProducts();
