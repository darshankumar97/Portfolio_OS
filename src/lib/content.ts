import "server-only";
import { unstable_cache } from "next/cache";
import { draftMode } from "next/headers";
import { db } from "@/lib/db";
import { dbEnumToApp } from "@/lib/enum-map";
import { CACHE_TAGS } from "@/lib/cache-tags";
import type {
  SiteConfig,
  Profile,
  Highlight,
  Audience,
  Experience,
  ExperienceType,
  Project,
  ProjectCategory,
  ProjectStatus,
  ProjectMetric,
  ProjectGalleryItem,
  Research,
  ResearchType,
  SkillCategory,
  Skill,
  SocialLink,
  Service,
  NavigationItem,
  Wallpaper,
  Accent,
  Education,
  Certification,
  Achievement,
  Testimonial,
  BlogPost,
} from "@/types/content";

/** Draft Mode lets the admin "Preview site" view include unpublished rows. */
async function isPreviewing(): Promise<boolean> {
  try {
    const dm = await draftMode();
    return dm.isEnabled;
  } catch {
    return false;
  }
}

function sortByOrder<T extends { order: number }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => a.order - b.order);
}

// ---------- Singletons ----------

const getProfileRow = unstable_cache(
  async () => db.profile.findUnique({ where: { id: "singleton" } }),
  ["profile"],
  { tags: [CACHE_TAGS.profile] }
);

export async function getProfile(): Promise<Profile> {
  const row = await getProfileRow();
  if (!row) {
    throw new Error("Profile not seeded yet — run `npx prisma db seed` after configuring .env.");
  }
  return {
    name: row.name,
    title: row.title,
    headline: row.headline,
    subheadline: row.subheadline,
    location: row.location,
    email: row.email,
    availability: row.availability,
    bio: row.bio,
    avatarUrl: row.avatarUrl ?? undefined,
    highlights: row.highlights as unknown as Highlight[],
    audiences: row.audiences as unknown as Audience[],
  };
}

const getSiteSettingsRow = unstable_cache(
  async () => db.siteSettings.findUnique({ where: { id: "singleton" } }),
  ["site-settings"],
  { tags: [CACHE_TAGS.siteSettings] }
);

export async function getSiteConfig(): Promise<SiteConfig> {
  const row = await getSiteSettingsRow();
  if (!row) {
    throw new Error("Site settings not seeded yet — run `npx prisma db seed` after configuring .env.");
  }
  return {
    name: row.name,
    tagline: row.tagline,
    domain: row.domain,
    url: row.url,
    description: row.description,
    keywords: row.keywords as unknown as string[],
    locale: row.locale,
    resumeUrl: row.resumeUrl ?? "",
    ogImageUrl: row.ogImageUrl ?? undefined,
  };
}

// ---------- Navigation & social ----------

const getNavigationRows = unstable_cache(
  async () => db.navigationItem.findMany({ orderBy: { order: "asc" } }),
  ["navigation"],
  { tags: [CACHE_TAGS.navigation] }
);

export async function getNavigation(): Promise<NavigationItem[]> {
  const rows = await getNavigationRows();
  const preview = await isPreviewing();
  return rows
    .filter((r) => preview || r.published)
    .map((r) => ({ label: r.label, href: r.href }));
}

const getSocialRows = unstable_cache(
  async () => db.socialLink.findMany({ orderBy: { order: "asc" } }),
  ["social"],
  { tags: [CACHE_TAGS.social] }
);

export async function getSocialLinks(): Promise<SocialLink[]> {
  const rows = await getSocialRows();
  const preview = await isPreviewing();
  return rows
    .filter((r) => preview || r.published)
    .map((r) => ({ id: r.id, label: r.label, url: r.url, icon: dbEnumToApp(r.icon) }));
}

// ---------- Experience ----------

const getExperienceRows = unstable_cache(
  async () => db.experience.findMany({ orderBy: { order: "asc" } }),
  ["experience"],
  { tags: [CACHE_TAGS.experience] }
);

