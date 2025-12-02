import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import OmexSearchService from "../../../../modules/omex-search/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const searchService = req.scope.resolve("omexSearchService") as OmexSearchService

  const { sku, manufacturer_id } = req.query

  try {
    if (!sku || typeof sku !== "string") {
      return res.status(400).json({
        error: "Manufacturer SKU parameter 'sku' is required",
      })
    }

    const products = await searchService.searchByManufacturerSKU(
      sku,
      manufacturer_id as string
    )

    return res.json({
      manufacturer_sku: sku,
      manufacturer_id: manufacturer_id || null,
      products,
      count: products.length,
    })
  } catch (error) {
    console.error("Manufacturer SKU search error:", error)
    return res.status(500).json({
      error: "Search failed",
      message: error.message,
    })
  }
}
