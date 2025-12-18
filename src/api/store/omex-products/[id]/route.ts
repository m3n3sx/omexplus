import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { OMEX_PRODUCT_MODULE } from "../../../../modules/omex-product"
import { OMEX_TRANSLATION_MODULE } from "../../../../modules/omex-translation"
import { OMEX_PRICING_MODULE } from "../../../../modules/omex-pricing"
import { OMEX_INVENTORY_MODULE } from "../../../../modules/omex-inventory"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const productService = req.scope.resolve(OMEX_PRODUCT_MODULE)
  const translationService = req.scope.resolve(OMEX_TRANSLATION_MODULE)
  const pricingService = req.scope.resolve(OMEX_PRICING_MODULE)
  const inventoryService = req.scope.resolve(OMEX_INVENTORY_MODULE)

  const { id } = req.params
  const { locale = 'pl' } = req.query

  try {
    // Get product
    const product = await productService.retrieveProduct(id, locale as string)

    if (!product) {
      return res.status(404).json({
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: `Product with ID ${id} not found`,
        },
      })
    }

    // Get translation
    const translation = await translationService.getProductTranslation(
      id,
      locale as string
    )

    // Get pricing tiers (for B2B customers)
    // In real implementation, get customer type from session
    const customerType = 'retail' // Default to retail

    // Get stock levels
    const stock = await inventoryService.getTotalStock(id)

    res.json({
      product: {
        ...product,
        translated_title: translation?.title || product.title,
        translated_description: translation?.description || product.description,
        total_stock: stock,
        in_stock: stock > 0,
      },
    })
  } catch (error: any) {
    res.status(400).json({
      error: {
        code: 'PRODUCT_RETRIEVE_ERROR',
        message: error.message,
      },
    })
  }
}
