"use server";

import { revalidateTag } from "next/cache";
import { db } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { requireAdmin } from "@/lib/admin/guard";
import { ok, fail, type ActionResult } from "@/lib/admin/action-result";
import { testimonialSchema, type TestimonialFormValues } from "@/lib/admin/schemas";
import type { Testimonial } from "@/types/content";

export type TestimonialInput = TestimonialFormValues;

function toRow(row: Awaited<ReturnType<typeof db.testimonial.create>>): Testimonial {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    company: row.company ?? undefined,
    quote: row.quote,
    avatarUrl: row.avatarUrl ?? undefined,
  };
}

export async function createTestimonial(input: TestimonialInput): Promise<ActionResult<Testimonial>> {
  await requireAdmin();
  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  const data = parsed.data;

  const order = await db.testimonial.count();
  const row = await db.testimonial.create({ data: { ...data, order } });
  revalidateTag(CACHE_TAGS.testimonials);
  return ok(toRow(row));
}

export async function updateTestimonial(id: string, input: TestimonialInput): Promise<ActionResult<Testimonial>> {
  await requireAdmin();
  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  const data = parsed.data;

  const row = await db.testimonial.update({ where: { id }, data });
  revalidateTag(CACHE_TAGS.testimonials);
  return ok(toRow(row));
}

export async function deleteTestimonial(id: string): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  await db.testimonial.delete({ where: { id } });
  revalidateTag(CACHE_TAGS.testimonials);
  return ok({ id });
}

export async function toggleTestimonialPublished(id: string, published: boolean): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  await db.testimonial.update({ where: { id }, data: { published } });
  revalidateTag(CACHE_TAGS.testimonials);
  return ok({ id });
}

export async function reorderTestimonials(orderedIds: string[]): Promise<ActionResult<{ ok: true }>> {
  await requireAdmin();
  await db.$transaction(
    orderedIds.map((id, order) => db.testimonial.update({ where: { id }, data: { order } }))
  );
  revalidateTag(CACHE_TAGS.testimonials);
  return ok({ ok: true });
}
