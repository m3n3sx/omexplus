import { MigrationInterface, QueryRunner } from "typeorm"

export class AddB2bProductFields1733097600000 implements MigrationInterface {
  name = 'AddB2bProductFields1733097600000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add B2B fields to product table
    await queryRunner.query(`
      ALTER TABLE "product" 
      ADD COLUMN IF NOT EXISTS "part_number" VARCHAR(255),
      ADD COLUMN IF NOT EXISTS "equipment_type" VARCHAR(255),
      ADD COLUMN IF NOT EXISTS "technical_specs" JSONB,
      ADD COLUMN IF NOT EXISTS "min_order_qty" INTEGER DEFAULT 1
    `)

    // Create indexes for better query performance
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_product_part_number" ON "product" ("part_number")
    `)
    
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_product_equipment_type" ON "product" ("equipment_type")
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_product_part_number"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_product_equipment_type"`)
    
    // Remove columns
    await queryRunner.query(`
      ALTER TABLE "product" 
      DROP COLUMN IF EXISTS "part_number",
      DROP COLUMN IF EXISTS "equipment_type",
      DROP COLUMN IF EXISTS "technical_specs",
      DROP COLUMN IF EXISTS "min_order_qty"
    `)
  }
}
