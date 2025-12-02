const fs = require('fs');
const { parse } = require('csv-parse/sync');
const { Client } = require('pg');

async function run() {
  console.log('🚀 Import Start\n');
  
  const client = new Client({
    connectionString: 'postgres://postgres@localhost/medusa-my-medusa-store'
  });
  
  await client.connect();
  console.log('✅ DB Connected\n');
  
  const csv = fs.readFileSync('./sample-products-120.csv', 'utf-8');
  const rows = parse(csv, { columns: true, trim: true, skip_empty_lines: true });
  
  console.log(`📊 Rows: ${rows.length}\n`);
  
  let ok = 0;
  
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const id = `prod_${r.SKU.toLowerCase().replace(/-/g, '_')}`;
    const vid = `var_${r.SKU.toLowerCase().replace(/-/g, '_')}`;
    const pid = `price_${r.SKU.toLowerCase().replace(/-/g, '_')}`;
    
    try {
      await client.query(
        'INSERT INTO product (id, title, handle, status, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW())',
        [id, r.name_pl, r.SKU.toLowerCase(), 'published']
      );
      
      await client.query(
        'INSERT INTO product_variant (id, product_id, title, sku, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW())',
        [vid, id, 'Default', r.SKU]
      );
      
      await client.query(
        'INSERT INTO price (id, variant_id, amount, currency_code, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW())',
        [pid, vid, Math.round(parseFloat(r.price) * 100), 'pln']
      );
      
      ok++;
      console.log(`✓ ${ok}. ${r.SKU} - ${r.name_pl}`);
    } catch (e) {
      console.log(`✗ ${r.SKU} - ${e.message}`);
    }
  }
  
  const count = await client.query('SELECT COUNT(*) FROM product');
  console.log(`\n✅ Total: ${count.rows[0].count} products`);
  
  await client.end();
}

run().catch(console.error);
