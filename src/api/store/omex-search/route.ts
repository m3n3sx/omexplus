/**
 * OMEX Advanced Search API Endpoints
 * 5 search methods implementation
 */

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import AdvancedSearchService from "../../../modules/omex-search/advanced-search.service"

// ============================================================================
// METHOD 1: Machine-Based Search (Step-by-step wizard)
// ============================================================================

/**
 * GET /store/omex-search
 * Multi-step machine search wizard
 * 
 * Step 1: No params → returns brands
 * Step 2: ?brand=CAT → returns types for CAT + products for CAT
 * Step 3: ?brand=CAT&machineType=Koparka → returns models + products
 * Step 4: ?brand=CAT&machineType=Koparka&model=320D → returns products
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const advancedSearchService = new AdvancedSearchService({ container_: req.scope } as any)

  try {
    const { brand, machineType, model, series, frame, engine } = req.query

    // STEP 1: No params → return brands list
    if (!brand) {
      const brands = await advancedSearchService.getMachineBrands()
      return res.json({
        step: 1,
        brands,
        nextStep: "Select a brand to see machine types",
      })
    }

    // STEP 2: Only brand → return types + products for this brand
    if (brand && !machineType) {
      const types = await advancedSearchService.getMachineTypes(brand as string)
      const products = await advancedSearchService.searchByMachine({
        brand: brand as string,
        machineType: '',
        model: '',
      })
      
      return res.json({
        step: 2,
        brand,
        types,
        products: products.products,
        total: products.total,
        nextStep: "Select a machine type to narrow results",
      })
    }

    // STEP 3: Brand + type → return models + products
    if (brand && machineType && !model) {
      const models = await advancedSearchService.getMachineModels(
        brand as string,
        machineType as string
      )
      const products = await advancedSearchService.searchByMachine({
        brand: brand as string,
        machineType: machineType as string,
        model: '',
      })
      
      return res.json({
        step: 3,
        brand,
        machineType,
        models,
        products: products.products,
        total: products.total,
        nextStep: "Select a model to see specific parts",
      })
    }

    // STEP 4: Brand + type + model → return products
    const result = await advancedSearchService.searchByMachine({
      brand: brand as string,
      machineType: machineType as string,
      model: model as string,
      series: series as string,
      frame: frame as string,
      engine: engine as string,
    })

    res.json({
      step: 4,
      brand,
      machineType,
      model,
      products: result.products,
      total: result.total,
      hasMore: result.hasMore,
    })
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
