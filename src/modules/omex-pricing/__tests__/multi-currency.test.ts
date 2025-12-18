import OmexPricingService from '../service'

describe('OmexPricingService - Multi-Currency', () => {
  let service: OmexPricingService

  beforeEach(() => {
    service = new OmexPricingService({} as any)
  })

  describe('convertCurrency', () => {
    it('should convert PLN to EUR correctly', () => {
      const result = service.convertCurrency(10000, 'PLN', 'EUR')
      expect(result).toBe(2300) // 10000 * 0.23
    })

    it('should convert PLN to USD correctly', () => {
      const result = service.convertCurrency(10000, 'PLN', 'USD')
      expect(result).toBe(2500) // 10000 * 0.25
    })

    it('should return same amount for same currency', () => {
      const result = service.convertCurrency(10000, 'PLN', 'PLN')
      expect(result).toBe(10000)
    })

    it('should convert EUR to USD correctly', () => {
      const result = service.convertCurrency(100, 'EUR', 'USD')
      // 100 EUR -> PLN: 100 / 0.23 = 434.78 PLN
      // 434.78 PLN -> USD: 434.78 * 0.25 = 108.70 USD
      expect(result).toBeCloseTo(108.70, 1)
    })

    it('should throw error for invalid currency', () => {
      expect(() => {
        service.convertCurrency(10000, 'PLN', 'INVALID')
      }).toThrow('Invalid currency conversion')
    })

    it('should handle HUF with 0 decimal places', () => {
      const result = service.convertCurrency(10000, 'PLN', 'HUF')
      expect(result).toBe(900000) // 10000 * 90.0, no decimals
    })
  })

  describe('formatPrice', () => {
    it('should format PLN correctly', () => {
      const result = service.formatPrice(12500, 'PLN')
      expect(result).toBe('12500.00 zł')
    })

    it('should format EUR correctly', () => {
      const result = service.formatPrice(2875, 'EUR')
      expect(result).toBe('2875.00 €')
    })

    it('should format USD correctly', () => {
      const result = service.formatPrice(3125, 'USD')
      expect(result).toBe('3125.00 $')
    })

    it('should format HUF without decimals', () => {
      const result = service.formatPrice(900000, 'HUF')
      expect(result).toBe('900000 Ft')
    })

    it('should handle unknown currency gracefully', () => {
      const result = service.formatPrice(10000, 'UNKNOWN')
      expect(result).toBe('10000 UNKNOWN')
    })
  })

  describe('getSupportedCurrencies', () => {
    it('should return all active currencies', async () => {
      const currencies = await service.getSupportedCurrencies()
      
      expect(currencies.length).toBeGreaterThan(0)
      expect(currencies.every(c => c.is_active)).toBe(true)
      
      const codes = currencies.map(c => c.code)
      expect(codes).toContain('PLN')
      expect(codes).toContain('EUR')
      expect(codes).toContain('USD')
    })

    it('should include all required currency properties', async () => {
      const currencies = await service.getSupportedCurrencies()
      
      currencies.forEach(currency => {
        expect(currency).toHaveProperty('code')
        expect(currency).toHaveProperty('name')
        expect(currency).toHaveProperty('symbol')
        expect(currency).toHaveProperty('exchange_rate')
        expect(currency).toHaveProperty('is_active')
        expect(currency).toHaveProperty('decimal_places')
      })
    })
  })

  describe('getPriceInAllCurrencies', () => {
    it('should return prices in all active currencies', async () => {
      // Mock getPriceTiers to return test data
      jest.spyOn(service as any, 'getPriceTiers').mockResolvedValue([
        {
          customer_type: 'retail',
          quantity_min: 1,
          quantity_max: null,
          price: 10000,
          currency_code: 'PLN'
        }
      ])

      const prices = await service.getPriceInAllCurrencies('prod_01', 'retail', 1)
      
      expect(prices).toHaveProperty('PLN')
      expect(prices).toHaveProperty('EUR')
      expect(prices).toHaveProperty('USD')
      
      expect(prices.PLN.amount).toBe(10000)
      expect(prices.PLN.currency).toBe('PLN')
      
      expect(prices.EUR.amount).toBe(2300)
      expect(prices.EUR.currency).toBe('EUR')
    })
  })

  describe('calculateCartTotal with currency', () => {
    it('should calculate cart total in specified currency', async () => {
      const mockCart = {
        items: [
          { product_id: 'prod_01', quantity: 2 },
          { product_id: 'prod_02', quantity: 1 }
        ]
      }

      // Mock getPrice
      jest.spyOn(service, 'getPrice').mockImplementation(async (productId, customerType, quantity, currency) => {
        return {
          amount: productId === 'prod_01' ? 10000 : 20000,
          currency: currency || 'PLN',
          customer_type: customerType,
          quantity
        }
      })

      const total = await service.calculateCartTotal(mockCart, 'retail', 'PLN')
      
      expect(total.currency).toBe('PLN')
      expect(total.subtotal).toBe(40000) // (10000 * 2) + (20000 * 1)
      expect(total.tax).toBe(9200) // 40000 * 0.23
      expect(total.shipping).toBe(15)
      expect(total.total).toBe(49215)
    })

    it('should calculate cart total in EUR', async () => {
      const mockCart = {
        items: [
          { product_id: 'prod_01', quantity: 1 }
        ]
      }

      jest.spyOn(service, 'getPrice').mockResolvedValue({
        amount: 2300,
        currency: 'EUR',
        customer_type: 'retail',
        quantity: 1
      })

      const total = await service.calculateCartTotal(mockCart, 'retail', 'EUR')
      
      expect(total.currency).toBe('EUR')
      expect(total.subtotal).toBe(2300)
    })
  })
})
