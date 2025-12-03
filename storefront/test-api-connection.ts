/**
 * Test Medusa API Connection
 * Run: npx tsx test-api-connection.ts
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'

async function testConnection() {
  console.log('🔍 Testing Medusa API Connection...')
  console.log('Backend URL:', BACKEND_URL)
  console.log('')

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing health endpoint...')
    const healthRes = await fetch(`${BACKEND_URL}/health`)
    if (healthRes.ok) {
      console.log('✅ Health check passed')
    } else {
      console.log('❌ Health check failed:', healthRes.status)
    }
    console.log('')

    // Test 2: Store API - Regions
    console.log('2️⃣ Testing /store/regions...')
    const regionsRes = await fetch(`${BACKEND_URL}/store/regions`)
    if (regionsRes.ok) {
      const data = await regionsRes.json()
      console.log('✅ Regions:', data.regions?.length || 0)
    } else {
      console.log('❌ Regions failed:', regionsRes.status)
    }
    console.log('')

    // Test 3: Store API - Products
    console.log('3️⃣ Testing /store/products...')
    const productsRes = await fetch(`${BACKEND_URL}/store/products?limit=5`)
    if (productsRes.ok) {
      const data = await productsRes.json()
      console.log('✅ Products:', data.products?.length || 0)
      if (data.products?.length > 0) {
        console.log('   First product:', data.products[0].title)
      }
    } else {
      console.log('❌ Products failed:', productsRes.status)
    }
    console.log('')

    // Test 4: Store API - Categories
    console.log('4️⃣ Testing /store/product-categories...')
    const categoriesRes = await fetch(`${BACKEND_URL}/store/product-categories?limit=5`)
    if (categoriesRes.ok) {
      const data = await categoriesRes.json()
      console.log('✅ Categories:', data.product_categories?.length || 0)
      if (data.product_categories?.length > 0) {
        console.log('   First category:', data.product_categories[0].name)
      }
    } else {
      console.log('❌ Categories failed:', categoriesRes.status)
    }
    console.log('')

    // Test 5: CORS Check
    console.log('5️⃣ Testing CORS...')
    const corsRes = await fetch(`${BACKEND_URL}/store/products`, {
      method: 'OPTIONS',
    })
    const corsHeaders = corsRes.headers.get('access-control-allow-origin')
    if (corsHeaders) {
      console.log('✅ CORS configured:', corsHeaders)
    } else {
      console.log('⚠️  CORS headers not found (may need configuration)')
    }
    console.log('')

    console.log('🎉 All tests completed!')
    console.log('')
    console.log('Next steps:')
    console.log('1. Start storefront: cd storefront && npm run dev')
    console.log('2. Open browser: http://localhost:3000')
    console.log('3. Check browser console for any errors')

  } catch (error) {
    console.error('❌ Connection failed:', error)
    console.log('')
    console.log('Troubleshooting:')
    console.log('1. Is Medusa backend running? (npm run dev)')
    console.log('2. Is it on port 9000? Check medusa-config.ts')
    console.log('3. Check firewall/antivirus settings')
  }
}

testConnection()
