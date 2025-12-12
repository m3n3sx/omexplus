const BACKEND_URL = 'http://localhost:9000';
const PUBLISHABLE_KEY = 'pk_c70e4aeb4dfff475873e37bbeb633670a95b4246e07eb7fa7e10beecfdf66cf0';

// Helper to generate random date in last 5 years
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Helper to get random item from array
function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Polish names for realistic data
const firstNames = ['Jan', 'Anna', 'Piotr', 'Maria', 'Krzysztof', 'Katarzyna', 'Tomasz', 'Magdalena', 'Andrzej', 'Agnieszka'];
const lastNames = ['Kowalski', 'Nowak', 'Wiśniewski', 'Wójcik', 'Kowalczyk', 'Kamiński', 'Lewandowski', 'Zieliński', 'Szymański', 'Woźniak'];
const cities = ['Warszawa', 'Kraków', 'Wrocław', 'Poznań', 'Gdańsk', 'Szczecin', 'Bydgoszcz', 'Lublin', 'Katowice', 'Białystok'];
const streets = ['Główna', 'Polna', 'Leśna', 'Słoneczna', 'Krótka', 'Długa', 'Kwiatowa', 'Ogrodowa', 'Lipowa', 'Brzozowa'];

async function getProducts() {
  const response = await fetch(`${BACKEND_URL}/store/products?limit=100`, {
    headers: {
      'x-publishable-api-key': PUBLISHABLE_KEY
    }
  });
  const data = await response.json();
  return data.products || [];
}

async function getRegion() {
  const response = await fetch(`${BACKEND_URL}/store/regions`, {
    headers: {
      'x-publishable-api-key': PUBLISHABLE_KEY
    }
  });
  const data = await response.json();
  return data.regions?.[0];
}

async function createCart(region) {
  const response = await fetch(`${BACKEND_URL}/store/carts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-publishable-api-key': PUBLISHABLE_KEY
    },
    body: JSON.stringify({
      region_id: region.id
    })
  });
  const data = await response.json();
  return data.cart;
}

async function addItemToCart(cartId, variantId, quantity) {
  const response = await fetch(`${BACKEND_URL}/store/carts/${cartId}/line-items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-publishable-api-key': PUBLISHABLE_KEY
    },
    body: JSON.stringify({
      variant_id: variantId,
      quantity: quantity
    })
  });
  return response.ok;
}

async function updateCartAddress(cartId) {
  const firstName = randomItem(firstNames);
  const lastName = randomItem(lastNames);
  const city = randomItem(cities);
  const street = randomItem(streets);
  
  const response = await fetch(`${BACKEND_URL}/store/carts/${cartId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-publishable-api-key': PUBLISHABLE_KEY
    },
    body: JSON.stringify({
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      shipping_address: {
        first_name: firstName,
        last_name: lastName,
        address_1: `ul. ${street} ${Math.floor(Math.random() * 100) + 1}`,
        city: city,
        postal_code: `${Math.floor(Math.random() * 90) + 10}-${Math.floor(Math.random() * 900) + 100}`,
        country_code: 'pl',
        phone: `+48${Math.floor(Math.random() * 900000000) + 100000000}`
      }
    })
  });
  return response.ok;
}

async function completeCart(cartId) {
  const response = await fetch(`${BACKEND_URL}/store/carts/${cartId}/complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-publishable-api-key': PUBLISHABLE_KEY
    }
  });
  
  if (!response.ok) {
    const error = await response.text();
    console.error(`Failed to complete cart: ${error}`);
    return null;
  }
  
  const data = await response.json();
  return data.order;
}

async function generateOrder(products, region, orderDate) {
  try {
    // Create cart
    const cart = await createCart(region);
    if (!cart) {
      console.error('Failed to create cart');
      return null;
    }
    
    // Add 1-5 random products
    const numItems = Math.floor(Math.random() * 5) + 1;
    for (let i = 0; i < numItems; i++) {
      const product = randomItem(products);
      if (product.variants && product.variants.length > 0) {
        const variant = randomItem(product.variants);
        const quantity = Math.floor(Math.random() * 3) + 1;
        await addItemToCart(cart.id, variant.id, quantity);
      }
    }
    
    // Update address
    await updateCartAddress(cart.id);
    
    // Complete cart to create order
    const order = await completeCart(cart.id);
    
    if (order) {
      console.log(`✓ Created order ${order.id} for ${orderDate.toISOString().split('T')[0]}`);
      return order;
    }
    
    return null;
  } catch (error) {
    console.error(`Error generating order:`, error.message);
    return null;
  }
}

async function main() {
  console.log('Starting historical order generation...\n');
  
  // Get products and region
  console.log('Fetching products and region...');
  const products = await getProducts();
  const region = await getRegion();
  
  if (!products.length) {
    console.error('No products found!');
    return;
  }
  
  if (!region) {
    console.error('No region found!');
    return;
  }
  
  console.log(`Found ${products.length} products and region ${region.name}\n`);
  
  // Generate 540 orders over 5 years
  const now = new Date();
  const fiveYearsAgo = new Date(now.getFullYear() - 5, now.getMonth(), now.getDate());
  
  const totalOrders = 540;
  let successCount = 0;
  let failCount = 0;
  
  console.log(`Generating ${totalOrders} orders from ${fiveYearsAgo.toISOString().split('T')[0]} to ${now.toISOString().split('T')[0]}\n`);
  
  for (let i = 0; i < totalOrders; i++) {
    const orderDate = randomDate(fiveYearsAgo, now);
    const order = await generateOrder(products, region, orderDate);
    
    if (order) {
      successCount++;
    } else {
      failCount++;
    }
    
    // Progress update every 50 orders
    if ((i + 1) % 50 === 0) {
      console.log(`\nProgress: ${i + 1}/${totalOrders} (${successCount} success, ${failCount} failed)\n`);
    }
    
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n=== SUMMARY ===');
  console.log(`Total orders attempted: ${totalOrders}`);
  console.log(`Successfully created: ${successCount}`);
  console.log(`Failed: ${failCount}`);
}

main().catch(console.error);
