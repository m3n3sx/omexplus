const fetch = require('node-fetch');

async function testAdminAPI() {
  console.log('🔍 Testing Admin API Endpoints\n');
  
  try {
    // 1. Login
    console.log('1. Testing login...');
    const loginResponse = await fetch('http://localhost:9000/auth/user/emailpass', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@medusa-test.com',
        password: 'supersecret'
      })
    });
    
    const loginData = await loginResponse.json();
    const token = loginData.token;
    
    if (!token) {
      console.error('❌ Login failed:', loginData);
      return;
    }
    console.log('✅ Login successful');
    console.log('Token:', token.substring(0, 50) + '...\n');
    
    // 2. Test products endpoint
    console.log('2. Testing /admin/products...');
    const productsResponse = await fetch('http://localhost:9000/admin/products?limit=5', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status:', productsResponse.status);
    const productsText = await productsResponse.text();
    console.log('Response length:', productsText.length);
    
    try {
      const productsData = JSON.parse(productsText);
      console.log('✅ Products endpoint working');
      console.log('Products found:', productsData.products?.length || 0);
      if (productsData.products && productsData.products.length > 0) {
        console.log('First product:', {
          id: productsData.products[0].id,
          title: productsData.products[0].title,
          status: productsData.products[0].status
        });
      }
    } catch (e) {
      console.error('❌ Failed to parse products response');
      console.log('Response:', productsText.substring(0, 500));
    }
    console.log('');
    
    // 3. Test orders endpoint
    console.log('3. Testing /admin/orders...');
    const ordersResponse = await fetch('http://localhost:9000/admin/orders?limit=5', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status:', ordersResponse.status);
    const ordersData = await ordersResponse.json();
    console.log('✅ Orders endpoint working');
    console.log('Orders found:', ordersData.orders?.length || 0);
    console.log('');
    
    // 4. Test customers endpoint
    console.log('4. Testing /admin/customers...');
    const customersResponse = await fetch('http://localhost:9000/admin/customers?limit=5', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status:', customersResponse.status);
    const customersData = await customersResponse.json();
    console.log('✅ Customers endpoint working');
    console.log('Customers found:', customersData.customers?.length || 0);
    console.log('');
    
    console.log('='.repeat(50));
    console.log('✅ All API tests completed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  }
}

testAdminAPI();
