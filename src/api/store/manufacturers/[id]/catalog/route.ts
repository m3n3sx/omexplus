import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

/**
 * GET /store/manufacturers/:id/catalog
 * Get products from manufacturer catalog by page number
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const { page } = req.query

  if (!id) {
    return res.status(400).json({
      error: "Manufacturer ID is required",
    })
  }

  if (!page) {
    return res.status(400).json({
      error: "Catalog page number is required",
    })
  }

  try {
    const searchService = req.scope.resolve("omexSearch")

    const products = await searchService.searchByCatalogPage(id, Number(page))

    return res.json({
      products,
      count: products.length,
      manufacturer_id: id,
      catalog_page: Number(page),
    })
  } catch (error: any) {
    return res.status(500).json({
      error: error.message || "Failed to get catalog products",
    })
  }
}
