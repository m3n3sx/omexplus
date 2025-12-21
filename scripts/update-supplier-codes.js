#!/usr/bin/env node
/**
 * Update Supplier Codes for Remote API Sync
 * 
 * Aktualizuje kody dostawców, żeby pasowały do mapowania w sync API
 * 
 * Run: node scripts/update-supplier-codes.js
 */

const { Client } = require('pg')

const PG_CONFIG = {
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost/medusa_db'
}

async function updateSupplierCodes() {
  const client = new Client(PG_CONFIG)
  
  try {
    await client.connect()
    console.log('✅ Connected to database')

    // Update OMEX Plus supplier
    const omexResult = await client.query(`
      UPDATE supplier 
      SET 
        code = 'OMEXPLUS',
        api_url = 'https://omexplus.pl/api/supplier-feed.php',
        api_format = 'json',
        sync_enabled = true,
        sync_frequency = 'daily',
        updated_at = NOW()
      WHERE id = 'sup_omexplus' OR name ILIKE '%omex%'
      RETURNING id, name, code
    `)
    
    if (omexResult.rows.length > 0) {
      console.log('✅ Updated OMEX Plus:', omexResult.rows[0])
    } else {
      console.log('⚠️ OMEX Plus supplier not found')
    }

    // Update Kola i Walki supplier
    const kolaResult = await client.query(`
      UPDATE supplier 
      SET 
        code = 'KOLAIWALKI',
        api_url = 'https://kolaiwalki.pl/api/supplier-feed.php',
        api_format = 'json',
        sync_enabled = true,
        sync_frequency = 'daily',
        updated_at = NOW()
      WHERE id = 'sup_kolaiwalki' OR name ILIKE '%kola%'
      RETURNING id, name, code
    `)
    
    if (kolaResult.rows.length > 0) {
      console.log('✅ Updated Kola i Walki:', kolaResult.rows[0])
    } else {
      console.log('⚠️ Kola i Walki supplier not found')
    }

    // Show all suppliers
    const allSuppliers = await client.query(`
      SELECT id, name, code, api_url, sync_enabled 
      FROM supplier 
      ORDER BY name
    `)
    
    console.log('\n📋 All suppliers:')
    for (const s of allSuppliers.rows) {
      console.log(`  - ${s.name} (${s.code}): sync=${s.sync_enabled}`)
    }

    console.log('\n✅ Done!')

  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

updateSupplierCodes()
