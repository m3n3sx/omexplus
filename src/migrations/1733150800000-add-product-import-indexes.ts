import { MigrationInterface, QueryRunner } from "typeorm"

export class AddProductImportIndexes1733150800000 implements MigrationInterface {
  name = 'AddProductImportIndexes1733150800000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add unique index on SKU for fast duplicate checking
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "idx_product_sku_unique" 
      ON "product" ("sku") 
      WHERE "deleted_at" IS NULL
    `)

    // Add index on category_id for validation
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_product_category_id" 
      ON "product" ("category_id")
    `)

    // Add index on created_at for sorting recent imports
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_product_created_at" 
      ON "product" ("created_at" DESC)
    `)

    // Add index on equipment_type for filtering
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_product_equipment_type" 
      ON "product" ("equipment_type")
    `)

    // Add composite index for common queries
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_product_category_equipment" 
      ON "product" ("category_id", "equipment_type")
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_product_sku_unique"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_product_category_id"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_product_created_at"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_product_equipment_type"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_product_category_equipment"`)
  }
}
