import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateInventoryTable1733098100000 implements MigrationInterface {
  name = 'CreateInventoryTable1733098100000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create inventory table for multi-warehouse management
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "inventory" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "product_id" UUID NOT NULL,
        "warehouse_id" VARCHAR(50) NOT NULL,
        "quantity" INTEGER NOT NULL DEFAULT 0,
        "reserved" INTEGER NOT NULL DEFAULT 0,
        "updated_at" TIMESTAMP DEFAULT NOW(),
        CONSTRAINT "fk_inventory_product" 
          FOREIGN KEY ("product_id") 
          REFERENCES "product"("id") 
          ON DELETE CASCADE,
        CONSTRAINT "uq_inventory_product_warehouse" 
          UNIQUE ("product_id", "warehouse_id")
      )
    `)

    // Create indexes
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_inventory_product_id" 
      ON "inventory" ("product_id")
    `)

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_inventory_warehouse_id" 
      ON "inventory" ("warehouse_id")
    `)

    // Create index for low stock queries
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_inventory_quantity" 
      ON "inventory" ("quantity")
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "inventory" CASCADE`)
  }
}
