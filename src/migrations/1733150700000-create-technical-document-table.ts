import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm"

export class CreateTechnicalDocumentTable1733150700000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "technical_document",
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
            isNullable: true,
          },
          {
            name: "title",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "document_type",
            type: "varchar",
            length: "50",
            isNullable: false,
          },
          {
            name: "file_url",
            type: "varchar",
            length: "500",
            isNullable: false,
          },
          {
            name: "file_size",
            type: "int",
            isNullable: true,
          },
          {
            name: "mime_type",
            type: "varchar",
            length: "100",
            isNullable: true,
          },
          {
            name: "products",
            type: "jsonb",
            isNullable: true,
            default: "'[]'",
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

    // Add foreign key
    await queryRunner.createForeignKey(
      "technical_document",
      new TableForeignKey({
        columnNames: ["manufacturer_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "manufacturer",
        onDelete: "CASCADE",
      })
    )

    // Create indexes
    await queryRunner.createIndex(
      "technical_document",
      new TableIndex({
        name: "IDX_technical_document_manufacturer_id",
        columnNames: ["manufacturer_id"],
      })
    )

    await queryRunner.createIndex(
      "technical_document",
      new TableIndex({
        name: "IDX_technical_document_type",
        columnNames: ["document_type"],
      })
    )

    // Create GIN index on products array for fast lookups
    await queryRunner.query(
      `CREATE INDEX "IDX_technical_document_products" ON "technical_document" USING GIN (products)`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("technical_document")
  }
}
