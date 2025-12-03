#!/usr/bin/env node

const axios = require('axios')

const MEDUSA_URL = 'http://localhost:9000'

async function createAdminUser() {
  console.log("🔐 Tworzenie użytkownika admin...")
  
  try {
    const response = await axios.post(`${MEDUSA_URL}/admin/users`, {
      email: 'admin@medusa-test.com',
      password: 'supersecret',
      first_name: 'Admin',
      last_name: 'User'
    })
    
    console.log("✅ Użytkownik admin utworzony!")
    console.log("   Email: admin@medusa-test.com")
    console.log("   Hasło: supersecret")
    return true
  } catch (error) {
    if (error.response?.status === 409) {
      console.log("ℹ️  Użytkownik admin już istnieje")
      return true
    }
    console.error("❌ Błąd:", error.response?.data || error.message)
    return false
  }
}

async function testLogin() {
  console.log("\n🔍 Testowanie logowania...")
  
  try {
    const response = await axios.post(`${MEDUSA_URL}/admin/auth`, {
      email: 'admin@medusa-test.com',
      password: 'supersecret'
    })
    
    console.log("✅ Logowanie działa!")
    console.log("   Token:", response.data.user.api_token?.substring(0, 20) + "...")
    return true
  } catch (error) {
    console.error("❌ Logowanie nie działa:", error.response?.data || error.message)
    return false
  }
}

async function main() {
  console.log("🚀 Konfiguracja użytkownika admin\n")
  
  await createAdminUser()
  await testLogin()
  
  console.log("\n✅ Gotowe! Możesz teraz uruchomić:")
  console.log("   node add-products-to-medusa.js")
}

main().catch(console.error)
