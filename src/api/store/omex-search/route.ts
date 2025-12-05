/**
 * OMEX Advanced Search API Endpoints
 * 5 search methods implementation
 */

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import AdvancedSearchService from "../../../modules/omex-search/advanced-search.service"

// ============================================================================
// METHOD 1: Machine-Based Search
// ============================================================================

/**
 * GET /store/omex-search
 * Search parts by machine using query params
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const advancedSearchService = new AdvancedSearchService({ container_: req.scope } as any)

  try {
    const { brand, machineType, model, series, frame, engine } = req.query

    // If no params, return brands list
    if (!brand && !machineType && !model) {
      const brands = await advancedSearchService.getMachineBrands()
      return res.json({
        brands,
        count: brands.length,
      })
    }

    // Otherwise search by machine
    if (!brand || !machineType || !model) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["brand", "machineType", "model"],
      })
    }

    const result = await advancedSearchService.searchByMachine({
      brand: brand as string,
      machineType: machineType as string,
      model: model as string,
      series: series as string,
      frame: frame as string,
      engine: engine as string,
    })

    res.json(result)
  } catch (error) {
    res.status(500).json({
      error: "Machine search failed",
      message: error.message,
    })
  }
}

/**
 * POST /store/omex-search
 * Search parts by machine (5-step wizard)
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const advancedSearchService = new AdvancedSearchService({ container_: req.scope } as any)

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
