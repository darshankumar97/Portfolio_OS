/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PROJECTS_DATA, ProjectDetail } from '../content/projectsData';
export type { ProjectDetail };

export interface AppearanceSettings {
  wallpaper: string; // Base64 or preset name or URL
  theme: 'graphite' | 'midnight' | 'minimal-light' | 'professional-dark';
  accentColor: string; // Hex or tailwind class name
  desktopIconLayout: Record<string, { x: number; y: number }>;
}

export interface ResearchItemCMS {
  id: string;
  title: string;
  abstract: string;
  date: string;
  tags: string[];
  outletHistory: string;
  keyFindings: string[];
  pdfBase64?: string;
  timeline: { phase: string; date: string; title: string; desc: string; status: string }[];
}

export interface ExperienceCMS {
  id: string;
  role: string;
  company: string;
  location: string;
  duration: string;
  type: string;
  tags: string[];
  bullets: string[];
  keyAchievement: string;
}

export interface ResumeVersion {
  version: string;
  uploadedAt: string;
  summary: string;
  fileSize: string;
  fileBase64: string; // PDF or file format
}

export interface ResumeSettings {
  views: number;
  downloads: number;
  versionHistory: ResumeVersion[];
}

export interface MediaAsset {
  id: string;
  name: string;
  type: string;
  base64: string; // url or data
  uploadedAt: string;
  size: string;
}

export interface ContactCMS {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  type: 'general' | 'founder' | 'freelance' | 'recruiter';
  status: 'new' | 'read' | 'archived';
  // Upgrades for CRM lead pipeline:
  leadStage?: 'new' | 'contacted' | 'discussion' | 'proposal_sent' | 'closed_won' | 'closed_lost';
  leadNotes?: string;
}

export interface VisitorSession {
  id: string;
  timestamp: string;
  duration: number; // in seconds
  pages: string[];
  country: string;
  city: string;
  device: string;
  browser: string;
  referrer: string;
  trafficSource: string;
  resumeDownloaded: boolean;
  contactSubmitted: boolean;
  projectOpened?: string;
}

export interface AnalyticsSummary {
  visitorCount: number;
  uniqueVisitors: number;
  returningVisitors: number;
  pageVisits: number;
  projectViews: Record<string, number>;
  resumeDownloads: number;
  contactRequests: number;
  githubClicks: number;
  linkedinClicks: number;
  leetcodeClicks: number;
  workWithMeClicks: number;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  resource: string;
  oldValue: string;
  newValue: string;
}

export interface ChangelogEntry {
  version: string;
  date: string;
  summary: string;
  changes: string[];
}

export interface GitCommit {
  id: string;
  date: string;
  summary: string;
  category: string;
}

export interface SettingsCMS {
  linkedinUrl: string;
  githubUrl: string;
  leetcodeUrl: string;
  instagramUrl: string;
  contactEmail: string;
  heroText: string;
  currentFocusWidget: string;
  buildWithMeContent: string;
  // Priority 9 Homepage CMS additions
  heroTitle?: string;
  heroSubtitle?: string;
  aboutSummary?: string;
  desktopWelcome?: string;
  featuredProjectId?: string;
  // Priority 10 SEO Management
  metaTitleHomepage?: string;
  metaDescriptionHomepage?: string;
  metaKeywordsHomepage?: string;
  ogImageHomepage?: string;
  metaTitleProjects?: string;
  metaDescriptionProjects?: string;
  metaTitleResearch?: string;
  metaDescriptionResearch?: string;
  metaTitleExperience?: string;
  metaDescriptionExperience?: string;
  metaTitleOpenSource?: string;
  metaDescriptionOpenSource?: string;
}

export class PortfolioDB {
  private static activeSessionId: string | null = null;
  private static isAuthenticatedClient: boolean = false;

  private static getStored<T>(key: string, defaultVal: T): T {
    const saved = localStorage.getItem(key);
    if (!saved) return defaultVal;
    try {
      return JSON.parse(saved) as T;
    } catch (_) {
      return defaultVal;
    }
  }

  private static setStored<T>(key: string, val: T) {
    localStorage.setItem(key, JSON.stringify(val));
    window.dispatchEvent(new Event(`portfolio-db-updated-${key}`));
    window.dispatchEvent(new Event(`portfolio-db-updated-global`));
  }

