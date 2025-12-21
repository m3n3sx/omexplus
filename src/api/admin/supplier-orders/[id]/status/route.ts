import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import WooCommerceOrderService from "../../../../../services/woocommerce-order.service"

/**
 * GET /admin/supplier-orders/:id/status
 * 
 * Sprawdza status zamówienia u dostawcy i aktualizuje tracking
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const knex = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)
    const { id } = req.params

    const supplierOrder = await knex("supplier_order").where("id", id).first()
    if (!supplierOrder) {
      return res.status(404).json({ message: "Supplier order not found" })
    }

    if (!supplierOrder.supplier_order_id) {
      return res.status(400).json({ message: "Order not yet sent to supplier" })
    }

    const supplier = await knex("supplier").where("id", supplierOrder.supplier_id).first()
    if (!supplier?.api_key) {
      return res.status(400).json({ message: "No API credentials" })
    }

    const [consumer_key, consumer_secret] = supplier.api_key.split(":")

    const wooService = new WooCommerceOrderService({
      store_url: supplier.api_url?.replace("/wp-json/wc/v3", "").replace("/api/supplier-feed.php", "") || "",
      consumer_key,
      consumer_secret,
    })

    const result = await wooService.getOrderStatus(parseInt(supplierOrder.supplier_order_id))

    if (result) {
      // Map WooCommerce status to our status
      const statusMap: Record<string, string> = {
        "pending": "pending",
        "processing": "confirmed",
        "on-hold": "pending",
        "completed": "delivered",
        "shipped": "shipped",
        "cancelled": "cancelled",
        "refunded": "cancelled",
      }

      const newStatus = statusMap[result.status] || supplierOrder.status

      // Update if changed
      const updates: any = { updated_at: new Date() }
      
      if (newStatus !== supplierOrder.status) {
        updates.status = newStatus
        if (newStatus === "confirmed") updates.confirmed_at = new Date()
        if (newStatus === "shipped") updates.shipped_at = new Date()
        if (newStatus === "delivered") updates.delivered_at = new Date()
      }

      if (result.tracking && result.tracking !== supplierOrder.tracking_number) {
        updates.tracking_number = result.tracking
      }

      await knex("supplier_order").where("id", id).update(updates)

      res.json({
        success: true,
        woo_status: result.status,
        status: newStatus,
        tracking_number: result.tracking || supplierOrder.tracking_number,
      })
    } else {
      res.status(500).json({ message: "Could not fetch order status" })
    }
  } catch (error: any) {
    console.error("Check status error:", error)
    res.status(500).json({ message: error.message })
  }
}
