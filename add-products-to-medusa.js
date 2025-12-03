#!/usr/bin/env node

const axios = require('axios')

const MEDUSA_URL = 'http://localhost:9000'
const ADMIN_EMAIL = 'admin@medusa-test.com'
const ADMIN_PASSWORD = 'supersecret'$'

let authToken = null

// Kategorie z podkategoriami (każda podkategoria = 20 produktów)
const CATEGORIES_DATA = [
  {
    name: "Hydraulika",
    handle: "hydraulika",
    subcategories: [
      { name: 'Pompy hydrauliczne', handle: 'pompy-hydrauliczne' },
      { name: 'Silniki hydrauliczne', handle: 'silniki-hydrauliczne' },
      { name: 'Zawory hydrauliczne', handle: 'zawory-hydrauliczne' },
      { name: 'Cylindry hydrauliczne', handle: 'cylindry-hydrauliczne' },
      { name: 'Wąż hydrauliczny & Złączki', handle: 'waz-hydrauliczny-zlaczki' },
      { name: 'Zbiorniki hydrauliczne', handle: 'zbiorniki-hydrauliczne' },
      { name: 'Filtry hydrauliczne', handle: 'filtry-hydrauliczne' },
      { name: 'Płyny hydrauliczne', handle: 'plyny-hydrauliczne' },
      { name: 'Garne hydrauliczne', handle: 'garne-hydrauliczne' },
      { name: 'Czujniki & Wskaźniki', handle: 'czujniki-wskazniki' }
    ]
  },
  {
    name: "Filtry",
    handle: "filtry",
    subcategories: [
      { name: 'Filtry powietrza', handle: 'filtry-powietrza' },
      { name: 'Filtry paliwa', handle: 'filtry-paliwa' },
      { name: 'Filtry oleju', handle: 'filtry-oleju' },
      { name: 'Filtry hydrauliczne HF', handle: 'filtry-hydrauliczne-hf' },
      { name: 'Filtry hydrauliczne HG', handle: 'filtry-hydrauliczne-hg' },
      { name: 'Filtry hydrauliczne HH', handle: 'filtry-hydrauliczne-hh' },
      { name: 'Komplety filtrów', handle: 'komplety-filtrow' }
    ]
  },
  {
    name: "Silniki",
    handle: "silniki",
    subcategories: [
      { name: 'Silniki spalinowe', handle: 'silniki-spalinowe' },
      { name: 'Turbosprężarki', handle: 'turbosprezarki' },
      { name: 'Układ paliwowy', handle: 'uklad-paliwowy' },
      { name: 'Układ chłodzenia', handle: 'uklad-chlodzenia' },
      { name: 'Układ rozruchowy', handle: 'uklad-rozruchowy' },
      { name: 'Paski & Łańcuchy', handle: 'paski-lancuchy' }
    ]
  },
  {
    name: "Podwozia",
    handle: "podwozia",
    subcategories: [
      { name: 'Gąsienice gumowe', handle: 'gasienice-gumowe' },
      { name: 'Podwozia kołowe', handle: 'podwozia-kolowe' },
      { name: 'Groty gąsienic', handle: 'groty-gasienic' },
      { name: 'Bolce gąsienic', handle: 'bolce-gasienic' },
      { name: 'Łączniki gąsienic', handle: 'laczniki-gasienic' },
      { name: 'Napinacze gąsienic', handle: 'napinacze-gasienic' }
    ]
  },
  {
    name: "Elektryka",
    handle: "elektryka",
    subcategories: [
      { name: 'Oświetlenie', handle: 'oswietlenie' },
      { name: 'Kable & Przewody', handle: 'kable-przewody' },
      { name: 'Silniki elektryczne', handle: 'silniki-elektryczne' },
      { name: 'Elektronika sterowania', handle: 'elektronika-sterowania' },
      { name: 'Baterie & Zasilanie', handle: 'baterie-zasilanie' }
    ]
  }
]

async function login() {
  console.log("🔐 Logowanie do Medusa Admin...")
  try {
    const response = await axios.post(`${MEDUSA_URL}/auth/user/emailpass`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    })
    
    authToken = response.data.token
    console.log("✅ Zalogowano pomyślnie")
    console.log(`   Token: ${authToken.substring(0, 50)}...`)
    return true
  } catch (error) {
    console.error("❌ Błąd logowania:", error.response?.data || error.message)
    return false
  }
}

