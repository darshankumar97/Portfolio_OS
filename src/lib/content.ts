import site from "@/content/site.json";
import profile from "@/content/profile.json";
import experience from "@/content/experience.json";
import projects from "@/content/projects.json";
import research from "@/content/research.json";
import skills from "@/content/skills.json";
import social from "@/content/social.json";
import services from "@/content/services.json";
import navigation from "@/content/navigation.json";

import type {
  SiteConfig,
  Profile,
  Experience,
  Project,
  Research,
  SkillCategory,
  SocialLink,
  Service,
  NavigationItem,
} from "@/types/content";

export function getSiteConfig(): SiteConfig {
  return site as SiteConfig;
}

export function getProfile(): Profile {
  return profile as Profile;
}

export function getExperience(): Experience[] {
  return experience as Experience[];
}

export function getFeaturedExperience(): Experience[] {
  return getExperience().filter((e) => e.featured);
}

export function getProjects(): Project[] {
  return projects as Project[];
}

export function getFeaturedProjects(): Project[] {
  return getProjects().filter((p) => p.featured);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug);
}

export function getResearch(): Research[] {
  return research as Research[];
}

export function getFeaturedResearch(): Research[] {
  return getResearch().filter((r) => r.featured);
}

export function getSkills(): SkillCategory[] {
  return skills as SkillCategory[];
}

export function getSocialLinks(): SocialLink[] {
  return social as SocialLink[];
}

export function getServices(): Service[] {
  return services as Service[];
}

export function getNavigation(): NavigationItem[] {
  return navigation as NavigationItem[];
}
