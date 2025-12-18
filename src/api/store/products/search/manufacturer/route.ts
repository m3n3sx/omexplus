import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

/**
 * GET /store/products/search/manufacturer
 * Search by manufacturer SKU
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { sku, manufacturer_id } = req.query

  if (!sku || typeof sku !== "string") {
    return res.status(400).json({
      error: "Manufacturer SKU is required",
    })
  }

  try {
    const searchService = req.scope.resolve("omexSearch")

    const results = await searchService.searchByManufacturerSKU(
      sku,
      manufacturer_id as string | undefined
    )

    return res.json({
      products: results,
      count: results.length,
    })
  } catch (error: any) {
    return res.status(500).json({
      error: error.message || "Search failed",
    })
  }
}
