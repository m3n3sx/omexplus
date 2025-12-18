import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const query = req.scope.resolve("query")
    
    const { data: orders } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "display_id",
        "status",
        "email",
        "total",
        "currency_code",
        "created_at",
        "summary.*",
        "fulfillments.*",
      ],
      pagination: {
        take: 3
      }
    })
    
    res.json({
      count: orders.length,
      orders: orders.map((o: any) => ({
        id: o.id,
        display_id: o.display_id,
        status: o.status,
        email: o.email,
        total: o.total,
        summary: o.summary,
        has_summary: !!o.summary,
        fulfillments: o.fulfillments,
        has_fulfillments: !!o.fulfillments && o.fulfillments.length > 0,
      }))
    })
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
      stack: error.stack
    })
  }
}
