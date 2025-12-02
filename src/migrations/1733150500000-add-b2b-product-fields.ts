import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AddB2bProductFields1733150500000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add B2B specific fields
    await queryRunner.addColumn(
      "product",
      new TableColumn({
        name: "b2b_min_quantity",
        type: "int",
        isNullable: true,
        default: 1,
      })
    )

    await queryRunner.addColumn(
      "product",
      new TableColumn({
        name: "b2b_pricing_tiers",
        type: "jsonb",
        isNullable: true,
        default: "'[]'",
      })
    )

    await queryRunner.addColumn(
      "product",
      new TableColumn({
        name: "b2b_discount_percentage",
        type: "decimal",
        precision: 5,
        scale: 2,
        isNullable: true,
      })
    )

    await queryRunner.addColumn(
      "product",
      new TableColumn({
        name: "b2b_lead_time_days",
        type: "int",
        isNullable: true,
      })
    )

    await queryRunner.addColumn(
      "product",
      new TableColumn({
        name: "b2b_bulk_discount_available",
        type: "boolean",
        default: false,
      })
    )

    await queryRunner.addColumn(
      "product",
      new TableColumn({
        name: "requires_quote",
        type: "boolean",
        default: false,
      })
    )

    // Add supplier and stock fields
    await queryRunner.addColumn(
      "product",
      new TableColumn({
        name: "supplier_ids",
        type: "jsonb",
        isNullable: true,
        default: "'[]'",
      })
    )

    await queryRunner.addColumn(
      "product",
      new TableColumn({
        name: "stock_level",
        type: "int",
        default: 0,
      })
    )

    await queryRunner.addColumn(
      "product",
      new TableColumn({
        name: "stock_reserved",
        type: "int",
        default: 0,
      })
    )

    await queryRunner.addColumn(
      "product",
      new TableColumn({
        name: "stock_available",
        type: "int",
        default: 0,
      })
    )

    await queryRunner.addColumn(
      "product",
      new TableColumn({
        name: "stock_warehouse_locations",
        type: "jsonb",
        isNullable: true,
        default: "'[]'",
      })
    )

    await queryRunner.addColumn(
      "product",
      new TableColumn({
        name: "reorder_point",
        type: "int",
        isNullable: true,
      })
    )

    await queryRunner.addColumn(
      "product",
      new TableColumn({
        name: "supplier_lead_time",
        type: "int",
        isNullable: true,
      })
    )

    // Create indexes
    await queryRunner.query(
      `CREATE INDEX "IDX_product_requires_quote" ON "product" ("requires_quote") WHERE requires_quote = true`
    )

    await queryRunner.query(
      `CREATE INDEX "IDX_product_stock_level" ON "product" ("stock_level")`
    )

    await queryRunner.query(
      `CREATE INDEX "IDX_product_stock_available" ON "product" ("stock_available")`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_product_stock_available"`)
    await queryRunner.query(`DROP INDEX "IDX_product_stock_level"`)
    await queryRunner.query(`DROP INDEX "IDX_product_requires_quote"`)

    await queryRunner.dropColumn("product", "supplier_lead_time")
    await queryRunner.dropColumn("product", "reorder_point")
    await queryRunner.dropColumn("product", "stock_warehouse_locations")
    await queryRunner.dropColumn("product", "stock_available")
    await queryRunner.dropColumn("product", "stock_reserved")
    await queryRunner.dropColumn("product", "stock_level")
    await queryRunner.dropColumn("product", "supplier_ids")
    await queryRunner.dropColumn("product", "requires_quote")
    await queryRunner.dropColumn("product", "b2b_bulk_discount_available")
    await queryRunner.dropColumn("product", "b2b_lead_time_days")
    await queryRunner.dropColumn("product", "b2b_discount_percentage")
    await queryRunner.dropColumn("product", "b2b_pricing_tiers")
    await queryRunner.dropColumn("product", "b2b_min_quantity")
  }
}
