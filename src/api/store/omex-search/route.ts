/**
 * OMEX Advanced Search API Endpoints
 * 5 search methods implementation
 */

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

// ============================================================================
// METHOD 1: Machine-Based Search
// ============================================================================

/**
 * GET /store/omex-search/machine/brands
 * Get available machine brands
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const advancedSearchService = req.scope.resolve("advancedSearchService")

  try {
    const brands = await advancedSearchService.getMachineBrands()

    res.json({
      brands,
      count: brands.length,
    })
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch machine brands",
      message: error.message,
    })
  }
}

/**
 * POST /store/omex-search/machine
 * Search parts by machine (5-step wizard)
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const advancedSearchService = req.scope.resolve("advancedSearchService")

  try {
    const { brand, machineType, model, series, frame, engine } = req.body

    if (!brand || !machineType || !model) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["brand", "machineType", "model"],
      })
    }

    const result = await advancedSearchService.searchByMachine({
      brand,
      machineType,
      model,
      series,
      frame,
      engine,
    })

    res.json(result)
  } catch (error) {
    res.status(500).json({
      error: "Machine search failed",
      message: error.message,
    })
  }
}
