import medusaClient from './medusa'

export async function getProducts(limit = 8) {
  try {
    const { products } = await medusaClient.products.list({
      limit,
      region_id: 'reg_01KBDXHQAFG1GS7F3WH2680KP0', // EUR region
    })
    return products || []
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return []
  }
}

export async function getProductCategories(limit = 8) {
  try {
    const { product_categories } = await medusaClient.productCategories.list({
      limit,
    })
    return product_categories || []
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return []
  }
}

export async function getRegions() {
  try {
    const { regions } = await medusaClient.regions.list()
    return regions || []
  } catch (error) {
    console.error('Failed to fetch regions:', error)
    return []
  }
}
