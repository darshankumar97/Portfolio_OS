"use server";

import { revalidateTag } from "next/cache";
import { db } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { requireAdmin } from "@/lib/admin/guard";
import { ok, fail, type ActionResult } from "@/lib/admin/action-result";
import { navigationItemSchema, type NavigationItemFormValues } from "@/lib/admin/schemas";

export type NavigationItemInput = NavigationItemFormValues;
export interface NavigationItemRow {
  id: string;
  label: string;
  href: string;
}

function toRow(row: Awaited<ReturnType<typeof db.navigationItem.create>>): NavigationItemRow {
  return { id: row.id, label: row.label, href: row.href };
}

export async function createNavigationItem(input: NavigationItemInput): Promise<ActionResult<NavigationItemRow>> {
  await requireAdmin();
  const parsed = navigationItemSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  const data = parsed.data;

  const order = await db.navigationItem.count();
  const row = await db.navigationItem.create({ data: { ...data, order } });
  revalidateTag(CACHE_TAGS.navigation);
  return ok(toRow(row));
}

export async function updateNavigationItem(id: string, input: NavigationItemInput): Promise<ActionResult<NavigationItemRow>> {
  await requireAdmin();
  const parsed = navigationItemSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  const data = parsed.data;

  const row = await db.navigationItem.update({ where: { id }, data });
  revalidateTag(CACHE_TAGS.navigation);
  return ok(toRow(row));
}

export async function deleteNavigationItem(id: string): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  await db.navigationItem.delete({ where: { id } });
  revalidateTag(CACHE_TAGS.navigation);
  return ok({ id });
}

export async function toggleNavigationItemPublished(id: string, published: boolean): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  await db.navigationItem.update({ where: { id }, data: { published } });
  revalidateTag(CACHE_TAGS.navigation);
  return ok({ id });
}

export async function reorderNavigationItems(orderedIds: string[]): Promise<ActionResult<{ ok: true }>> {
  await requireAdmin();
  await db.$transaction(orderedIds.map((id, order) => db.navigationItem.update({ where: { id }, data: { order } })));
  revalidateTag(CACHE_TAGS.navigation);
  return ok({ ok: true });
}
