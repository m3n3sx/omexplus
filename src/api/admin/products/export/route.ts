/**
 * CSV Export API
 * 
 * Eksportuj produkty do CSV - łatwy backup i analiza
 */

import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"

/**
 * GET /admin/products/export
 * 
 * Query params:
 * - format: 'csv' | 'json' (default: csv)
 * - filters: collection_id, status, etc.
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const { format = 'csv', ...filters } = req.query

  try {
    const productModuleService = req.scope.resolve("productModuleService")

    // Get all products with filters
    const products = await productModuleService.listProducts(filters, {
      relations: ['variants', 'variants.prices', 'collections', 'categories'],
    })

    if (format === 'json') {
      res.json({
        success: true,
        count: products.length,
        products,
      })
      return
    }

    // Generate CSV
    const csvRows = []
    
    // Header
    csvRows.push([
      'ID',
      'Handle',
      'Title',
      'Description',
      'Status',
      'Variant ID',
      'SKU',
      'Price (PLN)',
      'Currency',
      'Stock',
      'Collections',
      'Categories',
      'Created At',
      'Updated At',
    ].join(','))

    // Data rows
    for (const product of products) {
      const collections = product.collections?.map(c => c.title).join(';') || ''
      const categories = product.categories?.map(c => c.name).join(';') || ''

      for (const variant of product.variants || []) {
        const price = variant.prices?.[0]
        
        csvRows.push([
          product.id,
          product.handle,
          `"${product.title?.replace(/"/g, '""') || ''}"`,
          `"${product.description?.replace(/"/g, '""') || ''}"`,
          product.status,
          variant.id,
          variant.sku || '',
          price ? (price.amount / 100).toFixed(2) : '0.00',
          price?.currency_code || 'pln',
          variant.inventory_quantity || 0,
          `"${collections}"`,
          `"${categories}"`,
          product.created_at,
          product.updated_at,
        ].join(','))
      }
    }

    const csv = csvRows.join('\n')

    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', `attachment; filename="products-export-${Date.now()}.csv"`)
    res.send(csv)
  } catch (error) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      `Export failed: ${error.message}`
    )
  }
}
