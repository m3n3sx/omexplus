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
      fields: [
        "id",
        "email",
        "first_name",
        "last_name",
        "phone",
        "metadata",
        "created_at",
        "updated_at"
      ],
      filters: {
        metadata: {
          is_b2b: true
        }
      }
    })

    res.json({
      companies: b2bCustomers,
      count: b2bCustomers.length
    })
  } catch (error: any) {
    console.error("Error fetching B2B companies:", error)
    res.status(500).json({
      error: error.message || "Failed to fetch B2B companies"
    })
  }
}
