"use server";

import { revalidateTag } from "next/cache";
import { db } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { appEnumToDb } from "@/lib/enum-map";
import { requireAdmin } from "@/lib/admin/guard";
import { ok, fail, type ActionResult } from "@/lib/admin/action-result";
import { projectSchema, type ProjectFormValues } from "@/lib/admin/schemas";
import type { Project, ProjectCategory, ProjectStatus } from "@/types/content";

export type ProjectInput = ProjectFormValues;
const projectInputSchema = projectSchema;

function toRow(p: Awaited<ReturnType<typeof db.project.create>>): Project {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    tagline: p.tagline,
    description: p.description,
    problem: p.problem,
    solution: p.solution,
    impact: p.impact as unknown as string[],
    technologies: p.technologies as unknown as string[],
    category: p.category.replace(/_/g, "-") as ProjectCategory,
    status: p.status.replace(/_/g, "-") as ProjectStatus,
    featured: p.featured,
    links: p.links as unknown as Project["links"],
    metrics: p.metrics as unknown as Project["metrics"],
    gallery: p.gallery as unknown as Project["gallery"],
    coverImage: p.coverImage ?? undefined,
  };
}

export async function createProject(input: ProjectInput): Promise<ActionResult<Project>> {
  await requireAdmin();
  const parsed = projectInputSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  const data = parsed.data;

  try {
    const order = await db.project.count();
    const row = await db.project.create({
      data: {
        ...data,
        category: appEnumToDb(data.category) as never,
        status: appEnumToDb(data.status) as never,
        order,
      },
    });
    revalidateTag(CACHE_TAGS.projects);
    return ok(toRow(row));
  } catch {
    return fail("That slug is already in use.");
  }
}

export async function updateProject(id: string, input: ProjectInput): Promise<ActionResult<Project>> {
  await requireAdmin();
  const parsed = projectInputSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input");
  const data = parsed.data;

  try {
    const row = await db.project.update({
      where: { id },
      data: {
        ...data,
        category: appEnumToDb(data.category) as never,
        status: appEnumToDb(data.status) as never,
      },
    });
    revalidateTag(CACHE_TAGS.projects);
    return ok(toRow(row));
  } catch {
    return fail("That slug is already in use.");
  }
}

export async function deleteProject(id: string): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  await db.project.delete({ where: { id } });
  revalidateTag(CACHE_TAGS.projects);
  return ok({ id });
}

export async function toggleProjectPublished(id: string, published: boolean): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  await db.project.update({ where: { id }, data: { published } });
  revalidateTag(CACHE_TAGS.projects);
  return ok({ id });
}

export async function reorderProjects(orderedIds: string[]): Promise<ActionResult<{ ok: true }>> {
  await requireAdmin();
  await db.$transaction(orderedIds.map((id, order) => db.project.update({ where: { id }, data: { order } })));
  revalidateTag(CACHE_TAGS.projects);
  return ok({ ok: true });
}
