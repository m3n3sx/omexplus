import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

/**
 * GET /store/products/:id/similar
 * Get similar products
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const { limit = 5 } = req.query

  if (!id) {
    return res.status(400).json({
      error: "Product ID is required",
    })
  }

  try {
    const searchService = req.scope.resolve("omexSearch")

    const products = await searchService.similarProducts(id, Number(limit))

    return res.json({
      products,
      count: products.length,
    })
  } catch (error: any) {
    return res.status(500).json({
      error: error.message || "Failed to get similar products",
    })
  }
}
