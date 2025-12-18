import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateAdvancedSearchTables1733649600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Machine Types table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS machine_types (
        id VARCHAR PRIMARY KEY,
        name VARCHAR NOT NULL,
        name_pl VARCHAR,
        emoji VARCHAR,
        popularity_score INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `)

    // Manufacturers table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS manufacturers (
        id VARCHAR PRIMARY KEY,
        name VARCHAR NOT NULL,
        machine_type_id VARCHAR REFERENCES machine_types(id),
        popularity_score INTEGER DEFAULT 0,
        region VARCHAR,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `)

    // Machine Models table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS machine_models (
        id VARCHAR PRIMARY KEY,
        name VARCHAR NOT NULL,
        manufacturer_id VARCHAR REFERENCES manufacturers(id),
        year_from INTEGER,
        year_to INTEGER,
        power_hp INTEGER,
        weight_kg INTEGER,
        specs JSONB,
        popularity_score INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `)

    // Symptom Mappings table (AI CORE)
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS symptom_mappings (
        id VARCHAR PRIMARY KEY,
        symptom_text VARCHAR NOT NULL,
        symptom_text_pl VARCHAR,
        category VARCHAR NOT NULL,
        subcategory VARCHAR,
        confidence_score DECIMAL(5,2) DEFAULT 100.00,
        machine_type_id VARCHAR REFERENCES machine_types(id),
        keywords TEXT[],
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `)

    // Part Categories table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS part_categories (
        id VARCHAR PRIMARY KEY,
        name VARCHAR NOT NULL,
        name_pl VARCHAR,
        parent_id VARCHAR REFERENCES part_categories(id),
        icon VARCHAR,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `)

    // Compatibility Matrix table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS compatibility_matrix (
        id VARCHAR PRIMARY KEY,
        product_id VARCHAR NOT NULL,
        machine_model_id VARCHAR REFERENCES machine_models(id),
        compatibility_level VARCHAR CHECK (compatibility_level IN ('perfect', 'compatible', 'check_specs', 'not_compatible')),
        confidence_score DECIMAL(5,2) DEFAULT 100.00,
        is_original BOOLEAN DEFAULT false,
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `)

    // Purchase History table (for recommendations)
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS purchase_history (
        id VARCHAR PRIMARY KEY,
        customer_id VARCHAR,
        machine_model_id VARCHAR REFERENCES machine_models(id),
        product_id VARCHAR NOT NULL,
        purchased_at TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `)

    // Frequently Bought Together table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS frequently_bought_together (
        id VARCHAR PRIMARY KEY,
        product_id VARCHAR NOT NULL,
        related_product_id VARCHAR NOT NULL,
        machine_model_id VARCHAR REFERENCES machine_models(id),
        frequency_score DECIMAL(5,2) DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `)

    // Saved Searches table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS saved_searches (
        id VARCHAR PRIMARY KEY,
        customer_id VARCHAR NOT NULL,
        search_query JSONB NOT NULL,
        search_name VARCHAR,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `)

    // Search Analytics table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS search_analytics (
        id VARCHAR PRIMARY KEY,
        customer_id VARCHAR,
        query_text TEXT,
        machine_type_id VARCHAR,
        manufacturer_id VARCHAR,
        machine_model_id VARCHAR,
        symptom TEXT,
        results_count INTEGER,
        clicked_product_id VARCHAR,
        converted BOOLEAN DEFAULT false,
        session_id VARCHAR,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `)

    // Create indexes for performance
    await queryRunner.query(`CREATE INDEX idx_manufacturers_machine_type ON manufacturers(machine_type_id);`)
    await queryRunner.query(`CREATE INDEX idx_machine_models_manufacturer ON machine_models(manufacturer_id);`)
    await queryRunner.query(`CREATE INDEX idx_symptom_mappings_category ON symptom_mappings(category);`)
    await queryRunner.query(`CREATE INDEX idx_compatibility_machine_model ON compatibility_matrix(machine_model_id);`)
    await queryRunner.query(`CREATE INDEX idx_compatibility_product ON compatibility_matrix(product_id);`)
    await queryRunner.query(`CREATE INDEX idx_purchase_history_machine ON purchase_history(machine_model_id);`)
    await queryRunner.query(`CREATE INDEX idx_purchase_history_product ON purchase_history(product_id);`)
    await queryRunner.query(`CREATE INDEX idx_frequently_bought_product ON frequently_bought_together(product_id);`)
    await queryRunner.query(`CREATE INDEX idx_search_analytics_customer ON search_analytics(customer_id);`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS search_analytics CASCADE;`)
    await queryRunner.query(`DROP TABLE IF EXISTS saved_searches CASCADE;`)
    await queryRunner.query(`DROP TABLE IF EXISTS frequently_bought_together CASCADE;`)
    await queryRunner.query(`DROP TABLE IF EXISTS purchase_history CASCADE;`)
    await queryRunner.query(`DROP TABLE IF EXISTS compatibility_matrix CASCADE;`)
    await queryRunner.query(`DROP TABLE IF EXISTS part_categories CASCADE;`)
    await queryRunner.query(`DROP TABLE IF EXISTS symptom_mappings CASCADE;`)
    await queryRunner.query(`DROP TABLE IF EXISTS machine_models CASCADE;`)
    await queryRunner.query(`DROP TABLE IF EXISTS manufacturers CASCADE;`)
    await queryRunner.query(`DROP TABLE IF EXISTS machine_types CASCADE;`)
  }
}
