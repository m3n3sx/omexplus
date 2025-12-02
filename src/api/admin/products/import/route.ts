import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { OMEX_BULK_IMPORT_MODULE } from "../../../../modules/omex-bulk-import"
import { ImportProgress } from "../../../../modules/omex-bulk-import/types"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const bulkImportService = req.scope.resolve(OMEX_BULK_IMPORT_MODULE)

  try {
    // Check if file is provided
    const file = (req as any).file
    if (!file) {
      return res.status(400).json({
        error: {
          code: 'NO_FILE',
          message: 'No file provided. Please upload a CSV file.',
        },
      })
    }

    // Validate file type
    if (!file.originalname.endsWith('.csv')) {
      return res.status(400).json({
        error: {
          code: 'INVALID_FILE_TYPE',
          message: 'Invalid file type. Only CSV files are allowed.',
        },
      })
    }

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      return res.status(400).json({
        error: {
          code: 'FILE_TOO_LARGE',
          message: `File size exceeds maximum allowed size of 50MB.`,
        },
      })
    }

    // Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    // Progress callback
    const onProgress = (progress: ImportProgress) => {
      res.write(`data: ${JSON.stringify(progress)}\n\n`)
    }

    // Start import
    const result = await bulkImportService.importFromCSV(
      file.buffer,
      onProgress
    )

    // Send final result
    res.write(`data: ${JSON.stringify(result)}\n\n`)
    res.end()

  } catch (error: any) {
    console.error('Import error:', error)
    
    const errorResponse = {
      status: 'failed',
      total: 0,
      successful: 0,
      failed: 0,
      errors: [{
        line: 0,
        field: 'system',
        reason: error.message,
      }],
    }

    res.write(`data: ${JSON.stringify(errorResponse)}\n\n`)
    res.end()
  }
}

// Alternative non-SSE endpoint for simpler clients
export async function PUT(req: MedusaRequest, res: MedusaResponse) {
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

    const result = await bulkImportService.importFromCSV(file.buffer)

    res.json(result)

  } catch (error: any) {
    console.error('Import error:', error)
    res.status(500).json({
      error: {
        code: 'IMPORT_FAILED',
        message: error.message,
      },
    })
  }
}
