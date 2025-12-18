import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm"

export class CreateManufacturerPartTable1733150200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "manufacturer_part",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "manufacturer_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "product_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "manufacturer_sku",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "manufacturer_name",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "part_number",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "alternative_names",
            type: "jsonb",
            isNullable: true,
            default: "'[]'",
          },
          {
            name: "catalog_page",
            type: "int",
            isNullable: true,
          },
          {
            name: "catalog_url",
            type: "varchar",
            length: "500",
            isNullable: true,
          },
          {
            name: "technical_doc_url",
            type: "varchar",
            length: "500",
            isNullable: true,
          },
          {
            name: "datasheet_json",
            type: "jsonb",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "now()",
          },
        ],
      }),
      true
    )

    // Add foreign keys
    await queryRunner.createForeignKey(
      "manufacturer_part",
      new TableForeignKey({
        columnNames: ["manufacturer_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "manufacturer",
        onDelete: "CASCADE",
      })
    )

    await queryRunner.createForeignKey(
      "manufacturer_part",
      new TableForeignKey({
        columnNames: ["product_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "product",
        onDelete: "CASCADE",
      })
    )

    // Create indexes
    await queryRunner.createIndex(
      "manufacturer_part",
      new TableIndex({
        name: "IDX_manufacturer_part_sku",
        columnNames: ["manufacturer_sku"],
      })
    )

    await queryRunner.createIndex(
      "manufacturer_part",
      new TableIndex({
        name: "IDX_manufacturer_part_number",
        columnNames: ["part_number"],
      })
    )

    await queryRunner.createIndex(
      "manufacturer_part",
      new TableIndex({
        name: "IDX_manufacturer_part_catalog_page",
        columnNames: ["manufacturer_id", "catalog_page"],
      })
    )

    // Create unique constraint
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_manufacturer_part_unique" ON "manufacturer_part" ("manufacturer_id", "manufacturer_sku")`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("manufacturer_part")
  }
}
