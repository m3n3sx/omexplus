import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import WooCommerceOrderService from "../services/woocommerce-order.service"

/**
 * Subscriber: Dropship Order Handler
 * 
 * Gdy zamówienie zostanie złożone:
 * 1. Sprawdza czy zawiera produkty od dostawców
 * 2. Tworzy zamówienia w WooCommerce dostawców
 * 3. Zapisuje w tabeli supplier_order
 */

export default async function dropshipOrderHandler({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const knex = container.resolve(ContainerRegistrationKeys.PG_CONNECTION)
  const orderId = event.data.id

  try {
    console.log(`🛒 Processing dropship order: ${orderId}`)

    // Get order
    const order = await knex("order").where("id", orderId).first()
    if (!order) return

    // Get shipping address
    const shippingAddress = await knex("order_address")
      .where("id", order.shipping_address_id)
      .first()

    // Get order items
    const orderItems = await knex("order_line_item")
      .where("order_id", orderId)

    // Group items by supplier
    const supplierItems: Map<string, { supplier: any; items: any[]; products: any[] }> = new Map()

    for (const item of orderItems) {
      // Get product with metadata
      const product = await knex("product")
        .where("id", item.product_id)
        .first()

      if (!product?.metadata) continue

      const metadata = typeof product.metadata === 'string' 
        ? JSON.parse(product.metadata) 
        : product.metadata

      if (!metadata.supplier_id) continue

      const supplierId = metadata.supplier_id

      if (!supplierItems.has(supplierId)) {
        const supplier = await knex("supplier").where("id", supplierId).first()
        if (!supplier || !supplier.is_dropship) continue
        
        supplierItems.set(supplierId, { supplier, items: [], products: [] })
      }

      const group = supplierItems.get(supplierId)!
      group.items.push(item)
      group.products.push({
        sku: metadata.supplier_sku,
        quantity: item.quantity,
        name: product.title,
        unit_price: item.unit_price,
      })
    }

    // Process each supplier
    for (const [supplierId, { supplier, items, products }] of supplierItems) {
      // Check if supplier order already exists
      const existing = await knex("supplier_order")
        .where("order_id", orderId)
        .where("supplier_id", supplierId)
        .first()

      if (existing) continue

      // Calculate totals
      let supplierTotal = 0
      for (const p of products) {
        const sp = await knex("supplier_product")
          .where("supplier_id", supplierId)
          .where("supplier_sku", p.sku)
          .first()
        supplierTotal += (sp?.supplier_price || 0) * p.quantity
      }

      const orderTotal = items.reduce((sum, i) => sum + (i.unit_price * i.quantity), 0)
      const yourMargin = orderTotal - supplierTotal

      // Create supplier order record
      const supplierOrderId = `so_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
      
      await knex("supplier_order").insert({
        id: supplierOrderId,
        supplier_id: supplierId,
        order_id: orderId,
        status: "pending",
        supplier_total: supplierTotal,
        your_margin: yourMargin,
        notes: JSON.stringify({ items: products }),
        created_at: new Date(),
        updated_at: new Date(),
      })

      console.log(`📦 Created supplier order ${supplierOrderId} for ${supplier.name}`)

      // Try to send to WooCommerce if credentials exist
      if (supplier.api_url && supplier.api_key) {
        try {
          // Parse credentials from api_key (format: consumer_key:consumer_secret)
          const [consumer_key, consumer_secret] = (supplier.api_key || "").split(":")
          
          if (consumer_key && consumer_secret) {
            const wooService = new WooCommerceOrderService({
              store_url: supplier.api_url.replace("/wp-json/wc/v3", "").replace("/api/supplier-feed.php", ""),
              consumer_key,
              consumer_secret,
            })

            const result = await wooService.createOrder(
              products.map(p => ({ sku: p.sku, quantity: p.quantity, name: p.name })),
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
              `Zamówienie OMEX #${order.display_id}`
            )

            if (result.success) {
              await knex("supplier_order").where("id", supplierOrderId).update({
                supplier_order_id: String(result.woo_order_id),
                status: "sent",
                sent_at: new Date(),
                updated_at: new Date(),
              })
              console.log(`✅ Sent to WooCommerce: order #${result.woo_order_number}`)
            } else {
              console.error(`❌ WooCommerce error: ${result.error}`)
            }
          }
        } catch (wooError: any) {
          console.error(`WooCommerce send error: ${wooError.message}`)
        }
      }
    }
  } catch (error) {
    console.error("Dropship order handler error:", error)
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
