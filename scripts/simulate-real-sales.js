const { Client } = require('pg');

const DATABASE_URL = 'postgres://medusa_user:medusa_password@localhost/medusa_db';

// Polish customer data
const firstNames = ['Jan', 'Anna', 'Piotr', 'Maria', 'Krzysztof', 'Katarzyna', 'Tomasz', 'Magdalena', 'Andrzej', 'Agnieszka', 'Paweł', 'Joanna', 'Marcin', 'Ewa', 'Michał', 'Barbara', 'Kamil', 'Monika', 'Łukasz', 'Natalia'];
const lastNames = ['Kowalski', 'Nowak', 'Wiśniewski', 'Wójcik', 'Kowalczyk', 'Kamiński', 'Lewandowski', 'Zieliński', 'Szymański', 'Woźniak', 'Dąbrowski', 'Kozłowski', 'Jankowski', 'Mazur', 'Kwiatkowski'];
const cities = ['Warszawa', 'Kraków', 'Wrocław', 'Poznań', 'Gdańsk', 'Szczecin', 'Bydgoszcz', 'Lublin', 'Katowice', 'Białystok', 'Gdynia', 'Częstochowa', 'Radom', 'Sosnowiec', 'Toruń'];
const streets = ['Główna', 'Polna', 'Leśna', 'Słoneczna', 'Krótka', 'Długa', 'Kwiatowa', 'Ogrodowa', 'Lipowa', 'Brzozowa', 'Parkowa', 'Kolejowa', 'Szkolna', 'Kościelna', 'Sportowa'];

const orderStatuses = [
  { status: 'completed', weight: 70 },  // 70% completed
  { status: 'pending', weight: 20 },    // 20% pending
  { status: 'canceled', weight: 10 }    // 10% cancelled
];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomStatus() {
  const rand = Math.random() * 100;
  let cumulative = 0;
  for (const { status, weight } of orderStatuses) {
    cumulative += weight;
    if (rand <= cumulative) return status;
  }
  return 'completed';
}

