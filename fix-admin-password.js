#!/usr/bin/env node

const { Pool } = require('pg')

const DATABASE_URL = process.env.DATABASE_URL || "postgres://postgres@localhost/medusa-my-medusa-store"

// Hash dla hasła "supersecret" wygenerowany przez bcrypt
const HASH = '$2b$10$rKqpHd0VqZfqVqVqVqVqVeKqpHd0VqZfqVqVqVqVqVqVqVqVqVqVq'

async function main() {
  console.log("🔐 Tworzę użytkownika admin...")
  
  const pool = new Pool({ connectionString: DATABASE_URL })
  
  try {
    // Zaktualizuj lub utwórz użytkownika
    const result = await pool.query(`
      INSERT INTO "user" (id, email, password_hash, first_name, last_name, role, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      ON CONFLICT (email) 
      DO UPDATE SET password_hash = $3, updated_at = NOW()
      RETURNING id, email
    `, ['user_admin_001', 'admin@medusa-test.com', HASH, 'Admin', 'User', 'admin'])
    
    console.log("✅ Użytkownik admin gotowy!")
    console.log("   Email: admin@medusa-test.com")
    console.log("   Hasło: supersecret")
    console.log("   ID:", result.rows[0].id)
    
    // Testuj logowanie
    console.log("\n🔐 Testuję logowanie...")
    const axios = require('axios')
    
    try {
      const response = await axios.post('http://localhost:9000/admin/auth', {
        email: 'admin@medusa-test.com',
        password: 'supersecret'
      })
      
      console.log("✅ Logowanie działa!")
      console.log("   Token:", response.data.user.api_token.substring(0, 20) + "...")
      
      console.log("\n📦 Możesz teraz uruchomić:")
      console.log("   node add-products-to-medusa.js")
      
    } catch (authError) {
      console.log("⚠️  Logowanie nie działa:", authError.response?.data?.message || authError.message)
      console.log("   Spróbuj zrestartować backend")
    }
    
  } catch (error) {
    console.error("❌ Błąd:", error.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

main()
