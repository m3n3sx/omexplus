/**
 * Skrypt dodający ceny bezpośrednio do bazy danych
 */

const { Client } = require('pg')

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost/medusa_db'
})

async function addPrices() {
  try {
    await client.connect()
    console.log('🔌 Połączono z bazą danych')

    // Pobierz wszystkie warianty produktów z ich price_set_id
    const variantsResult = await client.query(`
      SELECT 
        pv.id as variant_id,
        pvps.price_set_id,
        pv.product_id,
        p.title,
        p.description
      FROM product_variant pv
      JOIN product p ON p.id = pv.product_id
      LEFT JOIN product_variant_price_set pvps ON pvps.variant_id = pv.id
      WHERE pv.deleted_at IS NULL
      ORDER BY p.created_at DESC
    `)

    console.log(`📦 Znaleziono ${variantsResult.rows.length} wariantów produktów`)

    let addedCount = 0
    let skippedCount = 0
    let noPriceSetCount = 0

    for (const variant of variantsResult.rows) {
      if (!variant.price_set_id) {
        console.log(`  ⚠️  ${variant.title} - brak price_set_id`)
        noPriceSetCount++
        continue
      }

      // Sprawdź czy price_set ma już cenę
      const priceCheck = await client.query(
        'SELECT id FROM price WHERE price_set_id = $1 AND deleted_at IS NULL LIMIT 1',
        [variant.price_set_id]
      )

      if (priceCheck.rows.length > 0) {
        console.log(`  ✓ ${variant.title} - ma już cenę`)
        skippedCount++
        continue
      }

      // Generuj cenę
      const priceAmount = generatePrice(variant.title, variant.description)

      // Dodaj cenę
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
          'price_' || substr(md5(random()::text), 1, 26),
          $1,
          'PLN',
          $2,
          $3,
          1,
          NOW(),
          NOW()
        )
      `, [variant.price_set_id, priceAmount, JSON.stringify({ value: priceAmount.toString() })])

      console.log(`  ✅ ${variant.title} - dodano cenę: ${(priceAmount / 100).toFixed(2)} PLN`)
      addedCount++
    }

    console.log('\n' + '='.repeat(50))
    console.log('✅ Zakończono!')
    console.log(`📊 Statystyki:`)
    console.log(`   - Dodano cen: ${addedCount}`)
    console.log(`   - Pominięto (już mają ceny): ${skippedCount}`)
    console.log(`   - Pominięto (brak price_set): ${noPriceSetCount}`)
    console.log('='.repeat(50))

  } catch (error) {
    console.error('❌ Błąd:', error)
    throw error
  } finally {
    await client.end()
  }
}

function generatePrice(title, description) {
  const titleLower = (title || '').toLowerCase()
  const descLower = (description || '').toLowerCase()
  const combined = titleLower + ' ' + descLower

  // Kategorie cenowe (w groszach)
  const priceRanges = {
    // Hydraulika
    'rura': [500, 15000],
    'kolano': [300, 5000],
    'trójnik': [400, 6000],
    'zawór': [2000, 50000],
    'bateria': [15000, 100000],
    
    // Elektryka
    'kabel': [200, 10000],
    'przewód': [150, 8000],
    'gniazdko': [500, 3000],
    'wyłącznik': [800, 5000],
    'lampka': [1000, 15000],
    
    // Narzędzia
    'młotek': [2000, 15000],
    'śrubokręt': [500, 8000],
    'klucz': [1500, 20000],
    'wiertarka': [15000, 100000],
    'piła': [5000, 50000],
    
    // Materiały budowlane
    'cement': [1500, 3000],
    'piasek': [500, 2000],
    'cegła': [100, 500],
    'płytka': [2000, 20000],
    'farba': [3000, 15000],
  }

  // Znajdź pasującą kategorię
  for (const [keyword, range] of Object.entries(priceRanges)) {
    if (combined.includes(keyword)) {
      const [min, max] = range
      const randomPrice = Math.floor(Math.random() * (max - min) + min)
      return Math.floor(randomPrice / 100) * 100 + 99
    }
  }

  // Domyślna cena
  const randomPrice = Math.floor(Math.random() * 9000 + 1000)
  return Math.floor(randomPrice / 100) * 100 + 99
}

addPrices()
  .then(() => {
    console.log('\n✅ Skrypt zakończony pomyślnie')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Skrypt zakończony błędem:', error)
    process.exit(1)
  })
