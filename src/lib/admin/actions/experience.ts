"use server";

import { revalidateTag } from "next/cache";
import { db } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { appEnumToDb, dbEnumToApp } from "@/lib/enum-map";
import { requireAdmin } from "@/lib/admin/guard";
import { ok, fail, type ActionResult } from "@/lib/admin/action-result";
import { experienceSchema, type ExperienceFormValues } from "@/lib/admin/schemas";
import type { Experience, ExperienceType } from "@/types/content";

export type ExperienceInput = ExperienceFormValues;

function toRow(row: Awaited<ReturnType<typeof db.experience.create>>): Experience {
  return {
    id: row.id,
    company: row.company,
    role: row.role,
    period: row.period,
    location: row.location,
    type: dbEnumToApp<ExperienceType>(row.type),
    description: row.description,
    achievements: row.achievements as unknown as string[],
    technologies: row.technologies as unknown as string[],
    featured: row.featured,
  };
}

export async function createExperience(input: ExperienceInput): Promise<ActionResult<Experience>> {
  await requireAdmin();
  const parsed = experienceSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  const data = parsed.data;

  const order = await db.experience.count();
  const row = await db.experience.create({
    data: { ...data, type: appEnumToDb(data.type) as never, order },
  });
  revalidateTag(CACHE_TAGS.experience);
  return ok(toRow(row));
}

export async function updateExperience(id: string, input: ExperienceInput): Promise<ActionResult<Experience>> {
  await requireAdmin();
  const parsed = experienceSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  const data = parsed.data;

  const row = await db.experience.update({
    where: { id },
    data: { ...data, type: appEnumToDb(data.type) as never },
  });
  revalidateTag(CACHE_TAGS.experience);
  return ok(toRow(row));
}

export async function deleteExperience(id: string): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  await db.experience.delete({ where: { id } });
  revalidateTag(CACHE_TAGS.experience);
  return ok({ id });
}

export async function toggleExperiencePublished(id: string, published: boolean): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  await db.experience.update({ where: { id }, data: { published } });
  revalidateTag(CACHE_TAGS.experience);
  return ok({ id });
}

export async function reorderExperience(orderedIds: string[]): Promise<ActionResult<{ ok: true }>> {
  await requireAdmin();
  await db.$transaction(orderedIds.map((id, order) => db.experience.update({ where: { id }, data: { order } })));
  revalidateTag(CACHE_TAGS.experience);
  return ok({ ok: true });
}
