import { readFileSync } from 'fs'
import { parse } from 'csv-parse/sync'

/**
 * Import products directly to database using Medusa services
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

export default async function importToDatabase({ container }: any) {
  console.log('🚀 Starting Database Import...\n')

  const productModuleService = container.resolve('productModuleService')
  
  try {
    // Read and parse CSV
    const fileContent = readFileSync(CSV_FILE, 'utf-8')
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
      const lineNumber = i + 2

      try {
        // Parse technical specs
        let technicalSpecs = {}
        if (row.technical_specs_json && row.technical_specs_json.trim() !== '') {
          try {
            technicalSpecs = JSON.parse(row.technical_specs_json)
          } catch (e) {
            console.log(`⚠️  Invalid JSON for ${row.sku}, using empty object`)
          }
        }

        // Create product using Medusa service
        const product = await productModuleService.createProducts({
          title: row.name_pl,
          handle: row.sku.toLowerCase(),
          status: 'published',
          metadata: {
            sku: row.sku,
            name_pl: row.name_pl,
            name_en: row.name_en || row.name_pl,
            name_de: row.name_de || row.name_pl,
            desc_pl: row.desc_pl || '',
            desc_en: row.desc_en || row.desc_pl || '',
            desc_de: row.desc_de || row.desc_pl || '',
            cost: row.cost ? parseFloat(row.cost) : 0,
            category_id: row.category_id,
            equipment_type: row.equipment_type || '',
            min_order_qty: row.min_order_qty ? parseInt(row.min_order_qty) : 1,
            technical_specs: technicalSpecs,
          },
        })

        // Create variant with price
        await productModuleService.createProductVariants({
          product_id: product.id,
          title: 'Default',
          sku: row.sku,
          manage_inventory: false,
          prices: [
            {
              amount: Math.round(parseFloat(row.price) * 100), // Convert to cents
              currency_code: 'pln',
            },
          ],
        })

        successCount++
        console.log(`✓ [${successCount}/${records.length}] ${row.sku} - ${row.name_pl}`)

        // Progress every 20 products
        if (successCount % 20 === 0) {
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

    // Summary
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

    console.log('\n✅ Import completed!')

  } catch (error: any) {
    console.error('❌ Import failed:', error.message)
    throw error
  }
}
