const { MedusaModule } = require("@medusajs/framework/modules-sdk")

async function run() {
  console.log('🚀 Rozpoczynam dodawanie cen i produktów...')
  
  const productModule = MedusaModule.getProductModuleService()
  const pricingModule = MedusaModule.getPricingModuleService()
  const regionModule = MedusaModule.getRegionModuleService()
  
  try {
    // 1. Pobierz wszystkie produkty z wariantami
    console.log('📦 Pobieranie produktów...')
    const { data: products } = await productModule.listAndCountProducts({}, {
      relations: ['variants']
    })
    console.log(`✅ Znaleziono ${products.length} produktów`)
    
    // 2. Dodaj ceny do istniejących wariantów
    console.log('💰 Dodawanie cen do wariantów...')
    let pricesAdded = 0
    
    for (const product of products) {
      if (!product.variants || product.variants.length === 0) {
        // Produkt bez wariantów - stwórz domyślny wariant
        console.log(`   Tworzę wariant dla: ${product.title}`)
        const variant = await productModule.createProductVariants({
          product_id: product.id,
          title: 'Standard',
          sku: `SKU-${product.id.substring(0, 8)}`,
          manage_inventory: true,
          inventory_quantity: Math.floor(Math.random() * 50) + 10
        })
        
        // Dodaj cenę
        const price = Math.floor(Math.random() * (500000 - 5000) + 5000)
        await pricingModule.createPriceSets({
          prices: [{
            amount: price,
            currency_code: 'pln',
            rules: {}
          }]
        })
        
        // Link price set to variant
        await pricingModule.addPriceListPrices({
          variant_id: variant.id,
          price_set_id: priceSet.id
        })
        
        pricesAdded++
      } else {
        // Dodaj ceny do istniejących wariantów
        for (const variant of product.variants) {
          try {
            const price = Math.floor(Math.random() * (500000 - 5000) + 5000)
            const priceSet = await pricingModule.createPriceSets({
              prices: [{
                amount: price,
                currency_code: 'pln',
                rules: {}
              }]
            })
            pricesAdded++
          } catch (err) {
            // Cena już istnieje
          }
        }
      }
    }
    
    console.log(`✅ Dodano ${pricesAdded} cen`)
    
    // 3. Pobierz kategorie
    console.log('📁 Pobieranie kategorii...')
    const { data: categories } = await productModule.listAndCountProductCategories({
      limit: 20
    })
    console.log(`✅ Znaleziono ${categories.length} kategorii`)
    
    // 4. Dla każdej kategorii dodaj produkty do 50
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
      const { data: existingProducts } = await productModule.listAndCountProducts({
        category_id: [category.id]
      })
      
      const toCreate = Math.max(0, 50 - existingProducts.length)
      
      if (toCreate === 0) {
        console.log(`   ✓ Ma już ${existingProducts.length} produktów`)
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
          const product = await productModule.createProducts({
            title,
            description,
            handle: `${partType.toLowerCase().replace(/\s+/g, '-')}-${brand.toLowerCase()}-${Date.now()}`,
            status: 'published',
            category_ids: [category.id]
          })
          
          // Stwórz wariant
          const variant = await productModule.createProductVariants({
            product_id: product.id,
            title: 'Standard',
            sku: partNumber,
            manage_inventory: true,
            inventory_quantity: Math.floor(Math.random() * 100) + 1
          })
          
          // Dodaj cenę (50-5000 PLN)
          const price = Math.floor(Math.random() * (500000 - 5000) + 5000)
          await pricingModule.createPriceSets({
            prices: [{
              amount: price,
              currency_code: 'pln',
              rules: {}
            }]
          })
          
          totalCreated++
          
          if ((i + 1) % 10 === 0) {
            process.stdout.write(`   ${i + 1}/${toCreate}...\r`)
          }
        } catch (err) {
          console.error(`   ❌ Błąd: ${err.message}`)
        }
      }
      
      console.log(`   ✅ Utworzono ${toCreate} produktów`)
    }
    
    console.log(`\n\n🎉 Zakończono!`)
    console.log(`📊 Podsumowanie:`)
    console.log(`   - Dodano cen: ${pricesAdded}`)
    console.log(`   - Utworzono produktów: ${totalCreated}`)
    console.log(`   - Kategorie: ${categories.length}`)
    
    const { data: finalProducts } = await productModule.listAndCountProducts()
    console.log(`   - Łącznie produktów: ${finalProducts.length}`)
    
  } catch (error) {
    console.error('❌ Błąd:', error)
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
