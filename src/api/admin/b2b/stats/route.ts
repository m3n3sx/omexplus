import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const query = req.scope.resolve("query")
    
    // Pobierz klientów B2B
    const { data: b2bCustomers } = await query.graph({
      entity: "customer",
      fields: ["id", "email", "first_name", "last_name", "metadata"],
      filters: {
        metadata: {
          is_b2b: true
        }
      }
    })

    // Oblicz statystyki
    let totalCreditLimit = 0
    let totalRevenue = 0
    
    b2bCustomers.forEach((customer: any) => {
      if (customer.metadata?.credit_limit) {
        totalCreditLimit += parseInt(customer.metadata.credit_limit)
      }
    })

    res.json({
      stats: {
        companies: b2bCustomers.length,
        quotes: 0, // TODO: Implement quotes
        purchaseOrders: 0, // TODO: Implement POs
        totalRevenue: totalRevenue,
        totalCreditLimit: totalCreditLimit
      }
    })
  } catch (error: any) {
    console.error("Error fetching B2B stats:", error)
    res.status(500).json({
      error: error.message || "Failed to fetch B2B stats"
    })
  }
}