function generateEmail(firstName, lastName) {
  const domains = ['gmail.com', 'wp.pl', 'onet.pl', 'interia.pl', 'o2.pl'];
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${randomItem(domains)}`;
}

async function main() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();

  console.log('🚀 Starting sales simulation...\n');

  try {
    // 1. Get region and sales channel
    const regionResult = await client.query('SELECT id FROM region LIMIT 1');
    const region_id = regionResult.rows[0]?.id;
    
    const salesChannelResult = await client.query('SELECT id FROM sales_channel LIMIT 1');
    const sales_channel_id = salesChannelResult.rows[0]?.id;

    console.log(`Region: ${region_id}`);
    console.log(`Sales Channel: ${sales_channel_id}\n`);

    // 2. Create more customers (50 total)
    console.log('👥 Creating customers...');
    const customers = [];
    
    for (let i = 0; i < 50; i++) {
      const firstName = randomItem(firstNames);
      const lastName = randomItem(lastNames);
      const email = generateEmail(firstName, lastName);
      
      const customerId = `cus_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      try {
        await client.query(`
          INSERT INTO customer (id, email, first_name, last_name, created_at, updated_at)
          VALUES ($1, $2, $3, $4, NOW(), NOW())
          ON CONFLICT (email) DO NOTHING
        `, [customerId, email, firstName, lastName]);
        
        customers.push({ id: customerId, email, firstName, lastName });
      } catch (err) {
        // Skip duplicates
      }
    }
    console.log(`✓ Created ${customers.length} customers\n`);

    // 3. Get all customers
    const allCustomersResult = await client.query('SELECT id, email, first_name, last_name FROM customer');
    const allCustomers = allCustomersResult.rows;
    console.log(`Total customers in DB: ${allCustomers.length}\n`);

    // 4. Get products with variants
    const productsResult = await client.query(`
      SELECT p.id as product_id, p.title, pv.id as variant_id, pv.sku
      FROM product p
      INNER JOIN product_variant pv ON p.id = pv.product_id
      LIMIT 100
    `);
    const products = productsResult.rows;
    console.log(`Products with variants: ${products.length}\n`);

    if (products.length === 0) {
      console.log('❌ No products with variants found!');
      return;
    }

    // 5. Get all orders
    const ordersResult = await client.query('SELECT id, created_at FROM "order" ORDER BY created_at');
    const orders = ordersResult.rows;
    console.log(`📦 Processing ${orders.length} orders...\n`);

    let processed = 0;
    let completed = 0;
    let pending = 0;
    let cancelled = 0;

    for (const order of orders) {
      const customer = randomItem(allCustomers);
      const status = randomStatus();
      const numItems = Math.floor(Math.random() * 4) + 1; // 1-4 items per order
      
      // Create address
      const addressId = `addr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const city = randomItem(cities);
      const street = randomItem(streets);
      const houseNumber = Math.floor(Math.random() * 100) + 1;
      const postalCode = `${Math.floor(Math.random() * 90) + 10}-${Math.floor(Math.random() * 900) + 100}`;
      
      await client.query(`
        INSERT INTO order_address (
          id, customer_id, company, first_name, last_name,
          address_1, city, postal_code, country_code, phone,
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
      `, [
        addressId,
        customer.id,
        null,
        customer.first_name || 'Jan',
        customer.last_name || 'Kowalski',
        `ul. ${street} ${houseNumber}`,
        city,
        postalCode,
        'pl',
        `+48${Math.floor(Math.random() * 900000000) + 100000000}`
      ]);

      // Update order
      await client.query(`
        UPDATE "order"
        SET 
          customer_id = $1,
          email = $2,
          status = $3,
          region_id = $4,
          sales_channel_id = $5,
          shipping_address_id = $6,
          billing_address_id = $6,
          currency_code = 'pln'
        WHERE id = $7
      `, [customer.id, customer.email, status, region_id, sales_channel_id, addressId, order.id]);

      // Add items to order
      let orderTotal = 0;
      for (let i = 0; i < numItems; i++) {
        const product = randomItem(products);
        const quantity = Math.floor(Math.random() * 3) + 1;
        const unitPrice = Math.floor(Math.random() * 50000) + 5000; // 50-500 PLN
        const total = unitPrice * quantity;
        orderTotal += total;

        const lineItemId = `oli_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const orderItemId = `oi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Insert line item (product details)
        await client.query(`
          INSERT INTO order_line_item (
            id, variant_id, product_id, title, subtitle,
            unit_price, raw_unit_price, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
        `, [
          lineItemId,
          product.variant_id,
          product.product_id,
          product.title,
          product.sku,
          unitPrice,
          JSON.stringify({ value: unitPrice.toString(), precision: 20 })
        ]);

        // Insert order item (link order to line item)
        await client.query(`
          INSERT INTO order_item (
            id, order_id, item_id, version, quantity, raw_quantity,
            fulfilled_quantity, raw_fulfilled_quantity,
            shipped_quantity, raw_shipped_quantity,
            return_requested_quantity, raw_return_requested_quantity,
            return_received_quantity, raw_return_received_quantity,
            return_dismissed_quantity, raw_return_dismissed_quantity,
            written_off_quantity, raw_written_off_quantity,
            delivered_quantity, raw_delivered_quantity,
            unit_price, raw_unit_price,
            created_at, updated_at
          ) VALUES (
            $1, $2, $3, 1, $4, $5,
            $6, $7, $8, $9, 0, $10, 0, $11, 0, $12, 0, $13, 0, $14,
            $15, $16, NOW(), NOW()
          )
        `, [
          orderItemId,
          order.id,
          lineItemId,
          quantity,
          JSON.stringify({ value: quantity.toString(), precision: 20 }),
          status === 'completed' ? quantity : 0,
          JSON.stringify({ value: (status === 'completed' ? quantity : 0).toString(), precision: 20 }),
          status === 'completed' ? quantity : 0,
          JSON.stringify({ value: (status === 'completed' ? quantity : 0).toString(), precision: 20 }),
          JSON.stringify({ value: "0", precision: 20 }),
          JSON.stringify({ value: "0", precision: 20 }),
          JSON.stringify({ value: "0", precision: 20 }),
          JSON.stringify({ value: "0", precision: 20 }),
          JSON.stringify({ value: "0", precision: 20 }),
          unitPrice,
          JSON.stringify({ value: unitPrice.toString(), precision: 20 })
        ]);
      }

      // Create order summary with totals
      const summaryId = `sum_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      try {
        await client.query(`
          INSERT INTO order_summary (id, order_id, version, totals, created_at, updated_at)
          VALUES ($1, $2, 1, $3, NOW(), NOW())
        `, [
          summaryId,
          order.id,
          JSON.stringify({
            total: orderTotal,
            subtotal: orderTotal,
            tax_total: 0,
            discount_total: 0,
            shipping_total: 0,
            gift_card_total: 0
          })
        ]);
      } catch (err) {
        // Summary might already exist, update it
        await client.query(`
          UPDATE order_summary
          SET totals = $1, updated_at = NOW()
          WHERE order_id = $2
        `, [
          JSON.stringify({
            total: orderTotal,
            subtotal: orderTotal,
            tax_total: 0,
            discount_total: 0,
            shipping_total: 0,
            gift_card_total: 0
          }),
          order.id
        ]);
      }

      processed++;
      if (status === 'completed') completed++;
      else if (status === 'pending') pending++;
      else if (status === 'canceled') cancelled++;

      if (processed % 100 === 0) {
        console.log(`Progress: ${processed}/${orders.length}`);
      }
    }

    console.log('\n✅ Simulation complete!\n');
    console.log('=== SUMMARY ===');
    console.log(`Total orders: ${orders.length}`);
    console.log(`Completed: ${completed} (${((completed/orders.length)*100).toFixed(1)}%)`);
    console.log(`Pending: ${pending} (${((pending/orders.length)*100).toFixed(1)}%)`);
    console.log(`Cancelled: ${cancelled} (${((cancelled/orders.length)*100).toFixed(1)}%)`);
    console.log(`Total customers: ${allCustomers.length}`);
    console.log(`Products used: ${products.length}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

main();
