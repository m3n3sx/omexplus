import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AddSearchFieldsToProduct1733150400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add search and filter fields
    await queryRunner.addColumn(
      "product",
      new TableColumn({
        name: "searchable_text",
        type: "text",
        isNullable: true,
      })
    )

    await queryRunner.addColumn(
      "product",
      new TableColumn({
        name: "filter_attributes",
        type: "jsonb",
        isNullable: true,
        default: "'{}'",
      })
    )

    await queryRunner.addColumn(
      "product",
      new TableColumn({
        name: "is_featured",
        type: "boolean",
        default: false,
      })
    )

    await queryRunner.addColumn(
      "product",
      new TableColumn({
        name: "is_bestseller",
        type: "boolean",
        default: false,
      })
    )

    await queryRunner.addColumn(
      "product",
      new TableColumn({
        name: "is_new",
        type: "boolean",
        default: false,
      })
    )

    await queryRunner.addColumn(
      "product",
      new TableColumn({
        name: "comparable_products",
        type: "jsonb",
        isNullable: true,
        default: "'[]'",
      })
    )

    await queryRunner.addColumn(
      "product",
      new TableColumn({
        name: "breadcrumb",
        type: "varchar",
        length: "500",
        isNullable: true,
      })
    )

    // Create full-text search index
    await queryRunner.query(
      `CREATE INDEX "IDX_product_searchable_text" ON "product" USING GIN (to_tsvector('simple', COALESCE(searchable_text, '')))`
    )

    // Create GIN index on filter_attributes for fast JSONB queries
    await queryRunner.query(
      `CREATE INDEX "IDX_product_filter_attributes" ON "product" USING GIN (filter_attributes)`
    )

    // Create indexes on boolean flags
    await queryRunner.query(
      `CREATE INDEX "IDX_product_is_featured" ON "product" ("is_featured") WHERE is_featured = true`
    )

    await queryRunner.query(
      `CREATE INDEX "IDX_product_is_bestseller" ON "product" ("is_bestseller") WHERE is_bestseller = true`
    )

    await queryRunner.query(
      `CREATE INDEX "IDX_product_is_new" ON "product" ("is_new") WHERE is_new = true`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_product_is_new"`)
    await queryRunner.query(`DROP INDEX "IDX_product_is_bestseller"`)
    await queryRunner.query(`DROP INDEX "IDX_product_is_featured"`)
    await queryRunner.query(`DROP INDEX "IDX_product_filter_attributes"`)
    await queryRunner.query(`DROP INDEX "IDX_product_searchable_text"`)

    await queryRunner.dropColumn("product", "breadcrumb")
    await queryRunner.dropColumn("product", "comparable_products")
    await queryRunner.dropColumn("product", "is_new")
    await queryRunner.dropColumn("product", "is_bestseller")
    await queryRunner.dropColumn("product", "is_featured")
    await queryRunner.dropColumn("product", "filter_attributes")
    await queryRunner.dropColumn("product", "searchable_text")
  }
}