  // Initial startup hook called in bootstrap or file inclusion
  static staticConstructor() {
    this.syncWithServer();
    
    // Periodically sync (and handle session pings)
    if (typeof window !== 'undefined') {
      setInterval(() => {
        this.pingSession();
      }, 10000); // every 10 seconds
    }
  }

  // Check auth and fetch state from server side
  static async syncWithServer() {
    try {
      // Check Auth Status first
      const authRes = await fetch('/api/auth/status');
      if (authRes.ok) {
        const authData = await authRes.json();
        this.isAuthenticatedClient = !!authData.authenticated;
      }

      // Fetch dynamic records
      const url = this.isAuthenticatedClient ? '/api/admin/data' : '/api/public/data';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (this.isAuthenticatedClient) {
          // Store entire uncensored database in local state cache
          if (data.appearance) this.setStored('devos_cms_appearance', data.appearance);
          if (data.settings) this.setStored('devos_cms_settings', data.settings);
          if (data.projects) this.setStored('devos_cms_projects', data.projects);
          if (data.research) this.setStored('devos_cms_research', data.research);
          if (data.experiences) this.setStored('devos_cms_experiences', data.experiences);
          if (data.contacts) this.setStored('devos_cms_contacts', data.contacts);
          if (data.changelogs) this.setStored('devos_cms_changelogs', data.changelogs);
          if (data.sessions) this.setStored('devos_cms_sessions', data.sessions);
          if (data.activityLogs) this.setStored('devos_cms_activity_logs', data.activityLogs);
          if (data.versionHistoryStates) this.setStored('devos_cms_version_history', data.versionHistoryStates);
        } else {
          // Store public-only slice mapping
          if (data.appearance) this.setStored('devos_cms_appearance', data.appearance);
          if (data.settings) this.setStored('devos_cms_settings', data.settings);
          if (data.projects) this.setStored('devos_cms_projects', data.projects);
          if (data.research) this.setStored('devos_cms_research', data.research);
          if (data.experiences) this.setStored('devos_cms_experiences', data.experiences);
          if (data.changelogs) this.setStored('devos_cms_changelogs', data.changelogs);
        }
      }
    } catch (e) {
      console.warn('[DevOS DB] Server sync unavailable, utilizing client offline-cache values.');
    }
  }

  // Server saving proxy which handles activity logs & rollback snapshots
  private static async persistToServer(key: string, value: any, logToSave?: { action: string; section: string; oldValue: string; newValue: string; description: string }) {
    if (!this.isAuthenticatedClient) return;
    try {
      await fetch('/api/admin/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [key]: value,
          activityLogToSave: logToSave
        })
      });
      // Silent sync with output values
      this.syncWithServer();
    } catch (_) {
      console.warn('[DevOS DB] Offline - failed saving state to server.');
    }
  }

  // APPEARANCE
  static getAppearance(): AppearanceSettings {
    return this.getStored<AppearanceSettings>('devos_cms_appearance', {
      wallpaper: 'default-mesh',
      theme: 'midnight',
      accentColor: '#3B82F6',
      desktopIconLayout: {}
    });
  }
  static saveAppearance(settings: AppearanceSettings) {
    const old = this.getAppearance();
    this.setStored('devos_cms_appearance', settings);
    this.persistToServer('appearance', settings, {
      action: 'Wallpaper Specs Updated',
      section: 'Appearance specs',
      oldValue: `${old.theme} / ${old.wallpaper.substring(0, 20)}`,
      newValue: `${settings.theme} / ${settings.wallpaper.substring(0, 20)}`,
      description: 'Modified system wallpapers, styling parameters and colors.'
    });
  }

  // PROJECTS Lifecycle statuses (Priority 3 Project Workflow)
  static getProjects(includeAll: boolean = false): ProjectDetail[] {
    const projs = this.getStored<ProjectDetail[]>('devos_cms_projects', PROJECTS_DATA);
    if (includeAll || this.isAuthenticatedClient) {
      return projs;
    }
    // Only published visible on public portfolio
    return projs.filter(p => p.lifecycleStatus === 'published' || !p.lifecycleStatus);
  }
  static saveProjects(projects: ProjectDetail[]) {
    this.setStored('devos_cms_projects', projects);
    this.persistToServer('projects', projects);
  }

  // Add Project management action logs (Priority 3/4 Version snap tracking)
  static logProjectAction(action: string, projectTitle: string, details: string) {
    this.persistToServer('projects', this.getProjects(true), {
      action,
      section: 'Projects Portfolio',
      oldValue: 'Active Inventory',
      newValue: projectTitle,
      description: details
    });
  }

  // RESEARCH
  static getResearch() {
    return this.getStored<ResearchItemCMS[]>('devos_cms_research', []);
  }
  static saveResearch(research: ResearchItemCMS[]) {
    this.setStored('devos_cms_research', research);
    this.persistToServer('research', research, {
      action: 'Research Updated',
      section: 'IEEE Publications',
      oldValue: 'Prior journals',
      newValue: `Vessel details with count: ${research.length}`,
      description: 'Saved changes inside whitepapers database.'
    });
  }

  // EXPERIENCES
  static getExperiences() {
    return this.getStored<ExperienceCMS[]>('devos_cms_experiences', []);
  }
  static saveExperiences(experiences: ExperienceCMS[]) {
    this.setStored('devos_cms_experiences', experiences);
    this.persistToServer('experiences', experiences, {
      action: 'Experience Updated',
      section: 'Professional CV',
      oldValue: 'Existing timeline',
      newValue: `Inventory length: ${experiences.length}`,
      description: 'Updated center experiences timelines and skills matrix.'
    });
  }

  // RESUME (compatibility fallback helper)
  static getResumeSettings(): ResumeSettings {
    return {
      views: 232,
      downloads: 74,
      versionHistory: []
    };
  }

  // MEDIA LIBRARY
  static getMediaAssets() {
    return this.getStored<MediaAsset[]>('devos_cms_media', [
      { id: 'm-wp1', name: 'Ambient Cosmos.png', type: 'image/png', base64: '/uploads/wp1.png', uploadedAt: '2026-06-15', size: '1.2 MB' }
    ]);
  }
  static saveMediaAssets(assets: MediaAsset[]) {
    this.setStored('devos_cms_media', assets);
    this.persistToServer('media', assets);
  }

  // CONTACTS (CRM pipeline - Priority 8)
  static getContacts(): ContactCMS[] {
    return this.getStored<ContactCMS[]>('devos_cms_contacts', []);
  }
  static saveContacts(contacts: ContactCMS[]) {
    this.setStored('devos_cms_contacts', contacts);
    this.persistToServer('contacts', contacts);
  }
  static saveContactLead(leadId: string, stage: any, notes: string) {
    const contacts = this.getContacts();
    const idx = contacts.findIndex(c => c.id === leadId);
    if (idx !== -1) {
      contacts[idx].leadStage = stage;
      contacts[idx].leadNotes = notes;
      this.saveContacts(contacts);
      this.persistToServer('contacts', contacts, {
        action: 'Lead Pipeline Adjusted',
        section: 'Contacts CRM',
        oldValue: 'Previous stage',
        newValue: `${contacts[idx].name}: Stage -> ${stage}`,
        description: `Modified status of opportunity and inserted CRM notes details.`
      });
    }
  }

  // SETTINGS (Priority 9 Homepage CMS & Priority 10 SEO)
  static getSettings(): SettingsCMS {
    const defaults: SettingsCMS = {
      linkedinUrl: 'https://linkedin.com/in/darshankumarkr',
      githubUrl: 'https://github.com/darshan-kumar-k-r',
      leetcodeUrl: 'https://leetcode.com/u/darshankumarkr97/',
      instagramUrl: 'https://instagram.com/darshankumarkr',
      contactEmail: 'darshankumarkr97@gmail.com',
      heroText: 'I engineer robust distributed infrastructures, develop deep learning threat intelligence classifiers, and build secure systems pipelines.',
      currentFocusWidget: 'Cloud Security Research, Container Orchestration Lab, & Enterprise CMS Deployments',
      buildWithMeContent: 'I advise founders and collaborate with security groups to design custom distributed architectures, secure APIs, and dynamic dashboard nodes.',
      heroTitle: 'Darshan Kumar K R',
      heroSubtitle: 'Cloud Infrastructure & Systems Security Engineer',
      aboutSummary: 'I am a passionate systems developer researching Tor merchant stylometry, container runtimes, consensus networks, and automated vulnerability management patterns.',
      desktopWelcome: "Welcome to Darshan's DevOS Operating System Workspace",
      featuredProjectId: 'dark-web-marketplaces',
      // SEO Meta default settings
      metaTitleHomepage: 'Darshan Kumar K R | Portfolio',
      metaDescriptionHomepage: 'Systems Architect & Cloud Security Specialist portfolio built in React.',
      metaKeywordsHomepage: 'Cybersecurity, Docker, Kubernetes, React, Portfolio',
      ogImageHomepage: '/uploads/profile.png'
    };
    return this.getStored<SettingsCMS>('devos_cms_settings', defaults);
  }
  static saveSettings(settings: SettingsCMS) {
    this.setStored('devos_cms_settings', settings);
    this.persistToServer('settings', settings, {
      action: 'Variables CMS Overwrite',
      section: 'Dynamic Variables',
      oldValue: 'Variables cached',
      newValue: 'Settings configuration written',
      description: 'Modified platform copy settings, contact targets, landing titles and SEO parameters dynamically.'
    });

    // Dynamically adjust browser page head parameters in real-time on settings update
    this.applySEOMeta(settings);
  }

  // SEO manager head injection (Priority 10)
  static applySEOMeta(sett?: SettingsCMS) {
    if (typeof document === 'undefined') return;
    const s = sett || this.getSettings();
    document.title = s.metaTitleHomepage || 'Darshan Kumar K R | Portfolio';
    
    // Inject and update meta descriptions
    let descMeta = document.querySelector('meta[name="description"]');
    if (!descMeta) {
      descMeta = document.createElement('meta');
      descMeta.setAttribute('name', 'description');
      document.head.appendChild(descMeta);
    }
    descMeta.setAttribute('content', s.metaDescriptionHomepage || 'Systems Architect Portfolio');

    let keyMeta = document.querySelector('meta[name="keywords"]');
    if (!keyMeta) {
      keyMeta = document.createElement('meta');
      keyMeta.setAttribute('name', 'keywords');
      document.head.appendChild(keyMeta);
    }
    keyMeta.setAttribute('content', s.metaKeywordsHomepage || 'Systems, security, cloud');
  }

  // CHANGELOGS (Priority 13 Changelog manager)
  static getChangelogs(): ChangelogEntry[] {
    return this.getStored<ChangelogEntry[]>('devos_cms_changelogs', []);
  }
  static saveChangelogs(changelogs: ChangelogEntry[]) {
    this.setStored('devos_cms_changelogs', changelogs);
    this.persistToServer('changelogs', changelogs, {
      action: 'OS Changelogs Managed',
      section: 'DevOS Journal Spec',
      oldValue: 'Existing catalog',
      newValue: `Registered entry count: ${changelogs.length}`,
      description: 'Added or edited release version entries in the public Changelog registry.'
    });
  }

  // DETAILED SESSION LOGS
  static getSessions(): VisitorSession[] {
    return this.getStored<VisitorSession[]>('devos_cms_sessions', []);
  }

  // ANALYTICS INTEGRATIONS
  static getAnalyticsSummary() {
    const sessions = this.getSessions();
    const contacts = this.getContacts();
    const uniqueIds = new Set(sessions.map(s => s.referrer + s.device + s.country)).size;
    const totalVisits = sessions.length;

    return {
      visitorCount: totalVisits + 322,
      uniqueVisitors: uniqueIds + 145,
      returningVisitors: 45,
      pageVisits: sessions.reduce((acc, s) => acc + s.pages.length, 0) + 945,
      resumeDownloads: sessions.filter(s => s.resumeDownloaded).length + 74,
      contactRequests: contacts.length,
      githubClicks: 142,
      linkedinClicks: 215,
      leetcodeClicks: 34,
      workWithMeClicks: 48,
      projectViews: {} as Record<string, number>
    };
  }

  // SYSTEM SNAPSHOT VERSION RESTORATIONS (Priority 5 Snapshot system rollback trigger)
  static getSystemVersionHistory(): any[] {
    return this.getStored<any[]>('devos_cms_version_history', []);
  }
  static async rollbackToHistoryRecord(historyRecordId: string) {
    try {
      const res = await fetch('/api/admin/rollback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ historyRecordId })
      });
      if (res.ok) {
        await this.syncWithServer();
        return { success: true };
      }
    } catch (_) {
      console.warn('[DevOS DB] Failed initiating server-side rollback.');
    }
    return { success: false };
  }

  // BACKUP & RESTORE SYSTEMS (Priority 11 JSON export system)
  static exportStateBackup() {
    const backupObj = {
      projects: this.getProjects(true),
      research: this.getResearch(),
      experiences: this.getExperiences(),
      settings: this.getSettings(),
      appearance: this.getAppearance(),
      changelogs: this.getChangelogs()
    };
    
    const blob = new Blob([JSON.stringify(backupObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `darshankumar_me_backup_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  static async importStateBackup(jsonDataParsed: any) {
    try {
      const res = await fetch('/api/admin/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isFullRestore: true,
          data: jsonDataParsed,
          activityLogToSave: {
            action: 'Full DB Restore',
            section: 'Backup Import System',
            oldValue: 'Previous configuration',
            newValue: 'Imported snapshot structure uploaded',
            description: 'Restored the entire portfolio database using a JSON backup file.'
          }
        })
      });
      if (res.ok) {
        await this.syncWithServer();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  }

  // TELEMETRY CLICKS & PAGEVIEWS
  static async trackClick(buttonId: 'github' | 'linkedin' | 'leetcode' | 'work-with-me' | 'resume', projectId?: string) {
    try {
      await fetch('/api/public/track-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buttonId, projectId })
      });
    } catch (_) {}

    // Track on current visitor log too
    if (buttonId === 'resume' && this.activeSessionId) {
      const sessions = this.getSessions();
      const idx = sessions.findIndex(s => s.id === this.activeSessionId);
      if (idx !== -1) {
        sessions[idx].resumeDownloaded = true;
        this.saveSessions(sessions);
      }
    }
  }

  // Track project views / plays (Priority 7 Project Analytics)
  static async trackProjectInteraction(projectId: string, type: 'view' | 'demoPlay' | 'github' | 'liveDemo' | 'pdf') {
    try {
      await fetch('/api/public/track-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, type })
      });
    } catch (_) {}
  }

  static async trackPageView(pageName: string) {
    try {
      await fetch('/api/public/track-pageview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageName, sessionId: this.activeSessionId })
      });
    } catch (_) {}
  }

  static async initiateVisitorSession(device: string, browser: string, referrer: string) {
    if (this.activeSessionId) return; // session already booted in this lifetime
    
    // Attempt parsing geo
    let country = 'India';
    let city = 'Bengaluru';
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) {
        const data = await response.json();
        if (data.country_name) country = data.country_name;
        if (data.city) city = data.city;
      }
    } catch (_) {}

    const source = referrer.includes('github') ? 'GitHub' : referrer.includes('linkedin') ? 'LinkedIn' : 'Direct';

    try {
      const res = await fetch('/api/public/initiate-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device, browser, referrer, trafficSource: source, country, city })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.sessionId) {
          this.activeSessionId = data.sessionId;
          sessionStorage.setItem('devos_active_session', data.sessionId);
        }
      }
    } catch (_) {}
  }

  // Ping intervals adding durations seamlessly (Priority 6)
  private static async pingSession() {
    const sId = this.activeSessionId || sessionStorage.getItem('devos_active_session');
    if (!sId) return;
    try {
      await fetch('/api/public/session/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: sId, secondsToAdd: 10 })
      });
    } catch (_) {}
  }

  static saveSessions(sessions: VisitorSession[]) {
    this.setStored('devos_cms_sessions', sessions);
    this.persistToServer('sessions', sessions);
  }

  static saveAnalyticsSummary(summary: any) {
    this.setStored('devos_cms_analytics_summary', summary);
    this.persistToServer('analytics', summary);
  }

  static saveResumeSettings(settings: ResumeSettings) {
    this.setStored('devos_cms_resume_settings', settings);
    this.persistToServer('resume', settings);
  }
}

// Auto instanciate on file load
PortfolioDB.staticConstructor();
