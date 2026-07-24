"use server";

import { revalidateTag } from "next/cache";
import { db } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { requireAdmin } from "@/lib/admin/guard";
import { ok, fail, type ActionResult } from "@/lib/admin/action-result";
import { profileSchema, type ProfileFormValues } from "@/lib/admin/schemas";
import type { Profile } from "@/types/content";

export type ProfileInput = ProfileFormValues;

function toRow(row: Awaited<ReturnType<typeof db.profile.upsert>>): Profile {
  return {
    name: row.name,
    title: row.title,
    headline: row.headline,
    subheadline: row.subheadline,
    location: row.location,
    email: row.email,
    availability: row.availability,
    bio: row.bio,
    avatarUrl: row.avatarUrl ?? undefined,
    highlights: row.highlights as unknown as Profile["highlights"],
    audiences: row.audiences as unknown as Profile["audiences"],
  };
}

export async function updateProfile(input: ProfileInput): Promise<ActionResult<Profile>> {
  await requireAdmin();
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  const data = parsed.data;

  const row = await db.profile.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", ...data },
    update: data,
  });
  revalidateTag(CACHE_TAGS.profile);
  return ok(toRow(row));
}
