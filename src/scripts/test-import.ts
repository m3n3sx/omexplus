import { readFileSync } from 'fs'
import { parse } from 'csv-parse/sync'

/**
 * Test script to validate CSV format before import
 * Usage: npm run test-import
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

async function testImport() {
  console.log('🧪 Testing CSV Import...\n')

  try {
    // Read CSV file
    const fileContent = readFileSync(CSV_FILE, 'utf-8')
    
    // Parse CSV
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as ProductRow[]

    console.log(`📊 Total products: ${records.length}`)
    console.log('')

    // Validate each row
    let validCount = 0
    let errorCount = 0
    const errors: any[] = []

    records.forEach((row, index) => {
      const lineNumber = index + 2 // +1 for header, +1 for 0-index
      let hasError = false

      // Check required fields
      if (!row.sku || row.sku.trim() === '') {
        errors.push({ line: lineNumber, field: 'sku', reason: 'Missing SKU' })
        hasError = true
      }

      if (!row.name_pl || row.name_pl.trim() === '') {
        errors.push({ line: lineNumber, field: 'name_pl', reason: 'Missing Polish name' })
        hasError = true
      }

      if (!row.price || row.price.trim() === '') {
        errors.push({ line: lineNumber, field: 'price', reason: 'Missing price' })
        hasError = true
      }

      if (!row.category_id || row.category_id.trim() === '') {
        errors.push({ line: lineNumber, field: 'category_id', reason: 'Missing category' })
        hasError = true
      }

      // Validate SKU format
      if (row.sku && !/^[A-Z]{3}-\d{3}$/.test(row.sku)) {
        errors.push({ 
          line: lineNumber, 
          field: 'sku', 
          reason: 'Invalid SKU format (should be XXX-000)',
          value: row.sku 
        })
        hasError = true
      }

      // Validate price
      if (row.price) {
        const price = parseFloat(row.price)
        if (isNaN(price) || price < 0) {
          errors.push({ 
            line: lineNumber, 
            field: 'price', 
            reason: 'Invalid price',
            value: row.price 
          })
          hasError = true
        }
      }

      // Validate technical specs JSON
      if (row.technical_specs_json && row.technical_specs_json.trim() !== '') {
        try {
          JSON.parse(row.technical_specs_json)
        } catch {
          errors.push({ 
            line: lineNumber, 
            field: 'technical_specs_json', 
            reason: 'Invalid JSON',
            value: row.technical_specs_json.substring(0, 50) + '...'
          })
          hasError = true
        }
      }

      if (hasError) {
        errorCount++
      } else {
        validCount++
      }
    })

    // Print results
    console.log('📈 Validation Results:')
    console.log(`  ✅ Valid: ${validCount}`)
    console.log(`  ❌ Errors: ${errorCount}`)
    console.log('')

    if (errors.length > 0) {
      console.log('⚠️  Errors found:')
      errors.slice(0, 10).forEach(error => {
        console.log(`  Line ${error.line}: ${error.field} - ${error.reason}`)
        if (error.value) {
          console.log(`    Value: ${error.value}`)
        }
      })
      
      if (errors.length > 10) {
        console.log(`  ... and ${errors.length - 10} more errors`)
      }
      console.log('')
    }

    // Category breakdown
    const categories = new Map<string, number>()
    records.forEach(row => {
      const count = categories.get(row.category_id) || 0
      categories.set(row.category_id, count + 1)
    })

    console.log('📦 Products by Category:')
    categories.forEach((count, category) => {
      console.log(`  ${category}: ${count} products`)
    })
    console.log('')

    // Sample products
    console.log('🔍 Sample Products:')
    records.slice(0, 3).forEach(row => {
      console.log(`  ${row.sku} - ${row.name_pl} (${row.price} PLN)`)
    })
    console.log('')

    if (errorCount === 0) {
      console.log('✅ CSV is valid and ready for import!')
    } else {
      console.log('❌ Please fix errors before importing')
      process.exit(1)
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

testImport()
