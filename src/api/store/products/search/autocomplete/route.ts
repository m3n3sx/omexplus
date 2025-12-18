import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

/**
 * GET /store/products/search/autocomplete
 * Get autocomplete suggestions
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { prefix, limit = 10 } = req.query

  if (!prefix || typeof prefix !== "string" || prefix.length < 2) {
    return res.json({
      suggestions: [],
    })
  }

  try {
    const searchService = req.scope.resolve("omexSearch")

    const suggestions = await searchService.autocomplete(prefix, Number(limit))

    return res.json({
      suggestions,
    })
  } catch (error: any) {
    return res.status(500).json({
      error: error.message || "Autocomplete failed",
    })
  }
}
