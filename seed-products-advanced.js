const { Medusa } = require("@medusajs/medusa-js")

const medusa = new Medusa({
  baseUrl: "http://localhost:9000",
  maxRetries: 3,
})

// Kategorie z produktami
const CATEGORIES = {
  hydraulika: {
    name: "Hydraulika",
    products: [
      {
        title: "Pompa hydrauliczna A10VSO 28 DFR1/31R-PPA12N00",
        description: "Wysokowydajna pompa tłokowa osiowa o zmiennym wydatku. Ciśnienie robocze do 280 bar. Idealny do koparek i ładowarek.",
        sku: "HYD-PUMP-A10VSO-28",
        manufacturer_sku: "A10VSO28DFR1/31R-PPA12N00",
        ean: "4052568123456",
        price: 4500.00,
        weight: 25.5,
        manufacturer: "Rexroth Bosch Group",
        origin_country: "DE",
        warranty_months: 24,
        tags: ["pompa", "hydraulika", "rexroth", "a10vso", "zmienny-wydatek"]
      },
      {
        title: "Silnik hydrauliczny OMR 80 151-0210",
        description: "Silnik hydrauliczny orbitalny OMR 80. Moment obrotowy 190 Nm. Prędkość obrotowa do 1000 obr/min.",
        sku: "HYD-MOTOR-OMR-80",
        manufacturer_sku: "OMR80-151-0210",
        ean: "4052568123457",
        price: 1200.00,
        weight: 8.2,
        manufacturer: "Danfoss",
        origin_country: "DK",
        warranty_months: 18,
        tags: ["silnik", "hydraulika", "danfoss", "omr", "orbitalny"]
      }
    ]
  }
}

async function clearDatabase() {
  console.log("🗑️  Usuwanie demo content...")
  // TODO: Implement database clearing
}

async function seedProducts() {
  console.log("🌱 Rozpoczynam seedowanie produktów...")
  
  for (const [categorySlug, categoryData] of Object.entries(CATEGORIES)) {
    console.log(`\n📦 Kategoria: ${categoryData.name}`)
    
    for (const product of categoryData.products) {
      console.log(`  ➕ Dodaję: ${product.title}`)
      // TODO: Add product via API
    }
  }
}

async function main() {
  try {
    await clearDatabase()
    await seedProducts()
    console.log("\n✅ Seedowanie zakończone!")
  } catch (error) {
    console.error("❌ Błąd:", error)
    process.exit(1)
  }
}

main()
