import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { OMEX_PRODUCT_MODULE } from "../../../../modules/omex-product"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const productService = req.scope.resolve(OMEX_PRODUCT_MODULE)
  const { id } = req.params

  try {
    const product = await productService.retrieveProduct(id)

    if (!product) {
      return res.status(404).json({
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: `Product ${id} not found`,
        },
      })
    }

    res.json({ product })
  } catch (error: any) {
    res.status(400).json({
      error: {
        code: 'PRODUCT_RETRIEVE_ERROR',
        message: error.message,
      },
    })
  }
}

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const productService = req.scope.resolve(OMEX_PRODUCT_MODULE)
  const { id } = req.params

  try {
    const product = await productService.updateProduct(id, req.body)

    res.json({ product })
  } catch (error: any) {
    res.status(400).json({
      error: {
        code: 'PRODUCT_UPDATE_ERROR',
        message: error.message,
      },
    })
  }
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const productService = req.scope.resolve(OMEX_PRODUCT_MODULE)
  const { id } = req.params

  try {
    await productService.deleteProduct(id)

    res.json({
      deleted: true,
      id,
    })
  } catch (error: any) {
    res.status(400).json({
      error: {
        code: 'PRODUCT_DELETE_ERROR',
        message: error.message,
      },
    })
  }
}
