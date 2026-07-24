"use client";

import { createContext, useContext } from "react";
import type {
  Profile,
  SiteConfig,
  Project,
  Experience,
  Research,
  SkillCategory,
  Service,
  SocialLink,
} from "@/types/content";

export interface OSContent {
  profile: Profile;
  site: SiteConfig;
  projects: Project[];
  experience: Experience[];
  research: Research[];
  skills: SkillCategory[];
  services: Service[];
  social: SocialLink[];
}

const OSContentContext = createContext<OSContent | null>(null);

interface OSContentProviderProps {
  content: OSContent;
  children: React.ReactNode;
}

/**
 * DevOS apps (Finder, Notes, Mail, Preview, Safari, Terminal, Spotlight) are
 * client components dynamically loaded by the window manager, so they can't
 * call the async, DB-backed src/lib/content.ts functions directly. The
 * desktop's server-component root fetches everything once and hands it down
 * through this context instead.
 */
export function OSContentProvider({ content, children }: OSContentProviderProps) {
  return <OSContentContext.Provider value={content}>{children}</OSContentContext.Provider>;
}

export function useOSContent(): OSContent {
  const ctx = useContext(OSContentContext);
  if (!ctx) {
    throw new Error("useOSContent must be used within OSContentProvider");
  }
  return ctx;
}
