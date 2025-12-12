import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateCategoriesTable1733650200000 implements MigrationInterface {
  name = 'CreateCategoriesTable1733650200000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create categories table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "categories" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" VARCHAR(255) NOT NULL,
        "name_en" VARCHAR(255),
        "slug" VARCHAR(255) NOT NULL UNIQUE,
        "description" TEXT,
        "icon" VARCHAR(50),
        "priority" INTEGER DEFAULT 0,
        "parent_id" UUID REFERENCES "categories"("id") ON DELETE SET NULL,
        "metadata" JSONB,
        "created_at" TIMESTAMP DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      )
    `)

    // Create indexes for performance
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_categories_slug" ON "categories" ("slug")
    `)

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_categories_parent_id" ON "categories" ("parent_id")
    `)

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_categories_priority" ON "categories" ("priority")
    `)

    // Create category_translations table for i18n support
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "category_translations" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "category_id" UUID NOT NULL,
        "language_code" VARCHAR(10) NOT NULL,
        "name" VARCHAR(255) NOT NULL,
        "description" TEXT,
        "created_at" TIMESTAMP DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW(),
        CONSTRAINT "fk_category_translations_category" 
          FOREIGN KEY ("category_id") 
          REFERENCES "categories"("id") 
          ON DELETE CASCADE,
        CONSTRAINT "uk_category_translations_unique" 
          UNIQUE ("category_id", "language_code")
      )
    `)

    // Create indexes for category_translations
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_category_translations_category_id" 
      ON "category_translations" ("category_id")
    `)

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_category_translations_language_code" 
      ON "category_translations" ("language_code")
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop category_translations table first (due to foreign key)
    await queryRunner.query(`DROP TABLE IF EXISTS "category_translations" CASCADE`)

    // Drop categories table
    await queryRunner.query(`DROP TABLE IF EXISTS "categories" CASCADE`)
  }
}
