"use server";

import { revalidateTag } from "next/cache";
import { db } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { appEnumToDb, dbEnumToApp } from "@/lib/enum-map";
import { requireAdmin } from "@/lib/admin/guard";
import { ok, fail, type ActionResult } from "@/lib/admin/action-result";
import { socialLinkSchema, type SocialLinkFormValues } from "@/lib/admin/schemas";
import type { SocialLink } from "@/types/content";

export type SocialLinkInput = SocialLinkFormValues;

function toRow(row: Awaited<ReturnType<typeof db.socialLink.create>>): SocialLink {
  return { id: row.id, label: row.label, url: row.url, icon: dbEnumToApp(row.icon) };
}

export async function createSocialLink(input: SocialLinkInput): Promise<ActionResult<SocialLink>> {
  await requireAdmin();
  const parsed = socialLinkSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  const data = parsed.data;

  const order = await db.socialLink.count();
  const row = await db.socialLink.create({ data: { ...data, icon: appEnumToDb(data.icon) as never, order } });
  revalidateTag(CACHE_TAGS.social);
  return ok(toRow(row));
}

export async function updateSocialLink(id: string, input: SocialLinkInput): Promise<ActionResult<SocialLink>> {
  await requireAdmin();
  const parsed = socialLinkSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  const data = parsed.data;

  const row = await db.socialLink.update({ where: { id }, data: { ...data, icon: appEnumToDb(data.icon) as never } });
  revalidateTag(CACHE_TAGS.social);
  return ok(toRow(row));
}

export async function deleteSocialLink(id: string): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  await db.socialLink.delete({ where: { id } });
  revalidateTag(CACHE_TAGS.social);
  return ok({ id });
}

export async function toggleSocialLinkPublished(id: string, published: boolean): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  await db.socialLink.update({ where: { id }, data: { published } });
  revalidateTag(CACHE_TAGS.social);
  return ok({ id });
}

export async function reorderSocialLinks(orderedIds: string[]): Promise<ActionResult<{ ok: true }>> {
  await requireAdmin();
  await db.$transaction(orderedIds.map((id, order) => db.socialLink.update({ where: { id }, data: { order } })));
  revalidateTag(CACHE_TAGS.social);
  return ok({ ok: true });
}