function generateProduct(category, subcategory, index) {
  const manufacturers = {
    hydraulika: ["Rexroth", "Danfoss", "Parker", "Eaton", "Vickers"],
    filtry: ["Mann", "Donaldson", "Fleetguard", "Mahle", "Bosch"],
    silniki: ["Caterpillar", "Cummins", "Perkins", "Deutz", "Volvo"],
    podwozia: ["Berco", "ITR", "VemaTrack", "Prowler", "Bridgestone"],
    elektryka: ["Bosch", "Hella", "Valeo", "Magneti Marelli", "Denso"]
  }
  
  const mfr = manufacturers[category][index % manufacturers[category].length]
  const model = `${String.fromCharCode(65 + (index % 26))}${100 + index}`
  
  // Użyj nazwy podkategorii jako typu produktu
  const type = subcategory.name
  
  return {
    title: `${type} ${mfr} ${model}`,
    subtitle: `Model ${model} - Oryginalna część ${mfr}`,
    description: `Wysokiej jakości ${type.toLowerCase()} marki ${mfr}. Model ${model} zapewnia doskonałą wydajność i trwałość. Idealny do maszyn budowlanych, koparek, ładowarek i sprzętu przemysłowego. Gwarancja producenta. Certyfikaty CE i ISO.`,
    handle: `${subcategory.handle}-${mfr.toLowerCase()}-${model.toLowerCase()}-${index}`,
    collection_id: subcategory.handle,
    is_giftcard: false,
    status: "published",
    metadata: {
      manufacturer: mfr,
      manufacturer_sku: `${mfr.substring(0,3).toUpperCase()}-${model}-${String(index).padStart(3,'0')}`,
      ean: `590${String(index).padStart(10,'0')}`,
      origin_country: ["DE","US","IT","FR","UK","PL"][index % 6],
      warranty_months: [12,18,24,36][index % 4],
      weight_kg: (Math.random() * 50 + 1).toFixed(2),
      dimensions_mm: `${100+index*10}x${50+index*5}x${30+index*3}`,
      pressure_max_bar: 100 + (index * 10),
      temperature_range: "-20°C do +80°C",
      material: ["Stal","Aluminium","Żeliwo","Brąz"][index % 4],
      application: ["Koparki","Ładowarki","Spycharki","Dźwigi"][index % 4],
      category: category,
      subcategory: subcategory.name,
      subcategory_handle: subcategory.handle
    },
    options: [
      {
        title: "Wariant",
        values: ["Standard"]
      }
    ],
    variants: [
      {
        title: "Standard",
        sku: `${subcategory.handle.substring(0,6).toUpperCase().replace(/-/g,'')}-${String(index).padStart(4,'0')}`,
        ean: `590${String(index).padStart(10,'0')}`,
        inventory_quantity: Math.floor(Math.random() * 50) + 5,
        manage_inventory: true,
        allow_backorder: false,
        prices: [
          {
            amount: Math.floor((Math.random() * 4900 + 100) * 100),
            currency_code: "pln"
          },
          {
            amount: Math.floor((Math.random() * 1200 + 25) * 100),
            currency_code: "eur"
          }
        ],
        options: [
          {
            value: "Standard"
          }
        ]
      }
    ],
    tags: [
      { value: category },
      { value: subcategory.handle },
      { value: mfr.toLowerCase() },
      { value: type.toLowerCase().replace(/\s+/g,'-') },
      { value: `model-${model.toLowerCase()}` }
    ]
  }
}

async function createProduct(productData) {
  try {
    const response = await axios.post(
      `${MEDUSA_URL}/admin/products`,
      productData,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }
    )
    return response.data.product
  } catch (error) {
    console.error(`❌ Błąd tworzenia produktu:`, error.response?.data || error.message)
    return null
  }
}

async function main() {
  console.log("🚀 Rozpoczynam dodawanie produktów do Medusa...\n")
  
  // Logowanie
  const loggedIn = await login()
  if (!loggedIn) {
    console.error("Nie można się zalogować. Sprawdź czy backend działa i dane logowania są poprawne.")
    process.exit(1)
  }
  
  let totalAdded = 0
  let totalSubcategories = 0
  
  // Dodaj produkty dla każdej kategorii i podkategorii
  for (const category of CATEGORIES_DATA) {
    console.log(`\n📦 Kategoria: ${category.name}`)
    console.log(`   Podkategorie: ${category.subcategories.length}`)
    
    for (const subcategory of category.subcategories) {
      totalSubcategories++
      console.log(`\n   📁 ${subcategory.name}`)
      console.log(`      Dodaję 20 produktów...`)
      
      for (let i = 1; i <= 20; i++) {
        const productData = generateProduct(category.handle, subcategory, totalAdded + i)
        const product = await createProduct(productData)
        
        if (product) {
          totalAdded++
          process.stdout.write(`      ✅ ${i}/20 - ${productData.title.substring(0, 50)}...\r`)
        }
        
        // Małe opóźnienie aby nie przeciążyć API
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      console.log(`\n      ✅ Dodano 20 produktów do ${subcategory.name}`)
    }
  }
  
  console.log(`\n\n✨ Zakończono!`)
  console.log(`   📊 Statystyki:`)
  console.log(`   - Kategorie główne: ${CATEGORIES_DATA.length}`)
  console.log(`   - Podkategorie: ${totalSubcategories}`)
  console.log(`   - Produkty: ${totalAdded}`)
  console.log(`\n📊 Sprawdź produkty:`)
  console.log(`   Frontend: http://localhost:3000/pl/products`)
  console.log(`   API: http://localhost:9000/store/products`)
}

main().catch(console.error)
