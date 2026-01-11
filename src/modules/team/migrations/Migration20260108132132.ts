import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260108132132 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "calendar_event" ("id" text not null, "title" text not null, "description" text null, "start_date" timestamptz not null, "end_date" timestamptz not null, "all_day" boolean not null default false, "location" text null, "type" text not null default 'meeting', "color" text not null default '#3b82f6', "created_by" text not null, "attendees" jsonb null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "calendar_event_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_calendar_event_deleted_at" ON "calendar_event" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "internal_message" ("id" text not null, "sender_id" text not null, "sender_name" text not null, "recipient_id" text null, "recipient_name" text null, "subject" text null, "content" text not null, "read" boolean not null default false, "priority" text not null default 'normal', "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "internal_message_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_internal_message_deleted_at" ON "internal_message" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "note" ("id" text not null, "title" text not null, "content" text not null, "category" text not null default 'general', "color" text not null default '#fbbf24', "created_by" text not null, "shared_with" jsonb null, "pinned" boolean not null default false, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "note_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_note_deleted_at" ON "note" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "task" ("id" text not null, "title" text not null, "description" text null, "status" text not null default 'todo', "priority" text not null default 'medium', "assigned_to" text null, "assigned_by" text not null, "due_date" timestamptz null, "completed_at" timestamptz null, "tags" jsonb null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "task_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_task_deleted_at" ON "task" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "team_notification" ("id" text not null, "user_id" text not null, "type" text not null, "title" text not null, "message" text not null, "link" text null, "read" boolean not null default false, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "team_notification_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_team_notification_deleted_at" ON "team_notification" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "calendar_event" cascade;`);

    this.addSql(`drop table if exists "internal_message" cascade;`);

    this.addSql(`drop table if exists "note" cascade;`);

    this.addSql(`drop table if exists "task" cascade;`);

    this.addSql(`drop table if exists "team_notification" cascade;`);
  }

}
