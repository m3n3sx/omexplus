/**
 * GET /store/omex-search/machine/models
 * Get available machine models (step 3)
 */

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const advancedSearchService = req.scope.resolve("advancedSearchService")

  try {
    const { brand, type } = req.query

    if (!brand || !type) {
      return res.status(400).json({
        error: "Missing required parameters",
        required: ["brand", "type"],
      })
    }

    const models = await advancedSearchService.getMachineModels(
      brand as string,
      type as string
    )

    res.json({
      models,
      count: models.length,
    })
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch machine models",
      message: error.message,
    })
  }
}
