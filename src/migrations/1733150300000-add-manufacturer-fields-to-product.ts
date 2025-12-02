import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey, TableIndex } from "typeorm"

export class AddManufacturerFieldsToProduct1733150300000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add manufacturer fields
    await queryRunner.addColumn(
      "product",
      new TableColumn({
        name: "manufacturer_id",
        type: "uuid",
        isNullable: true,
      })
    )

    await queryRunner.addColumn(
      "product",
      new TableColumn({
        name: "manufacturer_sku",
        type: "varchar",
        length: "255",
        isNullable: true,
      })
    )

    await queryRunner.addColumn(
      "product",
      new TableColumn({
        name: "manufacturer_part_number",
        type: "varchar",
        length: "255",
        isNullable: true,
      })
    )

    await queryRunner.addColumn(
      "product",
      new TableColumn({
        name: "manufacturer_catalog_page",
        type: "int",
        isNullable: true,
      })
    )

    await queryRunner.addColumn(
      "product",
      new TableColumn({
        name: "manufacturer_catalog_pdf_url",
        type: "varchar",
        length: "500",
        isNullable: true,
      })
    )

    await queryRunner.addColumn(
      "product",
      new TableColumn({
        name: "manufacturer_technical_docs",
        type: "jsonb",
        isNullable: true,
        default: "'[]'",
      })
    )

    // Add foreign key
    await queryRunner.createForeignKey(
      "product",
      new TableForeignKey({
        columnNames: ["manufacturer_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "manufacturer",
        onDelete: "SET NULL",
      })
    )

    // Create indexes
    await queryRunner.createIndex(
      "product",
      new TableIndex({
        name: "IDX_product_manufacturer_id",
        columnNames: ["manufacturer_id"],
      })
    )

    await queryRunner.createIndex(
      "product",
      new TableIndex({
        name: "IDX_product_manufacturer_sku",
        columnNames: ["manufacturer_sku"],
      })
    )

    await queryRunner.createIndex(
      "product",
      new TableIndex({
        name: "IDX_product_manufacturer_part_number",
        columnNames: ["manufacturer_part_number"],
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("product")
    const foreignKey = table?.foreignKeys.find(
      fk => fk.columnNames.indexOf("manufacturer_id") !== -1
    )
    if (foreignKey) {
      await queryRunner.dropForeignKey("product", foreignKey)
    }

    await queryRunner.query(`DROP INDEX "IDX_product_manufacturer_part_number"`)
    await queryRunner.query(`DROP INDEX "IDX_product_manufacturer_sku"`)
    await queryRunner.query(`DROP INDEX "IDX_product_manufacturer_id"`)

    await queryRunner.dropColumn("product", "manufacturer_technical_docs")
    await queryRunner.dropColumn("product", "manufacturer_catalog_pdf_url")
    await queryRunner.dropColumn("product", "manufacturer_catalog_page")
    await queryRunner.dropColumn("product", "manufacturer_part_number")
    await queryRunner.dropColumn("product", "manufacturer_sku")
    await queryRunner.dropColumn("product", "manufacturer_id")
  }
}
