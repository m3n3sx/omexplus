/**
 * Bulk Stock Update API
 * 
 * Aktualizuj stany magazynowe wielu wariantów jednocześnie
 */

import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"

interface StockUpdate {
  variantId: string
  quantity: number
  locationId?: string
}

/**
 * POST /admin/products/bulk-stock/update
 * 
 * Body: {
 *   updates: [
 *     { variantId: 'var_123', quantity: 50 },
 *     { variantId: 'var_456', quantity: 100 }
 *   ]
 * }
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const { updates } = req.body as { updates: StockUpdate[] }

  if (!updates || !Array.isArray(updates) || updates.length === 0) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "updates array is required"
    )
  }

  try {
    const inventoryModuleService = req.scope.resolve("inventoryModuleService")
    const productModuleService = req.scope.resolve("productModuleService")

    const results = []
    const affectedProductIds = new Set<string>()

    for (const update of updates) {
      try {
        const { variantId, quantity, locationId } = update

        // Get variant to find product
        const variant = await productModuleService.retrieveProductVariant(variantId)
        if (variant) {
          affectedProductIds.add(variant.product_id)
        }

        // Update inventory
        await inventoryModuleService.updateInventoryLevels({
          inventory_item_id: variantId,
          location_id: locationId || 'default',
          stocked_quantity: quantity,
        })

        results.push({
          variantId,
          status: 'success',
          newQuantity: quantity,
        })
      } catch (error) {
        results.push({
          variantId: update.variantId,
          status: 'error',
          error: error.message,
        })
      }
    }

    // Trigger revalidation
    if (affectedProductIds.size > 0 && typeof fetch !== 'undefined') {
      const storefrontUrl = process.env.NEXT_PUBLIC_STOREFRONT_URL || 'http://localhost:3000'
      const revalidateSecret = process.env.REVALIDATE_SECRET
      
      fetch(`${storefrontUrl}/api/revalidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tags: ['products', 'inventory', ...Array.from(affectedProductIds).map(id => `product-${id}`)],
          secret: revalidateSecret,
        }),
      }).catch(() => {})
    }

    const successCount = results.filter(r => r.status === 'success').length
    const errorCount = results.filter(r => r.status === 'error').length

    res.json({
      success: true,
      updated: successCount,
      failed: errorCount,
      results,
    })
  } catch (error) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      `Bulk stock update failed: ${error.message}`
    )
  }
}
