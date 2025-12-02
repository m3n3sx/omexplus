import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { OMEX_CATEGORY_MODULE } from "../../../../modules/omex-category"

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const categoryService = req.scope.resolve(OMEX_CATEGORY_MODULE)
  const { id } = req.params

  try {
    const category = await categoryService.updateCategory(id, req.body)

    res.json({ category })
  } catch (error: any) {
    res.status(400).json({
      error: {
        code: 'CATEGORY_UPDATE_ERROR',
        message: error.message,
      },
    })
  }
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const categoryService = req.scope.resolve(OMEX_CATEGORY_MODULE)
  const { id } = req.params
  const { cascade = false } = req.query

  try {
    await categoryService.deleteCategory(id, cascade === 'true')

    res.json({
      deleted: true,
      id,
      cascade: cascade === 'true',
    })
  } catch (error: any) {
    res.status(400).json({
      error: {
        code: 'CATEGORY_DELETE_ERROR',
        message: error.message,
      },
    })
  }
}
