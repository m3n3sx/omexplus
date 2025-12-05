// Test CMS API
const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000'

async function testCMS() {
  console.log('🧪 Testowanie CMS API...\n')
  
  try {
    // Test 1: Pobierz wszystkie elementy CMS
    console.log('1️⃣ Test: GET /store/cms')
    const res1 = await fetch(`${BACKEND_URL}/store/cms?locale=pl`)
    const data1 = await res1.json()
    console.log('✅ Status:', res1.status)
    console.log('📦 Elementy:', data1.contents?.length || 0)
    if (data1.contents?.length > 0) {
      console.log('   Przykład:', data1.contents[0].name)
    }
    console.log()
    
    // Test 2: Pobierz konkretny element
    console.log('2️⃣ Test: GET /store/cms?key=main-header')
    const res2 = await fetch(`${BACKEND_URL}/store/cms?key=main-header&locale=pl`)
    const data2 = await res2.json()
    console.log('✅ Status:', res2.status)
    if (data2.content) {
      console.log('📦 Element:', data2.content.name)
      console.log('   Zawartość:', JSON.stringify(data2.content.content, null, 2))
    }
    console.log()
    
    // Test 3: Pobierz menu
    console.log('3️⃣ Test: GET /store/cms/menus?key=main-menu')
    const res3 = await fetch(`${BACKEND_URL}/store/cms/menus?key=main-menu&locale=pl`)
    const data3 = await res3.json()
    console.log('✅ Status:', res3.status)
    if (data3.menu) {
      console.log('📦 Menu:', data3.menu.name)
      console.log('   Pozycje:', data3.menu.items?.length || 0)
      if (data3.menu.items?.length > 0) {
        data3.menu.items.forEach((item, i) => {
          console.log(`   ${i + 1}. ${item.label} → ${item.url}`)
        })
      }
    }
    console.log()
    
    // Test 4: Pobierz elementy po typie
    console.log('4️⃣ Test: GET /store/cms?type=hero')
    const res4 = await fetch(`${BACKEND_URL}/store/cms?type=hero&locale=pl`)
    const data4 = await res4.json()
    console.log('✅ Status:', res4.status)
    console.log('📦 Hero sections:', data4.contents?.length || 0)
    console.log()
    
    console.log('🎉 Wszystkie testy zakończone!')
    console.log('\n📝 Następne kroki:')
    console.log('   1. Otwórz panel: http://localhost:3001/cms')
    console.log('   2. Dodaj nowe elementy')
    console.log('   3. Edytuj istniejące elementy')
    console.log('   4. Użyj na frontendzie')
    
  } catch (error) {
    console.error('❌ Błąd:', error.message)
    console.log('\n💡 Upewnij się że:')
    console.log('   - Backend działa (npm run dev)')
    console.log('   - Baza danych jest zainicjalizowana (node init-cms-db.js)')
    console.log('   - Port 9000 jest dostępny')
  }
}

testCMS()
