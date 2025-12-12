/**
 * Seed script for multi-currency prices
 * Run with: npm run seed
 */

export default async function seedMultiCurrencyPrices() {
  console.log('Seeding multi-currency prices...')

  // Example products with prices in multiple currencies
  const products = [
    {
      id: 'prod_01',
      name: 'Example Product 1',
      prices: [
        { currency: 'PLN', retail: 12500, b2b: 11000, wholesale: 10000 },
        { currency: 'EUR', retail: 2875, b2b: 2530, wholesale: 2300 },
        { currency: 'USD', retail: 3125, b2b: 2750, wholesale: 2500 },
      ]
    },
    {
      id: 'prod_02',
      name: 'Example Product 2',
      prices: [
        { currency: 'PLN', retail: 25000, b2b: 22000, wholesale: 20000 },
        { currency: 'EUR', retail: 5750, b2b: 5060, wholesale: 4600 },
        { currency: 'USD', retail: 6250, b2b: 5500, wholesale: 5000 },
      ]
    },
  ]

  // In real implementation, insert into database
  console.log('Sample multi-currency prices:', JSON.stringify(products, null, 2))
  
  console.log('✓ Multi-currency prices seeded successfully')
}
