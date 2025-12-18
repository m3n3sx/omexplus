import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { OMEX_BULK_IMPORT_MODULE } from "../../../../../../modules/omex-bulk-import"

/**
 * GET /admin/products/import/errors/:id
 * Download error report for a specific import
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const bulkImportService = req.scope.resolve(OMEX_BULK_IMPORT_MODULE)
  const { id } = req.params
  const { format = 'txt' } = req.query

  try {
    // In production, fetch errors from import_error table
    const errors = [
      {
        line: 15,
        field: 'price',
        reason: 'Price must be a positive number',
        value: 'invalid',
      },
      {
        line: 42,
        field: 'sku',
        reason: 'SKU must match format XXX-000',
        value: 'INVALID-SKU',
      },
    ]

    if (format === 'csv') {
      // Generate CSV format
      let csv = 'Line,Field,Reason,Value\n'
      errors.forEach(error => {
        csv += `${error.line},"${error.field}","${error.reason}","${error.value || ''}"\n`
      })

      res.setHeader('Content-Type', 'text/csv')
      res.setHeader('Content-Disposition', `attachment; filename="import-errors-${id}.csv"`)
      res.send(csv)
    } else {
      // Generate text format
      const report = bulkImportService.generateErrorReport(errors)

      res.setHeader('Content-Type', 'text/plain')
      res.setHeader('Content-Disposition', `attachment; filename="import-errors-${id}.txt"`)
      res.send(report)
    }

  } catch (error: any) {
    console.error('Failed to generate error report:', error)
    res.status(500).json({
      error: {
        code: 'ERROR_REPORT_FAILED',
        message: error.message,
      },
    })
  }
}
