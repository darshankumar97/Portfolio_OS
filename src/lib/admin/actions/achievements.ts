"use server";

import { revalidateTag } from "next/cache";
import { db } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { requireAdmin } from "@/lib/admin/guard";
import { ok, fail, type ActionResult } from "@/lib/admin/action-result";
import { achievementSchema, type AchievementFormValues } from "@/lib/admin/schemas";
import type { Achievement } from "@/types/content";

export type AchievementInput = AchievementFormValues;

function toRow(row: Awaited<ReturnType<typeof db.achievement.create>>): Achievement {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    date: row.date ?? undefined,
  };
}

export async function createAchievement(input: AchievementInput): Promise<ActionResult<Achievement>> {
  await requireAdmin();
  const parsed = achievementSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  const data = parsed.data;

  const order = await db.achievement.count();
  const row = await db.achievement.create({ data: { ...data, order } });
  revalidateTag(CACHE_TAGS.achievements);
  return ok(toRow(row));
}

export async function updateAchievement(id: string, input: AchievementInput): Promise<ActionResult<Achievement>> {
  await requireAdmin();
  const parsed = achievementSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  const data = parsed.data;

  const row = await db.achievement.update({ where: { id }, data });
  revalidateTag(CACHE_TAGS.achievements);
  return ok(toRow(row));
}

export async function deleteAchievement(id: string): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  await db.achievement.delete({ where: { id } });
  revalidateTag(CACHE_TAGS.achievements);
  return ok({ id });
}

export async function toggleAchievementPublished(id: string, published: boolean): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  await db.achievement.update({ where: { id }, data: { published } });
  revalidateTag(CACHE_TAGS.achievements);
  return ok({ id });
}

export async function reorderAchievements(orderedIds: string[]): Promise<ActionResult<{ ok: true }>> {
  await requireAdmin();
  await db.$transaction(
    orderedIds.map((id, order) => db.achievement.update({ where: { id }, data: { order } }))
  );
  revalidateTag(CACHE_TAGS.achievements);
  return ok({ ok: true });
}
