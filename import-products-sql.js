#!/usr/bin/env node

const { Client } = require('pg');

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

function generateId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

async function main() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'medusa-my-medusa-store',
    user: 'postgres',
    password: 'postgres'
  });

  try {
    await client.connect();
    console.log('✅ Połączono z bazą danych\n');

    // Sprawdź ile produktów już jest
    const countResult = await client.query('SELECT COUNT(*) FROM product WHERE deleted_at IS NULL');
    const currentCount = parseInt(countResult.rows[0].count);
    console.log(`📊 Aktualnie w bazie: ${currentCount} produktów\n`);

    let totalAdded = 0;
    const manufacturers = {
      hydraulika: ["Rexroth", "Danfoss", "Parker", "Eaton", "Vickers"],
      filtry: ["Mann", "Donaldson", "Fleetguard", "Mahle", "Bosch"],
      silniki: ["Caterpillar", "Cummins", "Perkins", "Deutz", "Volvo"],
      podwozia: ["Berco", "ITR", "VemaTrack", "Prowler", "Bridgestone"],
      elektryka: ["Bosch", "Hella", "Valeo", "Magneti Marelli", "Denso"]
    };

    for (const category of CATEGORIES_DATA) {
      console.log(`\n📦 Kategoria: ${category.name}`);
      
      for (const subcategory of category.subcategories) {
        console.log(`   📁 ${subcategory.name}`);
        
        for (let i = 1; i <= 20; i++) {
          const productId = generateId('prod');
          const variantId = generateId('var');
          const priceId = generateId('price');
          
          const mfr = manufacturers[category.handle][i % manufacturers[category.handle].length];
          const model = `${String.fromCharCode(65 + (i % 26))}${100 + totalAdded + i}`;
          const title = `${subcategory.name} ${mfr} ${model}`;
          const handle = `${subcategory.handle}-${mfr.toLowerCase()}-${model.toLowerCase()}-${totalAdded + i}`;
          const sku = `${subcategory.handle.substring(0,6).toUpperCase().replace(/-/g,'')}-${String(totalAdded + i).padStart(4,'0')}`;
          const price = Math.floor((Math.random() * 4900 + 100) * 100);
          const inventory = Math.floor(Math.random() * 50) + 5;

          // Dodaj produkt
          await client.query(`
            INSERT INTO product (id, title, handle, status, created_at, updated_at)
            VALUES ($1, $2, $3, 'published', NOW(), NOW())
          `, [productId, title, handle]);

          // Dodaj wariant
          await client.query(`
            INSERT INTO product_variant (id, title, product_id, sku, inventory_quantity, manage_inventory, created_at, updated_at)
            VALUES ($1, 'Standard', $2, $3, $4, true, NOW(), NOW())
          `, [variantId, productId, sku, inventory]);

          // Dodaj cenę
          await client.query(`
            INSERT INTO price_set (id, created_at, updated_at)
            VALUES ($1, NOW(), NOW())
          `, [priceId]);

          await client.query(`
            INSERT INTO price (id, price_set_id, amount, currency_code, created_at, updated_at)
            VALUES ($1, $2, $3, 'pln', NOW(), NOW())
          `, [generateId('price'), priceId, price]);

          // Połącz wariant z ceną
          await client.query(`
            UPDATE product_variant SET price_set_id = $1 WHERE id = $2
          `, [priceId, variantId]);

          totalAdded++;
          process.stdout.write(`      ✅ ${i}/20 - ${title.substring(0, 40)}...\r`);
        }
        console.log(`\n      ✅ Dodano 20 produktów`);
      }
    }

    const finalCount = await client.query('SELECT COUNT(*) FROM product WHERE deleted_at IS NULL');
    console.log(`\n\n✨ Zakończono!`);
    console.log(`   📊 Statystyki:`);
    console.log(`   - Dodano: ${totalAdded} produktów`);
    console.log(`   - Razem w bazie: ${finalCount.rows[0].count} produktów`);
    console.log(`\n📊 Sprawdź produkty:`);
    console.log(`   Frontend: http://localhost:3000/pl/products`);
    console.log(`   API: http://localhost:9000/store/products`);

    await client.end();
  } catch (error) {
    console.error('❌ Błąd:', error.message);
    await client.end();
    process.exit(1);
  }
}

main();
