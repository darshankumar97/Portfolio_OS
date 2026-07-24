"use server";

import { revalidateTag } from "next/cache";
import { db } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { requireAdmin } from "@/lib/admin/guard";
import { ok, fail, type ActionResult } from "@/lib/admin/action-result";
import { serviceSchema, type ServiceFormValues } from "@/lib/admin/schemas";
import type { Service } from "@/types/content";

export type ServiceInput = ServiceFormValues;

function toRow(row: Awaited<ReturnType<typeof db.service.create>>): Service {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    deliverables: row.deliverables as unknown as string[],
  };
}

export async function createService(input: ServiceInput): Promise<ActionResult<Service>> {
  await requireAdmin();
  const parsed = serviceSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  const data = parsed.data;

  const order = await db.service.count();
  const row = await db.service.create({ data: { ...data, order } });
  revalidateTag(CACHE_TAGS.services);
  return ok(toRow(row));
}

export async function updateService(id: string, input: ServiceInput): Promise<ActionResult<Service>> {
  await requireAdmin();
  const parsed = serviceSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  const data = parsed.data;

  const row = await db.service.update({ where: { id }, data });
  revalidateTag(CACHE_TAGS.services);
  return ok(toRow(row));
}

export async function deleteService(id: string): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  await db.service.delete({ where: { id } });
  revalidateTag(CACHE_TAGS.services);
  return ok({ id });
}

export async function toggleServicePublished(id: string, published: boolean): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  await db.service.update({ where: { id }, data: { published } });
  revalidateTag(CACHE_TAGS.services);
  return ok({ id });
}

export async function reorderServices(orderedIds: string[]): Promise<ActionResult<{ ok: true }>> {
  await requireAdmin();
  await db.$transaction(orderedIds.map((id, order) => db.service.update({ where: { id }, data: { order } })));
  revalidateTag(CACHE_TAGS.services);
  return ok({ ok: true });
}
