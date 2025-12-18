/**
 * METHOD 2: Part Number Search
 * GET /store/omex-search/part-number
 */

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import AdvancedSearchService from "../../../../modules/omex-search/advanced-search.service"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const advancedSearchService = new AdvancedSearchService({ container_: req.scope } as any)

  try {
    const { 
      partNumber, 
      includeAlternatives = 'true', 
      exactMatch = 'false' 
    } = req.query

    if (!partNumber) {
      return res.status(400).json({
        error: "Part number is required",
        example: "/store/omex-search/part-number?partNumber=320-8134",
      })
    }

    const result = await advancedSearchService.searchByPartNumber({
      partNumber: partNumber as string,
      includeAlternatives: includeAlternatives === 'true',
      exactMatch: exactMatch === 'true',
    })

    res.json(result)
  } catch (error) {
    res.status(500).json({
      error: "Part number search failed",
      message: error.message,
    })
  }
}
