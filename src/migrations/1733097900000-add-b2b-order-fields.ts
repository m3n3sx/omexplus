import { MigrationInterface, QueryRunner } from "typeorm"

export class AddB2bOrderFields1733097900000 implements MigrationInterface {
  name = 'AddB2bOrderFields1733097900000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add B2B order fields
    await queryRunner.query(`
      ALTER TABLE "order" 
      ADD COLUMN IF NOT EXISTS "purchase_order_number" VARCHAR(255),
      ADD COLUMN IF NOT EXISTS "delivery_date" DATE,
      ADD COLUMN IF NOT EXISTS "payment_terms" VARCHAR(50),
      ADD COLUMN IF NOT EXISTS "warehouse_id" VARCHAR(50)
    `)

    // Create index for PO number lookups
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_order_po_number" 
      ON "order" ("purchase_order_number")
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_order_po_number"`)
    await queryRunner.query(`
      ALTER TABLE "order" 
      DROP COLUMN IF EXISTS "purchase_order_number",
      DROP COLUMN IF EXISTS "delivery_date",
      DROP COLUMN IF EXISTS "payment_terms",
      DROP COLUMN IF EXISTS "warehouse_id"
    `)
  }
}
