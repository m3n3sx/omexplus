/**
 * WooCommerce Order Service
 * 
 * Wysyła zamówienia do sklepów WooCommerce dostawców
 */

interface WooCommerceCredentials {
  store_url: string
  consumer_key: string
  consumer_secret: string
}

interface OrderItem {
  sku: string
  quantity: number
  name?: string
}

interface ShippingAddress {
  first_name?: string
  last_name?: string
  address_1?: string
  address_2?: string
  city?: string
  postal_code?: string
  country_code?: string
  phone?: string
}

interface CreateOrderResult {
  success: boolean
  woo_order_id?: number
  woo_order_number?: string
  error?: string
}

export class WooCommerceOrderService {
  private credentials: WooCommerceCredentials

  constructor(credentials: WooCommerceCredentials) {
    this.credentials = credentials
  }

  /**
   * Tworzy zamówienie w WooCommerce
   */
  async createOrder(
    items: OrderItem[],
    shipping: ShippingAddress,
    note?: string
  ): Promise<CreateOrderResult> {
    try {
      const { store_url, consumer_key, consumer_secret } = this.credentials

      // Build WooCommerce API URL
      const apiUrl = `${store_url}/wp-json/wc/v3/orders`
      
      // Auth header (Basic Auth)
      const auth = Buffer.from(`${consumer_key}:${consumer_secret}`).toString('base64')

      // Find product IDs by SKU
      const lineItems = []
      for (const item of items) {
        const productId = await this.findProductBySku(item.sku)
        if (productId) {
          lineItems.push({
            product_id: productId,
            quantity: item.quantity,
          })
        } else {
          // If product not found, add as custom line item
          lineItems.push({
            name: item.name || item.sku,
            quantity: item.quantity,
            sku: item.sku,
          })
        }
      }

      // Create order payload
      const orderData = {
        status: "processing",
        shipping: {
          first_name: shipping.first_name || "",
          last_name: shipping.last_name || "",
          address_1: shipping.address_1 || "",
          address_2: shipping.address_2 || "",
          city: shipping.city || "",
          postcode: shipping.postal_code || "",
          country: shipping.country_code || "PL",
          phone: shipping.phone || "",
        },
        billing: {
          first_name: shipping.first_name || "",
          last_name: shipping.last_name || "",
          address_1: shipping.address_1 || "",
          city: shipping.city || "",
          postcode: shipping.postal_code || "",
          country: shipping.country_code || "PL",
          phone: shipping.phone || "",
          email: "dropship@omexplus.pl",
        },
        line_items: lineItems,
        customer_note: note || "Zamówienie dropship z OMEX",
        meta_data: [
          { key: "_dropship_order", value: "yes" },
          { key: "_source", value: "omex_medusa" },
        ],
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("WooCommerce API error:", errorText)
        return {
          success: false,
          error: `WooCommerce API error: ${response.status}`,
        }
      }

      const result = await response.json()

      return {
        success: true,
        woo_order_id: result.id,
        woo_order_number: result.number,
      }
    } catch (error: any) {
      console.error("WooCommerce order error:", error)
      return {
        success: false,
        error: error.message,
      }
    }
  }

  /**
   * Znajduje produkt w WooCommerce po SKU
   */
  private async findProductBySku(sku: string): Promise<number | null> {
    try {
      const { store_url, consumer_key, consumer_secret } = this.credentials
      const auth = Buffer.from(`${consumer_key}:${consumer_secret}`).toString('base64')

      const response = await fetch(
        `${store_url}/wp-json/wc/v3/products?sku=${encodeURIComponent(sku)}`,
        {
          headers: {
            "Authorization": `Basic ${auth}`,
          },
        }
      )

      if (!response.ok) return null

      const products = await response.json()
      return products.length > 0 ? products[0].id : null
    } catch {
      return null
    }
  }

  /**
   * Pobiera status zamówienia z WooCommerce
   */
  async getOrderStatus(orderId: number): Promise<{ status: string; tracking?: string } | null> {
    try {
      const { store_url, consumer_key, consumer_secret } = this.credentials
      const auth = Buffer.from(`${consumer_key}:${consumer_secret}`).toString('base64')

      const response = await fetch(
        `${store_url}/wp-json/wc/v3/orders/${orderId}`,
        {
          headers: {
            "Authorization": `Basic ${auth}`,
          },
        }
      )

      if (!response.ok) return null

      const order = await response.json()
      
      // Try to find tracking number in meta data
      const trackingMeta = order.meta_data?.find(
        (m: any) => m.key === "_tracking_number" || m.key === "tracking_number"
      )

      return {
        status: order.status,
        tracking: trackingMeta?.value,
      }
    } catch {
      return null
    }
  }
}

export default WooCommerceOrderService
