const { Client } = require('pg')

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost/medusa_db'
})

async function checkStatuses() {
  try {
    await client.connect()
    
    // Check paid orders
    const paidResult = await client.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN (totals->>'paid_total')::bigint > 0 THEN 1 END) as paid,
        COUNT(CASE WHEN (totals->>'paid_total')::bigint = (totals->>'total')::bigint THEN 1 END) as fully_paid,
        COUNT(CASE WHEN (totals->>'paid_total')::bigint > 0 AND (totals->>'paid_total')::bigint < (totals->>'total')::bigint THEN 1 END) as partially_paid
      FROM order_summary
    `)
    
    console.log('=== PAYMENT STATUS ===')
    console.log(`Total orders: ${paidResult.rows[0].total}`)
    console.log(`Paid (any amount): ${paidResult.rows[0].paid}`)
    console.log(`Fully paid: ${paidResult.rows[0].fully_paid}`)
    console.log(`Partially paid: ${paidResult.rows[0].partially_paid}`)
    
    // Check fulfillments
    const fulfillmentResult = await client.query(`
      SELECT COUNT(*) as total FROM fulfillment WHERE deleted_at IS NULL
    `)
    
    const shippedResult = await client.query(`
      SELECT COUNT(*) as total FROM fulfillment WHERE shipped_at IS NOT NULL AND deleted_at IS NULL
    `)
    
    const deliveredResult = await client.query(`
      SELECT COUNT(*) as total FROM fulfillment WHERE delivered_at IS NOT NULL AND deleted_at IS NULL
    `)
    
    console.log('\n=== FULFILLMENT STATUS ===')
    console.log(`Total fulfillments: ${fulfillmentResult.rows[0].total}`)
    console.log(`Shipped: ${shippedResult.rows[0].total}`)
    console.log(`Delivered: ${deliveredResult.rows[0].total}`)
    
    // Sample orders with different statuses
    const sampleResult = await client.query(`
      SELECT 
        o.display_id,
        (os.totals->>'total')::bigint as total,
        (os.totals->>'paid_total')::bigint as paid_total,
        COUNT(f.id) as fulfillment_count,
        COUNT(CASE WHEN f.shipped_at IS NOT NULL THEN 1 END) as shipped_count,
        COUNT(CASE WHEN f.delivered_at IS NOT NULL THEN 1 END) as delivered_count
      FROM "order" o
      LEFT JOIN order_summary os ON o.id = os.order_id
      LEFT JOIN order_fulfillment of ON o.id = of.order_id
      LEFT JOIN fulfillment f ON of.fulfillment_id = f.id AND f.deleted_at IS NULL
      WHERE o.deleted_at IS NULL
      GROUP BY o.id, o.display_id, os.totals
      ORDER BY o.created_at DESC
      LIMIT 10
    `)
    
    console.log('\n=== SAMPLE ORDERS ===')
    sampleResult.rows.forEach(row => {
      const paymentStatus = row.paid_total === 0 ? 'Nieopłacone' : 
                           row.paid_total < row.total ? 'Częściowo opłacone' : 'Opłacone'
      const fulfillmentStatus = row.fulfillment_count === 0 ? 'Niezrealizowane' :
                               row.delivered_count > 0 ? 'Dostarczone' :
                               row.shipped_count > 0 ? 'Wysłane' : 'W realizacji'
      
      console.log(`Order #${row.display_id}: ${paymentStatus} | ${fulfillmentStatus}`)
    })
    
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await client.end()
  }
}

checkStatuses()
