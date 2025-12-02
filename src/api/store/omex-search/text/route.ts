/**
 * METHOD 4: Text Search (Natural Language)
 * GET /store/omex-search/text
 */

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const advancedSearchService = req.scope.resolve("advancedSearchService")

  try {
    const { 
      q,
      query, 
      language = 'pl', 
      fuzzy = 'true' 
    } = req.query

    const searchQuery = (q || query) as string

    if (!searchQuery) {
      return res.status(400).json({
        error: "Search query is required",
        example: "/store/omex-search/text?q=pompa hydrauliczna do komatsu pc200",
        examples: [
          "pompa hydrauliczna do komatsu pc200",
          "filtr oleju cat 320d",
          "gąsienice do hitachi zx210",
          "młot hydrauliczny 3 tony",
          "320-8134",
        ],
      })
    }

    const result = await advancedSearchService.searchByText({
      query: searchQuery,
      language: language as 'pl' | 'en' | 'de' | 'uk',
      fuzzy: fuzzy === 'true',
    })

    res.json(result)
  } catch (error) {
    res.status(500).json({
      error: "Text search failed",
      message: error.message,
    })
  }
}
