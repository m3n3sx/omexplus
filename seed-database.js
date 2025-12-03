#!/usr/bin/env node

const { execSync } = require('child_process')
const { Pool } = require('pg')

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/medusa-store"

async function clearDatabase() {
  console.log("🗑️  Czyszczenie bazy danych...")
  
  const pool = new Pool({ connectionString: DATABASE_URL })
  
  try {
    // Usuń produkty
    await pool.query('DELETE FROM product_variant WHERE 1=1')
    await pool.query('DELETE FROM product WHERE 1=1')
    await pool.query('DELETE FROM product_category WHERE 1=1')
    
    console.log("✅ Baza danych wyczyszczona")
  } catch (error) {
    console.error("❌ Błąd czyszczenia:", error.message)
  } finally {
    await pool.end()
  }
}

async function seedProducts() {
  console.log("\n🌱 Seedowanie produktów...")
  
  try {
    // Uruchom Medusa seed
    execSync('cd my-medusa-store && npm run seed', { stdio: 'inherit' })
    console.log("✅ Produkty dodane")
  } catch (error) {
    console.error("❌ Błąd seedowania:", error.message)
  }
}

async function main() {
  console.log("🚀 Rozpoczynam proces seedowania...\n")
  
  const args = process.argv.slice(2)
  const skipClear = args.includes('--skip-clear')
  
  if (!skipClear) {
    await clearDatabase()
  }
  
  await seedProducts()
  
  console.log("\n✨ Proces zakończony!")
  console.log("\n📊 Sprawdź produkty:")
  console.log("   http://localhost:9000/store/products")
}

main().catch(console.error)
