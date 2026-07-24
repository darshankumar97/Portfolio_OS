export interface SiteConfig {
  name: string;
  tagline: string;
  domain: string;
  url: string;
  description: string;
  keywords: string[];
  locale: string;
  resumeUrl: string;
  ogImageUrl?: string;
}

export interface Profile {
  name: string;
  title: string;
  headline: string;
  subheadline: string;
  location: string;
  email: string;
  availability: string;
  bio: string;
  avatarUrl?: string;
  highlights: Highlight[];
  audiences: Audience[];
}

export interface Highlight {
  label: string;
  value: string;
}

export interface Audience {
  id: string;
  title: string;
  description: string;
}

export type ExperienceType = "full-time" | "contract" | "internship" | "research";

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  type: ExperienceType;
  description: string;
  achievements: string[];
  technologies: string[];
  featured: boolean;
}

export type ProjectCategory = "product" | "research" | "open-source" | "freelance";
export type ProjectStatus = "live" | "in-progress" | "archived";

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectGalleryItem {
  url: string;
  alt?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  problem: string;
  solution: string;
  impact: string[];
  technologies: string[];
  category: ProjectCategory;
  status: ProjectStatus;
  featured: boolean;
  links: {
    live?: string;
    github?: string;
    paper?: string;
    demo?: string;
  };
  metrics?: ProjectMetric[];
  gallery?: ProjectGalleryItem[];
  coverImage?: string;
}

export type ResearchType = "paper" | "thesis" | "preprint" | "talk";

export interface Research {
  id: string;
  title: string;
  venue: string;
  year: string;
  type: ResearchType;
  abstract: string;
  authors: string[];
  links: {
    pdf?: string;
    doi?: string;
    arxiv?: string;
    slides?: string;
  };
  tags: string[];
  featured: boolean;
}

export interface SkillCategory {
  id: string;
  name: string;
  skills: Skill[];
}

export interface Skill {
  name: string;
  level?: "expert" | "proficient" | "familiar";
}

export interface SocialLink {
  id: string;
  label: string;
  url: string;
  icon: "github" | "linkedin" | "twitter" | "email" | "scholar" | "medium";
}

export interface Service {
  id: string;
  title: string;
  description: string;
  deliverables: string[];
}

export interface NavigationItem {
  label: string;
  href: string;
}

export interface Wallpaper {
  id: string;
  label: string;
  gradient?: string;
  imageUrl?: string;
  isDefault: boolean;
}

export interface Accent {
  id: string;
  label: string;
  value: string;
  isDefault: boolean;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  period: string;
  location?: string;
  description?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description?: string;
  date?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  quote: string;
  avatarUrl?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  externalUrl?: string;
  coverImage?: string;
  tags: string[];
  publishedAt?: string;
}
