import { Migration } from "@mikro-orm/migrations"

export class Migration20251211000001 extends Migration {
  async up(): Promise<void> {
    // Create cms_page table
    this.addSql(`
      CREATE TABLE IF NOT EXISTS "cms_page" (
        "id" character varying NOT NULL,
        "slug" text NOT NULL UNIQUE,
        "title" text NOT NULL,
        "meta_description" text,
        "meta_keywords" text,
        "content" jsonb NOT NULL DEFAULT '{}',
        "template" text NOT NULL DEFAULT 'default',
        "status" text NOT NULL DEFAULT 'draft',
        "locale" text NOT NULL DEFAULT 'pl',
        "published_at" timestamptz,
        "seo_title" text,
        "seo_image" text,
        "metadata" jsonb,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz,
        CONSTRAINT "cms_page_pkey" PRIMARY KEY ("id")
      );
    `)

    // Create indexes
    this.addSql(`
      CREATE INDEX IF NOT EXISTS "cms_page_slug_idx" ON "cms_page" ("slug");
    `)
    
    this.addSql(`
      CREATE INDEX IF NOT EXISTS "cms_page_status_idx" ON "cms_page" ("status");
    `)
    
    this.addSql(`
      CREATE INDEX IF NOT EXISTS "cms_page_locale_idx" ON "cms_page" ("locale");
    `)
  }

  async down(): Promise<void> {
    this.addSql(`DROP TABLE IF EXISTS "cms_page" CASCADE;`)
  }
}
