#!/usr/bin/env node

const axios = require('axios');

const MEDUSA_URL = 'http://localhost:9000';
const ADMIN_EMAIL = 'admin@medusa-test.com';
const ADMIN_PASSWORD = 'supersecret';

let authToken = null;

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
];

async function login() {
  console.log("🔐 Logowanie do Medusa Admin...");
  try {
    const response = await axios.post(`${MEDUSA_URL}/auth/user/emailpass`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });
    
    authToken = response.data.token;
    console.log("✅ Zalogowano pomyślnie");
    return true;
  } catch (error) {
    console.error("❌ Błąd logowania:");
    console.error("Status:", error.response?.status);
    console.error("Data:", JSON.stringify(error.response?.data, null, 2));
    console.error("Message:", error.message);
    return false;
  }
}

function generateProduct(category, subcategory, index) {
  const manufacturers = {
    hydraulika: ["Rexroth", "Danfoss", "Parker", "Eaton", "Vickers"],
    filtry: ["Mann", "Donaldson", "Fleetguard", "Mahle", "Bosch"],
    silniki: ["Caterpillar", "Cummins", "Perkins", "Deutz", "Volvo"],
    podwozia: ["Berco", "ITR", "VemaTrack", "Prowler", "Bridgestone"],
    elektryka: ["Bosch", "Hella", "Valeo", "Magneti Marelli", "Denso"]
  };
  
  const mfr = manufacturers[category][index % manufacturers[category].length];
  const model = `${String.fromCharCode(65 + (index % 26))}${100 + index}`;
  const type = subcategory.name;
  
  return {
    title: `${type} ${mfr} ${model}`,
    subtitle: `Model ${model} - Oryginalna część ${mfr}`,
    description: `Wysokiej jakości ${type.toLowerCase()} marki ${mfr}. Model ${model} zapewnia doskonałą wydajność i trwałość. Idealny do maszyn budowlanych, koparek, ładowarek i sprzętu przemysłowego. Gwarancja producenta. Certyfikaty CE i ISO.`,
    handle: `${subcategory.handle}-${mfr.toLowerCase()}-${model.toLowerCase()}-${Date.now()}-${index}`,
    status: "published",
    variants: [
      {
        title: "Standard",
        sku: `${subcategory.handle.substring(0,6).toUpperCase().replace(/-/g,'')}-${String(index).padStart(4,'0')}`,
        manage_inventory: true,
        inventory_quantity: Math.floor(Math.random() * 50) + 5,
        prices: [
          {
            amount: Math.floor((Math.random() * 4900 + 100) * 100),
            currency_code: "pln"
          }
        ]
      }
    ]
  };
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
    );
    return response.data.product;
  } catch (error) {
    console.error(`❌ Błąd:`, error.response?.data?.message || error.message);
    return null;
  }
}

async function main() {
  console.log("🚀 Rozpoczynam dodawanie produktów do Medusa...\n");
  
  const loggedIn = await login();
  if (!loggedIn) {
    console.error("Nie można się zalogować.");
    process.exit(1);
  }
  
  let totalAdded = 0;
  let totalFailed = 0;
  
  for (const category of CATEGORIES_DATA) {
    console.log(`\n📦 Kategoria: ${category.name}`);
    
    for (const subcategory of category.subcategories) {
      console.log(`\n   📁 ${subcategory.name}`);
      console.log(`      Dodaję 20 produktów...`);
      
      for (let i = 1; i <= 20; i++) {
        const productData = generateProduct(category.handle, subcategory, totalAdded + i);
        const product = await createProduct(productData);
        
        if (product) {
          totalAdded++;
          process.stdout.write(`      ✅ ${i}/20\r`);
        } else {
          totalFailed++;
        }
        
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      console.log(`\n      ✅ Dodano produkty do ${subcategory.name}`);
    }
  }
  
  console.log(`\n\n✨ Zakończono!`);
  console.log(`   📊 Statystyki:`);
  console.log(`   - Dodano: ${totalAdded}`);
  console.log(`   - Błędy: ${totalFailed}`);
  console.log(`\n📊 Sprawdź produkty:`);
  console.log(`   Frontend: http://localhost:3000/pl/products`);
  console.log(`   API: http://localhost:9000/store/products`);
}

main().catch(console.error);
