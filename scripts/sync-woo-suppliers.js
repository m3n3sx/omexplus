#!/usr/bin/env node
/**
 * Remote WooCommerce Supplier Sync
 * 
 * Synchronizuje produkty z WooCommerce przez zdalne API HTTP
 * Sklepy WooCommerce są na VPS, Medusa działa lokalnie
 * 
 * Uruchom: node scripts/sync-woo-suppliers.js
 */

const { Client } = require('pg')

// Konfiguracja zdalnych API - każdy sklep ma własny endpoint na VPS
const API_KEY = 'omex_supplier_sync_2024_secret'

// Mapowanie sklepów: supplier_id -> API URL
const STORES = {
  omexplus: {
    supplier_id: 'sup_omexplus',
    api_url: 'https://omexplus.pl/api/supplier-feed.php',
  },
  kolaiwalki: {
    supplier_id: 'sup_kolaiwalki', 
    api_url: 'https://kolaiwalki.pl/api/supplier-feed.php',
  },
}

// PostgreSQL config (lokalna baza Medusa)
const PG_CONFIG = {
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost/medusa_db'
}

async function fetchRemoteProducts(store) {
  const url = `${store.api_url}?key=${API_KEY}`
  console.log(`  📡 Pobieranie z: ${store.api_url}`)
  
  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }
  
  const data = await response.json()
  
  if (!data.success) {
    throw new Error(data.error || 'Unknown API error')
  }
  
  return data
}

async function syncStore(storeKey) {
  const store = STORES[storeKey]
  console.log(`\n🔄 Synchronizacja: ${storeKey} (${store.supplier_id})`)

  const pg = new Client(PG_CONFIG)
  await pg.connect()

  try {
    // Pobierz produkty przez HTTP API
    console.log(`  📦 Pobieranie produktów...`)
    const data = await fetchRemoteProducts(store)
    console.log(`  ✅ Otrzymano ${data.products_count} produktów z ${data.store_name}`)

    let created = 0
    let updated = 0
    let errors = 0

    for (const product of data.products) {
      try {
        // Sprawdź czy produkt już istnieje
        const existing = await pg.query(
          'SELECT id FROM supplier_product WHERE supplier_id = $1 AND supplier_sku = $2',
          [store.supplier_id, product.sku]
        )

        const priceInCents = Math.round(product.price * 100)

        if (existing.rows.length > 0) {
          // Aktualizuj istniejący
          await pg.query(`
            UPDATE supplier_product SET
              supplier_price = $1,
              supplier_stock = $2,
              last_sync_at = NOW(),
              sync_status = 'synced',
              updated_at = NOW()
            WHERE id = $3
          `, [priceInCents, product.stock, existing.rows[0].id])
          updated++
        } else {
          // Utwórz nowy
          const spId = `sp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
          await pg.query(`
            INSERT INTO supplier_product (
              id, supplier_id, supplier_sku, supplier_price, supplier_currency,
              supplier_stock, markup_type, markup_value, is_active, sync_status,
              last_sync_at, created_at, updated_at
            ) VALUES ($1, $2, $3, $4, 'PLN', $5, 'percentage', 15, true, 'synced', NOW(), NOW(), NOW())
          `, [spId, store.supplier_id, product.sku, priceInCents, product.stock])
          created++
        }
      } catch (err) {
        errors++
        if (errors <= 5) console.error(`  ❌ Błąd dla ${product.sku}:`, err.message)
      }
    }

    // Aktualizuj statystyki dostawcy
    const countResult = await pg.query(
      'SELECT COUNT(*) as count FROM supplier_product WHERE supplier_id = $1',
      [store.supplier_id]
    )

    await pg.query(`
      UPDATE supplier SET
        products_count = $1,
        last_sync_at = NOW(),
        sync_enabled = true,
        updated_at = NOW()
      WHERE id = $2
    `, [parseInt(countResult.rows[0].count), store.supplier_id])

    console.log(`  ✅ Zakończono: ${created} nowych, ${updated} zaktualizowanych, ${errors} błędów`)

    return { store: data.store_name, created, updated, errors, total: data.products_count }
  } finally {
    await pg.end()
  }
}

async function main() {
  console.log('═══════════════════════════════════════════')
  console.log('  OMEX Remote Supplier Sync')
  console.log('  ' + new Date().toISOString())
  console.log('═══════════════════════════════════════════')

  const results = []

  for (const storeKey of Object.keys(STORES)) {
    try {
      const result = await syncStore(storeKey)
      results.push(result)
    } catch (error) {
      console.error(`❌ Błąd synchronizacji ${storeKey}:`, error.message)
      results.push({ store: storeKey, error: error.message })
    }
  }

  console.log('\n═══════════════════════════════════════════')
  console.log('  PODSUMOWANIE')
  console.log('═══════════════════════════════════════════')
  
  for (const r of results) {
    if (r.error) {
      console.log(`  ❌ ${r.store}: BŁĄD - ${r.error}`)
    } else {
      console.log(`  ✅ ${r.store}: ${r.total} produktów (${r.created} nowych, ${r.updated} zaktualizowanych)`)
    }
  }

  console.log('\n✅ Synchronizacja zakończona!')
}

main().catch(console.error)
