import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateTranslationTables1733098200000 implements MigrationInterface {
  name = 'CreateTranslationTables1733098200000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create product_translation table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "product_translation" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "product_id" UUID NOT NULL,
        "locale" VARCHAR(5) NOT NULL,
        "title" VARCHAR(255) NOT NULL,
        "description" TEXT,
        "created_at" TIMESTAMP DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW(),
        CONSTRAINT "fk_product_translation_product" 
          FOREIGN KEY ("product_id") 
          REFERENCES "product"("id") 
          ON DELETE CASCADE,
        CONSTRAINT "uq_product_translation_product_locale" 
          UNIQUE ("product_id", "locale")
      )
    `)

    // Create category_translation table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "category_translation" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "category_id" UUID NOT NULL,
        "locale" VARCHAR(5) NOT NULL,
        "name" VARCHAR(255) NOT NULL,
        "description" TEXT,
        "created_at" TIMESTAMP DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW(),
        CONSTRAINT "fk_category_translation_category" 
          FOREIGN KEY ("category_id") 
          REFERENCES "product_category"("id") 
          ON DELETE CASCADE,
        CONSTRAINT "uq_category_translation_category_locale" 
          UNIQUE ("category_id", "locale")
      )
    `)

    // Create indexes
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_product_translation_product_id" 
      ON "product_translation" ("product_id")
    `)

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_product_translation_locale" 
      ON "product_translation" ("locale")
    `)

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_category_translation_category_id" 
      ON "category_translation" ("category_id")
    `)

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_category_translation_locale" 
      ON "category_translation" ("locale")
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "product_translation" CASCADE`)
    await queryRunner.query(`DROP TABLE IF EXISTS "category_translation" CASCADE`)
  }
}
