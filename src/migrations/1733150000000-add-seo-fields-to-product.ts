import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AddSeoFieldsToProduct1733150000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add SEO fields to product table
    await queryRunner.addColumn(
      "product",
      new TableColumn({
        name: "meta_title",
        type: "varchar",
        length: "60",
        isNullable: true,
      })
    )

    await queryRunner.addColumn(
      "product",
      new TableColumn({
        name: "meta_description",
        type: "varchar",
        length: "160",
        isNullable: true,
      })
    )

    await queryRunner.addColumn(
      "product",
      new TableColumn({
        name: "meta_keywords",
        type: "jsonb",
        isNullable: true,
        default: "'[]'",
      })
    )

    await queryRunner.addColumn(
      "product",
      new TableColumn({
        name: "slug",
        type: "varchar",
        length: "255",
        isNullable: true,
        isUnique: true,
      })
    )

    await queryRunner.addColumn(
      "product",
      new TableColumn({
        name: "canonical_url",
        type: "varchar",
        length: "500",
        isNullable: true,
      })
    )

    await queryRunner.addColumn(
      "product",
      new TableColumn({
        name: "og_title",
        type: "varchar",
        length: "60",
        isNullable: true,
      })
    )

    await queryRunner.addColumn(
      "product",
      new TableColumn({
        name: "og_description",
        type: "varchar",
        length: "160",
        isNullable: true,
      })
    )

    await queryRunner.addColumn(
      "product",
      new TableColumn({
        name: "og_image",
        type: "varchar",
        length: "500",
        isNullable: true,
      })
    )

    await queryRunner.addColumn(
      "product",
      new TableColumn({
        name: "schema_type",
        type: "varchar",
        length: "50",
        isNullable: true,
        default: "'Product'",
      })
    )

    await queryRunner.addColumn(
      "product",
      new TableColumn({
        name: "structured_data",
        type: "jsonb",
        isNullable: true,
      })
    )

    // Create index on slug for fast lookups
    await queryRunner.query(
      `CREATE INDEX "IDX_product_slug" ON "product" ("slug")`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_product_slug"`)
    await queryRunner.dropColumn("product", "structured_data")
    await queryRunner.dropColumn("product", "schema_type")
    await queryRunner.dropColumn("product", "og_image")
    await queryRunner.dropColumn("product", "og_description")
    await queryRunner.dropColumn("product", "og_title")
    await queryRunner.dropColumn("product", "canonical_url")
    await queryRunner.dropColumn("product", "slug")
    await queryRunner.dropColumn("product", "meta_keywords")
    await queryRunner.dropColumn("product", "meta_description")
    await queryRunner.dropColumn("product", "meta_title")
  }
}
