import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { productIds } = req.body
  
  // Porównywanie produktów
  const comparison = {
    products: [],
    attributes: [],
  }
  
  res.json({ comparison })
}
