/**
 * Skrypt dodający ceny do wszystkich produktów
 * Generuje realistyczne ceny na podstawie kategorii produktu
 */

import { MedusaModule } from "@medusajs/framework/modules-sdk"

export default async function addPricesToProducts() {
  console.log("🏷️ Dodawanie cen do produktów...")

  try {
    // Initialize Medusa modules
    const productModule = await MedusaModule.resolve("@medusajs/product")
    const pricingModule = await MedusaModule.resolve("@medusajs/pricing")

    // Get all products
    const [products] = await productModule.listProducts({}, { relations: ["variants"] })
    console.log(`📦 Znaleziono ${products.length} produktów`)

    let updatedCount = 0
    let skippedCount = 0

    for (const product of products) {
      console.log(`\n📝 Przetwarzanie: ${product.title}`)

      if (!product.variants || product.variants.length === 0) {
        console.log("  ⚠️  Brak wariantów, pomijam")
        skippedCount++
        continue
      }

      for (const variant of product.variants) {
        // Check if variant already has prices
        const existingPrices = await pricingModule.listPrices({
          variant_id: variant.id
        })

        if (existingPrices && existingPrices.length > 0) {
          console.log(`  ✓ Wariant ${variant.sku || variant.id} ma już cenę`)
          skippedCount++
          continue
        }

        // Generate realistic price based on product title/category
        const price = generatePrice(product.title, product.description)

        // Create price for variant
        await pricingModule.createPrices({
          variant_id: variant.id,
          currency_code: "PLN",
          amount: price,
          min_quantity: 1,
          max_quantity: null,
        })

        console.log(`  ✅ Dodano cenę: ${(price / 100).toFixed(2)} PLN`)
        updatedCount++
      }
    }

    console.log("\n" + "=".repeat(50))
    console.log("✅ Zakończono!")
    console.log(`📊 Statystyki:`)
    console.log(`   - Zaktualizowano: ${updatedCount} wariantów`)
    console.log(`   - Pominięto: ${skippedCount} wariantów (już mają ceny)`)
    console.log("=".repeat(50))

  } catch (error) {
    console.error("❌ Błąd:", error)
    throw error
  }
}

/**
 * Generuje realistyczną cenę na podstawie nazwy produktu
 */
function generatePrice(title: string, description?: string): number {
  const titleLower = (title || "").toLowerCase()
  const descLower = (description || "").toLowerCase()
  const combined = titleLower + " " + descLower

  // Kategorie cenowe (w groszach)
  const priceRanges: Record<string, [number, number]> = {
    // Hydraulika
    rura: [500, 15000],
    kolano: [300, 5000],
    trójnik: [400, 6000],
    zawór: [2000, 50000],
    bateria: [15000, 100000],
    
    // Elektryka
    kabel: [200, 10000],
    przewód: [150, 8000],
    gniazdko: [500, 3000],
    wyłącznik: [800, 5000],
    lampka: [1000, 15000],
    
    // Narzędzia
    młotek: [2000, 15000],
    śrubokręt: [500, 8000],
    klucz: [1500, 20000],
    wiertarka: [15000, 100000],
    piła: [5000, 50000],
    
    // Materiały budowlane
    cement: [1500, 3000],
    piasek: [500, 2000],
    cegła: [100, 500],
    płytka: [2000, 20000],
    farba: [3000, 15000],
    
    // Domyślne
    default: [1000, 10000]
  }

  // Znajdź pasującą kategorię
  for (const [keyword, range] of Object.entries(priceRanges)) {
    if (combined.includes(keyword)) {
      const [min, max] = range
      // Losowa cena w zakresie, zaokrąglona do 99 groszy
      const randomPrice = Math.floor(Math.random() * (max - min) + min)
      return Math.floor(randomPrice / 100) * 100 + 99
    }
  }

  // Domyślna cena
  const [min, max] = priceRanges.default
  const randomPrice = Math.floor(Math.random() * (max - min) + min)
  return Math.floor(randomPrice / 100) * 100 + 99
}
