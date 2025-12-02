import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { OMEX_BULK_IMPORT_MODULE } from "../../../../../modules/omex-bulk-import"

/**
 * GET /admin/products/import/stats
 * Get import statistics and metrics
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const bulkImportService = req.scope.resolve(OMEX_BULK_IMPORT_MODULE)

  try {
    const stats = await bulkImportService.getImportStatistics()

    // Add additional metrics
    const metrics = {
      ...stats,
      success_rate: stats.total_imports > 0 
        ? ((stats.successful_products / (stats.successful_products + stats.failed_products)) * 100).toFixed(2)
        : 0,
      average_products_per_import: stats.total_imports > 0
        ? Math.round((stats.successful_products + stats.failed_products) / stats.total_imports)
        : 0,
    }

    res.json(metrics)

  } catch (error: any) {
    console.error('Failed to fetch import statistics:', error)
    res.status(500).json({
      error: {
        code: 'STATS_FETCH_ERROR',
        message: error.message,
      },
    })
  }
}
