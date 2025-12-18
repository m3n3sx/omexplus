import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { OMEX_CATEGORY_MODULE } from "../../../modules/omex-category"
import { OMEX_TRANSLATION_MODULE } from "../../../modules/omex-translation"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const categoryService = req.scope.resolve(OMEX_CATEGORY_MODULE)
  const translationService = req.scope.resolve(OMEX_TRANSLATION_MODULE)

  const { locale = 'pl' } = req.query

  try {
    // Get category tree
    const tree = await categoryService.listTree()

    // Add translations for each category
    const translateCategory = async (category: any): Promise<any> => {
      const translation = await translationService.getCategoryTranslation(
        category.id,
        locale as string
      )

      const translatedCategory = {
        ...category,
        translated_name: translation?.name || category.name,
        translated_description: translation?.description || category.description,
      }

      if (category.children && category.children.length > 0) {
        translatedCategory.children = await Promise.all(
          category.children.map(translateCategory)
        )
      }

      return translatedCategory
    }

    const translatedTree = await Promise.all(tree.map(translateCategory))

    res.json({
      categories: translatedTree,
    })
  } catch (error: any) {
    res.status(400).json({
      error: {
        code: 'CATEGORY_LIST_ERROR',
        message: error.message,
      },
    })
  }
}
