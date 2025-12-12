import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { OMEX_CATEGORY_MODULE } from "../../../../../modules/omex-category"

/**
 * GET /api/categories/:slug/breadcrumb
 * Returns the full path from root to the specified category for breadcrumb navigation
 * 
 * Requirements: 5.5
 * Property 18: API Breadcrumb Endpoint Returns Correct Path
 * 
 * Response format:
 * {
 *   "breadcrumb": [
 *     { "id": "cat-1", "name": "Root Category", "slug": "root-category" },
 *     { "id": "cat-2", "name": "Sub Category", "slug": "root-category/sub-category" },
 *     { "id": "cat-3", "name": "Current Category", "slug": "root-category/sub-category/current" }
 *   ]
 * }
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

    // Get breadcrumb path from root to this category
    const breadcrumb = await categoryService.getBreadcrumbPath(category.id)

    // Set caching headers
    res.setHeader("Cache-Control", "public, max-age=3600") // 1 hour cache
    res.setHeader("ETag", `"breadcrumb-${category.id}-${category.updated_at.getTime()}"`)

    // Return breadcrumb path
    res.json({
      breadcrumb: breadcrumb.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
      })),
      count: breadcrumb.length,
    })
  } catch (error: any) {
    console.error("Error fetching breadcrumb:", error)

    res.status(500).json({
      error: {
        code: "BREADCRUMB_FETCH_ERROR",
        message: error.message || "Failed to fetch breadcrumb",
      },
    })
  }
}
