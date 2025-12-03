#!/usr/bin/env node

// Prosty skrypt dodający produkty przez SQL
const { Pool } = require('pg')

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/medusa-store"

const pool = new Pool({ connectionString: DATABASE_URL })

const CATEGORIES = [
  {
    name: "Hydraulika",
    handle: "hydraulika",
    subcategories: [
      { name: 'Pompy hydrauliczne', handle: 'pompy-hydrauliczne' },
      { name: 'Silniki hydrauliczne', handle: 'silniki-hydrauliczne' },
      { name: 'Zawory hydrauliczne', handle: 'zawory-hydrauliczne' }
    ]
  }
]

async function addProduct(category, subcategory, index) {
  const productId = `prod_${subcategory.handle}_${index}`
  const variantId = `var_${subcategory.handle}_${index}`
  const sku = `${subcategory.handle.substring(0,6).toUpperCase()}-${String(index).padStart(4,'0')}`
  
  const manufacturer = ["Rexroth", "Danfoss", "Parker"][index % 3]
  const model = `${String.fromCharCode(65 + (index % 26))}${100 + index}`
  const title = `${subcategory.name} ${manufacturer} ${model}`
  
  try {
    // Dodaj produkt
    await pool.query(`
      INSERT INTO product (id, title, handle, status, created_at, updated_at)
      VALUES ($1, $2, $3, 'published', NOW(), NOW())
      ON CONFLICT (id) DO NOTHING
    `, [productId, title, `${subcategory.handle}-${manufacturer.toLowerCase()}-${model.toLowerCase()}-${index}`])
    
    // Dodaj wariant
    await pool.query(`
      INSERT INTO product_variant (id, title, product_id, sku, inventory_quantity, manage_inventory, created_at, updated_at)
      VALUES ($1, 'Standard', $2, $3, $4, true, NOW(), NOW())
      ON CONFLICT (id) DO NOTHING
    `, [variantId, productId, sku, Math.floor(Math.random() * 50) + 5])
    
    // Dodaj cenę PLN
    await pool.query(`
      INSERT INTO money_amount (id, currency_code, amount, variant_id, created_at, updated_at)
      VALUES ($1, 'pln', $2, $3, NOW(), NOW())
      ON CONFLICT (id) DO NOTHING
    `, [`price_${variantId}_pln`, Math.floor((Math.random() * 4900 + 100) * 100), variantId])
    
    return true
  } catch (error) {
    console.error(`Błąd dodawania produktu ${title}:`, error.message)
    return false
  }
}

async function main() {
  console.log("🚀 Dodawanie produktów przez SQL...\n")
  
  let total = 0
  
  for (const category of CATEGORIES) {
    console.log(`📦 ${category.name}`)
    
    for (const subcategory of category.subcategories) {
      console.log(`  📁 ${subcategory.name}`)
      
      for (let i = 1; i <= 20; i++) {
        const success = await addProduct(category, subcategory, i)
        if (success) {
          total++
          process.stdout.write(`     ${i}/20\r`)
        }
      }
      console.log(`     ✅ 20 produktów`)
    }
  }
  
  await pool.end()
  
  console.log(`\n✨ Dodano ${total} produktów!`)
  console.log(`\n📊 Sprawdź: http://localhost:3000/pl/products`)
}

main().catch(console.error)
