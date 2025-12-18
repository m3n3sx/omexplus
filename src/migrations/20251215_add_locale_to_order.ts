export async function up({ queryRunner }: any) {
  await queryRunner.query(`
    ALTER TABLE "order" ADD COLUMN IF NOT EXISTS "locale" character varying
  `)
}

export async function down({ queryRunner }: any) {
  await queryRunner.query(`
    ALTER TABLE "order" DROP COLUMN IF EXISTS "locale"
  `)
}
