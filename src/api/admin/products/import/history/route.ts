import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { OMEX_BULK_IMPORT_MODULE } from "../../../../../modules/omex-bulk-import"

/**
 * GET /admin/products/import/history
 * List all import history records
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const bulkImportService = req.scope.resolve(OMEX_BULK_IMPORT_MODULE)

  try {
    const { limit = 20, offset = 0, status } = req.query

    // In production, query import_history table
    const history = {
      imports: [],
      count: 0,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    }

    res.json(history)
  } catch (error: any) {
    console.error('Failed to fetch import history:', error)
    res.status(500).json({
      error: {
        code: 'HISTORY_FETCH_ERROR',
        message: error.message,
      },
    })
  }
}
