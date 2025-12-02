/**
 * GET /store/omex-search/suggestions
 * Autocomplete suggestions
 */

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const advancedSearchService = req.scope.resolve("advancedSearchService")

  try {
    const { q, query, limit = '10' } = req.query

    const searchQuery = (q || query) as string

    if (!searchQuery || searchQuery.length < 2) {
      return res.json({
        suggestions: [],
        message: "Query must be at least 2 characters",
      })
    }

    const suggestions = await advancedSearchService.getSuggestions(
      searchQuery,
      parseInt(limit as string)
    )

    res.json({
      suggestions,
      count: suggestions.length,
    })
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch suggestions",
      message: error.message,
    })
  }
}
