const fetch = require('node-fetch');

async function checkDataConsistency() {
  console.log('🔍 Checking Data Consistency Across All Systems\n');
  console.log('='.repeat(60));
  
  try {
    // 1. Check database directly
    console.log('\n1️⃣  DATABASE (PostgreSQL)');
    console.log('-'.repeat(60));
    const { execSync } = require('child_process');
    
    const productCount = execSync(
      `psql postgres://postgres@localhost/medusa-my-medusa-store -t -c "SELECT COUNT(*) FROM product WHERE deleted_at IS NULL;"`
    ).toString().trim();
    
    const orderCount = execSync(
      `psql postgres://postgres@localhost/medusa-my-medusa-store -t -c "SELECT COUNT(*) FROM \\\"order\\\" WHERE deleted_at IS NULL;"`
    ).toString().trim();
    
    const customerCount = execSync(
      `psql postgres://postgres@localhost/medusa-my-medusa-store -t -c "SELECT COUNT(*) FROM customer WHERE deleted_at IS NULL;"`
    ).toString().trim();
    
    console.log(`   Products:  ${productCount}`);
    console.log(`   Orders:    ${orderCount}`);
    console.log(`   Customers: ${customerCount}`);
    
    // 2. Check backend API
    console.log('\n2️⃣  BACKEND API (Medusa on :9000)');
    console.log('-'.repeat(60));
    
    // Login first
    const loginResponse = await fetch('http://localhost:9000/auth/user/emailpass', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@medusa-test.com',
        password: 'supersecret'
      })
    });
    
    const { token } = await loginResponse.json();
    
    if (!token) {
      console.log('   ❌ Authentication failed');
      return;
    }
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    // Get products
    const productsRes = await fetch('http://localhost:9000/admin/products?limit=1000', { headers });
    const productsData = await productsRes.json();
    console.log(`   Products:  ${productsData.products?.length || 0} (API returned)`);
    console.log(`   Count:     ${productsData.count || 'N/A'} (total in DB)`);
    
    // Get orders
    const ordersRes = await fetch('http://localhost:9000/admin/orders?limit=1000', { headers });
    const ordersData = await ordersRes.json();
    console.log(`   Orders:    ${ordersData.orders?.length || 0}`);
    
    // Get customers
    const customersRes = await fetch('http://localhost:9000/admin/customers?limit=1000', { headers });
    const customersData = await customersRes.json();
    console.log(`   Customers: ${customersData.customers?.length || 0}`);
    
    // 3. Check storefront API
    console.log('\n3️⃣  STOREFRONT API (Next.js on :3000)');
    console.log('-'.repeat(60));
    
    try {
      const storefrontProducts = await fetch('http://localhost:3000/api/products?limit=1000');
      if (storefrontProducts.ok) {
        const storefrontData = await storefrontProducts.json();
        console.log(`   Products:  ${storefrontData.products?.length || 0}`);
      } else {
        console.log(`   ⚠️  Storefront not running or API error (${storefrontProducts.status})`);
      }
    } catch (e) {
      console.log(`   ⚠️  Storefront not accessible: ${e.message}`);
    }
    
    // 4. Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY');
    console.log('='.repeat(60));
    console.log(`
Database has:     ${productCount} products, ${orderCount} orders, ${customerCount} customers
Backend API sees: ${productsData.count || productsData.products?.length || 0} products, ${ordersData.orders?.length || 0} orders, ${customersData.customers?.length || 0} customers

✅ All systems should show the SAME data from the database!
`);
    
    // Check for discrepancies
    if (parseInt(productCount) !== (productsData.count || productsData.products?.length || 0)) {
      console.log('⚠️  WARNING: Product count mismatch between database and API!');
      console.log('   This might be due to:');
      console.log('   - Deleted products (deleted_at IS NOT NULL)');
      console.log('   - Draft products (status = draft)');
      console.log('   - API pagination limits');
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

checkDataConsistency();
