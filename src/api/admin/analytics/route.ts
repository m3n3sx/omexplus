import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  // Analityka dla admina
  const analytics = {
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    topProducts: [],
    recentOrders: [],
  }
  
  res.json({ analytics })
}
