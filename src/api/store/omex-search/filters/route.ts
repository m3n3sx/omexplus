/**
 * METHOD 5: Advanced Filters
 * POST /store/omex-search/filters
 */

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const advancedSearchService = req.scope.resolve("advancedSearchService")

  try {
    const filters = req.body

    const result = await advancedSearchService.searchWithFilters(filters)

    res.json(result)
  } catch (error) {
    res.status(500).json({
      error: "Filter search failed",
      message: error.message,
    })
  }
}

/**
 * GET /store/omex-search/filters/options
 * Get available filter options
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    // Return available filter options
    res.json({
      categories: {
        description: "Multi-select categories",
        endpoint: "/store/omex-categories/tree",
      },
      machineBrands: {
        description: "Machine brands",
        options: [
          "CAT", "Komatsu", "Hitachi", "Volvo", "JCB", 
          "Kobelco", "Hyundai", "Bobcat", "Doosan"
        ],
      },
      availability: {
        description: "Stock availability",
        options: [
          { value: "in-stock", label: "Na magazynie" },
          { value: "order-2-5-days", label: "Zamówienie (2-5 dni)" },
          { value: "order-2-4-weeks", label: "Zamówienie (2-4 tygodnie)" },
          { value: "discontinued", label: "Wycofane" },
        ],
      },
      partTypes: {
        description: "OEM vs alternatives",
        options: [
          { value: "OEM", label: "Oryginalne" },
          { value: "Certified", label: "Certyfikowane" },
          { value: "Premium", label: "Wysokiej jakości" },
          { value: "Budget", label: "Ekonomiczne" },
        ],
      },
      manufacturers: {
        description: "Part manufacturers",
        options: [
          "Parker", "Rexroth", "Vickers", "Perkins", 
          "Yanmar", "Mitsubishi", "Bosch"
        ],
      },
      sortBy: {
        description: "Sort options",
        options: [
          { value: "newest", label: "Najnowsze" },
          { value: "best-selling", label: "Najlepiej sprzedające się" },
          { value: "price-asc", label: "Najtańsze" },
          { value: "price-desc", label: "Najdroższe" },
          { value: "rating", label: "Najwyżej oceniane" },
        ],
      },
    })
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch filter options",
      message: error.message,
    })
  }
}
