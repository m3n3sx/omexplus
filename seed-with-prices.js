const axios = require('axios')

const BACKEND_URL = 'http://localhost:9000'
const API_KEY = 'pk_c70e4aeb4dfff475873e37bbeb633670a95b4246e07eb7fa7e10beecfdf66cf0'

// Admin credentials
const ADMIN_EMAIL = 'meneswczesny@gmail.com'
const ADMIN_PASSWORD = 'CAnabis123#$'

async function loginAdmin() {
  try {
    const response = await axios.post(`${BACKEND_URL}/auth/user/emailpass`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    })
    return response.data.token
  } catch (error) {
    console.error('❌ Błąd logowania:', error.response?.data || error.message)
    throw error
  }
}

async function run() {
  console.log('🚀 Rozpoczynam dodawanie cen i produktów...')
  
  try {
    // 1. Zaloguj się jako admin
    console.log('🔐 Logowanie jako admin...')
    const token = await loginAdmin()
    console.log('✅ Zalogowano')
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
    
    // 2. Pobierz region PLN
    console.log('📍 Pobieranie regionu...')
    const regionsRes = await axios.get(`${BACKEND_URL}/admin/regions`, { headers })
    let region = regionsRes.data.regions.find(r => r.currency_code === 'pln')
    
    if (!region) {
      console.log('⚠️  Tworzę region PLN...')
      const createRes = await axios.post(`${BACKEND_URL}/admin/regions`, {
        name: 'Polska',
        currency_code: 'pln',
        countries: ['pl'],
        payment_providers: ['manual'],
        fulfillment_providers: ['manual']
      }, { headers })
      region = createRes.data.region
    }
    
    console.log(`✅ Region: ${region.name} (ID: ${region.id})`)
    
    // 3. Pobierz wszystkie produkty
    console.log('📦 Pobieranie produktów...')
    const productsRes = await axios.get(`${BACKEND_URL}/admin/products?limit=2000`, { headers })
    const products = productsRes.data.products
    console.log(`✅ Znaleziono ${products.length} produktów`)
    
    // 4. Dodaj ceny do produktów bez cen
    console.log('💰 Dodawanie cen...')
    let pricesAdded = 0
    
    for (const product of products) {
      for (const variant of product.variants || []) {
        // Sprawdź czy wariant ma cenę
        const hasPriceInRegion = variant.prices?.some(p => p.region_id === region.id)
        
        if (!hasPriceInRegion) {
          try {
            const price = Math.floor(Math.random() * (500000 - 5000) + 5000) // 50-5000 PLN w groszach
            
            await axios.post(`${BACKEND_URL}/admin/products/${product.id}/variants/${variant.id}/prices`, {
              prices: [{
                amount: price,
                currency_code: 'pln',
                region_id: region.id
              }]
            }, { headers })
            
            pricesAdded++
            
            if (pricesAdded % 50 === 0) {
              process.stdout.write(`   Dodano ${pricesAdded} cen...\r`)
            }
          } catch (err) {
            // Ignoruj błędy
          }
        }
      }
    }
    
    console.log(`\n✅ Dodano ${pricesAdded} cen`)
    
    // 5. Pobierz kategorie
    console.log('📁 Pobieranie kategorii...')
    const categoriesRes = await axios.get(`${BACKEND_URL}/admin/product-categories?limit=50`, { headers })
    const categories = categoriesRes.data.product_categories
    console.log(`✅ Znaleziono ${categories.length} kategorii`)
    
    // 6. Dla każdej kategorii dodaj produkty do 50
    console.log('🏭 Uzupełnianie produktów w kategoriach...')
    
    const partTypes = [
      'Pompa hydrauliczna', 'Filtr oleju', 'Uszczelka', 'Łożysko', 'Pasek klinowy',
      'Cylinder', 'Zawór hydrauliczny', 'Wąż hydrauliczny', 'Złącze', 'Tłok',
      'Pierścień', 'Membrana', 'Siłownik', 'Rozrusznik', 'Alternator',
      'Wtryskiwacz', 'Turbosprężarka', 'Amortyzator', 'Sprężyna', 'Sworzeń'
    ]
    
    const brands = ['Danfoss', 'Parker', 'Eaton', 'Vickers', 'Rexroth', 'Bosch', 'Delphi', 'Denso']
    const models = ['A101', 'B1040', 'C1054', 'D1064', 'E1073', 'F1082', 'G1091', 'H1100']
    const machines = ['CAT 320', 'Komatsu PC200', 'JCB 330D', 'Volvo EC210', 'Hitachi ZX200', 'Doosan EC380', 'Hyundai 330D', 'Case ZX350']
    
    let totalCreated = 0
    
    for (const category of categories) {
      console.log(`\n📂 ${category.name}`)
      
      // Sprawdź ile produktów jest w kategorii
      const catProductsRes = await axios.get(
        `${BACKEND_URL}/admin/products?category_id[]=${category.id}&limit=100`,
        { headers }
      )
      const existingCount = catProductsRes.data.count || catProductsRes.data.products.length
      
      const toCreate = Math.max(0, 50 - existingCount)
      
      if (toCreate === 0) {
        console.log(`   ✓ Ma już ${existingCount} produktów`)
        continue
      }
      
      console.log(`   Tworzę ${toCreate} produktów...`)
      
      for (let i = 0; i < toCreate; i++) {
        const partType = partTypes[Math.floor(Math.random() * partTypes.length)]
        const brand = brands[Math.floor(Math.random() * brands.length)]
        const model = models[Math.floor(Math.random() * models.length)]
        const machine = machines[Math.floor(Math.random() * machines.length)]
        const partNumber = `${brand.substring(0, 3).toUpperCase()}-${model}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
        
        const title = `${partType} ${brand} ${model} [${machine.split(' ')[0]}]`
        const description = `Wysokiej jakości część do maszyn ${machine.split(' ')[0]}. Kompatybilna z modelami: ${machine.split(' ')[1]}, ${machines[Math.floor(Math.random() * machines.length)].split(' ')[1]}. Gwarancja producenta. Certyfikaty CE i ISO.`
        
        try {
          // Stwórz produkt
          const productRes = await axios.post(`${BACKEND_URL}/admin/products`, {
            title,
            description,
            status: 'published',
            category_ids: [category.id],
            options: [{
              title: 'Wersja',
              values: ['Standard']
            }],
            variants: [{
              title: 'Standard',
              sku: partNumber,
              manage_inventory: true,
              inventory_quantity: Math.floor(Math.random() * 100) + 1,
              prices: [{
                amount: Math.floor(Math.random() * (500000 - 5000) + 5000),
                currency_code: 'pln',
                region_id: region.id
              }]
            }]
          }, { headers })
          
          totalCreated++
          
          if ((i + 1) % 10 === 0) {
            process.stdout.write(`   ${i + 1}/${toCreate}...\r`)
          }
        } catch (err) {
          console.error(`   ❌ Błąd: ${err.response?.data?.message || err.message}`)
        }
      }
      
      console.log(`   ✅ Utworzono ${toCreate} produktów`)
    }
    
    console.log(`\n\n🎉 Zakończono!`)
    console.log(`📊 Podsumowanie:`)
    console.log(`   - Dodano cen: ${pricesAdded}`)
    console.log(`   - Utworzono produktów: ${totalCreated}`)
    console.log(`   - Kategorie: ${categories.length}`)
    
    // Podsumowanie końcowe
    const finalRes = await axios.get(`${BACKEND_URL}/admin/products?limit=1`, { headers })
    console.log(`   - Łącznie produktów: ${finalRes.data.count}`)
    
  } catch (error) {
    console.error('❌ Błąd:', error.response?.data || error.message)
    throw error
  }
}

run()
  .then(() => {
    console.log('✅ Gotowe!')
    process.exit(0)
  })
  .catch((err) => {
    console.error('❌ Błąd:', err)
    process.exit(1)
  })
