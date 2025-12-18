export async function up({ queryRunner }: any) {
  await queryRunner.query(`
    CREATE TABLE IF NOT EXISTS "customer_password" (
      "id" character varying NOT NULL,
      "customer_id" character varying NOT NULL,
      "password_hash" character varying NOT NULL,
      "created_at" TIMESTAMP NOT NULL DEFAULT now(),
      "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
      PRIMARY KEY ("id"),
      FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE CASCADE,
      UNIQUE ("customer_id")
    )
  `)

  await queryRunner.query(`
    CREATE INDEX IF NOT EXISTS "idx_customer_password_customer_id" ON "customer_password" ("customer_id")
  `)
}

export async function down({ queryRunner }: any) {
  await queryRunner.query(`DROP TABLE IF EXISTS "customer_password"`)
}
