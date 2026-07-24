"use server";

import { revalidateTag } from "next/cache";
import { db } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { requireAdmin } from "@/lib/admin/guard";
import { ok, fail, type ActionResult } from "@/lib/admin/action-result";
import { blogPostSchema, type BlogPostFormValues } from "@/lib/admin/schemas";
import type { BlogPost } from "@/types/content";

export type BlogPostInput = BlogPostFormValues;

function toRow(row: Awaited<ReturnType<typeof db.blogPost.create>>): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content ?? undefined,
    externalUrl: row.externalUrl ?? undefined,
    coverImage: row.coverImage ?? undefined,
    tags: row.tags as unknown as string[],
    publishedAt: row.publishedAt?.toISOString() ?? undefined,
  };
}

function toWriteData(data: BlogPostFormValues) {
  return { ...data, publishedAt: data.publishedAt ? new Date(data.publishedAt) : null };
}

export async function createBlogPost(input: BlogPostInput): Promise<ActionResult<BlogPost>> {
  await requireAdmin();
  const parsed = blogPostSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");

  try {
    const order = await db.blogPost.count();
    const row = await db.blogPost.create({ data: { ...toWriteData(parsed.data), order } });
    revalidateTag(CACHE_TAGS.blog);
    return ok(toRow(row));
  } catch {
    return fail("That slug is already in use.");
  }
}

export async function updateBlogPost(id: string, input: BlogPostInput): Promise<ActionResult<BlogPost>> {
  await requireAdmin();
  const parsed = blogPostSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");

  try {
    const row = await db.blogPost.update({ where: { id }, data: toWriteData(parsed.data) });
    revalidateTag(CACHE_TAGS.blog);
    return ok(toRow(row));
  } catch {
    return fail("That slug is already in use.");
  }
}

export async function deleteBlogPost(id: string): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  await db.blogPost.delete({ where: { id } });
  revalidateTag(CACHE_TAGS.blog);
  return ok({ id });
}

export async function toggleBlogPostPublished(id: string, published: boolean): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  await db.blogPost.update({ where: { id }, data: { published } });
  revalidateTag(CACHE_TAGS.blog);
  return ok({ id });
}

export async function reorderBlogPosts(orderedIds: string[]): Promise<ActionResult<{ ok: true }>> {
  await requireAdmin();
  await db.$transaction(orderedIds.map((id, order) => db.blogPost.update({ where: { id }, data: { order } })));
  revalidateTag(CACHE_TAGS.blog);
  return ok({ ok: true });
}
