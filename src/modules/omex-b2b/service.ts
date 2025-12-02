import { MedusaService } from "@medusajs/framework/utils"

interface PricingTier {
  qty_min: number
  qty_max: number | null
  price: number
  discount_percentage?: number
}

interface QuoteItem {
  product_id: string
  quantity: number
  unit_price: number
  total: number
}

interface CreateQuoteDTO {
  customer_id: string
  items: QuoteItem[]
  valid_until?: Date
  notes?: string
}

interface CreatePurchaseOrderDTO {
  customer_id: string
  po_number: string
  items: QuoteItem[]
  payment_terms?: string
  delivery_date?: Date
  notes?: string
}

class B2BService extends MedusaService({}) {
  /**
   * Get pricing tier for a product based on quantity
   */
  async getPricingTier(productId: string, quantity: number): Promise<{ price: number; discount: number }> {
    if (!productId || quantity <= 0) {
      throw new Error("Valid product ID and quantity are required")
    }

    // In real implementation, fetch product with b2b_pricing_tiers
    const product: any = {} // Would be populated from query

    const tiers: PricingTier[] = product.b2b_pricing_tiers || []

    // Find applicable tier
    const applicableTier = tiers.find(
      tier => quantity >= tier.qty_min && (tier.qty_max === null || quantity <= tier.qty_max)
    )

    if (applicableTier) {
      return {
        price: applicableTier.price,
        discount: applicableTier.discount_percentage || 0,
      }
    }

    // Return base price if no tier matches
    return {
      price: product.price || 0,
      discount: 0,
    }
  }

  /**
   * Calculate B2B pricing for multiple items
   */
  async calculateB2BPricing(items: Array<{ product_id: string; quantity: number }>) {
    const pricedItems = []
    let totalAmount = 0

    for (const item of items) {
      const pricing = await this.getPricingTier(item.product_id, item.quantity)
      const itemTotal = pricing.price * item.quantity

      pricedItems.push({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: pricing.price,
        discount_percentage: pricing.discount,
        total: itemTotal,
      })

      totalAmount += itemTotal
    }

    return {
      items: pricedItems,
      total_amount: totalAmount,
    }
  }

  /**
   * Create a quote for B2B customer
   */
  async createQuote(data: CreateQuoteDTO) {
    if (!data.customer_id || !data.items || data.items.length === 0) {
      throw new Error("Customer ID and items are required")
    }

    // Calculate total
    const totalAmount = data.items.reduce((sum, item) => sum + item.total, 0)

    // Set default valid_until (30 days from now)
    const validUntil = data.valid_until || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    const quoteData = {
      id: `quote_${Date.now()}`,
      customer_id: data.customer_id,
      items: data.items,
      total_amount: totalAmount,
      valid_until: validUntil,
      status: "draft",
      notes: data.notes,
      created_at: new Date(),
      updated_at: new Date(),
    }

    // In real implementation, save to database
    return quoteData
  }

  /**
   * Update quote status
   */
  async updateQuoteStatus(quoteId: string, status: "draft" | "sent" | "accepted" | "rejected" | "expired") {
    if (!quoteId) {
      throw new Error("Quote ID is required")
    }

    const validStatuses = ["draft", "sent", "accepted", "rejected", "expired"]
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(", ")}`)
    }

    // In real implementation, update in database
    return {
      id: quoteId,
      status,
      updated_at: new Date(),
    }
  }

  /**
   * Get quotes for a customer
   */
  async getCustomerQuotes(customerId: string, filters: { status?: string } = {}) {
    if (!customerId) {
      throw new Error("Customer ID is required")
    }

    // In real implementation, query database
    return {
      quotes: [],
      count: 0,
    }
  }

  /**
   * Create a purchase order
   */
  async createPurchaseOrder(data: CreatePurchaseOrderDTO) {
    if (!data.customer_id || !data.po_number || !data.items || data.items.length === 0) {
      throw new Error("Customer ID, PO number, and items are required")
    }

    // Check if PO number already exists
    const existing = await this.findPurchaseOrderByNumber(data.po_number)
    if (existing) {
      throw new Error(`Purchase order with number "${data.po_number}" already exists`)
    }

    // Calculate total
    const totalAmount = data.items.reduce((sum, item) => sum + item.total, 0)

    const poData = {
      id: `po_${Date.now()}`,
      customer_id: data.customer_id,
      po_number: data.po_number,
      items: data.items,
      total_amount: totalAmount,
      payment_terms: data.payment_terms || "NET30",
      delivery_date: data.delivery_date,
      status: "pending",
      notes: data.notes,
      created_at: new Date(),
      updated_at: new Date(),
    }

    // In real implementation, save to database
    return poData
  }

  /**
   * Update purchase order status
   */
  async updatePurchaseOrderStatus(
    poId: string,
    status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  ) {
    if (!poId) {
      throw new Error("Purchase order ID is required")
    }

    const validStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(", ")}`)
    }

    // In real implementation, update in database
    return {
      id: poId,
      status,
      updated_at: new Date(),
    }
  }

  /**
   * Get purchase orders for a customer
   */
  async getCustomerPurchaseOrders(customerId: string, filters: { status?: string } = {}) {
    if (!customerId) {
      throw new Error("Customer ID is required")
    }

    // In real implementation, query database
    return {
      purchase_orders: [],
      count: 0,
    }
  }

  /**
   * Find purchase order by PO number
   */
  async findPurchaseOrderByNumber(poNumber: string) {
    if (!poNumber) {
      return null
    }

    // In real implementation, query database
    return null
  }

  /**
   * Validate B2B order (check min quantities, stock, etc.)
   */
  async validateB2BOrder(items: Array<{ product_id: string; quantity: number }>) {
    const errors: string[] = []
    const warnings: string[] = []

    for (const item of items) {
      // In real implementation, fetch product from database
      const product: any = {} // Would be populated from query

      // Check minimum quantity
      if (product.b2b_min_quantity && item.quantity < product.b2b_min_quantity) {
        errors.push(
          `Product ${item.product_id} requires minimum quantity of ${product.b2b_min_quantity}`
        )
      }

      // Check stock availability
      if (product.stock_available < item.quantity) {
        warnings.push(
          `Product ${item.product_id} has only ${product.stock_available} units available (requested: ${item.quantity})`
        )
      }

      // Check if quote is required
      if (product.requires_quote) {
        warnings.push(`Product ${item.product_id} requires a custom quote`)
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    }
  }

  /**
   * Create or update B2B customer group
   */
  async createCustomerGroup(data: {
    name: string
    discount_percentage?: number
    min_order_value?: number
    payment_terms?: string
    custom_catalog_ids?: string[]
  }) {
    if (!data.name) {
      throw new Error("Customer group name is required")
    }

    const groupData = {
      id: `b2b_group_${Date.now()}`,
      name: data.name,
      discount_percentage: data.discount_percentage || 0,
      min_order_value: data.min_order_value || 0,
      payment_terms: data.payment_terms || "NET30",
      custom_catalog_ids: data.custom_catalog_ids || [],
      created_at: new Date(),
      updated_at: new Date(),
    }

    // In real implementation, save to database
    return groupData
  }

  /**
   * Get customer group discount
   */
  async getCustomerGroupDiscount(customerId: string): Promise<number> {
    if (!customerId) {
      return 0
    }

    // In real implementation, fetch customer's group and return discount
    return 0
  }
}

export default B2BService
