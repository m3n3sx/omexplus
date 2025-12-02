import { MigrationInterface, QueryRunner } from "typeorm"

export class CreatePriceTierTable1733098000000 implements MigrationInterface {
  name = 'CreatePriceTierTable1733098000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create price_tier table for tiered pricing
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "price_tier" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "product_id" UUID NOT NULL,
        "customer_type" VARCHAR(20) NOT NULL,
        "quantity_min" INTEGER NOT NULL,
        "quantity_max" INTEGER,
        "price" DECIMAL(10,2) NOT NULL,
        "created_at" TIMESTAMP DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW(),
        CONSTRAINT "fk_price_tier_product" 
          FOREIGN KEY ("product_id") 
          REFERENCES "product"("id") 
          ON DELETE CASCADE
      )
    `)

    // Create indexes
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_price_tier_product_id" 
      ON "price_tier" ("product_id")
    `)

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_price_tier_customer_type" 
      ON "price_tier" ("customer_type")
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "price_tier" CASCADE`)
  }
}
