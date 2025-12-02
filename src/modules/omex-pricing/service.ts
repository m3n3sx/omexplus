import { MedusaService } from "@medusajs/framework/utils"

type CustomerType = 'retail' | 'b2b' | 'wholesale'

interface PriceTier {
  customer_type: CustomerType
  quantity_min: number
  quantity_max?: number
  price: number
}

interface Price {
  amount: number
  currency: string
  customer_type: CustomerType
  quantity: number
}

class OmexPricingService extends MedusaService({}) {
  async getPrice(productId: string, customerType: CustomerType, quantity: number): Promise<Price> {
    if (!productId) {
      throw new Error("Product ID is required")
    }

    if (quantity < 1) {
      throw new Error("Quantity must be at least 1")
    }

    // In real implementation, fetch price tiers from database
    const tiers = await this.getPriceTiers(productId, customerType)

    // Find applicable tier based on quantity
    const applicableTier = this.findApplicableTier(tiers, quantity)

    if (!applicableTier) {
      throw new Error(`No price tier found for product ${productId}, customer type ${customerType}, quantity ${quantity}`)
    }

    return {
      amount: applicableTier.price,
      currency: 'PLN',
      customer_type: customerType,
      quantity,
    }
  }

  async setTieredPricing(productId: string, tiers: PriceTier[]) {
    if (!productId) {
      throw new Error("Product ID is required")
    }

    if (!tiers || tiers.length === 0) {
      throw new Error("At least one price tier is required")
    }

    // Validate tiers
    for (const tier of tiers) {
      if (tier.quantity_min < 1) {
        throw new Error("Minimum quantity must be at least 1")
      }

      if (tier.quantity_max && tier.quantity_max < tier.quantity_min) {
        throw new Error("Maximum quantity must be greater than minimum quantity")
      }

      if (tier.price <= 0) {
        throw new Error("Price must be greater than 0")
      }
    }

    // Check for overlapping tiers
    this.validateNoOverlaps(tiers)

    return {
      product_id: productId,
      tiers,
      updated_at: new Date(),
    }
  }

  async calculateCartTotal(cart: any, customerType: CustomerType) {
    if (!cart || !cart.items || cart.items.length === 0) {
      return {
        subtotal: 0,
        tax: 0,
        shipping: 0,
        total: 0,
      }
    }

    let subtotal = 0

    for (const item of cart.items) {
      const price = await this.getPrice(item.product_id, customerType, item.quantity)
      subtotal += price.amount * item.quantity
    }

    // Apply wholesale discount if applicable
    if (customerType === 'wholesale') {
      subtotal = this.applyWholesaleDiscount(subtotal)
    }

    const tax = subtotal * 0.23 // 23% VAT in Poland
    const shipping = this.calculateShipping(cart)

    return {
      subtotal,
      tax,
      shipping,
      total: subtotal + tax + shipping,
    }
  }

  async applyDiscount(amount: number, discountCode: string): Promise<number> {
    if (!discountCode) {
      return amount
    }

    // In real implementation, fetch discount from database
    // For now, return original amount
    return amount
  }

  private async getPriceTiers(productId: string, customerType: CustomerType): Promise<PriceTier[]> {
    // In real implementation, fetch from price_tier table
    // WHERE product_id = productId AND customer_type = customerType
    return []
  }

  private findApplicableTier(tiers: PriceTier[], quantity: number): PriceTier | null {
    for (const tier of tiers) {
      const meetsMin = quantity >= tier.quantity_min
      const meetsMax = !tier.quantity_max || quantity <= tier.quantity_max

      if (meetsMin && meetsMax) {
        return tier
      }
    }

    return null
  }

  private validateNoOverlaps(tiers: PriceTier[]) {
    // Sort tiers by quantity_min
    const sorted = [...tiers].sort((a, b) => a.quantity_min - b.quantity_min)

    for (let i = 0; i < sorted.length - 1; i++) {
      const current = sorted[i]
      const next = sorted[i + 1]

      if (current.quantity_max && current.quantity_max >= next.quantity_min) {
        throw new Error(
          `Overlapping price tiers: [${current.quantity_min}-${current.quantity_max}] and [${next.quantity_min}-${next.quantity_max || '∞'}]`
        )
      }
    }
  }

  private applyWholesaleDiscount(amount: number): number {
    // Apply 10% wholesale discount
    return amount * 0.9
  }

  private calculateShipping(cart: any): number {
    // Simple shipping calculation
    // In real implementation, integrate with shipping providers
    return 15 // Fixed 15 PLN shipping
  }
}

export default OmexPricingService
