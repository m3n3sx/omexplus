import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

/**
 * GET /admin/suppliers/:id/orders - Lista zamówień do dostawcy
 * POST /admin/suppliers/:id/orders - Utwórz zamówienie do dostawcy
 */

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const knex = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)
    const { id } = req.params
    const { status, limit = 50, offset = 0 } = req.query

    // Verify supplier exists
    const supplier = await knex("supplier").where("id", id).first()
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" })
    }

    let query = knex("supplier_order").where("supplier_id", id)

    if (status) {
      query = query.where("status", status)
    }

    const countResult = await query.clone().count("id as count").first()
    const count = parseInt(countResult?.count || "0")

    const orders = await query
      .orderBy("created_at", "desc")
      .limit(Number(limit))
      .offset(Number(offset))

    // Get Medusa order details
    const orderIds = orders.map((o: any) => o.order_id).filter(Boolean)
    let medusaOrders: any[] = []

    if (orderIds.length > 0) {
      medusaOrders = await knex("order")
        .whereIn("id", orderIds)
        .select("id", "display_id", "email", "created_at", "status")
    }

    // Merge data
    const enrichedOrders = orders.map((so: any) => {
      const medusaOrder = medusaOrders.find(o => o.id === so.order_id)
      return {
        ...so,
        order: medusaOrder || null,
      }
    })

    res.json({
      orders: enrichedOrders,
      count,
      limit: Number(limit),
      offset: Number(offset),
    })
  } catch (error: any) {
    console.error("Error listing supplier orders:", error)
    res.status(500).json({ message: error.message })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const knex = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)
    const { id } = req.params
    const data = req.body as any

    // Verify supplier exists
    const supplier = await knex("supplier").where("id", id).first()
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" })
    }

    if (!data.order_id || data.supplier_total === undefined) {
      return res.status(400).json({ 
        message: "order_id and supplier_total are required" 
      })
    }

    // Verify Medusa order exists
    const order = await knex("order").where("id", data.order_id).first()
    if (!order) {
      return res.status(400).json({ message: "Order not found in Medusa" })
    }

    // Check if supplier order already exists for this order
    const existing = await knex("supplier_order")
      .where("supplier_id", id)
      .where("order_id", data.order_id)
      .first()

    if (existing) {
      return res.status(400).json({ 
        message: "Supplier order already exists for this order" 
      })
    }

    const soId = `so_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`

    const supplierOrder = {
      id: soId,
      supplier_id: id,
      order_id: data.order_id,
      status: "pending",
      supplier_total: Math.round(data.supplier_total * 100),
      your_margin: data.your_margin ? Math.round(data.your_margin * 100) : 0,
      notes: data.notes || null,
      created_at: new Date(),
      updated_at: new Date(),
    }

    await knex("supplier_order").insert(supplierOrder)

    // Update supplier orders count
    await knex("supplier")
      .where("id", id)
      .increment("orders_count", 1)

    res.status(201).json({ 
      supplier_order: {
        ...supplierOrder,
        order,
      }
    })
  } catch (error: any) {
    console.error("Error creating supplier order:", error)
    res.status(500).json({ message: error.message })
  }
}
