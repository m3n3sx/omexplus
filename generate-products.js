#!/usr/bin/env node

// Generator 20 produktów dla każdej kategorii z pełnymi danymi

const categories = {
  hydraulika: {
    name: "Hydraulika",
    icon: "🔧",
    baseProducts: [
      { type: "Pompa hydrauliczna", prefix: "PUMP", manufacturers: ["Rexroth", "Danfoss", "Parker", "Eaton"] },
      { type: "Silnik hydrauliczny", prefix: "MOTOR", manufacturers: ["Danfoss", "Sauer", "Poclain", "Bosch"] },
      { type: "Zawór hydrauliczny", prefix: "VALVE", manufacturers: ["Rexroth", "Vickers", "Atos", "Hawe"] },
      { type: "Cylinder hydrauliczny", prefix: "CYL", manufacturers: ["Hyva", "Binotto", "Penta", "Hydro"] },
      { type: "Wąż hydrauliczny", prefix: "HOSE", manufacturers: ["Manuli", "Parker", "Gates", "Alfagomma"] }
    ]
  },
  filtry: {
    name: "Filtry",
    icon: "🔍",
    baseProducts: [
      { type: "Filtr powietrza", prefix: "AIR", manufacturers: ["Mann", "Donaldson", "Fleetguard", "Hengst"] },
      { type: "Filtr paliwa", prefix: "FUEL", manufacturers: ["Mann", "Bosch", "Purflux", "Mahle"] },
      { type: "Filtr oleju", prefix: "OIL", manufacturers: ["Mann", "Mahle", "Fram", "Knecht"] },
      { type: "Filtr hydrauliczny", prefix: "HYD", manufacturers: ["Pall", "Hydac", "MP Filtri", "Argo"] }
    ]
  }
}

function generateSKU(prefix, index) {
  return `${prefix}-${String(index).padStart(4, '0')}`
}

function generateEAN(categoryIndex, productIndex) {
  const base = "590" + String(categoryIndex).padStart(2, '0') + String(productIndex).padStart(5, '0')
  return base + calculateEANChecksum(base)
}

function calculateEANChecksum(code) {
  let sum = 0
  for (let i = 0; i < code.length; i++) {
    sum += parseInt(code[i]) * (i % 2 === 0 ? 1 : 3)
  }
  return (10 - (sum % 10)) % 10
}

function generatePrice(min, max) {
  return (Math.random() * (max - min) + min).toFixed(2)
}

function generateProducts() {
  const allProducts = []
  let categoryIndex = 1

  for (const [slug, category] of Object.entries(categories)) {
    console.log(`\n📦 Generuję produkty dla kategorii: ${category.name}`)
    
    const productsPerType = Math.ceil(20 / category.baseProducts.length)
    let productIndex = 1

    for (const baseProduct of category.baseProducts) {
      for (let i = 0; i < productsPerType && productIndex <= 20; i++) {
        const manufacturer = baseProduct.manufacturers[i % baseProduct.manufacturers.length]
        const model = `${String.fromCharCode(65 + i)}${Math.floor(Math.random() * 900) + 100}`
        
        const product = {
          category: slug,
          title: `${baseProduct.type} ${manufacturer} ${model}`,
          description: `Profesjonalny ${baseProduct.type.toLowerCase()} marki ${manufacturer}. Model ${model} zapewnia wysoką wydajność i niezawodność. Idealny do maszyn budowlanych i przemysłowych.`,
          sku: generateSKU(baseProduct.prefix, productIndex),
          manufacturer_sku: `${manufacturer.substring(0, 3).toUpperCase()}-${model}-${String(productIndex).padStart(3, '0')}`,
          ean: generateEAN(categoryIndex, productIndex),
          price: parseFloat(generatePrice(100, 5000)),
          weight: parseFloat((Math.random() * 50 + 1).toFixed(2)),
          manufacturer: manufacturer,
          origin_country: ["DE", "US", "IT", "FR", "UK"][Math.floor(Math.random() * 5)],
          warranty_months: [12, 18, 24, 36][Math.floor(Math.random() * 4)],
          stock: Math.floor(Math.random() * 50) + 5,
          dimensions: {
            length: Math.floor(Math.random() * 500) + 100,
            width: Math.floor(Math.random() * 300) + 50,
            height: Math.floor(Math.random() * 200) + 30
          },
          technical_specs: {
            pressure_max: `${Math.floor(Math.random() * 200) + 100} bar`,
            temperature_range: `-20°C do +80°C`,
            material: ["Stal", "Aluminium", "Żeliwo"][Math.floor(Math.random() * 3)]
          },
          tags: [
            baseProduct.type.toLowerCase().replace(/\s+/g, '-'),
            manufacturer.toLowerCase(),
            slug,
            `model-${model.toLowerCase()}`
          ]
        }

        allProducts.push(product)
        productIndex++
      }
    }

    categoryIndex++
  }

  return allProducts
}

// Generuj i zapisz
const products = generateProducts()
console.log(`\n✅ Wygenerowano ${products.length} produktów`)
console.log(JSON.stringify({ products }, null, 2))
