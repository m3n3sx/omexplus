import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { OMEX_CATEGORY_MODULE } from "../../../../../modules/omex-category"

/**
 * GET /api/categories/:slug/subcategories
 * Returns only direct subcategories of a specified category with pagination support
 * 
 * Query Parameters:
 * - limit: number (default: 50, max: 100) - Number of results to return
 * - offset: number (default: 0) - Number of results to skip
 * 
 * Requirements: 5.3
 * Property 16: API Endpoint Returns Only Direct Subcategories
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

    // Parse pagination parameters
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100)
    const offset = parseInt(req.query.offset as string) || 0

    // Validate pagination parameters
    if (limit < 1 || limit > 100) {
      return res.status(400).json({
        error: {
          code: "INVALID_LIMIT",
          message: "Limit must be between 1 and 100",
        },
      })
    }

    if (offset < 0) {
      return res.status(400).json({
        error: {
          code: "INVALID_OFFSET",
          message: "Offset must be greater than or equal to 0",
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

    // Get all direct subcategories (not grandchildren)
    const allSubcategories = await categoryService.getSubcategories(category.id)

    // Sort by priority
    allSubcategories.sort((a, b) => a.priority - b.priority)

    // Apply pagination
    const paginatedSubcategories = allSubcategories.slice(offset, offset + limit)

    // Set caching headers
    res.setHeader("Cache-Control", "public, max-age=3600") // 1 hour cache
    res.setHeader("ETag", `"subcategories-${category.id}-${Date.now()}"`)

    // Return paginated subcategories
    res.json({
      subcategories: paginatedSubcategories.map((sub) => ({
        id: sub.id,
        name: sub.name,
        name_en: sub.name_en,
        slug: sub.slug,
        description: sub.description,
        icon: sub.icon,
        priority: sub.priority,
        metadata: sub.metadata,
        created_at: sub.created_at,
        updated_at: sub.updated_at,
      })),
      pagination: {
        limit,
        offset,
        total: allSubcategories.length,
        count: paginatedSubcategories.length,
        hasMore: offset + limit < allSubcategories.length,
      },
    })
  } catch (error: any) {
    console.error("Error fetching subcategories:", error)

    res.status(500).json({
      error: {
        code: "SUBCATEGORIES_FETCH_ERROR",
        message: error.message || "Failed to fetch subcategories",
      },
    })
  }
}
