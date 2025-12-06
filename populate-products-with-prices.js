const { Modules } = require("@medusajs/framework/utils")

async function populateProductsWithPrices() {
  console.log('🚀 Rozpoczynam dodawanie cen i produktów...')
  
  const productModuleService = Modules.PRODUCT
  const pricingModuleService = Modules.PRICING
  const regionModuleService = Modules.REGION
  
  try {
    // 1. Pobierz region (PLN)
    console.log('📍 Pobieranie regionu PLN...')
    const regions = await regionModuleService.listRegions({ currency_code: 'pln' })
    let region = regions[0]
    
    if (!region) {
      console.log('⚠️  Brak regionu PLN, tworzę...')
      region = await regionModuleService.createRegions({
        name: 'Polska',
        currency_code: 'pln',
        countries: ['pl']
      })
    }
    
    console.log(`✅ Region: ${region.name} (${region.currency_code})`)
    
    // 2. Pobierz wszystkie produkty
    console.log('📦 Pobieranie produktów...')
    const products = await productModuleService.listProducts({}, { relations: ['variants'] })
    console.log(`✅ Znaleziono ${products.length} produktów`)
    
    // 3. Dodaj ceny do istniejących produktów
    console.log('💰 Dodawanie cen do produktów...')
    let pricesAdded = 0
    
    for (const product of products) {
      for (const variant of product.variants || []) {
        // Losowa cena między 50 PLN a 5000 PLN
        const price = Math.floor(Math.random() * (500000 - 5000) + 5000) // w groszach
        
        try {
          await pricingModuleService.createPriceSets({
            prices: [{
              amount: price,
              currency_code: 'pln',
              variant_id: variant.id
            }]
          })
          pricesAdded++
        } catch (err) {
          // Cena już istnieje - OK
        }
      }
    }
    
    console.log(`✅ Dodano ${pricesAdded} cen`)
    
    // 4. Pobierz kategorie
    console.log('📁 Pobieranie kategorii...')
    const categories = await productModuleService.listProductCategories({ limit: 20 })
    console.log(`✅ Znaleziono ${categories.length} kategorii`)
    
    // 5. Dla każdej kategorii dodaj 50 produktów
    console.log('🏭 Tworzenie produktów w kategoriach...')
    
    const partTypes = [
      'Pompa', 'Filtr', 'Uszczelka', 'Łożysko', 'Pasek', 'Cylinder', 
      'Zawór', 'Wąż', 'Złącze', 'Tłok', 'Pierścień', 'Membrana',
      'Siłownik', 'Rozrusznik', 'Alternator', 'Wtryskiwacz', 'Turbosprężarka',
      'Amortyzator', 'Sprężyna', 'Sworzeń', 'Tuleja', 'Wałek'
    ]
    
    const brands = ['CAT', 'Komatsu', 'JCB', 'Volvo', 'Hitachi', 'Doosan', 'Hyundai', 'Case']
    const models = ['320', '330', '350', 'EC210', 'EC380', 'ZX200', 'ZX350', 'DX225']
    
    let totalCreated = 0
    
    for (const category of categories) {
      console.log(`\n📂 Kategoria: ${category.name}`)
      
      // Sprawdź ile produktów już jest w kategorii
      const existingProducts = await productModuleService.listProducts({
        category_id: [category.id]
      })
      
      const toCreate = Math.max(0, 50 - existingProducts.length)
      
      if (toCreate === 0) {
        console.log(`   ✓ Kategoria już ma ${existingProducts.length} produktów`)
        continue
      }
      
      console.log(`   Tworzę ${toCreate} produktów...`)
      
      for (let i = 0; i < toCreate; i++) {
        const partType = partTypes[Math.floor(Math.random() * partTypes.length)]
        const brand = brands[Math.floor(Math.random() * brands.length)]
        const model = models[Math.floor(Math.random() * models.length)]
        const partNumber = `${brand}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
        
        const title = `${partType} ${brand} ${model}`
        const description = `Wysokiej jakości ${partType.toLowerCase()} do maszyn ${brand}. Kompatybilny z modelami: ${model}. Numer części: ${partNumber}. Gwarancja producenta. Certyfikaty CE i ISO.`
        
        try {
          const product = await productModuleService.createProducts({
            title,
            description,
            handle: `${partType.toLowerCase()}-${brand.toLowerCase()}-${model.toLowerCase()}-${i}`,
            status: 'published',
            categories: [{ id: category.id }],
            variants: [{
              title: 'Standard',
              sku: partNumber,
              manage_inventory: true,
              inventory_quantity: Math.floor(Math.random() * 100) + 1
            }]
          })
          
          // Dodaj cenę
          const price = Math.floor(Math.random() * (500000 - 5000) + 5000)
          
          if (product.variants && product.variants[0]) {
            await pricingModuleService.createPriceSets({
              prices: [{
                amount: price,
                currency_code: 'pln',
                variant_id: product.variants[0].id
              }]
            })
          }
          
          totalCreated++
          
          if ((i + 1) % 10 === 0) {
            process.stdout.write(`   ${i + 1}/${toCreate}...\r`)
          }
        } catch (err) {
          console.error(`   ❌ Błąd tworzenia produktu: ${err.message}`)
        }
      }
      
      console.log(`   ✅ Utworzono ${toCreate} produktów`)
    }
    
    console.log(`\n\n🎉 Zakończono!`)
    console.log(`📊 Podsumowanie:`)
    console.log(`   - Dodano cen: ${pricesAdded}`)
    console.log(`   - Utworzono produktów: ${totalCreated}`)
    console.log(`   - Kategorie wypełnione: ${categories.length}`)
    
    // Podsumowanie końcowe
    const finalProducts = await productModuleService.listProducts()
    console.log(`   - Łącznie produktów w bazie: ${finalProducts.length}`)
    
  } catch (error) {
    console.error('❌ Błąd:', error)
    throw error
  }
}

populateProductsWithPrices()
  .then(() => {
    console.log('✅ Skrypt zakończony pomyślnie')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Skrypt zakończony błędem:', error)
    process.exit(1)
  })
