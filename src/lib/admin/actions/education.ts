"use server";

import { revalidateTag } from "next/cache";
import { db } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { requireAdmin } from "@/lib/admin/guard";
import { ok, fail, type ActionResult } from "@/lib/admin/action-result";
import { educationSchema, type EducationFormValues } from "@/lib/admin/schemas";
import type { Education } from "@/types/content";

export type EducationInput = EducationFormValues;

function toRow(row: Awaited<ReturnType<typeof db.education.create>>): Education {
  return {
    id: row.id,
    institution: row.institution,
    degree: row.degree,
    field: row.field ?? undefined,
    period: row.period,
    location: row.location ?? undefined,
    description: row.description ?? undefined,
  };
}

export async function createEducation(input: EducationInput): Promise<ActionResult<Education>> {
  await requireAdmin();
  const parsed = educationSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  const data = parsed.data;

  const order = await db.education.count();
  const row = await db.education.create({ data: { ...data, order } });
  revalidateTag(CACHE_TAGS.education);
  return ok(toRow(row));
}

export async function updateEducation(id: string, input: EducationInput): Promise<ActionResult<Education>> {
  await requireAdmin();
  const parsed = educationSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  const data = parsed.data;

  const row = await db.education.update({ where: { id }, data });
  revalidateTag(CACHE_TAGS.education);
  return ok(toRow(row));
}

export async function deleteEducation(id: string): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  await db.education.delete({ where: { id } });
  revalidateTag(CACHE_TAGS.education);
  return ok({ id });
}

export async function toggleEducationPublished(id: string, published: boolean): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  await db.education.update({ where: { id }, data: { published } });
  revalidateTag(CACHE_TAGS.education);
  return ok({ id });
}

export async function reorderEducation(orderedIds: string[]): Promise<ActionResult<{ ok: true }>> {
  await requireAdmin();
  await db.$transaction(orderedIds.map((id, order) => db.education.update({ where: { id }, data: { order } })));
  revalidateTag(CACHE_TAGS.education);
  return ok({ ok: true });
}
