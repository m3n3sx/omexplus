#!/usr/bin/env node
/**
 * Automatic Supplier Sync Cron Job
 * 
 * Synchronizuje produkty z WooCommerce (omexplus.pl, kolaiwalki.pl) do OMEX
 * 
 * Uruchom ręcznie: node scripts/sync-suppliers-cron.js
 * Lub dodaj do crontab: 0 */6 * * * node /path/to/sync-suppliers-cron.js
 */

const mysql = require('mysql2/promise')
const { Client } = require('pg')

// Konfiguracja sklepów WooCommerce
const WOO_STORES = {
  omexplus: {
    supplier_id: 'sup_omexplus',
    name: 'OMEX Plus',
    mysql: {
      host: 'localhost',
      user: 'sql_omexplus_pl',
      password: '7d66ba884ae428',
      database: 'sql_omexplus_pl',
    },
    tablePrefix: 'wp_',
    baseUrl: 'https://omexplus.pl',
  },
  kolaiwalki: {
    supplier_id: 'sup_kolaiwalki',
    name: 'Kola i Walki',
    mysql: {
      host: 'localhost',
      user: 'sql_kolaiwalki_p',
      password: 'cb9735239120e',
      database: 'sql_kolaiwalki_p',
    },
    tablePrefix: 'wp_0b5b0b_',
    baseUrl: 'https://kolaiwalki.pl',
  },
}

// PostgreSQL config
const PG_CONFIG = {
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost/medusa_db'
}

async function getWooProducts(store) {
  const conn = await mysql.createConnection(store.mysql)
  const prefix = store.tablePrefix

  try {
    const [products] = await conn.execute(`
      SELECT 
        p.ID as id,
        p.post_title as name,
        p.post_name as slug,
        MAX(CASE WHEN pm.meta_key = '_sku' THEN pm.meta_value END) as sku,
        MAX(CASE WHEN pm.meta_key = '_price' THEN pm.meta_value END) as price,
        MAX(CASE WHEN pm.meta_key = '_regular_price' THEN pm.meta_value END) as regular_price,
        MAX(CASE WHEN pm.meta_key = '_stock' THEN pm.meta_value END) as stock_quantity,
        MAX(CASE WHEN pm.meta_key = '_stock_status' THEN pm.meta_value END) as stock_status
      FROM ${prefix}posts p
      LEFT JOIN ${prefix}postmeta pm ON p.ID = pm.post_id
      WHERE p.post_type = 'product' 
      AND p.post_status = 'publish'
      GROUP BY p.ID
      ORDER BY p.ID
    `)

    return products.map(p => ({
      id: p.id,
      sku: p.sku || `WOO-${p.id}`,
      name: p.name,
      slug: p.slug,
      price: parseFloat(p.price) || parseFloat(p.regular_price) || 0,
      stock: parseInt(p.stock_quantity) || (p.stock_status === 'instock' ? 100 : 0),
    }))
  } finally {
    await conn.end()
  }
}

async function syncStore(storeKey) {
  const store = WOO_STORES[storeKey]
  console.log(`\n🔄 Synchronizacja: ${store.name}`)

  const pg = new Client(PG_CONFIG)
  await pg.connect()

  try {
    // Pobierz produkty z WooCommerce
    console.log(`  📦 Pobieranie produktów z ${store.name}...`)
    const wooProducts = await getWooProducts(store)
    console.log(`  ✅ Znaleziono ${wooProducts.length} produktów`)

    let created = 0
    let updated = 0
    let errors = 0

    for (const product of wooProducts) {
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

    return { store: store.name, created, updated, errors, total: wooProducts.length }
  } finally {
    await pg.end()
  }
}

async function main() {
  console.log('═══════════════════════════════════════════')
  console.log('  OMEX Supplier Sync - ' + new Date().toISOString())
  console.log('═══════════════════════════════════════════')

  const results = []

  for (const storeKey of Object.keys(WOO_STORES)) {
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
