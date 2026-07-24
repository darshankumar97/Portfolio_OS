"use server";

import { revalidateTag } from "next/cache";
import { db } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { requireAdmin } from "@/lib/admin/guard";
import { ok, fail, type ActionResult } from "@/lib/admin/action-result";
import { certificationSchema, type CertificationFormValues } from "@/lib/admin/schemas";
import type { Certification } from "@/types/content";

export type CertificationInput = CertificationFormValues;

function toRow(row: Awaited<ReturnType<typeof db.certification.create>>): Certification {
  return {
    id: row.id,
    name: row.name,
    issuer: row.issuer,
    issueDate: row.issueDate,
    credentialUrl: row.credentialUrl ?? undefined,
  };
}

export async function createCertification(input: CertificationInput): Promise<ActionResult<Certification>> {
  await requireAdmin();
  const parsed = certificationSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  const data = parsed.data;

  const order = await db.certification.count();
  const row = await db.certification.create({ data: { ...data, order } });
  revalidateTag(CACHE_TAGS.certifications);
  return ok(toRow(row));
}

export async function updateCertification(id: string, input: CertificationInput): Promise<ActionResult<Certification>> {
  await requireAdmin();
  const parsed = certificationSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  const data = parsed.data;

  const row = await db.certification.update({ where: { id }, data });
  revalidateTag(CACHE_TAGS.certifications);
  return ok(toRow(row));
}

export async function deleteCertification(id: string): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  await db.certification.delete({ where: { id } });
  revalidateTag(CACHE_TAGS.certifications);
  return ok({ id });
}

export async function toggleCertificationPublished(id: string, published: boolean): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  await db.certification.update({ where: { id }, data: { published } });
  revalidateTag(CACHE_TAGS.certifications);
  return ok({ id });
}

export async function reorderCertifications(orderedIds: string[]): Promise<ActionResult<{ ok: true }>> {
  await requireAdmin();
  await db.$transaction(
    orderedIds.map((id, order) => db.certification.update({ where: { id }, data: { order } }))
  );
  revalidateTag(CACHE_TAGS.certifications);
  return ok({ ok: true });
}
