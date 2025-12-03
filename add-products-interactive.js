#!/usr/bin/env node

const axios = require('axios')
const readline = require('readline')

const MEDUSA_URL = 'http://localhost:9000'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query) {
  return new Promise(resolve => rl.question(query, resolve))
}

async function main() {
  console.log('🚀 Dodawanie produktów do Medusa\n')
  
  // Zapytaj o dane logowania
  const email = await question('📧 Email admina: ')
  const password = await question('🔐 Hasło: ')
  
  console.log('\n🔐 Testuję logowanie...')
  
  try {
    const response = await axios.post(`${MEDUSA_URL}/admin/auth`, {
      email,
      password
    })
    
    const token = response.data.user.api_token
    console.log('✅ Zalogowano pomyślnie!\n')
    
    // Teraz dodaj produkty
    console.log('📦 Dodaję produkty...\n')
    
    let totalAdded = 0
    
    // Przykład: dodaj 5 testowych produktów
    for (let i = 1; i <= 5; i++) {
      try {
        const productData = {
          title: `Test Product ${i}`,
          description: `Test description for product ${i}`,
          handle: `test-product-${i}`,
          status: 'published',
          options: [{ title: 'Wariant', values: ['Standard'] }],
          variants: [{
            title: 'Standard',
            sku: `TEST-${String(i).padStart(4, '0')}`,
            inventory_quantity: 10,
            prices: [
              { amount: 10000 * i, currency_code: 'pln' }
            ],
            options: [{ value: 'Standard' }]
          }]
        }
        
        const prodResponse = await axios.post(
          `${MEDUSA_URL}/admin/products`,
          productData,
          { headers: { 'Authorization': `Bearer ${token}` } }
        )
        
        totalAdded++
        console.log(`✅ ${i}/5 - ${productData.title}`)
        
      } catch (error) {
        console.log(`❌ Błąd: ${error.response?.data?.message || error.message}`)
      }
    }
    
    console.log(`\n✨ Dodano ${totalAdded} produktów testowych!`)
    console.log('\n📊 Sprawdź:')
    console.log('   http://localhost:3000/pl/products')
    console.log('   http://localhost:7001 (Admin Panel)')
    
  } catch (error) {
    console.log('❌ Logowanie nie powiodło się:', error.response?.data?.message || error.message)
    console.log('\n💡 Sprawdź:')
    console.log('   - Czy backend działa (http://localhost:9000/health)')
    console.log('   - Czy email i hasło są poprawne')
    console.log('   - Czy konto jest aktywne w Admin Panel')
  }
  
  rl.close()
}

main()
