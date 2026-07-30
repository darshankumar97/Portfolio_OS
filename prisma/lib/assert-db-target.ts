// Guards against DATABASE_URL and DIRECT_URL silently pointing at two different
// Supabase projects — Prisma Migrate would apply the schema through DIRECT_URL
// while the app/seed reads through DATABASE_URL, so a mismatch here means
// migrations "succeed" against a database the app never actually queries.

/** Pulls the Supabase project ref out of either a pooler or a direct connection string. */
export function extractSupabaseRef(connectionString: string): string | null {
  let url: URL;
  try {
    url = new URL(connectionString);
  } catch {
    return null;
  }

  const poolerUser = /^postgres\.([a-z0-9]+)$/.exec(url.username);
  if (poolerUser) return poolerUser[1];

  const directHost = /^db\.([a-z0-9]+)\.supabase\.co$/.exec(url.hostname);
  if (directHost) return directHost[1];

  return null;
}

/**
 * Throws if DATABASE_URL and DIRECT_URL resolve to different Supabase projects.
 * No-op for non-Supabase connection strings (ref extraction returns null) since
 * there's nothing reliable to compare in that case.
 */
export function assertSameSupabaseProject(databaseUrl?: string, directUrl?: string): void {
  if (!databaseUrl || !directUrl) return;

  const databaseRef = extractSupabaseRef(databaseUrl);
  const directRef = extractSupabaseRef(directUrl);

  if (databaseRef && directRef && databaseRef !== directRef) {
    throw new Error(
      `DATABASE_URL targets Supabase project "${databaseRef}" but DIRECT_URL targets "${directRef}". ` +
        "They must point at the same project — otherwise `prisma migrate deploy` (which uses " +
        "DIRECT_URL) creates tables in a database the app and seed script (which use DATABASE_URL) " +
        "never read from. Check for stale/mismatched values in your .env, GitHub Actions secrets, " +
        "and Vercel environment variables."
    );
  }
}
