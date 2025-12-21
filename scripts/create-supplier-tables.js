/**
 * Create Supplier Tables
 * 
 * Run: node scripts/create-supplier-tables.js
 */

const { Client } = require('pg')

async function createSupplierTables() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost/medusa_db'
  })

  try {
    await client.connect()
    console.log('✅ Connected to database')

    // Create supplier table
    await client.query(`
      CREATE TABLE IF NOT EXISTS supplier (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        code VARCHAR(50) NOT NULL UNIQUE,
        contact_name VARCHAR(255),
        contact_email VARCHAR(255),
        contact_phone VARCHAR(50),
        address_line_1 VARCHAR(255),
        address_line_2 VARCHAR(255),
        city VARCHAR(100),
        postal_code VARCHAR(20),
        country_code VARCHAR(2),
        api_url TEXT,
        api_key TEXT,
        api_format VARCHAR(10) DEFAULT 'json',
        sync_enabled BOOLEAN DEFAULT false,
        sync_frequency VARCHAR(20) DEFAULT 'manual',
        last_sync_at TIMESTAMP,
        commission_rate DECIMAL(5,2),
        min_order_value INTEGER,
        lead_time_days INTEGER DEFAULT 3,
        shipping_method VARCHAR(100),
        stock_location_id VARCHAR(255),
        is_active BOOLEAN DEFAULT true,
        is_dropship BOOLEAN DEFAULT true,
        products_count INTEGER DEFAULT 0,
        orders_count INTEGER DEFAULT 0,
        total_revenue BIGINT DEFAULT 0,
        notes TEXT,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✅ Created supplier table')

    // Create indexes
    await client.query(`CREATE INDEX IF NOT EXISTS idx_supplier_code ON supplier(code)`)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_supplier_is_active ON supplier(is_active)`)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_supplier_is_dropship ON supplier(is_dropship)`)
    console.log('✅ Created supplier indexes')

    // Create supplier_product table
    await client.query(`
      CREATE TABLE IF NOT EXISTS supplier_product (
        id VARCHAR(255) PRIMARY KEY,
        supplier_id VARCHAR(255) NOT NULL REFERENCES supplier(id) ON DELETE CASCADE,
        product_id VARCHAR(255),
        supplier_sku VARCHAR(255) NOT NULL,
        supplier_price INTEGER NOT NULL,
        supplier_currency VARCHAR(3) DEFAULT 'PLN',
        supplier_stock INTEGER DEFAULT 0,
        markup_type VARCHAR(20) DEFAULT 'percentage',
        markup_value DECIMAL(10,2) DEFAULT 20,
        last_sync_at TIMESTAMP,
        sync_status VARCHAR(20) DEFAULT 'pending',
        sync_error TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(supplier_id, supplier_sku)
      )
    `)
    console.log('✅ Created supplier_product table')

    // Create supplier_product indexes
    await client.query(`CREATE INDEX IF NOT EXISTS idx_supplier_product_supplier ON supplier_product(supplier_id)`)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_supplier_product_product ON supplier_product(product_id)`)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_supplier_product_sku ON supplier_product(supplier_sku)`)
    console.log('✅ Created supplier_product indexes')

    // Create supplier_order table
    await client.query(`
      CREATE TABLE IF NOT EXISTS supplier_order (
        id VARCHAR(255) PRIMARY KEY,
        supplier_id VARCHAR(255) NOT NULL REFERENCES supplier(id) ON DELETE CASCADE,
        order_id VARCHAR(255) NOT NULL,
        supplier_order_id VARCHAR(255),
        status VARCHAR(20) DEFAULT 'pending',
        tracking_number VARCHAR(100),
        tracking_url TEXT,
        supplier_total INTEGER NOT NULL,
        your_margin INTEGER DEFAULT 0,
        sent_at TIMESTAMP,
        confirmed_at TIMESTAMP,
        shipped_at TIMESTAMP,
        delivered_at TIMESTAMP,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✅ Created supplier_order table')

    // Create supplier_order indexes
    await client.query(`CREATE INDEX IF NOT EXISTS idx_supplier_order_supplier ON supplier_order(supplier_id)`)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_supplier_order_order ON supplier_order(order_id)`)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_supplier_order_status ON supplier_order(status)`)
    console.log('✅ Created supplier_order indexes')

    console.log('\n🎉 All supplier tables created successfully!')

  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

createSupplierTables()
