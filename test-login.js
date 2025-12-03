#!/usr/bin/env node

const axios = require('axios')

const MEDUSA_URL = 'http://localhost:9000'

// Spróbuj różnych kombinacji
const credentials = [
  { email: 'admin@medusa-test.com', password: 'supersecret' },
  { email: 'admin@localhost', password: 'admin' },
  { email: 'admin@admin.com', password: 'admin' }
]

async function testLogin(email, password) {
  try {
    const response = await axios.post(`${MEDUSA_URL}/admin/auth`, {
      email,
      password
    })
    
    console.log(`✅ Logowanie działa!`)
    console.log(`   Email: ${email}`)
    console.log(`   Token: ${response.data.user.api_token.substring(0, 30)}...`)
    return { email, password, token: response.data.user.api_token }
  } catch (error) {
    console.log(`❌ ${email} - ${error.response?.data?.message || error.message}`)
    return null
  }
}

async function main() {
  console.log('🔐 Testuję logowanie...\n')
  
  for (const cred of credentials) {
    const result = await testLogin(cred.email, cred.password)
    if (result) {
      console.log('\n✨ Znaleziono działające dane!')
      console.log('\n📝 Zaktualizuj add-products-to-medusa.js:')
      console.log(`   ADMIN_EMAIL = '${result.email}'`)
      console.log(`   ADMIN_PASSWORD = '${cred.password}'`)
      console.log('\n🚀 Następnie uruchom:')
      console.log('   node add-products-to-medusa.js')
      return
    }
  }
  
  console.log('\n⚠️  Żadne dane nie działają.')
  console.log('\n💡 Podaj swoje dane logowania:')
  console.log('   Email: _______________')
  console.log('   Hasło: _______________')
}

main()