export async function getExperience(): Promise<Experience[]> {
  const rows = await getExperienceRows();
  const preview = await isPreviewing();
  return rows
    .filter((r) => preview || r.published)
    .map((r) => ({
      id: r.id,
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

export async function getFeaturedExperience(): Promise<Experience[]> {
  return (await getExperience()).filter((e) => e.featured);
}

// ---------- Projects ----------

const getProjectRows = unstable_cache(
  async () => db.project.findMany({ orderBy: { order: "asc" } }),
  ["projects"],
  { tags: [CACHE_TAGS.projects] }
);

export async function getProjects(): Promise<Project[]> {
  const rows = await getProjectRows();
  const preview = await isPreviewing();
  return rows
    .filter((r) => preview || r.published)
    .map((r) => ({
      id: r.id,
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
      metrics: r.metrics as unknown as ProjectMetric[],
      gallery: r.gallery as unknown as ProjectGalleryItem[],
      coverImage: r.coverImage ?? undefined,
    }));
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return (await getProjects()).filter((p) => p.featured);
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  return (await getProjects()).find((p) => p.slug === slug);
}

// ---------- Research ----------

const getResearchRows = unstable_cache(
  async () => db.research.findMany({ orderBy: { order: "asc" } }),
  ["research"],
  { tags: [CACHE_TAGS.research] }
);

export async function getResearch(): Promise<Research[]> {
  const rows = await getResearchRows();
  const preview = await isPreviewing();
  return rows
    .filter((r) => preview || r.published)
    .map((r) => ({
      id: r.id,
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

export async function getFeaturedResearch(): Promise<Research[]> {
  return (await getResearch()).filter((r) => r.featured);
}

// ---------- Skills ----------

const getSkillCategoryRows = unstable_cache(
  async () => db.skillCategory.findMany({ orderBy: { order: "asc" } }),
  ["skills"],
  { tags: [CACHE_TAGS.skills] }
);

export async function getSkills(): Promise<SkillCategory[]> {
  const rows = await getSkillCategoryRows();
  const preview = await isPreviewing();
  return rows
    .filter((r) => preview || r.published)
    .map((r) => ({ id: r.id, name: r.name, skills: r.skills as unknown as Skill[] }));
}

// ---------- Services ----------

const getServiceRows = unstable_cache(
  async () => db.service.findMany({ orderBy: { order: "asc" } }),
  ["services"],
  { tags: [CACHE_TAGS.services] }
);

export async function getServices(): Promise<Service[]> {
  const rows = await getServiceRows();
  const preview = await isPreviewing();
  return rows
    .filter((r) => preview || r.published)
    .map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      deliverables: r.deliverables as unknown as string[],
    }));
}

// ---------- Education ----------

const getEducationRows = unstable_cache(
  async () => db.education.findMany({ orderBy: { order: "asc" } }),
  ["education"],
  { tags: [CACHE_TAGS.education] }
);

export async function getEducation(): Promise<Education[]> {
  const rows = await getEducationRows();
  const preview = await isPreviewing();
  return rows
    .filter((r) => preview || r.published)
    .map((r) => ({
      id: r.id,
      institution: r.institution,
      degree: r.degree,
      field: r.field ?? undefined,
      period: r.period,
      location: r.location ?? undefined,
      description: r.description ?? undefined,
    }));
}

// ---------- Certifications ----------

const getCertificationRows = unstable_cache(
  async () => db.certification.findMany({ orderBy: { order: "asc" } }),
  ["certifications"],
  { tags: [CACHE_TAGS.certifications] }
);

export async function getCertifications(): Promise<Certification[]> {
  const rows = await getCertificationRows();
  const preview = await isPreviewing();
  return rows
    .filter((r) => preview || r.published)
    .map((r) => ({
      id: r.id,
      name: r.name,
      issuer: r.issuer,
      issueDate: r.issueDate,
      credentialUrl: r.credentialUrl ?? undefined,
    }));
}

// ---------- Achievements ----------

const getAchievementRows = unstable_cache(
  async () => db.achievement.findMany({ orderBy: { order: "asc" } }),
  ["achievements"],
  { tags: [CACHE_TAGS.achievements] }
);

export async function getAchievements(): Promise<Achievement[]> {
  const rows = await getAchievementRows();
  const preview = await isPreviewing();
  return rows
    .filter((r) => preview || r.published)
    .map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description ?? undefined,
      date: r.date ?? undefined,
    }));
}

// ---------- Testimonials ----------

const getTestimonialRows = unstable_cache(
  async () => db.testimonial.findMany({ orderBy: { order: "asc" } }),
  ["testimonials"],
  { tags: [CACHE_TAGS.testimonials] }
);

export async function getTestimonials(): Promise<Testimonial[]> {
  const rows = await getTestimonialRows();
  const preview = await isPreviewing();
  return rows
    .filter((r) => preview || r.published)
    .map((r) => ({
      id: r.id,
      name: r.name,
      role: r.role,
      company: r.company ?? undefined,
      quote: r.quote,
      avatarUrl: r.avatarUrl ?? undefined,
    }));
}

// ---------- Blog ----------

const getBlogPostRows = unstable_cache(
  async () => db.blogPost.findMany({ orderBy: { order: "asc" } }),
  ["blog"],
  { tags: [CACHE_TAGS.blog] }
);

export async function getBlogPosts(): Promise<BlogPost[]> {
  const rows = await getBlogPostRows();
  const preview = await isPreviewing();
  return rows
    .filter((r) => preview || r.published)
    .map((r) => ({
      id: r.id,
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

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  return (await getBlogPosts()).find((p) => p.slug === slug);
}

// ---------- Appearance (wallpapers & accents) ----------

const getWallpaperRows = unstable_cache(
  async () => db.wallpaper.findMany({ orderBy: { order: "asc" } }),
  ["wallpapers"],
  { tags: [CACHE_TAGS.wallpapers] }
);

export async function getWallpapers(): Promise<Wallpaper[]> {
  return sortByOrder(await getWallpaperRows()).map((r) => ({
    id: r.id,
    label: r.label,
    gradient: r.gradient ?? undefined,
    imageUrl: r.imageUrl ?? undefined,
    isDefault: r.isDefault,
  }));
}

const getAccentRows = unstable_cache(
  async () => db.accent.findMany({ orderBy: { order: "asc" } }),
  ["accents"],
  { tags: [CACHE_TAGS.accents] }
);

export async function getAccents(): Promise<Accent[]> {
  return sortByOrder(await getAccentRows()).map((r) => ({
    id: r.id,
    label: r.label,
    value: r.value,
    isDefault: r.isDefault,
  }));
}
