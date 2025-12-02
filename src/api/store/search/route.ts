import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import OmexSearchService from "../../../modules/omex-search/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const searchService = req.scope.resolve("omexSearchService") as OmexSearchService

  const {
    q,
    category_id,
    min_price,
    max_price,
    brand,
    equipment_type,
    in_stock,
    sort_by = "popularity",
    sort_order = "desc",
    page = 1,
    limit = 12,
  } = req.query

  try {
    if (!q || typeof q !== "string") {
      return res.status(400).json({
        error: "Search query 'q' is required",
      })
    }

    const filters = {
      category_id: category_id as string,
      min_price: min_price ? parseFloat(min_price as string) : undefined,
      max_price: max_price ? parseFloat(max_price as string) : undefined,
      brand: brand ? (Array.isArray(brand) ? brand : [brand]) as string[] : undefined,
      equipment_type: equipment_type ? (Array.isArray(equipment_type) ? equipment_type : [equipment_type]) as string[] : undefined,
      in_stock: in_stock === "true",
    }

    const sort = {
      field: sort_by as "price" | "created_at" | "popularity" | "name",
      order: sort_order as "asc" | "desc",
    }

    const pagination = {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
    }

    const results = await searchService.search(q, filters, sort, pagination)

    return res.json(results)
  } catch (error) {
    console.error("Search error:", error)
    return res.status(500).json({
      error: "Search failed",
      message: error.message,
    })
  }
}
