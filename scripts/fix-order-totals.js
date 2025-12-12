const { Client } = require('pg');

const DATABASE_URL = 'postgres://medusa_user:medusa_password@localhost/medusa_db';

async function main() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();

  console.log('🔧 Fixing order totals...\n');

  try {
    // Get all orders with their items
    const result = await client.query(`
      SELECT 
        o.id as order_id,
        os.id as summary_id,
        COALESCE(SUM(oi.quantity * oi.unit_price), 0) as total
      FROM "order" o
      LEFT JOIN order_summary os ON o.id = os.order_id
      LEFT JOIN order_item oi ON o.id = oi.order_id
      GROUP BY o.id, os.id
    `);

    console.log(`Found ${result.rows.length} orders\n`);

    let updated = 0;
    for (const row of result.rows) {
      const total = Math.round(row.total || 0);
      
      const totals = {
        total: total,
        subtotal: total,
        tax_total: 0,
        discount_total: 0,
        shipping_total: 0,
        gift_card_total: 0,
        paid_total: 0,
        refunded_total: 0,
        pending_difference: total,
        current_order_total: total,
        original_order_total: total,
        accounting_total: total,
        credit_line_total: 0,
        transaction_total: 0,
        raw_current_order_total: { value: total.toString(), precision: 20 },
        raw_original_order_total: { value: total.toString(), precision: 20 },
        raw_pending_difference: { value: total.toString(), precision: 20 },
        raw_paid_total: { value: "0", precision: 20 },
        raw_refunded_total: { value: "0", precision: 20 },
        raw_accounting_total: { value: total.toString(), precision: 20 },
        raw_credit_line_total: { value: "0", precision: 20 },
        raw_transaction_total: { value: "0", precision: 20 }
      };

      await client.query(`
        UPDATE order_summary
        SET totals = $1, updated_at = NOW()
        WHERE id = $2
      `, [JSON.stringify(totals), row.summary_id]);

      updated++;
      if (updated % 100 === 0) {
        console.log(`Progress: ${updated}/${result.rows.length}`);
      }
    }

    console.log(`\n✅ Updated ${updated} order summaries\n`);

    // Show sample
    const sample = await client.query(`
      SELECT 
        o.id,
        o.email,
        o.status,
        (os.totals->>'total')::numeric / 100 as total_pln
      FROM "order" o
      JOIN order_summary os ON o.id = os.order_id
      WHERE os.totals->>'total' IS NOT NULL
      ORDER BY o.created_at DESC
      LIMIT 10
    `);

    console.log('Sample orders:');
    sample.rows.forEach(row => {
      console.log(`  ${row.id.substring(0, 20)}... | ${row.status.padEnd(10)} | ${row.total_pln} PLN`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

main();
