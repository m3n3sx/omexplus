const BACKEND_URL = 'http://localhost:9000';
const PUBLISHABLE_KEY = 'pk_c70e4aeb4dfff475873e37bbeb633670a95b4246e07eb7fa7e10beecfdf66cf0';

async function test() {
  console.log('Testing order creation...\n');
  
  // Get region
  console.log('1. Fetching region...');
  const regionRes = await fetch(`${BACKEND_URL}/store/regions`, {
    headers: { 'x-publishable-api-key': PUBLISHABLE_KEY }
  });
  const regionData = await regionRes.json();
  const region = regionData.regions?.[0];
  console.log(`   Region: ${region?.name} (${region?.id})\n`);
  
  // Use a known variant ID
  console.log('2. Using known variant...');
  const variantId = 'var_hyd_001';
  console.log(`   Variant ID: ${variantId}\n`);
  
  // Create cart
  console.log('2. Creating cart...');
  const cartRes = await fetch(`${BACKEND_URL}/store/carts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-publishable-api-key': PUBLISHABLE_KEY
    },
    body: JSON.stringify({ region_id: region.id })
  });
  const cartData = await cartRes.json();
  const cart = cartData.cart;
  console.log(`   Cart ID: ${cart.id}\n`);
  
  // Add item
  console.log('3. Adding item to cart...');
  const addRes = await fetch(`${BACKEND_URL}/store/carts/${cart.id}/line-items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-publishable-api-key': PUBLISHABLE_KEY
    },
    body: JSON.stringify({
      variant_id: variantId,
      quantity: 1
    })
  });
  
  if (!addRes.ok) {
    const error = await addRes.text();
    console.log(`   ERROR: ${error}\n`);
    return;
  }
  console.log('   Item added!\n');
  
  // Update address
  console.log('4. Updating address...');
  const updateRes = await fetch(`${BACKEND_URL}/store/carts/${cart.id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-publishable-api-key': PUBLISHABLE_KEY
    },
    body: JSON.stringify({
      email: 'test@example.com',
      shipping_address: {
        first_name: 'Jan',
        last_name: 'Kowalski',
        address_1: 'ul. Testowa 1',
        city: 'Warszawa',
        postal_code: '00-001',
        country_code: 'pl',
        phone: '+48123456789'
      }
    })
  });
  
  if (!updateRes.ok) {
    const error = await updateRes.text();
    console.log(`   ERROR: ${error}\n`);
    return;
  }
  console.log('   Address updated!\n');
  
  // Complete cart
  console.log('5. Completing cart...');
  const completeRes = await fetch(`${BACKEND_URL}/store/carts/${cart.id}/complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-publishable-api-key': PUBLISHABLE_KEY
    }
  });
  
  if (!completeRes.ok) {
    const error = await completeRes.text();
    console.log(`   ERROR: ${error}\n`);
    return;
  }
  
  const orderData = await completeRes.json();
  console.log(`   ✓ Order created: ${orderData.order?.id}\n`);
  console.log('SUCCESS!');
}

test().catch(console.error);
