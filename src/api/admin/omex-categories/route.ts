import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { OMEX_CATEGORY_MODULE } from "../../../modules/omex-category"

/**
 * GET /api/admin/categories
 * Retrieve all categories in tree structure
 * Requirements: 4.1
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const categoryService = req.scope.resolve(OMEX_CATEGORY_MODULE)

  try {
    const tree = await categoryService.getCategoryTree()

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

/**
 * POST /api/admin/categories
 * Create a new category
 * Requirements: 4.2, 1.2
 * 
 * Request body:
 * {
 *   name: string (required)
 *   slug: string (required, must be kebab-case)
 *   parent_id?: string (optional, must not create circular reference)
 *   description?: string
 *   icon?: string
 *   priority?: number
 *   name_en?: string
 *   metadata?: Record<string, any>
 * }
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const categoryService = req.scope.resolve(OMEX_CATEGORY_MODULE)

  const { name, slug, parent_id, icon, description, priority, name_en, metadata } = req.body

  try {
    // Validate required fields
    if (!name || !slug) {
      return res.status(400).json({
        error: {
          code: 'INVALID_REQUEST',
          message: 'Name and slug are required',
        },
      })
    }

    // Create the category
    // The service will handle:
    // - Slug format validation (kebab-case)
    // - Slug uniqueness validation
    // - Parent existence validation
    // - Circular reference prevention
    // - Cache invalidation
    const category = await categoryService.create({
      name,
      slug,
      parent_id: parent_id || null,
      icon,
      description,
      priority,
      name_en,
      metadata,
    })

    res.status(201).json({ category })
  } catch (error: any) {
    // Handle specific error types
    if (error.message.includes('kebab-case')) {
      return res.status(400).json({
        error: {
          code: 'INVALID_SLUG_FORMAT',
          message: error.message,
        },
      })
    }

    if (error.message.includes('already exists')) {
      return res.status(409).json({
        error: {
          code: 'SLUG_ALREADY_EXISTS',
          message: error.message,
        },
      })
    }

    if (error.message.includes('circular reference')) {
      return res.status(400).json({
        error: {
          code: 'CIRCULAR_REFERENCE',
          message: error.message,
        },
      })
    }

    if (error.message.includes('not found')) {
      return res.status(404).json({
        error: {
          code: 'PARENT_NOT_FOUND',
          message: error.message,
        },
      })
    }

    res.status(400).json({
      error: {
        code: 'CATEGORY_CREATE_ERROR',
        message: error.message,
      },
    })
  }
}
