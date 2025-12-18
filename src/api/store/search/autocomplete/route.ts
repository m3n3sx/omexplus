import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import OmexSearchService from "../../../../modules/omex-search/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const searchService = req.scope.resolve("omexSearchService") as OmexSearchService

  const { q, limit = 10 } = req.query

  try {
    if (!q || typeof q !== "string") {
      return res.status(400).json({
        error: "Query parameter 'q' is required",
      })
    }

    const suggestions = await searchService.autocomplete(q, parseInt(limit as string))

    return res.json({
      query: q,
      suggestions,
    })
  } catch (error) {
    console.error("Autocomplete error:", error)
    return res.status(500).json({
      error: "Autocomplete failed",
      message: error.message,
    })
  }
}
