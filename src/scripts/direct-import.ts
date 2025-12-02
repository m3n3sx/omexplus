import { readFileSync } from 'fs'
import { parse } from 'csv-parse/sync'

/**
 * Direct import script - imports products directly to console
 * This simulates the import process without requiring a running server
 */

const CSV_FILE = './sample-products-120.csv'

interface ProductRow {
  sku: string
  name_pl: string
  name_en: string
  name_de: string
  desc_pl: string
  desc_en: string
  desc_de: string
  price: string
  cost: string
  category_id: string
  equipment_type: string
  min_order_qty: string
  technical_specs_json: string
}

async function directImport() {
  console.log('🚀 Starting Direct Product Import...\n')

  try {
    // Read CSV file
    const fileContent = readFileSync(CSV_FILE, 'utf-8')
    
    // Parse CSV
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as ProductRow[]

    console.log(`📊 Total products to import: ${records.length}\n`)

    let successCount = 0
    let errorCount = 0
    const errors: any[] = []

    // Process each product
    for (let i = 0; i < records.length; i++) {
      const row = records[i]
      const lineNumber = i + 2 // +1 for header, +1 for 0-index

      try {
        // Validate SKU
        if (!row.sku || !/^[A-Z]{3}-\d{3}$/.test(row.sku)) {
          throw new Error(`Invalid SKU format: ${row.sku}`)
        }

        // Validate required fields
        if (!row.name_pl || !row.price || !row.category_id) {
          throw new Error('Missing required fields')
        }

        // Validate price
        const price = parseFloat(row.price)
        if (isNaN(price) || price < 0) {
          throw new Error(`Invalid price: ${row.price}`)
        }

        // Parse technical specs
        let technicalSpecs = {}
        if (row.technical_specs_json && row.technical_specs_json.trim() !== '') {
          try {
            technicalSpecs = JSON.parse(row.technical_specs_json)
          } catch {
            throw new Error('Invalid JSON in technical specs')
          }
        }

        // Create product object
        const product = {
          sku: row.sku,
          title: row.name_pl,
          price: price,
          cost: row.cost ? parseFloat(row.cost) : 0,
          category_id: row.category_id,
          equipment_type: row.equipment_type || '',
          min_order_qty: row.min_order_qty ? parseInt(row.min_order_qty) : 1,
          technical_specs: technicalSpecs,
          translations: {
            pl: {
              title: row.name_pl,
              description: row.desc_pl || '',
            },
            en: {
              title: row.name_en || row.name_pl,
              description: row.desc_en || row.desc_pl || '',
            },
            de: {
              title: row.name_de || row.name_pl,
              description: row.desc_de || row.desc_pl || '',
            },
          },
        }

        // Simulate product creation
        console.log(`✓ [${successCount + 1}/${records.length}] ${product.sku} - ${product.title} (${product.price} PLN)`)
        
        successCount++

        // Show progress every 20 products
        if ((successCount) % 20 === 0) {
          console.log(`\n📈 Progress: ${successCount}/${records.length} (${Math.round((successCount/records.length)*100)}%)\n`)
        }

      } catch (error: any) {
        errorCount++
        errors.push({
          line: lineNumber,
          sku: row.sku,
          error: error.message,
        })
        console.log(`✗ [Line ${lineNumber}] ${row.sku} - ERROR: ${error.message}`)
      }
    }

    // Final summary
    console.log('\n' + '='.repeat(60))
    console.log('📊 IMPORT SUMMARY')
    console.log('='.repeat(60))
    console.log(`✅ Successful: ${successCount}`)
    console.log(`❌ Failed: ${errorCount}`)
    console.log(`📦 Total: ${records.length}`)
    console.log(`⏱️  Success Rate: ${((successCount/records.length)*100).toFixed(2)}%`)
    console.log('='.repeat(60))

    if (errors.length > 0) {
      console.log('\n⚠️  Errors:')
      errors.forEach(err => {
        console.log(`  Line ${err.line}: ${err.sku} - ${err.error}`)
      })
    }

    // Category breakdown
    const categories = new Map<string, number>()
    records.forEach(row => {
      const count = categories.get(row.category_id) || 0
      categories.set(row.category_id, count + 1)
    })

    console.log('\n📦 Products by Category:')
    categories.forEach((count, category) => {
      console.log(`  ${category}: ${count} products`)
    })

    console.log('\n✅ Import simulation completed!')
    console.log('\n💡 Note: This is a simulation. To actually import to database:')
    console.log('   1. Start Medusa: npm run dev')
    console.log('   2. Use API: curl -X POST http://localhost:9000/admin/products/import -F "file=@sample-products-120.csv"')

  } catch (error: any) {
    console.error('❌ Import failed:', error.message)
    process.exit(1)
  }
}

directImport()
