/**
 * GET /store/omex-search/machine/types
 * Get available machine types (step 2)
 */

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import AdvancedSearchService from "../../../../../modules/omex-search/advanced-search.service"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const advancedSearchService = new AdvancedSearchService({ container_: req.scope } as any)

  try {
    const { brand } = req.query

    const types = await advancedSearchService.getMachineTypes(brand as string)

    res.json({
      types,
      count: types.length,
    })
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch machine types",
      message: error.message,
    })
  }
}
