import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { q, category, minPrice, maxPrice } = req.query
  
  // Wyszukiwanie produktów
  const results = {
    products: [],
    total: 0,
    query: q,
  }
  
  res.json(results)
}
