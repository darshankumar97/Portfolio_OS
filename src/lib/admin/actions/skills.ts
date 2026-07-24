"use server";

import { revalidateTag } from "next/cache";
import { db } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { requireAdmin } from "@/lib/admin/guard";
import { ok, fail, type ActionResult } from "@/lib/admin/action-result";
import { skillCategorySchema, type SkillCategoryFormValues } from "@/lib/admin/schemas";
import type { SkillCategory } from "@/types/content";

export type SkillCategoryInput = SkillCategoryFormValues;

function toRow(row: Awaited<ReturnType<typeof db.skillCategory.create>>): SkillCategory {
  return {
    id: row.id,
    name: row.name,
    skills: row.skills as unknown as SkillCategory["skills"],
  };
}

export async function createSkillCategory(input: SkillCategoryInput): Promise<ActionResult<SkillCategory>> {
  await requireAdmin();
  const parsed = skillCategorySchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  const data = parsed.data;

  const order = await db.skillCategory.count();
  const row = await db.skillCategory.create({ data: { ...data, order } });
  revalidateTag(CACHE_TAGS.skills);
  return ok(toRow(row));
}

export async function updateSkillCategory(id: string, input: SkillCategoryInput): Promise<ActionResult<SkillCategory>> {
  await requireAdmin();
  const parsed = skillCategorySchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  const data = parsed.data;

  const row = await db.skillCategory.update({ where: { id }, data });
  revalidateTag(CACHE_TAGS.skills);
  return ok(toRow(row));
}

export async function deleteSkillCategory(id: string): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  await db.skillCategory.delete({ where: { id } });
  revalidateTag(CACHE_TAGS.skills);
  return ok({ id });
}

export async function toggleSkillCategoryPublished(id: string, published: boolean): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  await db.skillCategory.update({ where: { id }, data: { published } });
  revalidateTag(CACHE_TAGS.skills);
  return ok({ id });
}

export async function reorderSkillCategories(orderedIds: string[]): Promise<ActionResult<{ ok: true }>> {
  await requireAdmin();
  await db.$transaction(orderedIds.map((id, order) => db.skillCategory.update({ where: { id }, data: { order } })));
  revalidateTag(CACHE_TAGS.skills);
  return ok({ ok: true });
}
