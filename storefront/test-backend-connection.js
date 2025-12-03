#!/usr/bin/env node

const http = require('http');

console.log('🔍 Testowanie połączenia z backendem Medusa...\n');

// Test 1: Health Check
console.log('Test 1: Health Check');
http.get('http://localhost:9000/health', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('✅ Backend odpowiada:', data);
    } else {
      console.log('❌ Backend zwrócił status:', res.statusCode);
    }
    
    // Test 2: Store API
    console.log('\nTest 2: Store API');
    http.get('http://localhost:9000/store/products?limit=1', (res2) => {
      let data2 = '';
      res2.on('data', (chunk) => { data2 += chunk; });
      res2.on('end', () => {
        if (res2.statusCode === 200) {
          console.log('✅ Store API działa');
          try {
            const json = JSON.parse(data2);
            console.log('   Liczba produktów:', json.count || 0);
          } catch (e) {
            console.log('   Odpowiedź:', data2.substring(0, 100));
          }
        } else {
          console.log('❌ Store API zwróciło status:', res2.statusCode);
        }
        
        // Test 3: CORS Headers
        console.log('\nTest 3: CORS Headers');
        const options = {
          hostname: 'localhost',
          port: 9000,
          path: '/store/products',
          method: 'OPTIONS',
          headers: {
            'Origin': 'http://localhost:3000',
            'Access-Control-Request-Method': 'GET',
            'Access-Control-Request-Headers': 'Content-Type'
          }
        };
        
        const req = http.request(options, (res3) => {
          const corsHeader = res3.headers['access-control-allow-origin'];
          if (corsHeader && corsHeader.includes('localhost:3000')) {
            console.log('✅ CORS jest poprawnie skonfigurowany');
            console.log('   Allow-Origin:', corsHeader);
          } else {
            console.log('❌ CORS nie jest skonfigurowany dla localhost:3000');
            console.log('   Allow-Origin:', corsHeader || 'brak');
          }
          
          console.log('\n📊 Podsumowanie:');
          console.log('Backend URL: http://localhost:9000');
          console.log('Frontend URL: http://localhost:3000');
          console.log('\n✨ Jeśli wszystkie testy przeszły, backend jest gotowy!');
        });
        
        req.on('error', (e) => {
          console.log('❌ Błąd CORS test:', e.message);
        });
        
        req.end();
      });
    }).on('error', (e) => {
      console.log('❌ Błąd Store API:', e.message);
    });
  });
}).on('error', (e) => {
  console.log('❌ Backend nie odpowiada:', e.message);
  console.log('\n💡 Upewnij się że backend działa:');
  console.log('   cd my-medusa-store');
  console.log('   npm run dev');
});
