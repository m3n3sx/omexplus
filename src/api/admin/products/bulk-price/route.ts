/**
 * Bulk Price Update API
 * 
 * Aktualizuj ceny wielu produktów jednocześnie
 */

import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"

interface PriceUpdate {
  variantId: string
  amount: number
  currencyCode?: string
}

/**
 * POST /admin/products/bulk-price/update
 * 
 * Body: {
 *   updates: [
 *     { variantId: 'var_123', amount: 9999, currencyCode: 'pln' },
 *     { variantId: 'var_456', amount: 14999, currencyCode: 'pln' }
 *   ]
 * }
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const { updates } = req.body as { updates: PriceUpdate[] }

  if (!updates || !Array.isArray(updates) || updates.length === 0) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "updates array is required"
    )
  }

  try {
    const pricingModuleService = req.scope.resolve("pricingModuleService")
    const productModuleService = req.scope.resolve("productModuleService")

    const results = []
    const affectedProductIds = new Set<string>()

    for (const update of updates) {
      try {
        const { variantId, amount, currencyCode = 'pln' } = update

        // Get variant to find product
        const variant = await productModuleService.retrieveProductVariant(variantId)
        if (variant) {
          affectedProductIds.add(variant.product_id)
        }

        // Update price
        await pricingModuleService.updatePrices({
          id: variantId,
          prices: [{
            amount,
            currency_code: currencyCode,
          }]
        })

        results.push({
          variantId,
          status: 'success',
          newPrice: amount,
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
          tags: ['products', 'pricing', ...Array.from(affectedProductIds).map(id => `product-${id}`)],
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
      `Bulk price update failed: ${error.message}`
    )
  }
}
