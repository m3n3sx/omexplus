import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

/**
 * GET /admin/suppliers/stats - Statystyki dropshippingu
 */

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const knex = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)

    // Total suppliers
    const totalSuppliers = await knex("supplier")
      .count("id as count")
      .first()

    // Active suppliers
    const activeSuppliers = await knex("supplier")
      .where("is_active", true)
      .count("id as count")
      .first()

    // Dropship suppliers
    const dropshipSuppliers = await knex("supplier")
      .where("is_dropship", true)
      .where("is_active", true)
      .count("id as count")
      .first()

    // Total dropship products
    const totalProducts = await knex("supplier_product")
      .where("is_active", true)
      .count("id as count")
      .first()

    // Pending supplier orders
    const pendingOrders = await knex("supplier_order")
      .whereIn("status", ["pending", "sent", "confirmed"])
      .count("id as count")
      .first()

    // Monthly revenue from dropship (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const monthlyRevenue = await knex("supplier_order")
      .where("status", "delivered")
      .where("delivered_at", ">=", thirtyDaysAgo)
      .sum("your_margin as total")
      .first()

    // Top suppliers by orders
    const topSuppliers = await knex("supplier")
      .select("id", "name", "code", "orders_count", "products_count")
      .where("is_active", true)
      .orderBy("orders_count", "desc")
      .limit(5)

    // Recent supplier orders
    const recentOrders = await knex("supplier_order")
      .select("supplier_order.*", "supplier.name as supplier_name")
      .leftJoin("supplier", "supplier_order.supplier_id", "supplier.id")
      .orderBy("supplier_order.created_at", "desc")
      .limit(10)

    // Orders by status
    const ordersByStatus = await knex("supplier_order")
      .select("status")
      .count("id as count")
      .groupBy("status")

    res.json({
      stats: {
        total_suppliers: parseInt(totalSuppliers?.count || "0"),
        active_suppliers: parseInt(activeSuppliers?.count || "0"),
        dropship_suppliers: parseInt(dropshipSuppliers?.count || "0"),
        total_dropship_products: parseInt(totalProducts?.count || "0"),
        pending_supplier_orders: parseInt(pendingOrders?.count || "0"),
        monthly_dropship_margin: parseInt(monthlyRevenue?.total || "0"),
      },
      top_suppliers: topSuppliers,
      recent_orders: recentOrders,
      orders_by_status: ordersByStatus.reduce((acc: any, item: any) => {
        acc[item.status] = parseInt(item.count)
        return acc
      }, {}),
    })
  } catch (error: any) {
    console.error("Error getting supplier stats:", error)
    res.status(500).json({ message: error.message })
  }
}
