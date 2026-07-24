// Shared cache tags: content.ts tags its cached reads with these; admin
// server actions call revalidateTag(...) with the same value after a write
// so the public site never serves stale content.
export const CACHE_TAGS = {
  profile: "profile",
  siteSettings: "site-settings",
  navigation: "navigation",
  social: "social",
  experience: "experience",
  projects: "projects",
  research: "research",
  skills: "skills",
  services: "services",
  education: "education",
  certifications: "certifications",
  achievements: "achievements",
  testimonials: "testimonials",
  blog: "blog",
  wallpapers: "wallpapers",
  accents: "accents",
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];
