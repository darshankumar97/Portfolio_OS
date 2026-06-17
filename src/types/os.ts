/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LucideIcon } from 'lucide-react';

export type AppWindowId =
  | 'projects'
  | 'research'
  | 'opensource'
  | 'howiwork'
  | 'architecture'
  | 'experience'
  | 'skills'
  | 'achievements'
  | 'resume'
  | 'contact'
  | 'terminal'
  | 'settings'
  | 'work'
  | 'journal'
  | 'reviews'
  | 'changelog'
  | 'admin';

export interface WindowInstance {
  id: AppWindowId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth?: number;
  minHeight?: number;
}

export interface DesktopIcon {
  id: AppWindowId;
  label: string;
  iconName: string;
  shortcut?: string;
}

export interface TaskbarItem {
  id: AppWindowId | 'home' | 'github' | 'linkedin' | 'leetcode' | 'cmd-palette';
  label: string;
  iconName: string;
  isExternal?: boolean;
  url?: string;
}

// Content Architecture Schemas
export interface ProjectItem {
  id: string;
  title: string;
  tagline: string;
  category: string;
  technologies: string[];
  architectureDiagram?: string; // Vector/ASCII path references
  metrics: { label: string; value: string }[];
  status: 'production' | 'active-dev' | 'archived';
  githubUrl?: string;
  demoUrl?: string;
}

export interface ResearchItem {
  id: string;
  title: string;
  abstract: string;
  date: string;
  tags: string[];
  publications?: { outlet: string; link?: string }[];
  keyFindings: string[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  duration: string;
  highlights: string[];
  skillsAssociated: string[];
}

export interface SkillGroup {
  category: string;
  skills: { name: string; proficiency: number; years: number }[];
}

export interface JournalEntry {
  id: string;
  title: string;
  publishDate: string;
  readingTime: string;
  tags: string[];
}
