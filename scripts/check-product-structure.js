/**
 * Sprawdza strukturę produktów w bazie danych
 */

const { Client } = require('pg')

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost/medusa_db'
})

async function checkProductStructure() {
  try {
    await client.connect()
    console.log('🔌 Połączono z bazą danych\n')

    // Pobierz przykładowy produkt z wariantami i cenami
    const result = await client.query(`
      SELECT 
        p.id as product_id,
        p.title as product_title,
        p.status,
        p.thumbnail,
        p.created_at,
        json_agg(
          json_build_object(
            'id', pv.id,
            'title', pv.title,
            'sku', pv.sku,
            'prices', (
              SELECT json_agg(
                json_build_object(
                  'amount', pr.amount,
                  'currency_code', pr.currency_code
                )
              )
              FROM product_variant_price_set pvps
              JOIN price pr ON pr.price_set_id = pvps.price_set_id
              WHERE pvps.variant_id = pv.id 
                AND pr.deleted_at IS NULL
            )
          )
        ) as variants
      FROM product p
      LEFT JOIN product_variant pv ON pv.product_id = p.id
      WHERE p.deleted_at IS NULL
        AND pv.deleted_at IS NULL
      GROUP BY p.id, p.title, p.status, p.thumbnail, p.created_at
      LIMIT 3
    `)

    console.log('📦 Przykładowe produkty z cenami:\n')
    result.rows.forEach((product, index) => {
      console.log(`\n${index + 1}. ${product.product_title}`)
      console.log('   Status:', product.status)
      console.log('   Warianty:', product.variants.length)
      
      product.variants.forEach((variant, vIndex) => {
        console.log(`\n   Wariant ${vIndex + 1}:`)
        console.log('   - ID:', variant.id)
        console.log('   - Tytuł:', variant.title)
        console.log('   - SKU:', variant.sku)
        console.log('   - Ceny:', variant.prices ? variant.prices.length : 0)
        
        if (variant.prices && variant.prices.length > 0) {
          variant.prices.forEach(price => {
            console.log(`     * ${(price.amount / 100).toFixed(2)} ${price.currency_code}`)
          })
        } else {
          console.log('     ⚠️  BRAK CEN!')
        }
      })
    })

    console.log('\n\n' + '='.repeat(50))
    console.log('✅ Sprawdzanie zakończone')
    console.log('='.repeat(50))

  } catch (error) {
    console.error('❌ Błąd:', error)
  } finally {
    await client.end()
  }
}

checkProductStructure()
