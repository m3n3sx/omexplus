import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { productId, customerId } = req.query
  
  // Rekomendacje produktów
  const recommendations = {
    products: [],
    reason: "based_on_history",
  }
  
  res.json({ recommendations })
}
