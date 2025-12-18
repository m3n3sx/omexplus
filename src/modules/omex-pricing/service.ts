import { MedusaService } from "@medusajs/framework/utils"

type CustomerType = 'retail' | 'b2b' | 'wholesale'

interface PriceTier {
  customer_type: CustomerType
  quantity_min: number
  quantity_max?: number
  price: number
  currency_code?: string
}

interface Price {
  amount: number
  currency: string
  customer_type: CustomerType
  quantity: number
}

interface CurrencyRate {
  code: string
  name: string
  symbol: string
  exchange_rate: number
  is_active: boolean
  decimal_places: number
}

// Supported currencies with exchange rates (relative to PLN)
const DEFAULT_CURRENCIES: Record<string, CurrencyRate> = {
  PLN: { code: 'PLN', name: 'Polish Złoty', symbol: 'zł', exchange_rate: 1.0, is_active: true, decimal_places: 2 },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', exchange_rate: 0.23, is_active: true, decimal_places: 2 },
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', exchange_rate: 0.25, is_active: true, decimal_places: 2 },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', exchange_rate: 0.20, is_active: true, decimal_places: 2 },
  CZK: { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', exchange_rate: 5.70, is_active: true, decimal_places: 2 },
  SEK: { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', exchange_rate: 2.60, is_active: true, decimal_places: 2 },
  NOK: { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', exchange_rate: 2.70, is_active: true, decimal_places: 2 },
  DKK: { code: 'DKK', name: 'Danish Krone', symbol: 'kr', exchange_rate: 1.70, is_active: true, decimal_places: 2 },
  CHF: { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', exchange_rate: 0.22, is_active: true, decimal_places: 2 },
  HUF: { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', exchange_rate: 90.0, is_active: true, decimal_places: 0 },
  RON: { code: 'RON', name: 'Romanian Leu', symbol: 'lei', exchange_rate: 1.15, is_active: true, decimal_places: 2 },
}

class OmexPricingService extends MedusaService({}) {
  async getPrice(
    productId: string, 
    customerType: CustomerType, 
    quantity: number,
    currencyCode: string = 'PLN'
  ): Promise<Price> {
    if (!productId) {
      throw new Error("Product ID is required")
    }

    if (quantity < 1) {
      throw new Error("Quantity must be at least 1")
    }

    // Validate currency
    if (!DEFAULT_CURRENCIES[currencyCode]) {
      throw new Error(`Unsupported currency: ${currencyCode}`)
    }

    // In real implementation, fetch price tiers from database
    const tiers = await this.getPriceTiers(productId, customerType)

    // Find applicable tier based on quantity
    const applicableTier = this.findApplicableTier(tiers, quantity)

    if (!applicableTier) {
      throw new Error(`No price tier found for product ${productId}, customer type ${customerType}, quantity ${quantity}`)
    }

    // Convert price to requested currency
    const baseCurrency = applicableTier.currency_code || 'PLN'
    const convertedPrice = this.convertCurrency(applicableTier.price, baseCurrency, currencyCode)

    return {
      amount: convertedPrice,
      currency: currencyCode,
      customer_type: customerType,
      quantity,
    }
  }

  async getPriceInAllCurrencies(
    productId: string,
    customerType: CustomerType,
    quantity: number
  ): Promise<Record<string, Price>> {
    const prices: Record<string, Price> = {}

    for (const currencyCode of Object.keys(DEFAULT_CURRENCIES)) {
      if (DEFAULT_CURRENCIES[currencyCode].is_active) {
        try {
          prices[currencyCode] = await this.getPrice(productId, customerType, quantity, currencyCode)
        } catch (error) {
          console.error(`Failed to get price in ${currencyCode}:`, error)
        }
      }
    }

    return prices
  }

  async getSupportedCurrencies(): Promise<CurrencyRate[]> {
    return Object.values(DEFAULT_CURRENCIES).filter(c => c.is_active)
  }

  convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
    if (fromCurrency === toCurrency) {
      return amount
    }

    const fromRate = DEFAULT_CURRENCIES[fromCurrency]?.exchange_rate
    const toRate = DEFAULT_CURRENCIES[toCurrency]?.exchange_rate

    if (!fromRate || !toRate) {
      throw new Error(`Invalid currency conversion: ${fromCurrency} to ${toCurrency}`)
    }

    // Convert to PLN first, then to target currency
    const amountInPLN = amount / fromRate
    const convertedAmount = amountInPLN * toRate

    // Round to appropriate decimal places
    const decimalPlaces = DEFAULT_CURRENCIES[toCurrency].decimal_places
    return Math.round(convertedAmount * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces)
  }

  formatPrice(amount: number, currencyCode: string): string {
    const currency = DEFAULT_CURRENCIES[currencyCode]
    if (!currency) {
      return `${amount} ${currencyCode}`
    }

    const formatted = amount.toFixed(currency.decimal_places)
    return `${formatted} ${currency.symbol}`
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

  async calculateCartTotal(cart: any, customerType: CustomerType, currencyCode: string = 'PLN') {
    if (!cart || !cart.items || cart.items.length === 0) {
      return {
        subtotal: 0,
        tax: 0,
        shipping: 0,
        total: 0,
        currency: currencyCode,
      }
    }

    let subtotal = 0

    for (const item of cart.items) {
      const price = await this.getPrice(item.product_id, customerType, item.quantity, currencyCode)
      subtotal += price.amount * item.quantity
    }

    // Apply wholesale discount if applicable
    if (customerType === 'wholesale') {
      subtotal = this.applyWholesaleDiscount(subtotal)
    }

    const tax = subtotal * 0.23 // 23% VAT in Poland
    const shipping = this.calculateShipping(cart, currencyCode)

    return {
      subtotal,
      tax,
      shipping,
      total: subtotal + tax + shipping,
      currency: currencyCode,
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

  private calculateShipping(cart: any, currencyCode: string = 'PLN'): number {
    // Simple shipping calculation
    // In real implementation, integrate with shipping providers
    const baseCost = 15 // Fixed 15 PLN shipping
    return this.convertCurrency(baseCost, 'PLN', currencyCode)
  }
}

export default OmexPricingService
