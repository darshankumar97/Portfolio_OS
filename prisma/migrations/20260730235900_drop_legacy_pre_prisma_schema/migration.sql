-- Drops the pre-Prisma "DevOS" schema that was built directly against this
-- Supabase project before the app was rewritten on Prisma. These tables are
-- unrelated to (and don't collide with, since Prisma's models are PascalCase
-- and these are snake_case) any model in schema.prisma. Their content is
-- either test/audit data or superseded by prisma/seed.ts, which loads the same
-- content from src/content/*.json into the new Prisma-managed tables.
--
-- The one real inbound lead in `contacts` (an inquiry from Sarah Jenkins) was
-- exported to legacy-schema-export/contacts.json before this migration was
-- written — see that file if you need it again.

DROP TABLE IF EXISTS "backups" CASCADE;
DROP TABLE IF EXISTS "contacts" CASCADE;
DROP TABLE IF EXISTS "changelog_entries" CASCADE;
DROP TABLE IF EXISTS "project_media" CASCADE;
DROP TABLE IF EXISTS "profiles" CASCADE;
DROP TABLE IF EXISTS "settings" CASCADE;
DROP TABLE IF EXISTS "services" CASCADE;
DROP TABLE IF EXISTS "achievements" CASCADE;
DROP TABLE IF EXISTS "media_assets" CASCADE;
DROP TABLE IF EXISTS "journal_articles" CASCADE;
DROP TABLE IF EXISTS "analytics_events" CASCADE;
DROP TABLE IF EXISTS "projects" CASCADE;
DROP TABLE IF EXISTS "opensource_contributions" CASCADE;
DROP TABLE IF EXISTS "experience" CASCADE;
DROP TABLE IF EXISTS "portfolio_state" CASCADE;
DROP TABLE IF EXISTS "research" CASCADE;
DROP TABLE IF EXISTS "resume_versions" CASCADE;
DROP TABLE IF EXISTS "audit_logs" CASCADE;
