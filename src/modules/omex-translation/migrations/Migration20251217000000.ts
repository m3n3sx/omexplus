import { Migration } from "@mikro-orm/migrations"

export class Migration20251217000000 extends Migration {
  async up(): Promise<void> {
    // Product translations table
    this.addSql(`
      CREATE TABLE IF NOT EXISTS "product_translation" (
        "id" VARCHAR(255) PRIMARY KEY,
        "product_id" VARCHAR(255) NOT NULL,
        "locale" VARCHAR(10) NOT NULL,
        "title" TEXT,
        "description" TEXT,
        "subtitle" TEXT,
        "material" TEXT,
        "is_auto_translated" BOOLEAN DEFAULT FALSE,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE("product_id", "locale")
      );
    `)

    this.addSql(`
      CREATE INDEX IF NOT EXISTS "idx_product_translation_product_id" 
      ON "product_translation" ("product_id");
    `)

    this.addSql(`
      CREATE INDEX IF NOT EXISTS "idx_product_translation_locale" 
      ON "product_translation" ("locale");
    `)

    // Category translations table
    this.addSql(`
      CREATE TABLE IF NOT EXISTS "category_translation" (
        "id" VARCHAR(255) PRIMARY KEY,
        "category_id" VARCHAR(255) NOT NULL,
        "locale" VARCHAR(10) NOT NULL,
        "name" TEXT,
        "description" TEXT,
        "is_auto_translated" BOOLEAN DEFAULT FALSE,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE("category_id", "locale")
      );
    `)

    this.addSql(`
      CREATE INDEX IF NOT EXISTS "idx_category_translation_category_id" 
      ON "category_translation" ("category_id");
    `)

    this.addSql(`
      CREATE INDEX IF NOT EXISTS "idx_category_translation_locale" 
      ON "category_translation" ("locale");
    `)
  }

  async down(): Promise<void> {
    this.addSql(`DROP TABLE IF EXISTS "product_translation";`)
    this.addSql(`DROP TABLE IF EXISTS "category_translation";`)
  }
}
