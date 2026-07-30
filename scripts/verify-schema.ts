/**
 * Run right after `prisma migrate deploy`, before seeding. `migrate deploy` can
 * report success while leaving the app's actual database untouched if
 * DATABASE_URL and DIRECT_URL point at different databases — this queries the
 * database the app itself uses (DATABASE_URL) and fails loudly, listing exactly
 * what's missing, instead of letting that surface later as a cryptic
 * "table does not exist" error from the seed script or a page render.
 */
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const EXPECTED_TABLES = [
  "Profile",
  "SiteSettings",
  "AdminUser",
  "NavigationItem",
  "SocialLink",
  "Experience",
  "Project",
  "Research",
  "SkillCategory",
  "Service",
  "Education",
  "Certification",
  "Achievement",
  "Testimonial",
  "BlogPost",
  "MediaAsset",
  "Wallpaper",
  "Accent",
];

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const db = new PrismaClient({ adapter });

  const rows = await db.$queryRaw<{ table_name: string }[]>`
    SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'
  `;
  await db.$disconnect();

  const found = new Set(rows.map((r) => r.table_name));
  const missing = EXPECTED_TABLES.filter((t) => !found.has(t));

  if (missing.length > 0) {
    console.error(
      `Schema verification failed — DATABASE_URL is missing ${missing.length} expected table(s): ${missing.join(", ")}.\n\n` +
        "`prisma migrate deploy` reported success, but the database DATABASE_URL points to doesn't " +
        "have these tables. This almost always means DATABASE_URL and DIRECT_URL reference different " +
        "databases — double-check both secrets (and the matching Vercel environment variables) point " +
        "at the same Supabase project."
    );
    process.exit(1);
  }

  console.log(`Schema verified — all ${EXPECTED_TABLES.length} expected tables exist.`);
}

main();
