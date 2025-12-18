import { MigrationInterface, QueryRunner } from "typeorm"

export class AddHierarchicalCategories1733097700000 implements MigrationInterface {
  name = 'AddHierarchicalCategories1733097700000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add parent_id for hierarchical structure
    await queryRunner.query(`
      ALTER TABLE "product_category" 
      ADD COLUMN IF NOT EXISTS "parent_id" UUID,
      ADD CONSTRAINT "fk_product_category_parent" 
        FOREIGN KEY ("parent_id") 
        REFERENCES "product_category"("id") 
        ON DELETE CASCADE
    `)

    // Add icon field for category display
    await queryRunner.query(`
      ALTER TABLE "product_category" 
      ADD COLUMN IF NOT EXISTS "icon" VARCHAR(255)
    `)

    // Create index for parent_id lookups
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_product_category_parent_id" 
      ON "product_category" ("parent_id")
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_product_category_parent_id"`)
    await queryRunner.query(`ALTER TABLE "product_category" DROP CONSTRAINT IF EXISTS "fk_product_category_parent"`)
    await queryRunner.query(`
      ALTER TABLE "product_category" 
      DROP COLUMN IF EXISTS "parent_id",
      DROP COLUMN IF EXISTS "icon"
    `)
  }
}
