import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

/**
 * GET /store/products/search
 * Basic product search with filters
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { query, category, price_min, price_max, sort, limit = 20, offset = 0 } = req.query

  if (!query || typeof query !== "string" || query.trim().length === 0) {
    return res.status(400).json({
      error: "Search query is required",
    })
  }

  try {
    // Get search service
    const searchService = req.scope.resolve("omexSearch")

    // Build filters
    const filters: any = {}
    if (category) filters.category_id = category
    if (price_min) filters.min_price = parseFloat(price_min as string)
    if (price_max) filters.max_price = parseFloat(price_max as string)

    // Build sort options
    const sortOptions = {
      field: "popularity" as const,
      order: "desc" as const,
    }

    if (sort === "price_asc") {
      sortOptions.field = "price"
      sortOptions.order = "asc"
    } else if (sort === "price_desc") {
      sortOptions.field = "price"
      sortOptions.order = "desc"
    } else if (sort === "newest") {
      sortOptions.field = "created_at"
      sortOptions.order = "desc"
    }

    // Perform search
    const result = await searchService.search(
      query,
      filters,
      sortOptions,
      {
        page: Math.floor(Number(offset) / Number(limit)) + 1,
        limit: Number(limit),
      }
    )

    return res.json(result)
  } catch (error: any) {
    return res.status(500).json({
      error: error.message || "Search failed",
    })
  }
}
