const Medusa = require("@medusajs/medusa-js").default

const medusaClient = new Medusa({
  baseUrl: "http://localhost:9000",
  maxRetries: 3,
  apiKey: "pk_c70e4aeb4dfff475873e37bbeb633670a95b4246e07eb7fa7e10beecfdf66cf0",
})

async function test() {
  try {
    console.log('Testing products.list...')
    const productsResponse = await medusaClient.products.list({
      limit: 3,
      region_id: 'reg_01KBDXHQAFG1GS7F3WH2680KP0',
    })
    
    console.log('Products count:', productsResponse.products.length)
    if (productsResponse.products.length > 0) {
      const product = productsResponse.products[0]
      console.log('First product:', {
        id: product.id,
        title: product.title,
        variants: product.variants?.length || 0,
        hasPrice: product.variants?.[0]?.prices?.length > 0
      })
    }
    
    console.log('\nTesting productCategories.list...')
    const categoriesResponse = await medusaClient.productCategories.list({
      limit: 3,
    })
    console.log('Categories count:', categoriesResponse.product_categories.length)
    
  } catch (error) {
    console.error('Error:', error.message)
    if (error.response) {
      console.error('Response:', error.response.data)
    }
  }
}

test()
