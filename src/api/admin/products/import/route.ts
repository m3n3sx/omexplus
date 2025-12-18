/**
 * CSV Import API
 * 
 * Importuj produkty z CSV - kluczowe dla katalogów dostawców
 */

import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"

/**
 * POST /admin/products/import
 * 
 * Body (multipart/form-data):
 * - file: CSV file
 * - updateMode: 'create_or_update' | 'create_only' | 'update_only'
 * 
 * CSV Format:
 * handle,title,description,price,stock,sku,collection_id,category_id
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const { updateMode = 'create_or_update' } = req.body
  const file = req.files?.file

  if (!file) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "CSV file is required"
    )
  }

  try {
    const productModuleService = req.scope.resolve("productModuleService")
    
    // Parse CSV
    const content = file.data.toString('utf-8')
    const lines = content.split('\n').filter(line => line.trim())
    
    if (lines.length < 2) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "CSV file is empty or invalid"
      )
    }

    // Parse header
    const header = lines[0].split(',').map(h => h.trim())
    const results = []

    // Process each row
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i])
      const record: any = {}
      
      header.forEach((key, index) => {
        record[key] = values[index]?.trim() || ''
      })

      try {
        let product
        let action = 'skipped'

        // Find existing product by handle
        const existing = await productModuleService.listProducts({
          handle: record.handle
        })

        const existingProduct = existing[0]

        if (existingProduct && (updateMode === 'create_or_update' || updateMode === 'update_only')) {
          // Update existing product
          product = await productModuleService.updateProducts(existingProduct.id, {
            title: record.title,
            description: record.description,
            status: record.status || 'published',
          })

          // Update variant
          if (existingProduct.variants?.[0]) {
            const variantId = existingProduct.variants[0].id
            
            // Update price
            if (record.price) {
              await req.scope.resolve("pricingModuleService").updatePrices({
                id: variantId,
                prices: [{
                  amount: Math.round(parseFloat(record.price) * 100),
                  currency_code: record.currency || 'pln',
                }]
              })
            }

            // Update stock
            if (record.stock) {
              await req.scope.resolve("inventoryModuleService").updateInventoryLevels({
                inventory_item_id: variantId,
                location_id: 'default',
                stocked_quantity: parseInt(record.stock),
              })
            }
          }

          action = 'updated'
        } else if (!existingProduct && (updateMode === 'create_or_update' || updateMode === 'create_only')) {
          // Create new product
          product = await productModuleService.createProducts({
            title: record.title,
            handle: record.handle,
            description: record.description,
            status: record.status || 'published',
            variants: [{
              title: 'Default',
              sku: record.sku || record.handle,
              prices: [{
                amount: Math.round(parseFloat(record.price || 0) * 100),
                currency_code: record.currency || 'pln',
              }],
              inventory_quantity: parseInt(record.stock || 0),
            }],
            collection_id: record.collection_id || undefined,
            category_id: record.category_id || undefined,
          })

          action = 'created'
        }

        results.push({
          handle: record.handle,
          title: record.title,
          action,
          success: true,
        })
      } catch (error) {
        results.push({
          handle: record.handle,
          title: record.title,
          action: 'error',
          success: false,
          error: error.message,
        })
      }
    }

    // Trigger revalidation
    if (typeof fetch !== 'undefined') {
      const storefrontUrl = process.env.NEXT_PUBLIC_STOREFRONT_URL || 'http://localhost:3000'
      const revalidateSecret = process.env.REVALIDATE_SECRET
      
      fetch(`${storefrontUrl}/api/revalidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tags: ['products', 'categories'],
          secret: revalidateSecret,
        }),
      }).catch(() => {})
    }

    const successCount = results.filter(r => r.success).length
    const errorCount = results.filter(r => !r.success).length
    const createdCount = results.filter(r => r.action === 'created').length
    const updatedCount = results.filter(r => r.action === 'updated').length

    res.json({
      success: true,
      total: results.length,
      created: createdCount,
      updated: updatedCount,
      failed: errorCount,
      results,
    })
  } catch (error) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      `Import failed: ${error.message}`
    )
  }
}

/**
 * Parse CSV line handling quoted values
 */
function parseCSVLine(line: string): string[] {
  const result = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }

  result.push(current)
  return result
}
