#!/usr/bin/env node
/**
 * Add show_in_store column to supplier table
 */

const { Client } = require('pg')
require('dotenv').config()

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  })

  try {
    await client.connect()
    console.log('Connected to database')

    // Check if column exists
    const checkResult = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'supplier' AND column_name = 'show_in_store'
    `)

    if (checkResult.rows.length > 0) {
      console.log('✅ Column show_in_store already exists')
    } else {
      // Add column
      await client.query(`
        ALTER TABLE supplier 
        ADD COLUMN show_in_store BOOLEAN DEFAULT false
      `)
      console.log('✅ Added show_in_store column to supplier table')
    }

    // Also fix supplier_product.product_id to allow NULL
    await client.query(`
      ALTER TABLE supplier_product 
      ALTER COLUMN product_id DROP NOT NULL
    `).catch(() => {
      // Ignore if already nullable
    })
    console.log('✅ Made supplier_product.product_id nullable')

    // Also add selling_price column if missing
    const checkSelling = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'supplier_product' AND column_name = 'selling_price'
    `)

    if (checkSelling.rows.length === 0) {
      await client.query(`
        ALTER TABLE supplier_product 
        ADD COLUMN selling_price INTEGER DEFAULT 0
      `)
      console.log('✅ Added selling_price column to supplier_product table')
    }

    console.log('\n✅ Database schema updated successfully!')

  } catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

main()
