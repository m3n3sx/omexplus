/**
 * Bulk Operations API
 * 
 * Umożliwia masową edycję produktów - oszczędza godziny pracy
 */

import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"

/**
 * POST /admin/products/bulk/update
 * 
 * Bulk update multiple products at once
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const { productIds, updates } = req.body

  if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "productIds array is required"
    )
  }

  if (!updates || typeof updates !== 'object') {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "updates object is required"
    )
  }

  try {
    const productModuleService = req.scope.resolve("productModuleService")
    
    // Validate all products exist first
    const products = await productModuleService.listProducts({
      id: productIds
    })

    if (products.length !== productIds.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Some products not found. Expected ${productIds.length}, found ${products.length}`
      )
    }

    // Perform bulk update
    const updatedProducts = await Promise.all(
      productIds.map(async (id) => {
        return await productModuleService.updateProducts(id, updates)
      })
    )

    // Trigger revalidation for storefront
    if (typeof fetch !== 'undefined') {
      const storefrontUrl = process.env.NEXT_PUBLIC_STOREFRONT_URL || 'http://localhost:3000'
      const revalidateSecret = process.env.REVALIDATE_SECRET
      
      fetch(`${storefrontUrl}/api/revalidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tags: ['products', ...productIds.map(id => `product-${id}`)],
          secret: revalidateSecret,
        }),
      }).catch(() => {
        // Silent fail - revalidation is optional
      })
    }

    res.json({
      success: true,
      updated: updatedProducts.length,
      products: updatedProducts,
    })
  } catch (error) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      `Bulk update failed: ${error.message}`
    )
  }
}
