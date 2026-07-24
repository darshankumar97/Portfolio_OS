"use server";

import { revalidateTag } from "next/cache";
import { db } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { appEnumToDb, dbEnumToApp } from "@/lib/enum-map";
import { requireAdmin } from "@/lib/admin/guard";
import { ok, fail, type ActionResult } from "@/lib/admin/action-result";
import { researchSchema, type ResearchFormValues } from "@/lib/admin/schemas";
import type { Research, ResearchType } from "@/types/content";

export type ResearchInput = ResearchFormValues;

function toRow(row: Awaited<ReturnType<typeof db.research.create>>): Research {
  return {
    id: row.id,
    title: row.title,
    venue: row.venue,
    year: row.year,
    type: dbEnumToApp<ResearchType>(row.type),
    abstract: row.abstract,
    authors: row.authors as unknown as string[],
    links: row.links as unknown as Research["links"],
    tags: row.tags as unknown as string[],
    featured: row.featured,
  };
}

export async function createResearch(input: ResearchInput): Promise<ActionResult<Research>> {
  await requireAdmin();
  const parsed = researchSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  const data = parsed.data;

  const order = await db.research.count();
  const row = await db.research.create({ data: { ...data, type: appEnumToDb(data.type) as never, order } });
  revalidateTag(CACHE_TAGS.research);
  return ok(toRow(row));
}

export async function updateResearch(id: string, input: ResearchInput): Promise<ActionResult<Research>> {
  await requireAdmin();
  const parsed = researchSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  const data = parsed.data;

  const row = await db.research.update({ where: { id }, data: { ...data, type: appEnumToDb(data.type) as never } });
  revalidateTag(CACHE_TAGS.research);
  return ok(toRow(row));
}

export async function deleteResearch(id: string): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  await db.research.delete({ where: { id } });
  revalidateTag(CACHE_TAGS.research);
  return ok({ id });
}

export async function toggleResearchPublished(id: string, published: boolean): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  await db.research.update({ where: { id }, data: { published } });
  revalidateTag(CACHE_TAGS.research);
  return ok({ id });
}

export async function reorderResearch(orderedIds: string[]): Promise<ActionResult<{ ok: true }>> {
  await requireAdmin();
  await db.$transaction(orderedIds.map((id, order) => db.research.update({ where: { id }, data: { order } })));
  revalidateTag(CACHE_TAGS.research);
  return ok({ ok: true });
}
