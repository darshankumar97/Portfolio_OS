"use server";

import { db } from "@/lib/db";
import { supabaseAdmin, MEDIA_BUCKET, publicMediaUrl } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin/guard";
import { ok, fail, type ActionResult } from "@/lib/admin/action-result";
import type { MediaType } from "@/generated/prisma/enums";

export interface MediaAssetDTO {
  id: string;
  url: string;
  type: MediaType;
  filename: string;
  size: number;
  createdAt: string;
}

const MAX_BYTES = 20 * 1024 * 1024; // 20MB
const ALLOWED_PREFIXES = ["image/", "video/"];
const ALLOWED_EXACT = ["application/pdf"];

function mediaTypeFor(mime: string): MediaType {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  return "document";
}

export async function uploadMedia(formData: FormData): Promise<ActionResult<MediaAssetDTO>> {
  await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File)) return fail("No file provided.");
  if (file.size > MAX_BYTES) return fail("File is larger than 20MB.");
  if (!ALLOWED_PREFIXES.some((p) => file.type.startsWith(p)) && !ALLOWED_EXACT.includes(file.type)) {
    return fail("Only images, videos, and PDFs are supported.");
  }

  const ext = file.name.includes(".") ? file.name.split(".").pop() : undefined;
  const path = `${crypto.randomUUID()}${ext ? `.${ext}` : ""}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabaseAdmin.storage
    .from(MEDIA_BUCKET)
    .upload(path, buffer, { contentType: file.type, upsert: false });

  if (uploadError) return fail(uploadError.message);

  const row = await db.mediaAsset.create({
    data: {
      url: publicMediaUrl(path),
      path,
      type: mediaTypeFor(file.type),
      filename: file.name,
      size: file.size,
    },
  });

  return ok({
    id: row.id,
    url: row.url,
    type: row.type,
    filename: row.filename,
    size: row.size,
    createdAt: row.createdAt.toISOString(),
  });
}

export async function deleteMedia(id: string): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const row = await db.mediaAsset.findUnique({ where: { id } });
  if (!row) return fail("Asset not found.");

  await supabaseAdmin.storage.from(MEDIA_BUCKET).remove([row.path]);
  await db.mediaAsset.delete({ where: { id } });
  return ok({ id });
}

export async function listMediaAdmin(): Promise<MediaAssetDTO[]> {
  await requireAdmin();
  const rows = await db.mediaAsset.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map((r) => ({
    id: r.id,
    url: r.url,
    type: r.type,
    filename: r.filename,
    size: r.size,
    createdAt: r.createdAt.toISOString(),
  }));
}
