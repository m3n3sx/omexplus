import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AddFeaturedPriorityToProduct1733960000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add is_featured column if it doesn't exist
    const table = await queryRunner.getTable("product")
    const isFeaturedColumn = table?.findColumnByName("is_featured")
    
    if (!isFeaturedColumn) {
      await queryRunner.addColumn(
        "product",
        new TableColumn({
          name: "is_featured",
          type: "boolean",
          default: false,
          isNullable: false,
        })
      )

      // Create index for featured products
      await queryRunner.query(
        `CREATE INDEX "IDX_product_is_featured" ON "product" ("is_featured") WHERE is_featured = true`
      )
    }

    // Add priority column for sorting featured products
    const priorityColumn = table?.findColumnByName("priority")
    
    if (!priorityColumn) {
      await queryRunner.addColumn(
        "product",
        new TableColumn({
          name: "priority",
          type: "integer",
          default: 0,
          isNullable: false,
        })
      )

      // Create index for priority sorting
      await queryRunner.query(
        `CREATE INDEX "IDX_product_priority" ON "product" ("priority")`
      )
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_product_priority"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_product_is_featured"`)

    // Drop columns
    await queryRunner.dropColumn("product", "priority")
    await queryRunner.dropColumn("product", "is_featured")
  }
}
