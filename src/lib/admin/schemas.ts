import { z } from "zod";

// Shared zod schemas: imported by "use server" action files (which may only
// export async functions, not schema values) and by client forms for
// react-hook-form's resolver — one definition, validated on both ends.

export const projectSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  title: z.string().min(1, "Title is required"),
  tagline: z.string().min(1, "Tagline is required"),
  description: z.string().min(1, "Description is required"),
  problem: z.string().min(1, "Problem is required"),
  solution: z.string().min(1, "Solution is required"),
  impact: z.array(z.string()),
  technologies: z.array(z.string()),
  category: z.enum(["product", "research", "open-source", "freelance"]),
  status: z.enum(["live", "in-progress", "archived"]),
  featured: z.boolean(),
  published: z.boolean(),
  links: z.object({
    live: z.string().optional(),
    github: z.string().optional(),
    paper: z.string().optional(),
    demo: z.string().optional(),
  }),
  metrics: z.array(z.object({ label: z.string(), value: z.string() })),
  gallery: z.array(z.object({ url: z.string(), alt: z.string().optional() })),
  coverImage: z.string().optional(),
});
export type ProjectFormValues = z.infer<typeof projectSchema>;

export const PROJECT_CATEGORY_OPTIONS = ["product", "research", "open-source", "freelance"] as const;
export const PROJECT_STATUS_OPTIONS = ["live", "in-progress", "archived"] as const;

export const experienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  period: z.string().min(1, "Period is required"),
  location: z.string().min(1, "Location is required"),
  type: z.enum(["full-time", "contract", "internship", "research"]),
  description: z.string().min(1, "Description is required"),
  achievements: z.array(z.string()),
  technologies: z.array(z.string()),
  featured: z.boolean(),
  published: z.boolean(),
});
export type ExperienceFormValues = z.infer<typeof experienceSchema>;

export const EXPERIENCE_TYPE_OPTIONS = ["full-time", "contract", "internship", "research"] as const;

export const researchSchema = z.object({
  title: z.string().min(1, "Title is required"),
  venue: z.string().min(1, "Venue is required"),
  year: z.string().min(1, "Year is required"),
  type: z.enum(["paper", "thesis", "preprint", "talk"]),
  abstract: z.string().min(1, "Abstract is required"),
  authors: z.array(z.string()),
  links: z.object({
    pdf: z.string().optional(),
    doi: z.string().optional(),
    arxiv: z.string().optional(),
    slides: z.string().optional(),
  }),
  tags: z.array(z.string()),
  featured: z.boolean(),
  published: z.boolean(),
});
export type ResearchFormValues = z.infer<typeof researchSchema>;

export const RESEARCH_TYPE_OPTIONS = ["paper", "thesis", "preprint", "talk"] as const;

export const skillCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  skills: z.array(
    z.object({
      name: z.string().min(1),
      level: z.enum(["expert", "proficient", "familiar"]).optional(),
    })
  ),
  published: z.boolean(),
});
export type SkillCategoryFormValues = z.infer<typeof skillCategorySchema>;

export const SKILL_LEVEL_OPTIONS = ["expert", "proficient", "familiar"] as const;

export const serviceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  deliverables: z.array(z.string()),
  published: z.boolean(),
});
export type ServiceFormValues = z.infer<typeof serviceSchema>;

export const socialLinkSchema = z.object({
  label: z.string().min(1, "Label is required"),
  url: z.string().min(1, "URL is required"),
  icon: z.enum(["github", "linkedin", "twitter", "email", "scholar", "medium"]),
  published: z.boolean(),
});
export type SocialLinkFormValues = z.infer<typeof socialLinkSchema>;

export const SOCIAL_ICON_OPTIONS = ["github", "linkedin", "twitter", "email", "scholar", "medium"] as const;

export const navigationItemSchema = z.object({
  label: z.string().min(1, "Label is required"),
  href: z.string().min(1, "Href is required"),
  published: z.boolean(),
});
export type NavigationItemFormValues = z.infer<typeof navigationItemSchema>;

export const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  headline: z.string().min(1, "Headline is required"),
  subheadline: z.string().min(1, "Subheadline is required"),
  location: z.string().min(1, "Location is required"),
  email: z.string().email("Enter a valid email"),
  availability: z.string().min(1, "Availability is required"),
  bio: z.string().min(1, "Bio is required"),
  avatarUrl: z.string().optional(),
  highlights: z.array(z.object({ label: z.string(), value: z.string() })),
  audiences: z.array(z.object({ id: z.string(), title: z.string(), description: z.string() })),
});
export type ProfileFormValues = z.infer<typeof profileSchema>;

export const siteSettingsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  tagline: z.string().min(1, "Tagline is required"),
  domain: z.string().min(1, "Domain is required"),
  url: z.string().min(1, "URL is required"),
  description: z.string().min(1, "Description is required"),
  keywords: z.array(z.string()),
  locale: z.string().min(1, "Locale is required"),
  resumeUrl: z.string().optional(),
  ogImageUrl: z.string().optional(),
});
export type SiteSettingsFormValues = z.infer<typeof siteSettingsSchema>;

export const educationSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  field: z.string().optional(),
  period: z.string().min(1, "Period is required"),
  location: z.string().optional(),
  description: z.string().optional(),
  published: z.boolean(),
});
export type EducationFormValues = z.infer<typeof educationSchema>;

export const certificationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  issueDate: z.string().min(1, "Issue date is required"),
  credentialUrl: z.string().optional(),
  published: z.boolean(),
});
export type CertificationFormValues = z.infer<typeof certificationSchema>;

export const achievementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  date: z.string().optional(),
  published: z.boolean(),
});
export type AchievementFormValues = z.infer<typeof achievementSchema>;

export const testimonialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  company: z.string().optional(),
  quote: z.string().min(1, "Quote is required"),
  avatarUrl: z.string().optional(),
  published: z.boolean(),
});
export type TestimonialFormValues = z.infer<typeof testimonialSchema>;

export const blogPostSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().optional(),
  externalUrl: z.string().optional(),
  coverImage: z.string().optional(),
  tags: z.array(z.string()),
  publishedAt: z.string().optional(),
  published: z.boolean(),
});
export type BlogPostFormValues = z.infer<typeof blogPostSchema>;

export const wallpaperSchema = z.object({
  label: z.string().min(1, "Label is required"),
  gradient: z.string().optional(),
  imageUrl: z.string().optional(),
  isDefault: z.boolean(),
});
export type WallpaperFormValues = z.infer<typeof wallpaperSchema>;

export const accentSchema = z.object({
  label: z.string().min(1, "Label is required"),
  value: z.string().min(1, "Color value is required"),
  isDefault: z.boolean(),
});
export type AccentFormValues = z.infer<typeof accentSchema>;
