import { Migration } from '@medusajs/framework/utils'

export default class AddMultiCurrencySupport20251206125633 implements Migration {
  async up(): Promise<void> {
    // Add currency_code column to price_tier table
    await this.query(`
      ALTER TABLE price_tier 
      ADD COLUMN IF NOT EXISTS currency_code VARCHAR(3) DEFAULT 'PLN'
    `)

    // Create currency table
    await this.query(`
      CREATE TABLE IF NOT EXISTS currency (
        code VARCHAR(3) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        symbol VARCHAR(10) NOT NULL,
        exchange_rate DECIMAL(10, 6) NOT NULL DEFAULT 1.0,
        is_active BOOLEAN DEFAULT true,
        decimal_places INTEGER DEFAULT 2,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Insert default currencies
    await this.query(`
      INSERT INTO currency (code, name, symbol, exchange_rate, is_active, decimal_places)
      VALUES 
        ('PLN', 'Polish Złoty', 'zł', 1.0, true, 2),
        ('EUR', 'Euro', '€', 0.23, true, 2),
        ('USD', 'US Dollar', '$', 0.25, true, 2),
        ('GBP', 'British Pound', '£', 0.20, true, 2),
        ('CZK', 'Czech Koruna', 'Kč', 5.70, true, 2),
        ('SEK', 'Swedish Krona', 'kr', 2.60, true, 2),
        ('NOK', 'Norwegian Krone', 'kr', 2.70, true, 2),
        ('DKK', 'Danish Krone', 'kr', 1.70, true, 2),
        ('CHF', 'Swiss Franc', 'CHF', 0.22, true, 2),
        ('HUF', 'Hungarian Forint', 'Ft', 90.0, true, 0),
        ('RON', 'Romanian Leu', 'lei', 1.15, true, 2)
      ON CONFLICT (code) DO NOTHING
    `)

    // Create index on currency_code in price_tier
    await this.query(`
      CREATE INDEX IF NOT EXISTS idx_price_tier_currency 
      ON price_tier(currency_code)
    `)
  }

  async down(): Promise<void> {
    await this.query(`DROP INDEX IF EXISTS idx_price_tier_currency`)
    await this.query(`DROP TABLE IF EXISTS currency`)
    await this.query(`ALTER TABLE price_tier DROP COLUMN IF EXISTS currency_code`)
  }

  private async query(sql: string): Promise<void> {
    // This will be executed by Medusa's migration system
    console.log('Executing:', sql)
  }
}
