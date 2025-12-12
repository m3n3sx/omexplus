import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { OMEX_CATEGORY_MODULE } from "../../../../modules/omex-category"

/**
 * GET /api/categories/:id
 * Returns a specific category by ID with all its direct subcategories
 * 
 * Used for admin edit pages to fetch category data
 * Requirements: 9.3
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const categoryService = req.scope.resolve(OMEX_CATEGORY_MODULE)
  const { id } = req.params

  try {
    // Validate id parameter
    if (!id || typeof id !== "string") {
      return res.status(400).json({
        error: {
          code: "INVALID_ID",
          message: "ID parameter is required and must be a string",
        },
      })
    }

    // Get category by ID
    const category = await categoryService.findById(id)

    // Handle category not found
    if (!category) {
      return res.status(404).json({
        error: {
          code: "CATEGORY_NOT_FOUND",
          message: `Category with ID "${id}" not found`,
        },
      })
    }

    // Return category
    res.json({
      id: category.id,
      name: category.name,
      name_en: category.name_en,
      slug: category.slug,
      description: category.description,
      icon: category.icon,
      priority: category.priority,
      parent_id: category.parent_id,
      metadata: category.metadata,
      created_at: category.created_at,
      updated_at: category.updated_at,
    })
  } catch (error: any) {
    console.error("Error fetching category:", error)

    res.status(500).json({
      error: {
        code: "CATEGORY_FETCH_ERROR",
        message: error.message || "Failed to fetch category",
      },
    })
  }
}
