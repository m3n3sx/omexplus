/**
 * Dodaje domyślne warianty do produktów które ich nie mają
 */

const { Client } = require('pg')

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost/medusa_db'
})

async function addDefaultVariants() {
  try {
    await client.connect()
    console.log('🔌 Połączono z bazą danych\n')

    // Pobierz produkty bez wariantów
    const result = await client.query(`
      SELECT p.id, p.title
      FROM product p
      WHERE p.deleted_at IS NULL
        AND NOT EXISTS (
          SELECT 1 FROM product_variant pv 
          WHERE pv.product_id = p.id 
            AND pv.deleted_at IS NULL
        )
      ORDER BY p.created_at
    `)

    console.log(`📦 Znaleziono ${result.rows.length} produktów bez wariantów\n`)

    let addedCount = 0

    for (const product of result.rows) {
      const variantId = `var_${product.id.replace('prod_', '')}`
      
      // Dodaj wariant
      await client.query(`
        INSERT INTO product_variant (
          id,
          title,
          product_id,
          sku,
          allow_backorder,
          manage_inventory,
          variant_rank,
          created_at,
          updated_at
        ) VALUES (
          $1,
          'Default',
          $2,
          $3,
          false,
          true,
          0,
          NOW(),
          NOW()
        )
        ON CONFLICT (id) DO NOTHING
      `, [variantId, product.id, `SKU-${variantId}`])

      // Utwórz price_set dla wariantu
      const priceSetId = `pset_${variantId}`
      await client.query(`
        INSERT INTO price_set (
          id,
          created_at,
          updated_at
        ) VALUES (
          $1,
          NOW(),
          NOW()
        )
        ON CONFLICT (id) DO NOTHING
      `, [priceSetId])

      // Połącz wariant z price_set
      await client.query(`
        INSERT INTO product_variant_price_set (
          variant_id,
          price_set_id,
          id,
          created_at,
          updated_at
        ) VALUES (
          $1,
          $2,
          gen_random_uuid()::text,
          NOW(),
          NOW()
        )
        ON CONFLICT (variant_id, price_set_id) DO NOTHING
      `, [variantId, priceSetId])

      // Dodaj domyślną cenę PLN
      const price = Math.floor(Math.random() * 9000 + 1000)
      const finalPrice = Math.floor(price / 100) * 100 + 99

      await client.query(`
        INSERT INTO price (
          id,
          price_set_id,
          currency_code,
          amount,
          raw_amount,
          min_quantity,
          created_at,
          updated_at
        ) VALUES (
          'price_pln_' || $1,
          $2,
          'PLN',
          $3,
          $4,
          1,
          NOW(),
          NOW()
        )
        ON CONFLICT (id) DO NOTHING
      `, [variantId, priceSetId, finalPrice, JSON.stringify({ value: finalPrice.toString() })])

      if (addedCount % 100 === 0) {
        console.log(`  ✅ Dodano ${addedCount} wariantów...`)
      }
      addedCount++
    }

    console.log('\n' + '='.repeat(50))
    console.log('✅ Zakończono!')
    console.log(`📊 Dodano ${addedCount} domyślnych wariantów z cenami`)
    console.log('='.repeat(50))

  } catch (error) {
    console.error('❌ Błąd:', error)
    throw error
  } finally {
    await client.end()
  }
}

addDefaultVariants()
  .then(() => {
    console.log('\n✅ Skrypt zakończony pomyślnie')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Skrypt zakończony błędem:', error)
    process.exit(1)
  })
