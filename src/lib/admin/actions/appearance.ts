"use server";

import { revalidateTag } from "next/cache";
import { db } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { requireAdmin } from "@/lib/admin/guard";
import { ok, fail, type ActionResult } from "@/lib/admin/action-result";
import { wallpaperSchema, accentSchema, type WallpaperFormValues, type AccentFormValues } from "@/lib/admin/schemas";
import type { Wallpaper, Accent } from "@/types/content";

export type WallpaperInput = WallpaperFormValues;
export type AccentInput = AccentFormValues;

function toWallpaperRow(row: Awaited<ReturnType<typeof db.wallpaper.create>>): Wallpaper {
  return {
    id: row.id,
    label: row.label,
    gradient: row.gradient ?? undefined,
    imageUrl: row.imageUrl ?? undefined,
    isDefault: row.isDefault,
  };
}

function toAccentRow(row: Awaited<ReturnType<typeof db.accent.create>>): Accent {
  return { id: row.id, label: row.label, value: row.value, isDefault: row.isDefault };
}

export async function createWallpaper(input: WallpaperInput): Promise<ActionResult<Wallpaper>> {
  await requireAdmin();
  const parsed = wallpaperSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  const data = parsed.data;

  const order = await db.wallpaper.count();
  if (data.isDefault) await db.wallpaper.updateMany({ data: { isDefault: false } });
  const row = await db.wallpaper.create({ data: { ...data, order } });
  revalidateTag(CACHE_TAGS.wallpapers);
  return ok(toWallpaperRow(row));
}

export async function updateWallpaper(id: string, input: WallpaperInput): Promise<ActionResult<Wallpaper>> {
  await requireAdmin();
  const parsed = wallpaperSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  const data = parsed.data;

  if (data.isDefault) await db.wallpaper.updateMany({ where: { id: { not: id } }, data: { isDefault: false } });
  const row = await db.wallpaper.update({ where: { id }, data });
  revalidateTag(CACHE_TAGS.wallpapers);
  return ok(toWallpaperRow(row));
}

export async function deleteWallpaper(id: string): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  await db.wallpaper.delete({ where: { id } });
  revalidateTag(CACHE_TAGS.wallpapers);
  return ok({ id });
}

export async function reorderWallpapers(orderedIds: string[]): Promise<ActionResult<{ ok: true }>> {
  await requireAdmin();
  await db.$transaction(orderedIds.map((id, order) => db.wallpaper.update({ where: { id }, data: { order } })));
  revalidateTag(CACHE_TAGS.wallpapers);
  return ok({ ok: true });
}

export async function createAccent(input: AccentInput): Promise<ActionResult<Accent>> {
  await requireAdmin();
  const parsed = accentSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  const data = parsed.data;

  const order = await db.accent.count();
  if (data.isDefault) await db.accent.updateMany({ data: { isDefault: false } });
  const row = await db.accent.create({ data: { ...data, order } });
  revalidateTag(CACHE_TAGS.accents);
  return ok(toAccentRow(row));
}

export async function updateAccent(id: string, input: AccentInput): Promise<ActionResult<Accent>> {
  await requireAdmin();
  const parsed = accentSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  const data = parsed.data;

  if (data.isDefault) await db.accent.updateMany({ where: { id: { not: id } }, data: { isDefault: false } });
  const row = await db.accent.update({ where: { id }, data });
  revalidateTag(CACHE_TAGS.accents);
  return ok(toAccentRow(row));
}

export async function deleteAccent(id: string): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  await db.accent.delete({ where: { id } });
  revalidateTag(CACHE_TAGS.accents);
  return ok({ id });
}

export async function reorderAccents(orderedIds: string[]): Promise<ActionResult<{ ok: true }>> {
  await requireAdmin();
  await db.$transaction(orderedIds.map((id, order) => db.accent.update({ where: { id }, data: { order } })));
  revalidateTag(CACHE_TAGS.accents);
  return ok({ ok: true });
}
