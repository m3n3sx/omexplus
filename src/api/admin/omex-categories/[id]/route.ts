import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { OMEX_CATEGORY_MODULE } from "../../../../modules/omex-category"
import { UpdateCategoryInput } from "../../../../modules/omex-category/repository"

/**
 * PUT /api/admin/categories/:id
 * Update an existing category
 * Requirements: 4.3
 * 
 * Request body:
 * {
 *   name?: string
 *   slug?: string (must be kebab-case and unique)
 *   parent_id?: string | null (must not create circular reference)
 *   description?: string
 *   icon?: string
 *   priority?: number
 *   name_en?: string
 *   metadata?: Record<string, any>
 * }
 */
export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const categoryService = req.scope.resolve(OMEX_CATEGORY_MODULE)
  const { id } = req.params

  try {
    // Validate that category exists
    const existingCategory = await categoryService.findById(id)
    if (!existingCategory) {
      return res.status(404).json({
        error: {
          code: 'CATEGORY_NOT_FOUND',
          message: `Category with ID "${id}" not found`,
        },
      })
    }

    // Update the category
    // The service will handle:
    // - Slug format validation (kebab-case)
    // - Slug uniqueness validation
    // - Parent existence validation
    // - Circular reference prevention
    // - Cache invalidation
    const updateData = req.body as UpdateCategoryInput
    const category = await categoryService.update(id, updateData)

    res.json({ category })
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
        code: 'CATEGORY_UPDATE_ERROR',
        message: error.message,
      },
    })
  }
}

/**
 * DELETE /api/admin/categories/:id
 * Delete a category
 * Requirements: 4.4
 */
export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const categoryService = req.scope.resolve(OMEX_CATEGORY_MODULE)
  const { id } = req.params

  try {
    // Validate that category exists
    const existingCategory = await categoryService.findById(id)
    if (!existingCategory) {
      return res.status(404).json({
        error: {
          code: 'CATEGORY_NOT_FOUND',
          message: `Category with ID "${id}" not found`,
        },
      })
    }

    await categoryService.delete(id)

    res.json({
      deleted: true,
      id,
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
