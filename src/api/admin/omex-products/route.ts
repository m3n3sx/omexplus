import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { OMEX_PRODUCT_MODULE } from "../../../modules/omex-product"
import { OMEX_TRANSLATION_MODULE } from "../../../modules/omex-translation"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const productService = req.scope.resolve(OMEX_PRODUCT_MODULE)

  const {
    category_id,
    equipment_type,
    q,
    limit = 20,
    offset = 0,
  } = req.query

  try {
    const filters = {
      category_id: category_id as string,
      equipment_type: equipment_type as string,
      q: q as string,
    }

    const pagination = {
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    }

    const result = await productService.listProducts(filters, pagination)

    res.json(result)
  } catch (error: any) {
    res.status(400).json({
      error: {
        code: 'PRODUCT_LIST_ERROR',
        message: error.message,
      },
    })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const productService = req.scope.resolve(OMEX_PRODUCT_MODULE)
  const translationService = req.scope.resolve(OMEX_TRANSLATION_MODULE)

  const {
    title,
    description,
    sku,
    part_number,
    equipment_type,
    price,
    cost,
    min_order_qty,
    technical_specs,
    categories,
    translations,
  } = req.body

  try {
    // Create product
    const product = await productService.createProduct({
      title,
      description,
      sku,
      part_number,
      equipment_type,
      price,
      cost,
      min_order_qty,
      technical_specs,
      categories,
    })

    // Add translations if provided
    if (translations) {
      await translationService.bulkAddTranslations(
        product.id,
        'product',
        translations
      )
    }

    res.status(201).json({ product })
  } catch (error: any) {
    res.status(400).json({
      error: {
        code: 'PRODUCT_CREATE_ERROR',
        message: error.message,
      },
    })
  }
}
