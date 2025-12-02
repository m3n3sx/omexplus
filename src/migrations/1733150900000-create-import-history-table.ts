import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateImportHistoryTable1733150900000 implements MigrationInterface {
  name = 'CreateImportHistoryTable1733150900000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create import_history table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "import_history" (
        "id" VARCHAR PRIMARY KEY,
        "filename" VARCHAR NOT NULL,
        "user_id" VARCHAR,
        "status" VARCHAR NOT NULL CHECK (status IN ('processing', 'completed', 'failed')),
        "total_rows" INTEGER NOT NULL DEFAULT 0,
        "successful_rows" INTEGER NOT NULL DEFAULT 0,
        "failed_rows" INTEGER NOT NULL DEFAULT 0,
        "error_report" TEXT,
        "duration_ms" INTEGER,
        "started_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "completed_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `)

    // Create indexes
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_import_history_user_id" 
      ON "import_history" ("user_id")
    `)

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_import_history_status" 
      ON "import_history" ("status")
    `)

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_import_history_created_at" 
      ON "import_history" ("created_at" DESC)
    `)

    // Create import_errors table for detailed error tracking
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "import_error" (
        "id" VARCHAR PRIMARY KEY,
        "import_history_id" VARCHAR NOT NULL,
        "line_number" INTEGER NOT NULL,
        "field_name" VARCHAR NOT NULL,
        "error_reason" TEXT NOT NULL,
        "field_value" TEXT,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        FOREIGN KEY ("import_history_id") REFERENCES "import_history" ("id") ON DELETE CASCADE
      )
    `)

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_import_error_history_id" 
      ON "import_error" ("import_history_id")
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_import_error_history_id"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "import_error"`)
    
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_import_history_created_at"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_import_history_status"`)
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_import_history_user_id"`)
    await queryRunner.query(`DROP TABLE IF EXISTS "import_history"`)
  }
}
