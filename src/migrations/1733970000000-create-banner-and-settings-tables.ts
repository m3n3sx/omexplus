import { Migration } from "@mikro-orm/migrations"

export class Migration20251211000000 extends Migration {
  async up(): Promise<void> {
    // Create banner table
    this.addSql(`
      CREATE TABLE IF NOT EXISTS "banner" (
        "id" character varying NOT NULL,
        "title" text NOT NULL,
        "image_url" text NOT NULL,
        "link_url" text,
        "position" text NOT NULL DEFAULT 'home-hero',
        "is_active" boolean NOT NULL DEFAULT true,
        "priority" integer NOT NULL DEFAULT 0,
        "start_date" timestamptz,
        "end_date" timestamptz,
        "metadata" jsonb,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz,
        CONSTRAINT "banner_pkey" PRIMARY KEY ("id")
      );
    `)

    // Create site_settings table
    this.addSql(`
      CREATE TABLE IF NOT EXISTS "site_settings" (
        "id" character varying NOT NULL,
        "key" text NOT NULL UNIQUE,
        "value" jsonb NOT NULL,
        "category" text NOT NULL DEFAULT 'general',
        "description" text,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz,
        CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
      );
    `)

    // Create indexes
    this.addSql(`
      CREATE INDEX IF NOT EXISTS "banner_position_idx" ON "banner" ("position");
    `)
    
    this.addSql(`
      CREATE INDEX IF NOT EXISTS "banner_is_active_idx" ON "banner" ("is_active");
    `)
    
    this.addSql(`
      CREATE INDEX IF NOT EXISTS "site_settings_key_idx" ON "site_settings" ("key");
    `)
    
    this.addSql(`
      CREATE INDEX IF NOT EXISTS "site_settings_category_idx" ON "site_settings" ("category");
    `)
  }

  async down(): Promise<void> {
    this.addSql(`DROP TABLE IF EXISTS "banner" CASCADE;`)
    this.addSql(`DROP TABLE IF EXISTS "site_settings" CASCADE;`)
  }
}
