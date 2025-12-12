#!/usr/bin/env node

const { Client } = require('pg')

async function fixInventory() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgres://medusa_user:medusa_password@localhost/medusa_db'
  })

  try {
    await client.connect()
    console.log('✅ Connected to database\n')

    // Get stock location
    const locationResult = await client.query('SELECT id FROM stock_location LIMIT 1')
    if (locationResult.rows.length === 0) {
      console.log('❌ No stock location found')
      return
    }
    const locationId = locationResult.rows[0].id
    console.log(`📍 Stock location: ${locationId}`)

    // Get all product variants without inventory
    const variantsResult = await client.query(`
      SELECT pv.id, pv.title, pv.sku, p.title as product_title
      FROM product_variant pv
      JOIN product p ON pv.product_id = p.id
      WHERE pv.id NOT IN (
        SELECT variant_id FROM product_variant_inventory_item
      )
      LIMIT 100
    `)

    console.log(`\n📦 Found ${variantsResult.rows.length} variants without inventory\n`)

    if (variantsResult.rows.length === 0) {
      console.log('✅ All variants have inventory!')
      return
    }

    let fixed = 0
    for (const variant of variantsResult.rows) {
      try {
        // Create inventory item
        const inventoryItemId = `iitem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        
        await client.query(`
          INSERT INTO inventory_item (id, sku, created_at, updated_at)
          VALUES ($1, $2, NOW(), NOW())
        `, [inventoryItemId, variant.sku || variant.id])

        // Link variant to inventory item
        await client.query(`
          INSERT INTO product_variant_inventory_item (
            id, variant_id, inventory_item_id, required_quantity, created_at, updated_at
          )
          VALUES ($1, $2, $3, 1, NOW(), NOW())
        `, [
          `pvii_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          variant.id,
          inventoryItemId
        ])

        // Create inventory level
        await client.query(`
          INSERT INTO inventory_level (
            id, inventory_item_id, location_id, stocked_quantity, 
            reserved_quantity, incoming_quantity, created_at, updated_at
          )
          VALUES ($1, $2, $3, 100, 0, 0, NOW(), NOW())
        `, [
          `ilev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          inventoryItemId,
          locationId
        ])

        console.log(`✅ Fixed: ${variant.product_title} - ${variant.title || 'Default'} (${variant.sku || variant.id})`)
        fixed++
        
        // Small delay to avoid ID collisions
        await new Promise(resolve => setTimeout(resolve, 10))
      } catch (error) {
        console.log(`❌ Error fixing ${variant.id}: ${error.message}`)
      }
    }

    console.log(`\n🎉 Fixed ${fixed} variants!`)
    console.log('\n✅ All products should now be available for purchase')

  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await client.end()
  }
}

fixInventory()
