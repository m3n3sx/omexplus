import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

/**
 * GET /admin/supplier-orders
 * 
 * Lista wszystkich zamówień do dostawców
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const knex = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)
    const { supplier_id, status, limit = 50, offset = 0 } = req.query

    let query = knex("supplier_order as so")
      .select(
        "so.*",
        "s.name as supplier_name",
        "s.code as supplier_code",
        "o.display_id as order_display_id",
        "o.email as customer_email"
      )
      .leftJoin("supplier as s", "so.supplier_id", "s.id")
      .leftJoin("order as o", "so.order_id", "o.id")

    if (supplier_id) {
      query = query.where("so.supplier_id", supplier_id)
    }

    if (status) {
      query = query.where("so.status", status)
    }

    const countQuery = knex("supplier_order")
    if (supplier_id) countQuery.where("supplier_id", supplier_id)
    if (status) countQuery.where("status", status)
    const countResult = await countQuery.count("id as c").first()

    const orders = await query
      .orderBy("so.created_at", "desc")
      .limit(Number(limit))
      .offset(Number(offset))

    // Parse notes JSON
    const ordersWithItems = orders.map(o => ({
      ...o,
      items: typeof o.notes === 'string' ? JSON.parse(o.notes)?.items : o.notes?.items,
    }))

    res.json({
      supplier_orders: ordersWithItems,
      count: parseInt(String(countResult?.c || 0)),
      limit: Number(limit),
      offset: Number(offset),
    })
  } catch (error: any) {
    console.error("List supplier orders error:", error)
    res.status(500).json({ message: error.message })
  }
}
