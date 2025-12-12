import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { OMEX_CATEGORY_MODULE } from "../../../modules/omex-category"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const categoryService = req.scope.resolve(OMEX_CATEGORY_MODULE)

  try {
    // Get all categories
    const allCategories = await categoryService.getAllCategories()

    // Filter to only top-level categories (parent_id is null)
    const topLevelCategories = allCategories.filter((cat) => cat.parent_id === null)

    // Enhance each category with subcategory count
    const categoriesWithCounts = await Promise.all(
      topLevelCategories.map(async (category) => {
        const subcategories = await categoryService.getSubcategories(category.id)
        return {
          id: category.id,
          name: category.name,
          name_en: category.name_en,
          slug: category.slug,
          description: category.description,
          icon: category.icon,
          priority: category.priority,
          metadata: category.metadata,
          subcategoryCount: subcategories.length,
          created_at: category.created_at,
          updated_at: category.updated_at,
        }
      })
    )

    // Sort by priority
    categoriesWithCounts.sort((a, b) => a.priority - b.priority)

    // Set caching headers
    res.setHeader("Cache-Control", "public, max-age=3600") // 1 hour cache
    res.setHeader("ETag", `"categories-${Date.now()}"`)

    res.json({
      categories: categoriesWithCounts,
      count: categoriesWithCounts.length,
    })
  } catch (error: any) {
    res.status(400).json({
      error: {
        code: "CATEGORY_LIST_ERROR",
        message: error.message,
      },
    })
  }
}
