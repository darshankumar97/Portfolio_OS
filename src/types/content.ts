export interface SiteConfig {
  name: string;
  tagline: string;
  domain: string;
  url: string;
  description: string;
  keywords: string[];
  locale: string;
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

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  type: "full-time" | "contract" | "internship" | "research";
  description: string;
  achievements: string[];
  technologies: string[];
  featured: boolean;
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
  category: "product" | "research" | "open-source" | "freelance";
  status: "live" | "in-progress" | "archived";
  featured: boolean;
  links: {
    live?: string;
    github?: string;
    paper?: string;
    demo?: string;
  };
  metrics?: {
    label: string;
    value: string;
  }[];
}

export interface Research {
  id: string;
  title: string;
  venue: string;
  year: string;
  type: "paper" | "thesis" | "preprint" | "talk";
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
