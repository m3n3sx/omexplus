import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { OMEX_BULK_IMPORT_MODULE } from "../../../../../modules/omex-bulk-import"

/**
 * POST /admin/products/import/validate
 * Validate CSV without importing (dry-run mode)
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const bulkImportService = req.scope.resolve(OMEX_BULK_IMPORT_MODULE)

  try {
    const file = (req as any).file
    if (!file) {
      return res.status(400).json({
        error: {
          code: 'NO_FILE',
          message: 'No file provided. Please upload a CSV file.',
        },
      })
    }

    if (!file.originalname.endsWith('.csv')) {
      return res.status(400).json({
        error: {
          code: 'INVALID_FILE_TYPE',
          message: 'Invalid file type. Only CSV files are allowed.',
        },
      })
    }

    // Validate without importing
    const result = await bulkImportService.validateCSV(file.buffer)

    res.json({
      valid: result.errors.length === 0,
      total_rows: result.total,
      validation_errors: result.errors,
      warnings: result.warnings || [],
      summary: {
        duplicate_skus: result.duplicate_skus || [],
        invalid_categories: result.invalid_categories || [],
        missing_translations: result.missing_translations || 0,
      },
    })

  } catch (error: any) {
    console.error('Validation error:', error)
    res.status(500).json({
      error: {
        code: 'VALIDATION_FAILED',
        message: error.message,
      },
    })
  }
}
