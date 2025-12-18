const { Client } = require('pg')

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost/medusa_db'
})

async function addOrderStatuses() {
  try {
    await client.connect()
    console.log('Connected to database')

    // Get all orders with their totals from order_summary
    const ordersResult = await client.query(`
      SELECT 
        o.id, 
        o.display_id, 
        o.currency_code, 
        o.created_at,
        COALESCE((os.totals->>'total')::bigint, 10000) as total
      FROM "order" o
      LEFT JOIN order_summary os ON o.id = os.order_id
      WHERE o.deleted_at IS NULL
      ORDER BY o.created_at DESC
      LIMIT 100
      OFFSET 50
    `)
    
    console.log(`Found ${ordersResult.rows.length} orders`)

    let paidCount = 0
    let partiallyPaidCount = 0
    let fulfilledCount = 0
    let shippedCount = 0

    for (let i = 0; i < ordersResult.rows.length; i++) {
      const order = ordersResult.rows[i]
      const scenario = i % 5 // 5 różnych scenariuszy

      console.log(`\nProcessing order #${order.display_id} (${order.id})`)

      // Scenariusz 0: Opłacone i zrealizowane (20%)
      if (scenario === 0) {
        // Update order_summary - paid_total
        await client.query(`
          UPDATE order_summary
          SET totals = jsonb_set(
            COALESCE(totals, '{}'::jsonb),
            '{paid_total}',
            $1::text::jsonb
          )
          WHERE order_id = $2
        `, [order.total, order.id])

        // Dodaj fulfillment (zrealizowane i dostarczone)
        const fulfillmentId = `ful_${Date.now()}_${i}`
        await client.query(`
          INSERT INTO fulfillment (
            id, 
            location_id, 
            provider_id,
            shipped_at,
            delivered_at,
            created_at, 
            updated_at
          )
          VALUES (
            $1, 
            '1', 
            'manual_manual',
            NOW() - INTERVAL '2 days',
            NOW() - INTERVAL '1 day',
            NOW() - INTERVAL '3 days', 
            NOW()
          )
        `, [fulfillmentId])

        // Link fulfillment to order
        await client.query(`
          INSERT INTO order_fulfillment (
            id,
            order_id,
            fulfillment_id,
            created_at,
            updated_at
          )
          VALUES (
            gen_random_uuid()::text,
            $1,
            $2,
            NOW(),
            NOW()
          )
        `, [order.id, fulfillmentId])

        console.log(`  ✓ Opłacone (100%) i dostarczone`)
        paidCount++
        fulfilledCount++
      }
      
      // Scenariusz 1: Opłacone ale niezrealizowane (20%)
      else if (scenario === 1) {
        // Update order_summary - paid_total
        await client.query(`
          UPDATE order_summary
          SET totals = jsonb_set(
            COALESCE(totals, '{}'::jsonb),
            '{paid_total}',
            $1::text::jsonb
          )
          WHERE order_id = $2
        `, [order.total, order.id])

        console.log(`  ✓ Opłacone (100%) ale niezrealizowane`)
        paidCount++
      }
      
      // Scenariusz 2: Częściowo opłacone (20%)
      else if (scenario === 2) {
        const partialAmount = Math.floor(order.total * 0.5)
        
        // Update order_summary - paid_total
        await client.query(`
          UPDATE order_summary
          SET totals = jsonb_set(
            COALESCE(totals, '{}'::jsonb),
            '{paid_total}',
            $1::text::jsonb
          )
          WHERE order_id = $2
        `, [partialAmount, order.id])

        console.log(`  ✓ Częściowo opłacone (50%)`)
        partiallyPaidCount++
      }
      
      // Scenariusz 3: Wysłane ale nie dostarczone (20%)
      else if (scenario === 3) {
        // Update order_summary - paid_total
        await client.query(`
          UPDATE order_summary
          SET totals = jsonb_set(
            COALESCE(totals, '{}'::jsonb),
            '{paid_total}',
            $1::text::jsonb
          )
          WHERE order_id = $2
        `, [order.total, order.id])

        // Dodaj fulfillment (wysłane ale nie dostarczone)
        const fulfillmentId = `ful_${Date.now()}_${i}`
        await client.query(`
          INSERT INTO fulfillment (
            id, 
            location_id, 
            provider_id,
            shipped_at,
            created_at, 
            updated_at
          )
          VALUES (
            $1, 
            '1', 
            'manual_manual',
            NOW() - INTERVAL '1 day',
            NOW() - INTERVAL '2 days', 
            NOW()
          )
        `, [fulfillmentId])

        // Link fulfillment to order
        await client.query(`
          INSERT INTO order_fulfillment (
            id,
            order_id,
            fulfillment_id,
            created_at,
            updated_at
          )
          VALUES (
            gen_random_uuid()::text,
            $1,
            $2,
            NOW(),
            NOW()
          )
        `, [order.id, fulfillmentId])

        console.log(`  ✓ Opłacone i wysłane (w drodze)`)
        paidCount++
        shippedCount++
      }
      
      // Scenariusz 4: Nieopłacone i niezrealizowane (20%)
      else {
        console.log(`  ✓ Nieopłacone i niezrealizowane (bez zmian)`)
      }
    }

    console.log('\n=== PODSUMOWANIE ===')
    console.log(`Opłacone (100%): ${paidCount}`)
    console.log(`Częściowo opłacone: ${partiallyPaidCount}`)
    console.log(`Dostarczone: ${fulfilledCount}`)
    console.log(`Wysłane: ${shippedCount}`)
    console.log(`Nieopłacone/niezrealizowane: ${ordersResult.rows.length - paidCount - partiallyPaidCount}`)

    console.log('\n✓ Zakończono dodawanie statusów do zamówień')

  } catch (error) {
    console.error('Error:', error)
    throw error
  } finally {
    await client.end()
  }
}

addOrderStatuses()
