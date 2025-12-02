import { MigrationInterface, QueryRunner } from "typeorm"

export class AddB2bCustomerFields1733097800000 implements MigrationInterface {
  name = 'AddB2bCustomerFields1733097800000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add B2B customer fields
    await queryRunner.query(`
      ALTER TABLE "customer" 
      ADD COLUMN IF NOT EXISTS "company_name" VARCHAR(255),
      ADD COLUMN IF NOT EXISTS "tax_id" VARCHAR(20),
      ADD COLUMN IF NOT EXISTS "customer_type" VARCHAR(20) DEFAULT 'retail'
    `)

    // Create index for customer type filtering
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_customer_type" 
      ON "customer" ("customer_type")
    `)

    // Create index for tax_id lookups
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_customer_tax_id" 
      ON "customer" ("tax_id")
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_customer_type"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_customer_tax_id"`)
    await queryRunner.query(`
      ALTER TABLE "customer" 
      DROP COLUMN IF EXISTS "company_name",
      DROP COLUMN IF EXISTS "tax_id",
      DROP COLUMN IF EXISTS "customer_type"
    `)
  }
}
