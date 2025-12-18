import { MedusaContainer } from "@medusajs/framework/types"

export default async function seedProducts(container: MedusaContainer) {
  const productModuleService = container.resolve("productModuleService")
  const pricingModuleService = container.resolve("pricingModuleService")
  const regionModuleService = container.resolve("regionModuleService")
  
  console.log('🚀 Rozpoczynam seed produktów...')
  
  try {
    // 1. Pobierz region PLN
    const regions = await regionModuleService.listRegions({ currency_code: 'pln' })
    const region = regions[0]
    
    if (!region) {
      console.log('❌ Brak regionu PLN')
      return
    }
    
    console.log(`✅ Region: ${region.name}`)
    
    // 2. Pobierz kategorie
    const categories = await productModuleService.listProductCategories({ limit: 20 })
    console.log(`✅ Znaleziono ${categories.length} kategorii`)
    
    // 3. Dane do generowania
    const partTypes = [
      'Pompa hydrauliczna', 'Filtr oleju', 'Uszczelka', 'Łożysko', 'Pasek',
      'Cylinder', 'Zawór', 'Wąż', 'Złącze', 'Tłok', 'Pierścień', 'Membrana',
      'Siłownik', 'Rozrusznik', 'Alternator', 'Wtryskiwacz', 'Turbosprężarka',
      'Amortyzator', 'Sprężyna', 'Sworzeń'
    ]
    
    const brands = ['Danfoss', 'Parker', 'Eaton', 'Vickers', 'Rexroth', 'Bosch']
    const models = ['A101', 'B104', 'C105', 'D106', 'E107', 'F108']
    const machines = ['CAT', 'Komatsu', 'JCB', 'Volvo', 'Hitachi', 'Doosan']
    
    let totalCreated = 0
    
    // 4. Dla każdej kategorii dodaj 50 produktów
    for (const category of categories) {
      console.log(`\n📂 ${category.name}`)
      
      // Sprawdź ile jest produktów
      const existing = await productModuleService.listProducts({
        category_id: [category.id]
      })
      
      const toCreate = Math.max(0, 50 - existing.length)
      
      if (toCreate === 0) {
        console.log(`   ✓ Ma już ${existing.length} produktów`)
        continue
      }
      
      console.log(`   Tworzę ${toCreate} produktów...`)
      
      for (let i = 0; i < toCreate; i++) {
        const part = partTypes[Math.floor(Math.random() * partTypes.length)]
        const brand = brands[Math.floor(Math.random() * brands.length)]
        const model = models[Math.floor(Math.random() * models.length)]
        const machine = machines[Math.floor(Math.random() * machines.length)]
        
        const title = `${part} ${brand} ${model} [${machine}]`
        const sku = `${brand.substring(0, 3).toUpperCase()}-${model}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
        
        try {
          await productModuleService.createProducts({
            title,
            description: `Wysokiej jakości ${part.toLowerCase()} do maszyn ${machine}. Numer: ${sku}`,
            status: 'published',
            category_ids: [category.id],
            variants: [{
              title: 'Standard',
              sku,
              manage_inventory: true,
              inventory_quantity: Math.floor(Math.random() * 100) + 1,
              prices: [{
                amount: Math.floor(Math.random() * (500000 - 5000) + 5000),
                currency_code: 'pln',
                region_id: region.id
              }]
            }]
          })
          
          totalCreated++
          
          if ((i + 1) % 10 === 0) {
            process.stdout.write(`   ${i + 1}/${toCreate}...\r`)
          }
        } catch (err: any) {
          console.error(`   ❌ ${err.message}`)
        }
      }
      
      console.log(`   ✅ Utworzono ${toCreate}`)
    }
    
    console.log(`\n\n🎉 Zakończono! Utworzono ${totalCreated} produktów`)
    
  } catch (error: any) {
    console.error('❌ Błąd:', error.message)
    throw error
  }
}
