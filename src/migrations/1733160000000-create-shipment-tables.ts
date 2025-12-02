import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateShipmentTables1733160000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create shipment table
    await queryRunner.createTable(
      new Table({
        name: "shipment",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "order_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "provider",
            type: "varchar",
            length: "50",
            isNullable: false,
          },
          {
            name: "shipping_method",
            type: "varchar",
            length: "100",
            isNullable: true,
          },
          {
            name: "tracking_number",
            type: "varchar",
            length: "255",
            isNullable: true,
            isUnique: true,
          },
          {
            name: "label_url",
            type: "varchar",
            length: "500",
            isNullable: true,
          },
          {
            name: "price",
            type: "decimal",
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: "status",
            type: "varchar",
            length: "50",
            default: "'pending'",
          },
          {
            name: "metadata",
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
    );

    // Create tracking_event table
    await queryRunner.createTable(
      new Table({
        name: "tracking_event",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "shipment_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "status",
            type: "varchar",
            length: "50",
            isNullable: false,
          },
          {
            name: "location",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "timestamp",
            type: "timestamp",
            isNullable: false,
          },
          {
            name: "description",
            type: "text",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
        ],
      }),
      true
    );

    // Add foreign key for shipment.order_id
    await queryRunner.createForeignKey(
      "shipment",
      new TableForeignKey({
        columnNames: ["order_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "order",
        onDelete: "CASCADE",
      })
    );

    // Add foreign key for tracking_event.shipment_id
    await queryRunner.createForeignKey(
      "tracking_event",
      new TableForeignKey({
        columnNames: ["shipment_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "shipment",
        onDelete: "CASCADE",
      })
    );

    // Create indexes
    await queryRunner.query(`CREATE INDEX idx_shipment_order_id ON shipment(order_id)`);
    await queryRunner.query(`CREATE INDEX idx_shipment_tracking_number ON shipment(tracking_number)`);
    await queryRunner.query(`CREATE INDEX idx_shipment_status ON shipment(status)`);
    await queryRunner.query(`CREATE INDEX idx_tracking_event_shipment_id ON tracking_event(shipment_id)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys
    const shipmentTable = await queryRunner.getTable("shipment");
    const trackingEventTable = await queryRunner.getTable("tracking_event");

    if (trackingEventTable) {
      const foreignKey = trackingEventTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf("shipment_id") !== -1
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey("tracking_event", foreignKey);
      }
    }

    if (shipmentTable) {
      const foreignKey = shipmentTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf("order_id") !== -1
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey("shipment", foreignKey);
      }
    }

    // Drop tables
    await queryRunner.dropTable("tracking_event", true);
    await queryRunner.dropTable("shipment", true);
  }
}
