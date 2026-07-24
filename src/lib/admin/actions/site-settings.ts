"use server";

import { revalidateTag } from "next/cache";
import { db } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { requireAdmin } from "@/lib/admin/guard";
import { ok, fail, type ActionResult } from "@/lib/admin/action-result";
import { siteSettingsSchema, type SiteSettingsFormValues } from "@/lib/admin/schemas";
import type { SiteConfig } from "@/types/content";

export type SiteSettingsInput = SiteSettingsFormValues;

function toRow(row: Awaited<ReturnType<typeof db.siteSettings.upsert>>): SiteConfig {
  return {
    name: row.name,
    tagline: row.tagline,
    domain: row.domain,
    url: row.url,
    description: row.description,
    keywords: row.keywords as unknown as string[],
    locale: row.locale,
    resumeUrl: row.resumeUrl ?? "",
    ogImageUrl: row.ogImageUrl ?? undefined,
  };
}

export async function updateSiteSettings(input: SiteSettingsInput): Promise<ActionResult<SiteConfig>> {
  await requireAdmin();
  const parsed = siteSettingsSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  const data = parsed.data;

  const row = await db.siteSettings.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", ...data },
    update: data,
  });
  revalidateTag(CACHE_TAGS.siteSettings);
  return ok(toRow(row));
}
