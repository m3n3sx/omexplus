import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { OMEX_PRODUCT_MODULE } from "../../../modules/omex-product"
import { OMEX_TRANSLATION_MODULE } from "../../../modules/omex-translation"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const productService = req.scope.resolve(OMEX_PRODUCT_MODULE)
  const translationService = req.scope.resolve(OMEX_TRANSLATION_MODULE)

  const {
    category_id,
    equipment_type,
    min_price,
    max_price,
    in_stock,
    q,
    limit = 12,
    offset = 0,
    locale = 'pl',
  } = req.query

  try {
    const filters = {
      category_id: category_id as string,
      equipment_type: equipment_type as string,
      min_price: min_price ? parseFloat(min_price as string) : undefined,
      max_price: max_price ? parseFloat(max_price as string) : undefined,
      in_stock: in_stock === 'true',
      q: q as string,
    }

    const pagination = {
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    }

    const result = await productService.listProducts(filters, pagination)

    // Add translations for each product
    const productsWithTranslations = await Promise.all(
      result.products.map(async (product: any) => {
        const translation = await translationService.getProductTranslation(
          product.id,
          locale as string
        )
        return {
          ...product,
          translated_title: translation?.title || product.title,
          translated_description: translation?.description || product.description,
        }
      })
    )

    res.json({
      products: productsWithTranslations,
      count: result.count,
      limit: result.limit,
      offset: result.offset,
    })
  } catch (error: any) {
    res.status(400).json({
      error: {
        code: 'PRODUCT_LIST_ERROR',
        message: error.message,
      },
    })
  }
}
