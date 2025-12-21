import { Migration } from '@mikro-orm/migrations'

/**
 * Migration: Create Supplier Tables
 * 
 * Tworzy tabele dla systemu dropshipping:
 * - supplier: Dostawcy
 * - supplier_product: Produkty od dostawców
 * - supplier_order: Zamówienia do dostawców
 */
export class CreateSupplierTables1734620000000 extends Migration {
  async up(): Promise<void> {
    // Tabela dostawców
    this.addSql(`
      CREATE TABLE IF NOT EXISTS supplier (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        code VARCHAR(50) NOT NULL UNIQUE,
        
        -- Dane kontaktowe
        contact_name VARCHAR(255),
        contact_email VARCHAR(255),
        contact_phone VARCHAR(50),
        
        -- Adres
        address_line_1 VARCHAR(255),
        address_line_2 VARCHAR(255),
        city VARCHAR(100),
        postal_code VARCHAR(20),
        country_code VARCHAR(2),
        
        -- Integracja API
        api_url TEXT,
        api_key TEXT,
        api_format VARCHAR(10) DEFAULT 'json',
        sync_enabled BOOLEAN DEFAULT false,
        sync_frequency VARCHAR(20) DEFAULT 'manual',
        last_sync_at TIMESTAMP,
        
        -- Warunki współpracy
        commission_rate DECIMAL(5,2),
        min_order_value INTEGER,
        lead_time_days INTEGER DEFAULT 3,
        shipping_method VARCHAR(100),
        
        -- Powiązania Medusa
        stock_location_id VARCHAR(255),
        
        -- Status
        is_active BOOLEAN DEFAULT true,
        is_dropship BOOLEAN DEFAULT true,
        
        -- Statystyki
        products_count INTEGER DEFAULT 0,
        orders_count INTEGER DEFAULT 0,
        total_revenue BIGINT DEFAULT 0,
        
        -- Notatki
        notes TEXT,
        
        -- Metadane
        metadata JSONB DEFAULT '{}',
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Indeksy dla supplier
    this.addSql(`CREATE INDEX idx_supplier_code ON supplier(code)`)
    this.addSql(`CREATE INDEX idx_supplier_is_active ON supplier(is_active)`)
    this.addSql(`CREATE INDEX idx_supplier_is_dropship ON supplier(is_dropship)`)
    this.addSql(`CREATE INDEX idx_supplier_stock_location ON supplier(stock_location_id)`)

    // Tabela produktów od dostawców
    this.addSql(`
      CREATE TABLE IF NOT EXISTS supplier_product (
        id VARCHAR(255) PRIMARY KEY,
        supplier_id VARCHAR(255) NOT NULL REFERENCES supplier(id) ON DELETE CASCADE,
        product_id VARCHAR(255) NOT NULL,
        
        -- Dane od dostawcy
        supplier_sku VARCHAR(255) NOT NULL,
        supplier_price INTEGER NOT NULL,
        supplier_currency VARCHAR(3) DEFAULT 'PLN',
        supplier_stock INTEGER DEFAULT 0,
        
        -- Marża
        markup_type VARCHAR(20) DEFAULT 'percentage',
        markup_value DECIMAL(10,2) DEFAULT 20,
        
        -- Synchronizacja
        last_sync_at TIMESTAMP,
        sync_status VARCHAR(20) DEFAULT 'pending',
        sync_error TEXT,
        
        -- Status
        is_active BOOLEAN DEFAULT true,
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        UNIQUE(supplier_id, supplier_sku)
      )
    `)

    // Indeksy dla supplier_product
    this.addSql(`CREATE INDEX idx_supplier_product_supplier ON supplier_product(supplier_id)`)
    this.addSql(`CREATE INDEX idx_supplier_product_product ON supplier_product(product_id)`)
    this.addSql(`CREATE INDEX idx_supplier_product_sku ON supplier_product(supplier_sku)`)
    this.addSql(`CREATE INDEX idx_supplier_product_active ON supplier_product(is_active)`)

    // Tabela zamówień do dostawców
    this.addSql(`
      CREATE TABLE IF NOT EXISTS supplier_order (
        id VARCHAR(255) PRIMARY KEY,
        supplier_id VARCHAR(255) NOT NULL REFERENCES supplier(id) ON DELETE CASCADE,
        order_id VARCHAR(255) NOT NULL,
        
        -- Status
        supplier_order_id VARCHAR(255),
        status VARCHAR(20) DEFAULT 'pending',
        
        -- Śledzenie
        tracking_number VARCHAR(100),
        tracking_url TEXT,
        
        -- Koszty
        supplier_total INTEGER NOT NULL,
        your_margin INTEGER DEFAULT 0,
        
        -- Daty
        sent_at TIMESTAMP,
        confirmed_at TIMESTAMP,
        shipped_at TIMESTAMP,
        delivered_at TIMESTAMP,
        
        notes TEXT,
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Indeksy dla supplier_order
    this.addSql(`CREATE INDEX idx_supplier_order_supplier ON supplier_order(supplier_id)`)
    this.addSql(`CREATE INDEX idx_supplier_order_order ON supplier_order(order_id)`)
    this.addSql(`CREATE INDEX idx_supplier_order_status ON supplier_order(status)`)

    console.log('✅ Created supplier tables')
  }

  async down(): Promise<void> {
    this.addSql(`DROP TABLE IF EXISTS supplier_order`)
    this.addSql(`DROP TABLE IF EXISTS supplier_product`)
    this.addSql(`DROP TABLE IF EXISTS supplier`)
    
    console.log('✅ Dropped supplier tables')
  }
}

export default CreateSupplierTables1734620000000
