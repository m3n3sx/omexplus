import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm"

export class CreateManufacturerTable1733150100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "manufacturer",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "name",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "name_en",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "name_de",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "slug",
            type: "varchar",
            length: "255",
            isUnique: true,
            isNullable: false,
          },
          {
            name: "logo_url",
            type: "varchar",
            length: "500",
            isNullable: true,
          },
          {
            name: "website_url",
            type: "varchar",
            length: "500",
            isNullable: true,
          },
          {
            name: "description",
            type: "text",
            isNullable: true,
          },
          {
            name: "country",
            type: "varchar",
            length: "100",
            isNullable: true,
          },
          {
            name: "contact_email",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "contact_phone",
            type: "varchar",
            length: "20",
            isNullable: true,
          },
          {
            name: "catalog_pdf_url",
            type: "varchar",
            length: "500",
            isNullable: true,
          },
          {
            name: "catalog_updated_at",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "api_endpoint",
            type: "varchar",
            length: "500",
            isNullable: true,
          },
          {
            name: "api_key",
            type: "varchar",
            length: "500",
            isNullable: true,
          },
          {
            name: "is_active",
            type: "boolean",
            default: true,
          },
          {
            name: "sync_frequency",
            type: "varchar",
            length: "50",
            isNullable: true,
          },
          {
            name: "last_sync_at",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "products_count",
            type: "int",
            default: 0,
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

    // Create indexes
    await queryRunner.createIndex(
      "manufacturer",
      new TableIndex({
        name: "IDX_manufacturer_slug",
        columnNames: ["slug"],
      })
    )

    await queryRunner.createIndex(
      "manufacturer",
      new TableIndex({
        name: "IDX_manufacturer_is_active",
        columnNames: ["is_active"],
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("manufacturer")
  }
}
