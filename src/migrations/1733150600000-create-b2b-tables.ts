import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm"

export class CreateB2bTables1733150600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create B2B Customer Group table
    await queryRunner.createTable(
      new Table({
        name: "b2b_customer_group",
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
            name: "discount_percentage",
            type: "decimal",
            precision: 5,
            scale: 2,
            isNullable: true,
          },
          {
            name: "min_order_value",
            type: "decimal",
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: "payment_terms",
            type: "varchar",
            length: "50",
            isNullable: true,
          },
          {
            name: "custom_catalog_ids",
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

    // Create Quote table
    await queryRunner.createTable(
      new Table({
        name: "quote",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "customer_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "items",
            type: "jsonb",
            isNullable: false,
          },
          {
            name: "total_amount",
            type: "decimal",
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: "valid_until",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "status",
            type: "varchar",
            length: "50",
            default: "'draft'",
          },
          {
            name: "notes",
            type: "text",
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

    // Create Purchase Order table
    await queryRunner.createTable(
      new Table({
        name: "purchase_order",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "customer_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "po_number",
            type: "varchar",
            length: "255",
            isNullable: false,
            isUnique: true,
          },
          {
            name: "items",
            type: "jsonb",
            isNullable: false,
          },
          {
            name: "total_amount",
            type: "decimal",
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: "payment_terms",
            type: "varchar",
            length: "50",
            isNullable: true,
          },
          {
            name: "delivery_date",
            type: "date",
            isNullable: true,
          },
          {
            name: "status",
            type: "varchar",
            length: "50",
            default: "'pending'",
          },
          {
            name: "notes",
            type: "text",
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

    // Create indexes
    await queryRunner.createIndex(
      "quote",
      new TableIndex({
        name: "IDX_quote_customer_id",
        columnNames: ["customer_id"],
      })
    )

    await queryRunner.createIndex(
      "quote",
      new TableIndex({
        name: "IDX_quote_status",
        columnNames: ["status"],
      })
    )

    await queryRunner.createIndex(
      "purchase_order",
      new TableIndex({
        name: "IDX_purchase_order_customer_id",
        columnNames: ["customer_id"],
      })
    )

    await queryRunner.createIndex(
      "purchase_order",
      new TableIndex({
        name: "IDX_purchase_order_po_number",
        columnNames: ["po_number"],
      })
    )

    await queryRunner.createIndex(
      "purchase_order",
      new TableIndex({
        name: "IDX_purchase_order_status",
        columnNames: ["status"],
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("purchase_order")
    await queryRunner.dropTable("quote")
    await queryRunner.dropTable("b2b_customer_group")
  }
}
