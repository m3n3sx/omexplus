import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import WooCommerceOrderService from "../../../../../services/woocommerce-order.service"

/**
 * POST /admin/supplier-orders/:id/send
 * 
 * Ręcznie wysyła zamówienie do dostawcy WooCommerce
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const knex = req.scope.resolve(ContainerRegistrationKeys.PG_CONNECTION)
    const { id } = req.params

    // Get supplier order
    const supplierOrder = await knex("supplier_order").where("id", id).first()
    if (!supplierOrder) {
      return res.status(404).json({ message: "Supplier order not found" })
    }

    if (supplierOrder.status === "sent" || supplierOrder.supplier_order_id) {
      return res.status(400).json({ message: "Order already sent to supplier" })
    }

    // Get supplier
    const supplier = await knex("supplier").where("id", supplierOrder.supplier_id).first()
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" })
    }

    // Check credentials
    if (!supplier.api_key) {
      return res.status(400).json({ message: "Supplier has no WooCommerce API credentials" })
    }

    const [consumer_key, consumer_secret] = supplier.api_key.split(":")
    if (!consumer_key || !consumer_secret) {
      return res.status(400).json({ message: "Invalid API credentials format (expected key:secret)" })
    }

    // Get original order for shipping address
    const order = await knex("order").where("id", supplierOrder.order_id).first()
    const shippingAddress = order?.shipping_address_id 
      ? await knex("order_address").where("id", order.shipping_address_id).first()
      : null

    // Parse items from notes
    const notes = typeof supplierOrder.notes === 'string' 
      ? JSON.parse(supplierOrder.notes) 
      : supplierOrder.notes
    const items = notes?.items || []

    // Send to WooCommerce
    const wooService = new WooCommerceOrderService({
      store_url: supplier.api_url?.replace("/wp-json/wc/v3", "").replace("/api/supplier-feed.php", "") || "",
      consumer_key,
      consumer_secret,
    })

    const result = await wooService.createOrder(
      items.map((i: any) => ({ sku: i.sku, quantity: i.quantity, name: i.name })),
      {
        first_name: shippingAddress?.first_name,
        last_name: shippingAddress?.last_name,
        address_1: shippingAddress?.address_1,
        address_2: shippingAddress?.address_2,
        city: shippingAddress?.city,
        postal_code: shippingAddress?.postal_code,
        country_code: shippingAddress?.country_code,
        phone: shippingAddress?.phone,
      },
      `Zamówienie OMEX #${order?.display_id || supplierOrder.order_id}`
    )

    if (result.success) {
      await knex("supplier_order").where("id", id).update({
        supplier_order_id: String(result.woo_order_id),
        status: "sent",
        sent_at: new Date(),
        updated_at: new Date(),
      })

      res.json({
        success: true,
        message: `Zamówienie wysłane do ${supplier.name}`,
        woo_order_id: result.woo_order_id,
        woo_order_number: result.woo_order_number,
      })
    } else {
      res.status(500).json({
        success: false,
        message: result.error || "Failed to send order",
      })
    }
  } catch (error: any) {
    console.error("Send supplier order error:", error)
    res.status(500).json({ message: error.message })
  }
}
