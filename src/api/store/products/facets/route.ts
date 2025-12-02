import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

/**
 * GET /store/products/facets
 * Get available filters/facets
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { category } = req.query

  try {
    const searchService = req.scope.resolve("omexSearch")

    const facets = await searchService.getFacets(category as string | undefined)

    return res.json(facets)
  } catch (error: any) {
    return res.status(500).json({
      error: error.message || "Failed to get facets",
    })
  }
}
