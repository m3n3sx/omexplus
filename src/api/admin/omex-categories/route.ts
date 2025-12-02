import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { OMEX_CATEGORY_MODULE } from "../../../modules/omex-category"
import { OMEX_TRANSLATION_MODULE } from "../../../modules/omex-translation"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const categoryService = req.scope.resolve(OMEX_CATEGORY_MODULE)

  try {
    const tree = await categoryService.listTree()

    res.json({ categories: tree })
  } catch (error: any) {
    res.status(400).json({
      error: {
        code: 'CATEGORY_LIST_ERROR',
        message: error.message,
      },
    })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const categoryService = req.scope.resolve(OMEX_CATEGORY_MODULE)
  const translationService = req.scope.resolve(OMEX_TRANSLATION_MODULE)

  const { name, slug, parent_id, icon, description, translations } = req.body

  try {
    const category = await categoryService.createCategory({
      name,
      slug,
      parent_id,
      icon,
      description,
    })

    // Add translations if provided
    if (translations) {
      await translationService.bulkAddTranslations(
        category.id,
        'category',
        translations
      )
    }

    res.status(201).json({ category })
  } catch (error: any) {
    res.status(400).json({
      error: {
        code: 'CATEGORY_CREATE_ERROR',
        message: error.message,
      },
    })
  }
}
