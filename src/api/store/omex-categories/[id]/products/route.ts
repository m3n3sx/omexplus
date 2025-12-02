import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { OMEX_CATEGORY_MODULE } from "../../../../../modules/omex-category"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const categoryService = req.scope.resolve(OMEX_CATEGORY_MODULE)

  const { id } = req.params
  const { include_subcategories = 'true' } = req.query

  try {
    const products = await categoryService.getProductsByCategory(
      id,
      include_subcategories === 'true'
    )

    res.json({
      products,
      category_id: id,
      includes_subcategories: include_subcategories === 'true',
    })
  } catch (error: any) {
    res.status(400).json({
      error: {
        code: 'CATEGORY_PRODUCTS_ERROR',
        message: error.message,
      },
    })
  }
}
