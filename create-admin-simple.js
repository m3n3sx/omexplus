#!/usr/bin/env node

const { Client } = require('pg')
const bcrypt = require('bcrypt')

async function createAdmin() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'medusa-store',
    user: 'postgres',
    password: 'postgres'
  })

  try {
    await client.connect()
    console.log('✅ Połączono z bazą danych')

    // Sprawdź czy admin już istnieje
    const checkResult = await client.query(
      "SELECT id FROM \"user\" WHERE email = $1",
      ['admin@medusa-test.com']
    )

    if (checkResult.rows.length > 0) {
      console.log('ℹ️  Użytkownik admin już istnieje')
      await client.end()
      return true
    }

    // Hashuj hasło
    const hashedPassword = await bcrypt.hash('supersecret', 10)

    // Utwórz admina
    const result = await client.query(
      `INSERT INTO "user" (id, email, password_hash, role, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING id, email`,
      [
        'user_admin_' + Date.now(),
        'admin@medusa-test.com',
        hashedPassword,
        'admin'
      ]
    )

    console.log('✅ Utworzono użytkownika admin:', result.rows[0])
    await client.end()
    return true

  } catch (error) {
    console.error('❌ Błąd:', error.message)
    await client.end()
    return false
  }
}

createAdmin().then(success => {
  if (success) {
    console.log('\n✨ Możesz teraz uruchomić import produktów:')
    console.log('   node add-products-to-medusa.js')
  }
  process.exit(success ? 0 : 1)
})
