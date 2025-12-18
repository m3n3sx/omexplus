import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { OMEX_CATEGORY_MODULE } from "../../../../modules/omex-category"

/**
 * GET /api/categories/:slug
 * Returns a specific category with all its direct subcategories and breadcrumb information
 * 
 * Requirements: 5.2, 1.5
 * Property 15: API Endpoint Returns Category with Subcategories
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const categoryService = req.scope.resolve(OMEX_CATEGORY_MODULE)
  const { slug } = req.params

  try {
    // Validate slug parameter
    if (!slug || typeof slug !== "string") {
      return res.status(400).json({
        error: {
          code: "INVALID_SLUG",
          message: "Slug parameter is required and must be a string",
        },
      })
    }

    // Get category by slug
    const category = await categoryService.getCategoryBySlug(slug)

    // Handle category not found
    if (!category) {
      return res.status(404).json({
        error: {
          code: "CATEGORY_NOT_FOUND",
          message: `Category with slug "${slug}" not found`,
        },
      })
    }

    // Get all direct subcategories
    const subcategories = await categoryService.getSubcategories(category.id)

    // Get breadcrumb path for navigation
    const breadcrumb = await categoryService.getBreadcrumbPath(category.id)

    // Set caching headers
    res.setHeader("Cache-Control", "public, max-age=3600") // 1 hour cache
    res.setHeader("ETag", `"category-${category.id}-${category.updated_at.getTime()}"`)

    // Return category with subcategories and breadcrumb
    res.json({
      category: {
        id: category.id,
        name: category.name,
        name_en: category.name_en,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        priority: category.priority,
        metadata: category.metadata,
        created_at: category.created_at,
        updated_at: category.updated_at,
      },
      subcategories: subcategories.map((sub) => ({
        id: sub.id,
        name: sub.name,
        name_en: sub.name_en,
        slug: sub.slug,
        description: sub.description,
        icon: sub.icon,
        priority: sub.priority,
        metadata: sub.metadata,
      })),
      breadcrumb: breadcrumb.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
      })),
      subcategoryCount: subcategories.length,
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
