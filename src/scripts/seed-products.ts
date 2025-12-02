import { readFileSync } from 'fs'
import { parse } from 'csv-parse/sync'

export default async function seedProducts({ container }: any) {
  console.log('🚀 Seeding products from CSV...\n')

  const productModule = container.resolve('productModuleService')
  
  try {
    const fileContent = readFileSync('./sample-products-120.csv', 'utf-8')
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    })

    console.log(`📊 Found ${records.length} products to import\n`)

    let count = 0
    
    for (const row of records) {
      try {
        // Parse technical specs
        let specs = {}
        if (row.technical_specs_json) {
          try {
            specs = JSON.parse(row.technical_specs_json)
          } catch (e) {
            // Skip invalid JSON
          }
        }

        // Create product
        const product = await productModule.createProducts({
          title: row.name_pl,
          handle: row.sku.toLowerCase(),
          status: 'published',
          description: row.desc_pl || '',
          metadata: {
            sku: row.sku,
            name_en: row.name_en,
            name_de: row.name_de,
            desc_en: row.desc_en,
            desc_de: row.desc_de,
            category_id: row.category_id,
            equipment_type: row.equipment_type,
            min_order_qty: parseInt(row.min_order_qty) || 1,
            cost: parseFloat(row.cost) || 0,
            technical_specs: specs,
          },
        })

        // Create variant
        await productModule.createProductVariants({
          product_id: product.id,
          title: 'Default',
          sku: row.sku,
          manage_inventory: false,
          prices: [{
            amount: Math.round(parseFloat(row.price) * 100),
            currency_code: 'pln',
          }],
        })

        count++
        console.log(`✓ ${count}. ${row.sku} - ${row.name_pl}`)

      } catch (error: any) {
        console.log(`✗ ${row.sku} - ${error.message}`)
      }
    }

    console.log(`\n✅ Imported ${count}/${records.length} products`)

  } catch (error: any) {
    console.error('❌ Seed failed:', error.message)
    throw error
  }
}
