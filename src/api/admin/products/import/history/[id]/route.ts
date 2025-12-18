import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { OMEX_BULK_IMPORT_MODULE } from "../../../../../../modules/omex-bulk-import"

/**
 * GET /admin/products/import/history/:id
 * Get detailed import history including errors
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const bulkImportService = req.scope.resolve(OMEX_BULK_IMPORT_MODULE)
  const { id } = req.params

  try {
    // In production, query import_history and import_error tables
    const importRecord = {
      id,
      filename: 'sample-products-120.csv',
      status: 'completed',
      total_rows: 120,
      successful_rows: 118,
      failed_rows: 2,
      duration_ms: 5432,
      started_at: new Date(),
      completed_at: new Date(),
      errors: [],
    }

    res.json(importRecord)
  } catch (error: any) {
    console.error('Failed to fetch import details:', error)
    res.status(500).json({
      error: {
        code: 'IMPORT_DETAIL_ERROR',
        message: error.message,
      },
    })
  }
}

/**
 * DELETE /admin/products/import/history/:id
 * Delete import history record
 */
export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params

  try {
    // In production, delete from import_history table (cascade to import_error)
    res.json({
      id,
      deleted: true,
    })
  } catch (error: any) {
    console.error('Failed to delete import history:', error)
    res.status(500).json({
      error: {
        code: 'IMPORT_DELETE_ERROR',
        message: error.message,
      },
    })
  }
}
