import "server-only";
import { db } from "@/lib/db";
import { dbEnumToApp } from "@/lib/enum-map";
import type {
  Project,
  ProjectCategory,
  ProjectStatus,
  Experience,
  ExperienceType,
  Research,
  ResearchType,
  SkillCategory,
  Skill,
  Service,
  SocialLink,
  NavigationItem,
  Wallpaper,
  Accent,
  Education,
  Certification,
  Achievement,
  Testimonial,
  BlogPost,
} from "@/types/content";

/**
 * Admin reads bypass content.ts entirely: no publish filtering (drafts must
 * be visible in the admin UI) and no unstable_cache (the admin always needs
 * the freshest row, e.g. immediately after a mutation).
 */

export interface AdminRow {
  id: string;
  order: number;
  published: boolean;
}

export async function listProjectsAdmin(): Promise<(Project & AdminRow)[]> {
  const rows = await db.project.findMany({ orderBy: { order: "asc" } });
  return rows.map((r) => ({
    id: r.id,
    order: r.order,
    published: r.published,
    slug: r.slug,
    title: r.title,
    tagline: r.tagline,
    description: r.description,
    problem: r.problem,
    solution: r.solution,
    impact: r.impact as unknown as string[],
    technologies: r.technologies as unknown as string[],
    category: dbEnumToApp<ProjectCategory>(r.category),
    status: dbEnumToApp<ProjectStatus>(r.status),
    featured: r.featured,
    links: r.links as unknown as Project["links"],
    metrics: r.metrics as unknown as Project["metrics"],
    gallery: r.gallery as unknown as Project["gallery"],
    coverImage: r.coverImage ?? undefined,
  }));
}

export async function listExperienceAdmin(): Promise<(Experience & AdminRow)[]> {
  const rows = await db.experience.findMany({ orderBy: { order: "asc" } });
  return rows.map((r) => ({
    id: r.id,
    order: r.order,
    published: r.published,
    company: r.company,
    role: r.role,
    period: r.period,
    location: r.location,
    type: dbEnumToApp<ExperienceType>(r.type),
    description: r.description,
    achievements: r.achievements as unknown as string[],
    technologies: r.technologies as unknown as string[],
    featured: r.featured,
  }));
}

export async function listResearchAdmin(): Promise<(Research & AdminRow)[]> {
  const rows = await db.research.findMany({ orderBy: { order: "asc" } });
  return rows.map((r) => ({
    id: r.id,
    order: r.order,
    published: r.published,
    title: r.title,
    venue: r.venue,
    year: r.year,
    type: dbEnumToApp<ResearchType>(r.type),
    abstract: r.abstract,
    authors: r.authors as unknown as string[],
    links: r.links as unknown as Research["links"],
    tags: r.tags as unknown as string[],
    featured: r.featured,
  }));
}

export async function listSkillsAdmin(): Promise<(SkillCategory & AdminRow)[]> {
  const rows = await db.skillCategory.findMany({ orderBy: { order: "asc" } });
  return rows.map((r) => ({
    id: r.id,
    order: r.order,
    published: r.published,
    name: r.name,
    skills: r.skills as unknown as Skill[],
  }));
}

export async function listServicesAdmin(): Promise<(Service & AdminRow)[]> {
  const rows = await db.service.findMany({ orderBy: { order: "asc" } });
  return rows.map((r) => ({
    id: r.id,
    order: r.order,
    published: r.published,
    title: r.title,
    description: r.description,
    deliverables: r.deliverables as unknown as string[],
  }));
}

export async function listSocialAdmin(): Promise<(SocialLink & AdminRow)[]> {
  const rows = await db.socialLink.findMany({ orderBy: { order: "asc" } });
  return rows.map((r) => ({
    id: r.id,
    order: r.order,
    published: r.published,
    label: r.label,
    url: r.url,
    icon: dbEnumToApp(r.icon),
  }));
}

export async function listNavigationAdmin(): Promise<(NavigationItem & AdminRow)[]> {
  const rows = await db.navigationItem.findMany({ orderBy: { order: "asc" } });
  return rows.map((r) => ({
    id: r.id,
    order: r.order,
    published: r.published,
    label: r.label,
    href: r.href,
  }));
}

export async function listEducationAdmin(): Promise<(Education & AdminRow)[]> {
  const rows = await db.education.findMany({ orderBy: { order: "asc" } });
  return rows.map((r) => ({
    id: r.id,
    order: r.order,
    published: r.published,
    institution: r.institution,
    degree: r.degree,
    field: r.field ?? undefined,
    period: r.period,
    location: r.location ?? undefined,
    description: r.description ?? undefined,
  }));
}

export async function listCertificationsAdmin(): Promise<(Certification & AdminRow)[]> {
  const rows = await db.certification.findMany({ orderBy: { order: "asc" } });
  return rows.map((r) => ({
    id: r.id,
    order: r.order,
    published: r.published,
    name: r.name,
    issuer: r.issuer,
    issueDate: r.issueDate,
    credentialUrl: r.credentialUrl ?? undefined,
  }));
}

export async function listAchievementsAdmin(): Promise<(Achievement & AdminRow)[]> {
  const rows = await db.achievement.findMany({ orderBy: { order: "asc" } });
  return rows.map((r) => ({
    id: r.id,
    order: r.order,
    published: r.published,
    title: r.title,
    description: r.description ?? undefined,
    date: r.date ?? undefined,
  }));
}

export async function listTestimonialsAdmin(): Promise<(Testimonial & AdminRow)[]> {
  const rows = await db.testimonial.findMany({ orderBy: { order: "asc" } });
  return rows.map((r) => ({
    id: r.id,
    order: r.order,
    published: r.published,
    name: r.name,
    role: r.role,
    company: r.company ?? undefined,
    quote: r.quote,
    avatarUrl: r.avatarUrl ?? undefined,
  }));
}

export async function listBlogPostsAdmin(): Promise<(BlogPost & AdminRow)[]> {
  const rows = await db.blogPost.findMany({ orderBy: { order: "asc" } });
  return rows.map((r) => ({
    id: r.id,
    order: r.order,
    published: r.published,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    content: r.content ?? undefined,
    externalUrl: r.externalUrl ?? undefined,
    coverImage: r.coverImage ?? undefined,
    tags: r.tags as unknown as string[],
    publishedAt: r.publishedAt?.toISOString() ?? undefined,
  }));
}

export async function listWallpapersAdmin(): Promise<Wallpaper[]> {
  const rows = await db.wallpaper.findMany({ orderBy: { order: "asc" } });
  return rows.map((r) => ({
    id: r.id,
    label: r.label,
    gradient: r.gradient ?? undefined,
    imageUrl: r.imageUrl ?? undefined,
    isDefault: r.isDefault,
  }));
}

export async function listAccentsAdmin(): Promise<Accent[]> {
  const rows = await db.accent.findMany({ orderBy: { order: "asc" } });
  return rows.map((r) => ({ id: r.id, label: r.label, value: r.value, isDefault: r.isDefault }));
}
