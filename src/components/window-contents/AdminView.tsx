/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Lock, Trash2, Plus, Database, CheckCircle2, FileText, UserCheck, TrendingUp, BarChart2, Settings, Mail, 
  Paintbrush, Layers, Award, ShieldAlert, LogOut, Code, Eye, Clock, Globe, ArrowRight, Upload, Search, 
  HelpCircle, Archive, Check, Edit2, AlertCircle, FileSpreadsheet, RefreshCw, GitCommit, List, MapPin, 
  Laptop, ExternalLink, Activity, Info, Sparkles, ChevronRight, MessageSquare, History, ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PortfolioDB, 
  ProjectDetail, 
  ExperienceCMS, 
  ResearchItemCMS, 
  ContactCMS, 
  VisitorSession, 
  MediaAsset, 
  AppearanceSettings,
  ChangelogEntry, 
  SettingsCMS 
} from '../../utils/portfolioDb';

export default function AdminView() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passphrase, setPassphrase] = useState('');
  const [securityError, setSecurityError] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // LIVE RE-RENDER BUMP
  const [updateTrigger, setUpdateTrigger] = useState(0);

  // DB STATES LOADED
  const [appearance, setAppearance] = useState(() => PortfolioDB.getAppearance());
  const [projects, setProjects] = useState(() => PortfolioDB.getProjects(true));
  const [research, setResearch] = useState(() => PortfolioDB.getResearch());
  const [experiences, setExperiences] = useState(() => PortfolioDB.getExperiences());
  const [contacts, setContacts] = useState(() => PortfolioDB.getContacts());
  const [sessions, setSessions] = useState(() => PortfolioDB.getSessions());
  const [analytics, setAnalytics] = useState(() => PortfolioDB.getAnalyticsSummary());
  const [changelogs, setChangelogs] = useState(() => PortfolioDB.getChangelogs());
  const [logs, setLogs] = useState(() => PortfolioDB.getSystemVersionHistory());
  const [settings, setSettings] = useState(() => PortfolioDB.getSettings());

  // SYNC RE-RENDER HANDLER
  const syncDB = () => {
    setAppearance(PortfolioDB.getAppearance());
    setProjects(PortfolioDB.getProjects(true));
    setResearch(PortfolioDB.getResearch());
    setExperiences(PortfolioDB.getExperiences());
    setContacts(PortfolioDB.getContacts());
    setSessions(PortfolioDB.getSessions());
    setAnalytics(PortfolioDB.getAnalyticsSummary());
    setChangelogs(PortfolioDB.getChangelogs());
    setLogs(PortfolioDB.getSystemVersionHistory());
    setSettings(PortfolioDB.getSettings());
    setUpdateTrigger(prev => prev + 1);
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await fetch('/api/auth/status');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setIsAuthenticated(true);
            await PortfolioDB.syncWithServer();
            syncDB();
          }
        }
      } catch (_) {}
    };
    checkAuthStatus();

    window.addEventListener('portfolio-db-updated-global', syncDB);
    return () => {
      window.removeEventListener('portfolio-db-updated-global', syncDB);
    };
  }, []);

  // SECURE AUTO-LOGOUT INACTIVITY TIMER (15 MINUTES)
  useEffect(() => {
    if (!isAuthenticated) return;
    let timer: NodeJS.Timeout;
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        setIsAuthenticated(false);
        setPassphrase('');
        try {
          await fetch('/api/auth/logout', { method: 'POST' });
        } catch (_) {}
        await PortfolioDB.syncWithServer();
        syncDB();
      }, 15 * 60 * 1000); // 15 mins
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    resetTimer();

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, [isAuthenticated]);

  // AUTHENTICATION CHECK WITH SERVER
  const handleAuthentication = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passphrase })
      });
      if (res.ok) {
        setIsAuthenticated(true);
        setSecurityError(false);
        await PortfolioDB.syncWithServer();
        syncDB();
      } else {
        setSecurityError(true);
        setTimeout(() => setSecurityError(false), 2400);
      }
    } catch (_) {
      setSecurityError(true);
      setTimeout(() => setSecurityError(false), 2400);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (_) {}
    setIsAuthenticated(false);
    setPassphrase('');
    await PortfolioDB.syncWithServer();
    syncDB();
  };

  // APPEARANCE MANAGEMENTS WITH SLIDABLE UPLOADER
  const handleBinaryMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'wallpaper' | 'general') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await fetch(`/api/media/upload?filename=${file.name}`, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file // Direct file stream
      });
      if (res.ok) {
        const data = await res.json();
        if (type === 'wallpaper') {
          const updated = { ...appearance, wallpaper: data.url };
          PortfolioDB.saveAppearance(updated);
          syncDB();
          alert(`Wallpaper uploaded and applied successfully! Path: ${data.url}`);
        } else {
          alert(`Media asset uploaded successfully! URL: ${data.url}\n(Copied to clipboard)`);
          navigator.clipboard.writeText(data.url);
        }
      } else {
        alert('File upload failed on server disk storage.');
      }
    } catch (_) {
      alert('Upload exception.');
    }
  };

  const updateTheme = (themeName: AppearanceSettings['theme']) => {
    const updated = { ...appearance, theme: themeName };
    PortfolioDB.saveAppearance(updated);
    syncDB();
  };

  const updateAccentColor = (color: string) => {
    const updated = { ...appearance, accentColor: color };
    PortfolioDB.saveAppearance(updated);
    syncDB();
  };

  // PROJECTS Lifecycle statuses (Priority 3 Project Workflow)
  const [editingProj, setEditingProj] = useState<Partial<ProjectDetail> | null>(null);
  const [projFormMode, setProjFormMode] = useState<'create' | 'edit' | null>(null);

  const saveProjectForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProj || !editingProj.title) return;

    let updatedProjects = [...projects];
    if (projFormMode === 'create') {
      const newProj: ProjectDetail = {
        id: editingProj.id || `proj-${Date.now()}`,
        title: editingProj.title,
        tagline: editingProj.tagline || 'Strategic cryptographic pipeline',
        category: editingProj.category || 'prototype',
        logo: editingProj.logo || 'CP',
        status: editingProj.status || 'production',
        lifecycleStatus: editingProj.lifecycleStatus || 'published',
        metrics: editingProj.metrics || [{ label: 'Performance', value: 'OPTIMAL' }],
        technologies: editingProj.technologies || ['React', 'TypeScript', 'Node.js'],
        bannerGradient: editingProj.bannerGradient || 'bg-gradient-to-r from-blue-900 to-indigo-950',
        overview: editingProj.overview || '',
        whyIBuiltThis: editingProj.whyIBuiltThis || '',
        results: editingProj.results || '',
        engineeringDecisions: editingProj.engineeringDecisions || [],
        githubUrl: editingProj.githubUrl || '',
        demoUrl: editingProj.demoUrl || '',
        features: editingProj.features || ['Microservice scalability'],
        challenges: editingProj.challenges || '',
        learnings: editingProj.learnings || '',
        futureImprovements: editingProj.futureImprovements || [],
        videoMockTitle: editingProj.videoMockTitle || 'DEMO.SYS',
        videoSteps: editingProj.videoSteps || [{ timestamp: '00:01', label: 'Launch node cluster', status: 'COMPLETED' }],
        architectureNodes: editingProj.architectureNodes || [],
        architectureEdges: editingProj.architectureEdges || [],
        architectureStory: editingProj.architectureStory || []
      };
      updatedProjects = [newProj, ...updatedProjects];
      PortfolioDB.saveProjects(updatedProjects);
      PortfolioDB.logProjectAction('Created Catalog Project', newProj.title, `Constructed new project metadata.`);
    } else {
      updatedProjects = updatedProjects.map(p => p.id === editingProj.id ? { ...p, ...editingProj } as ProjectDetail : p);
      PortfolioDB.saveProjects(updatedProjects);
      PortfolioDB.logProjectAction('Edited Portfolio Content', editingProj.title || '', `Saved specs updates inside CMS.`);
    }
    setEditingProj(null);
    setProjFormMode(null);
    syncDB();
  };

  const toggleProjectLifecycle = (id: string, stage: 'draft' | 'published' | 'archived') => {
    const updated = projects.map(p => {
      if (p.id === id) {
        return { ...p, lifecycleStatus: stage };
      }
      return p;
    });
    PortfolioDB.saveProjects(updated);
    const pTitle = projects.find(p => p.id === id)?.title || '';
    PortfolioDB.logProjectAction(`Lifecycle Status Changed to: ${stage.toUpperCase()}`, pTitle, `Modified status to ${stage}`);
    syncDB();
  };

  const deleteProject = (id: string, title: string) => {
    const updated = projects.filter(p => p.id !== id);
    PortfolioDB.saveProjects(updated);
    PortfolioDB.logProjectAction('Purged Project Resource', title, 'Removed catalog node completely.');
    syncDB();
  };

  // GUEST CONTACTS CRM PIPELINE Actions (Priority 8)
  const [leadSearch, setLeadSearch] = useState('');
  const [leadFilterStage, setLeadFilterStage] = useState<'all' | 'new' | 'contacted' | 'discussion' | 'proposal_sent' | 'closed_won' | 'closed_lost'>('all');

  const updateCRMLead = (leadId: string, stage: any, notes: string) => {
    PortfolioDB.saveContactLead(leadId, stage, notes);
    syncDB();
  };

  const toggleInboxReadStatus = (id: string, current: 'new' | 'read' | 'archived') => {
    const updated = contacts.map(c => c.id === id ? { ...c, status: (current === 'new' ? 'read' : 'new') as any } : c);
    PortfolioDB.saveContacts(updated);
    syncDB();
  };

  const deleteInboundLead = (id: string, name: string) => {
    const updated = contacts.filter(c => c.id !== id);
    PortfolioDB.saveContacts(updated);
    syncDB();
  };

  // DYNAMIC SETTINGS COMPONENT HANDLERS
  const saveSettingsCMS = (key: keyof SettingsCMS, val: string) => {
    const updated = { ...settings, [key]: val };
    PortfolioDB.saveSettings(updated);
    syncDB();
  };

  // BACKUP RESTORE SYSTEM FILE PROCESSING (Priority 11)
  const handleBackupRestoreUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.settings && parsed.projects) {
            const ok = await PortfolioDB.importStateBackup(parsed);
            if (ok) {
              alert('Portfolio Database restored successfully!');
              syncDB();
            } else {
              alert('Restore import rejected.');
            }
          } else {
            alert('File fails validation metadata.');
          }
        } catch (_) {
          alert('Invalid JSON formatting.');
        }
      };
      reader.readAsText(file);
    } catch (_) {}
  };

  // SYSTEM VERSION SNAPSHOT ROLLBACK SYSTEM (Priority 4 & 5 rollback execution)
  const handleSystemRollback = async (recordId: string, desc: string) => {
    const ok = window.confirm(`Confirm reverting entire system back to this snapshot?\nEvent Description: ${desc}`);
    if (ok) {
      const res = await PortfolioDB.rollbackToHistoryRecord(recordId);
      if (res && res.success) {
        alert('Systems successfully restored back to previous snapshot!');
        syncDB();
      } else {
        alert('Snapshot restore failed.');
      }
    }
  };

  // MANAGEMENT OF RELEASE CHANGELOG (Priority 13 Changelog CMS manager)
  const [editingChangelog, setEditingChangelog] = useState<Partial<ChangelogEntry> | null>(null);
  const [changelogFormMode, setChangelogFormMode] = useState<'create' | 'edit' | null>(null);

  const saveChangelogForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingChangelog || !editingChangelog.version) return;

    let updated = [...changelogs];
    const newEntry: ChangelogEntry = {
      version: editingChangelog.version,
      date: editingChangelog.date || new Date().toISOString().substring(0, 10),
      summary: editingChangelog.summary || 'Minor release',
      changes: editingChangelog.changes || ['Adjusted core settings.']
    };

    if (changelogFormMode === 'create') {
      updated = [newEntry, ...updated];
    } else {
      updated = updated.map(c => c.version === editingChangelog.version ? newEntry : c);
    }

    PortfolioDB.saveChangelogs(updated);
    setEditingChangelog(null);
    setChangelogFormMode(null);
    syncDB();
  };

  const deleteChangelog = (ver: string) => {
    const updated = changelogs.filter(c => c.version !== ver);
    PortfolioDB.saveChangelogs(updated);
    syncDB();
  };

  // PROFESSIONAL EXPERIENCE CMS HANDLERS
  const [experienceForm, setExperienceForm] = useState<Partial<ExperienceCMS> | null>(null);
  const [expFormMode, setExpFormMode] = useState<'create' | 'edit' | null>(null);

  const saveExperienceForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!experienceForm || !experienceForm.role) return;

    let updatedExp = [...experiences];
    const newExp: ExperienceCMS = {
      id: experienceForm.id || `exp-${Date.now()}`,
      role: experienceForm.role,
      company: experienceForm.company || '',
      location: experienceForm.location || '',
      duration: experienceForm.duration || '',
      type: experienceForm.type || 'Contract',
      tags: experienceForm.tags || [],
      bullets: experienceForm.bullets || ['Developed custom systems'],
      keyAchievement: experienceForm.keyAchievement || ''
    };

    if (expFormMode === 'create') {
      updatedExp = [newExp, ...updatedExp];
    } else {
      updatedExp = updatedExp.map(x => x.id === experienceForm.id ? newExp : x);
    }

    PortfolioDB.saveExperiences(updatedExp);
    syncDB();
    setExperienceForm(null);
    setExpFormMode(null);
  };

  const deleteExperience = (id: string) => {
    const updated = experiences.filter(x => x.id !== id);
    PortfolioDB.saveExperiences(updated);
    syncDB();
  };

  return (
    <div className="h-full w-full bg-[#030303] text-zinc-350 overflow-hidden font-sans select-none flex flex-col">
      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          /* GLORIOUS SECURE AUTH PANEL GATE */
          <motion.div 
            key="lock-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex items-center justify-center p-6 bg-[#040405] relative"
          >
            <div className="absolute inset-0 max-w-lg h-56 bg-blue-500/5 blur-[120px] rounded-full top-1/4 left-1/4 pointer-events-none" />
            
            <div className="w-full max-w-sm bg-[#08080a] border border-zinc-900 rounded-3xl p-8 text-center space-y-6 relative shadow-2xl">
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/15 text-blue-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner animate-pulse">
                <Lock className="w-5 h-5" />
              </div>
              
              <div className="space-y-1.5">
                <h1 className="text-lg font-bold tracking-tight text-white font-sans uppercase">DevOS Control Authorization</h1>
                <p className="text-zinc-550 text-[10px] font-mono leading-relaxed uppercase">
                  Systems access protected. Session timeout 15 minutes.
                </p>
              </div>

              <form onSubmit={handleAuthentication} className="space-y-3.5">
                <div className="space-y-1.5 text-left">
                  <label className="text-[9px] font-mono text-zinc-550 uppercase tracking-wider block">Security Password / Secret Key</label>
                  <input
                    type="password"
                    placeholder="ENTER SECURE PASSWORD"
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-900 focus:border-zinc-700/85 text-white/90 rounded-xl px-4 py-2.5 outline-none font-mono text-center text-xs tracking-widest placeholder:text-zinc-700 placeholder:tracking-normal transition-all"
                    required
                  />
                  {securityError && (
                    <span className="text-red-500 text-[9px] font-mono block mt-1 select-none font-bold uppercase text-center tracking-wider">
                      ACCESS_ERR: Invalid security credentials. Try again.
                    </span>
                  )}
                </div>

                <button 
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-mono text-[10.5px] uppercase tracking-widest py-3 rounded-xl cursor-pointer transition-all duration-300 shadow-lg font-bold shadow-blue-500/10"
                >
                  Authorize admin
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          /* EXTREME DEVOS OPERATIONAL CONTROL PANEL (CMS) */
          <motion.div 
            key="dashboard-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col md:flex-row h-full overflow-hidden"
          >
            {/* Sidebar Controls Section */}
            <aside className="w-full md:w-60 border-b md:border-b-0 md:border-r border-zinc-900/80 bg-[#0C0C0D] flex flex-col shrink-0 justify-between select-none">
              <div className="p-5 space-y-5 overflow-y-auto">
                <div className="flex items-center gap-2.5 leading-none">
                  <Database className="w-4 h-4 text-blue-500 shrink-0" />
                  <div className="text-left">
                    <h1 className="font-bold text-xs text-white uppercase tracking-tight font-sans">DevOS Workspace</h1>
                    <span className="text-[9px] font-mono text-zinc-650 tracking-wider">OPERATOR CONTROL</span>
                  </div>
                </div>

                <nav className="space-y-4">
                  {/* Category: General Overview */}
                  <div className="space-y-1.5 text-left">
                    <span className="text-[9px] text-zinc-650 font-bold uppercase tracking-widest block px-2.5">System Gate</span>
                    {[
                      { id: 'dashboard', name: 'Control Desktop', icon: Laptop },
                      { id: 'appearance', name: 'Theme Settings', icon: Paintbrush },
                      { id: 'settings', name: 'Variables CMS', icon: Settings },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left cursor-pointer transition-all text-xs
                          ${activeTab === tab.id 
                            ? 'bg-blue-500/10 border border-blue-500/15 text-blue-400 font-bold' 
                            : 'text-zinc-400 bg-transparent hover:text-white hover:bg-zinc-900/40'
                          }
                        `}
                      >
                        <tab.icon className="w-3.5 h-3.5 shrink-0" />
                        <span>{tab.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Category: Portfolio Database */}
                  <div className="space-y-1.5 text-left">
                    <span className="text-[9px] text-zinc-650 font-bold uppercase tracking-widest block px-2.5">Portfolio CMS</span>
                    {[
                      { id: 'projects', name: 'Projects Manager', icon: Code },
                      { id: 'experience', name: 'Experience CMS', icon: Award },
                      { id: 'cms_changelog', name: 'Changelog CMS', icon: Clock },
                      { id: 'history', name: 'Backup & Restore', icon: History },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left cursor-pointer transition-all text-xs
                          ${activeTab === tab.id 
                            ? 'bg-blue-500/10 border border-blue-500/15 text-blue-400 font-bold' 
                            : 'text-zinc-400 bg-transparent hover:text-white hover:bg-zinc-900/40'
                          }
                        `}
                      >
                        <tab.icon className="w-3.5 h-3.5 shrink-0" />
                        <span>{tab.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Category: Visitor Monitoring */}
                  <div className="space-y-1.5 text-left">
                    <span className="text-[9px] text-zinc-650 font-bold uppercase tracking-widest block px-2.5">Inbound CRM Leads</span>
                    {[
                      { id: 'contacts', name: 'Lead Pipeline', icon: Mail },
                      { id: 'analytics', name: 'Interaction Stats', icon: BarChart2 },
                      { id: 'sessions', name: 'Visitor Log', icon: Globe },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left cursor-pointer transition-all text-xs
                          ${activeTab === tab.id 
                            ? 'bg-blue-500/10 border border-blue-500/15 text-blue-400 font-bold' 
                            : 'text-zinc-400 bg-transparent hover:text-white hover:bg-zinc-900/40'
                          }
                        `}
                        onClick={() => setActiveTab(tab.id)}
                      >
                        <div className="flex items-center gap-2">
                          <tab.icon className="w-3.5 h-3.5 shrink-0" />
                          <span>{tab.name}</span>
                        </div>
                        {tab.id === 'contacts' && contacts.filter(c => c.status === 'new').length > 0 && (
                          <span className="bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-mono font-bold">
                            {contacts.filter(c => c.status === 'new').length}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </nav>
              </div>

              {/* Secure Log Out footer bar */}
              <div className="p-4 border-t border-zinc-900/80 bg-[#101012] flex items-center justify-between text-zinc-400">
                <div className="flex flex-col text-left">
                  <span className="text-[8px] uppercase tracking-wider text-zinc-550 block">Operational Auth Mode</span>
                  <span className="text-[10px] text-emerald-400 font-semibold tracking-wide flex items-center gap-1 leading-none pt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    SECURE_SESSION_ACTIVE
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 bg-zinc-900 hover:bg-red-950/20 border border-zinc-800 hover:border-red-900/40 text-zinc-400 hover:text-red-400 rounded-lg cursor-pointer transition-all duration-300"
                  title="Secure Lock Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </aside>

            {/* Dynamic Operations workspace canvas containing selected tab */}
            <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 text-left selection:bg-neutral-800 selection:text-white custom-scrollbar bg-[#121214]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-6"
                >
                  
                  {/* TAB 1: OPERATIONAL SHORTCUTS DASHBOARD */}
                  {activeTab === 'dashboard' && (
                    <div className="space-y-6">
                      <div className="border-b border-zinc-900 pb-4">
                        <h2 className="text-lg md:text-xl font-bold text-white tracking-tight font-sans flex items-center gap-2">
                          <Laptop className="w-5 h-5 text-blue-500 animate-pulse" />
                          <span>Operator Command Center</span>
                        </h2>
                        <p className="text-zinc-500 text-xs mt-1 font-mono uppercase">
                          Censored metrics summary. Access restricted to DARSHAN KUMAR K R.
                        </p>
                      </div>

                      {/* Summary Data Grid */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-[#08080a]/50 border border-zinc-900 p-5 rounded-2xl relative">
                          <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block">Total Page Views (Live)</span>
                          <span className="text-xl md:text-2xl font-bold text-white block mt-1.5 font-mono">{analytics.pageVisits}</span>
                        </div>
                        <div className="bg-[#08080a]/50 border border-zinc-900 p-5 rounded-2xl">
                          <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block">Inbound Contacts / Recruiter Leads</span>
                          <span className="text-xl md:text-2xl font-bold text-amber-500 block mt-1.5 font-mono">{contacts.length}</span>
                        </div>
                        <div className="bg-[#08080a]/50 border border-zinc-900 p-5 rounded-2xl">
                          <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block">Active Showcase Projects</span>
                          <span className="text-xl md:text-2xl font-bold text-emerald-500 block mt-1.5 font-mono">{projects.filter(p => p.lifecycleStatus !== 'archived').length}</span>
                        </div>
                        <div className="bg-[#08080a]/50 border border-zinc-900 p-5 rounded-2xl">
                          <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block">Visitor Sessions Registered</span>
                          <span className="text-xl md:text-2xl font-bold text-purple-400 block mt-1.5 font-mono">{sessions.length}</span>
                        </div>
                      </div>

                      {/* File Upload center on-disk */}
                      <div className="bg-[#08080a]/50 border border-zinc-900 rounded-3xl p-6 space-y-4">
                        <div className="border-b border-zinc-900 pb-3 leading-none flex items-center gap-2">
                          <Upload className="w-4 h-4 text-blue-500" />
                          <h3 className="font-bold text-white text-xs uppercase font-mono tracking-wider">Secure Server-Disk Upload Vault</h3>
                        </div>
                        <p className="text-zinc-500 text-xs leading-relaxed max-w-xl">
                          Upload media files (wallpapers, profiles, research visuals, video steps) directly onto server disk storage. Direct absolute URLs are returned to avoid packing massive Base64 streams inside local state tables.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleBinaryMediaUpload(e, 'general')}
                              className="hidden"
                              id="vault-uploader-in"
                            />
                            <label
                              htmlFor="vault-uploader-in"
                              className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-mono text-[10px] uppercase font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-all"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>Upload to server disk storage</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: PROJECTS LIFECYCLE CMS (Draft/Published/Archived) */}
                  {activeTab === 'projects' && (
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
                        <div>
                          <h2 className="text-lg md:text-xl font-bold text-white tracking-tight font-sans flex items-center gap-2">
                            <Code className="w-5 h-5 text-blue-500" />
                            <span>Projects Manager Terminal</span>
                          </h2>
                          <p className="text-zinc-500 text-xs mt-1 font-mono uppercase">
                            Configure project details, interactive topologies, metrics and publishing states.
                          </p>
                        </div>
                        
                        <button
                          onClick={() => {
                            setEditingProj({});
                            setProjFormMode('create');
                          }}
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-mono text-[10.5px] uppercase font-bold tracking-wider rounded-xl cursor-pointer flex items-center gap-1.5 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add New Project</span>
                        </button>
                      </div>

                      {/* Form Overlay Modal */}
                      {editingProj && (
                        <div className="bg-black/80 border border-zinc-900 rounded-3xl p-6 space-y-5">
                          <form onSubmit={saveProjectForm} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1 text-left">
                                <label className="text-[9px] font-mono text-zinc-550 uppercase tracking-wider block">Project Unique Slug / ID</label>
                                <input
                                  value={editingProj.id || ''}
                                  placeholder="unique-project-slug"
                                  disabled={projFormMode === 'edit'}
                                  onChange={(e) => setEditingProj({ ...editingProj, id: e.target.value })}
                                  className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2.5 focus:border-zinc-700 text-white outline-none text-xs text-left"
                                  required
                                />
                              </div>
                              <div className="space-y-1 text-left">
                                <label className="text-[9px] font-mono text-zinc-550 uppercase tracking-wider block">Project Title Name</label>
                                <input
                                  value={editingProj.title || ''}
                                  placeholder="Project Title"
                                  onChange={(e) => setEditingProj({ ...editingProj, title: e.target.value })}
                                  className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2.5 focus:border-zinc-700 text-white outline-none text-xs text-left"
                                  required
                                />
                              </div>
                              <div className="space-y-1 text-left">
                                <label className="text-[9px] font-mono text-zinc-550 uppercase tracking-wider block">Tagline Copy</label>
                                <input
                                  value={editingProj.tagline || ''}
                                  placeholder="Brief focus description"
                                  onChange={(e) => setEditingProj({ ...editingProj, tagline: e.target.value })}
                                  className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2.5 focus:border-zinc-700 text-white outline-none text-xs text-left"
                                />
                              </div>
                              <div className="space-y-1 text-left">
                                <label className="text-[9px] font-mono text-zinc-550 uppercase tracking-wider block">Visual Badge abbreviation</label>
                                <input
                                  value={editingProj.logo || ''}
                                  placeholder="e.g. DWP"
                                  maxLength={4}
                                  onChange={(e) => setEditingProj({ ...editingProj, logo: e.target.value })}
                                  className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2.5 focus:border-zinc-700 text-white outline-none text-xs text-left font-mono uppercase"
                                />
                              </div>
                              <div className="space-y-1 text-left">
                                <label className="text-[9px] font-mono text-zinc-550 uppercase tracking-wider block">Workflow status Category</label>
                                <select
                                  value={editingProj.status || 'production'}
                                  onChange={(e) => setEditingProj({ ...editingProj, status: e.target.value as any })}
                                  className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2.5 focus:border-zinc-700 text-white outline-none text-xs text-left"
                                >
                                  <option value="production">PRODUCTION RELEASE</option>
                                  <option value="active-dev">ACTIVE DEVELOPMENT</option>
                                  <option value="archived">ARCHIVED DISCONTINUED</option>
                                </select>
                              </div>
                              
                              {/* Workflow lifecycle dropdown (Priority 3 Project workflow) */}
                              <div className="space-y-1 text-left">
                                <label className="text-[9px] font-mono text-zinc-550 uppercase tracking-wider block">Showcase publishing State</label>
                                <select
                                  value={editingProj.lifecycleStatus || 'published'}
                                  onChange={(e) => setEditingProj({ ...editingProj, lifecycleStatus: e.target.value as any })}
                                  className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2.5 focus:border-zinc-700 text-white outline-none text-xs text-left"
                                >
                                  <option value="draft">DRAFT (Admin viewing only)</option>
                                  <option value="published">PUBLISHED (Public catalog list)</option>
                                  <option value="archived">ARCHIVED (Retained in DB; Hidden from lists)</option>
                                </select>
                              </div>
                            </div>

                            <div className="space-y-1 text-left">
                              <label className="text-[9px] font-mono text-zinc-550 uppercase tracking-wider block">Overview text</label>
                              <textarea
                                value={editingProj.overview || ''}
                                rows={2}
                                onChange={(e) => setEditingProj({ ...editingProj, overview: e.target.value })}
                                className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-3 focus:border-zinc-700 text-white outline-none text-xs text-left"
                              />
                            </div>

                            <div className="flex gap-2.5 justify-end">
                              <button
                                type="button"
                                onClick={() => setEditingProj(null)}
                                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 font-mono text-[10px] uppercase rounded-xl cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-mono text-[10px] uppercase rounded-xl cursor-pointer font-bold"
                              >
                                Save modifications
                              </button>
                            </div>
                          </form>
                        </div>
                      )}

                      {/* Projects Table inventory with quick lifecycle status toggles */}
                      <div className="bg-[#08080a]/50 border border-zinc-900 rounded-3xl overflow-hidden text-left font-mono text-xs">
                        <table className="w-full text-zinc-350">
                          <thead>
                            <tr className="bg-black/45 border-b border-zinc-900 text-[10px] font-mono text-zinc-550 uppercase font-bold">
                              <th className="p-4 pl-6">Logo / Title</th>
                              <th className="p-4">Publishing state</th>
                              <th className="p-4">Technologies</th>
                              <th className="p-4 text-center">Inbound Stats</th>
                              <th className="p-4 pr-6 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-900">
                            {projects.map(p => (
                              <tr key={p.id} className="hover:bg-zinc-950/25 transition-colors">
                                <td className="p-4 pl-6">
                                  <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 bg-zinc-950 border border-zinc-900 rounded flex items-center justify-center font-bold text-[10px] text-white shrink-0">
                                      {p.logo}
                                    </div>
                                    <div>
                                      <span className="font-bold text-white block truncate max-w-[200px]">{p.title}</span>
                                      <span className="text-[9px] font-mono text-zinc-550 mt-0.5">{p.id}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4 font-mono text-[10px]">
                                  {/* Badges */}
                                  <span className={`px-1.5 py-0.5 rounded leading-none text-[8.5px] uppercase font-bold border block w-fit
                                    ${p.lifecycleStatus === 'draft' ? 'bg-amber-500/10 border-amber-500/15 text-amber-500' : ''}
                                    ${p.lifecycleStatus === 'archived' ? 'bg-zinc-500/10 border-zinc-500/15 text-zinc-550' : ''}
                                    ${!p.lifecycleStatus || p.lifecycleStatus === 'published' ? 'bg-emerald-500/10 border-emerald-500/15 text-emerald-400' : ''}
                                  `}>
                                    {p.lifecycleStatus || 'published'}
                                  </span>
                                </td>
                                <td className="p-4 max-w-[120px] truncate text-[10px] text-zinc-500">
                                  {p.technologies.slice(0, 3).join(', ')}
                                </td>
                                <td className="p-4 text-center font-mono text-[9px] text-zinc-500">
                                  VIEWS: {p.analytics?.views || 0} // GITHUB: {p.analytics?.githubClicks || 0}
                                </td>
                                <td className="p-4 pr-6 text-right space-x-1 whitespace-nowrap">
                                  {/* Quick status switches (Priority 3 additions) */}
                                  <button
                                    onClick={() => toggleProjectLifecycle(p.id, 'published')}
                                    className="px-1.5 py-0.5 border border-emerald-500/20 text-emerald-400 font-mono text-[8px] rounded uppercase hover:bg-emerald-500/10 cursor-pointer"
                                    title="Publish catalog record"
                                  >
                                    PUB
                                  </button>
                                  <button
                                    onClick={() => toggleProjectLifecycle(p.id, 'draft')}
                                    className="px-1.5 py-0.5 border border-amber-500/20 text-amber-500 font-mono text-[8px] rounded uppercase hover:bg-amber-500/10 cursor-pointer"
                                    title="Draft item state"
                                  >
                                    DFT
                                  </button>
                                  <button
                                    onClick={() => toggleProjectLifecycle(p.id, 'archived')}
                                    className="px-1.5 py-0.5 border border-zinc-500/20 text-zinc-550 font-mono text-[8px] rounded uppercase hover:bg-zinc-500/15 cursor-pointer"
                                    title="Archive showcase entry"
                                  >
                                    ARC
                                  </button>
                                  
                                  <span className="text-zinc-800 font-mono">|</span>

                                  <button
                                    onClick={() => {
                                      setEditingProj(p);
                                      setProjFormMode('edit');
                                    }}
                                    className="text-zinc-400 hover:text-white cursor-pointer"
                                  >
                                    EDIT
                                  </button>
                                  <button
                                    onClick={() => deleteProject(p.id, p.title)}
                                    className="text-red-500 hover:text-red-400 cursor-pointer"
                                  >
                                    PURGE
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: GUEST LEAD CRM PIPELINE WITH NOTES (Priority 8 Lead pipeline!) */}
                  {activeTab === 'contacts' && (
                    <div className="space-y-6">
                      <div className="border-b border-zinc-900 pb-4">
                        <h2 className="text-lg md:text-xl font-bold text-white tracking-tight font-sans flex items-center gap-2">
                          <Mail className="w-5 h-5 text-blue-500" />
                          <span>Guest Lead Pipeline CRM</span>
                        </h2>
                        <p className="text-zinc-500 text-xs mt-1 font-mono uppercase">
                          Manage recruiters opportunities, pricing, schedules and logs pipelines.
                        </p>
                      </div>

                      {/* Header filters and search inputs */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                          <Search className="w-4 h-4 text-zinc-650 absolute left-3.5 top-3" />
                          <input
                            type="text"
                            placeholder="SEARCH INQUIRIES, MESSAGES, EMAIL OR CRM NOTES..."
                            value={leadSearch}
                            onChange={(e) => setLeadSearch(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-900 text-xs text-white rounded-xl pl-10 pr-4 py-2.5 font-mono tracking-wider outline-none focus:border-zinc-700/80 uppercase"
                          />
                        </div>

                        {/* Dropdown Filters */}
                        <div className="flex items-center gap-2 shrink-0">
                          <label className="text-[9px] font-mono text-zinc-650 uppercase">Stage:</label>
                          <select
                            value={leadFilterStage}
                            onChange={(e) => setLeadFilterStage(e.target.value as any)}
                            className="bg-zinc-950 border border-zinc-900 text-xs text-white rounded-xl px-4 py-2.5 outline-none font-mono"
                          >
                            <option value="all">ALL STAGES</option>
                            <option value="new">NEW INBOUND</option>
                            <option value="contacted">CONTACTED</option>
                            <option value="discussion">DISCUSSION</option>
                            <option value="proposal_sent">PROPOSAL SENT</option>
                            <option value="closed_won">CLOSED WON</option>
                            <option value="closed_lost">CLOSED LOST</option>
                          </select>
                        </div>
                      </div>

                      {/* Leads Cards Grid */}
                      <div className="grid grid-cols-1 gap-4 text-left font-sans">
                        {contacts
                          .filter(c => {
                            // Search query
                            const matchSearch = 
                              c.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
                              c.email.toLowerCase().includes(leadSearch.toLowerCase()) ||
                              c.subject.toLowerCase().includes(leadSearch.toLowerCase()) ||
                              c.message.toLowerCase().includes(leadSearch.toLowerCase()) ||
                              (c.leadNotes || '').toLowerCase().includes(leadSearch.toLowerCase());
                            
                            // Stage filter
                            const matchStage = leadFilterStage === 'all' || (c.leadStage || 'new') === leadFilterStage;
                            
                            return matchSearch && matchStage;
                          })
                          .map(c => (
                            <div 
                              key={c.id} 
                              className={`p-5 border rounded-3xl space-y-4 relative transition-all duration-350 bg-[#08080a]/65
                                ${c.status === 'new' ? 'border-l-4 border-l-blue-500 shadow-lg' : 'border-zinc-900/80 opacity-90'}
                              `}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-900/60 pb-3">
                                <div>
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-bold text-white text-xs">{c.name}</span>
                                    <span className="text-zinc-650 font-mono text-[9px]">•</span>
                                    <span className="text-[9px] font-mono text-blue-400 uppercase tracking-widest">{c.type} inquire</span>
                                    
                                    {/* Action category indicators */}
                                    <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-mono uppercase border font-bold leading-none
                                      ${(c.leadStage || 'new') === 'new' ? 'bg-blue-500/10 border-blue-500/15 text-blue-400' : ''}
                                      ${(c.leadStage || 'new') === 'contacted' ? 'bg-amber-500/10 border-amber-500/15 text-amber-500' : ''}
                                      ${(c.leadStage || 'new') === 'discussion' ? 'bg-purple-500/10 border-purple-500/15 text-purple-400' : ''}
                                      ${(c.leadStage || 'new') === 'proposal_sent' ? 'bg-cyan-500/10 border-cyan-500/15 text-cyan-400' : ''}
                                      ${(c.leadStage || 'new') === 'closed_won' ? 'bg-emerald-500/10 border-emerald-500/15 text-emerald-400 shadow-md shadow-emerald-500/5' : ''}
                                      ${(c.leadStage || 'new') === 'closed_lost' ? 'bg-zinc-500/10 border-zinc-500/15 text-zinc-550' : ''}
                                    `}>
                                      {c.leadStage || 'new'}
                                    </span>
                                  </div>
                                  <span className="text-[10.5px] font-mono text-zinc-500 block pt-0.5">{c.email}</span>
                                </div>
                                
                                <span className="text-[9.5px] text-zinc-550 font-mono uppercase tracking-widest">{c.date}</span>
                              </div>

                              <div className="space-y-1">
                                <h4 className="font-semibold text-white text-xs">{c.subject}</h4>
                                <p className="text-[11px] text-zinc-400 leading-relaxed whitespace-pre-wrap">{c.message}</p>
                              </div>

                              {/* CRM pipeline Note section and state selectors */}
                              <div className="bg-[#050506]/85 border border-zinc-900/70 p-4 rounded-2xl space-y-3">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 leading-none">
                                  <div className="flex items-center gap-1.5">
                                    <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                                    <span className="font-mono text-[9.5px] uppercase tracking-wider text-zinc-500">Advisory Pipeline CRM CRM State</span>
                                  </div>
                                  
                                  {/* Select Pipeline state triggers */}
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-mono text-[9px] text-zinc-650 uppercase">Update Stage:</span>
                                    <select
                                      value={c.leadStage || 'new'}
                                      onChange={(e) => updateCRMLead(c.id, e.target.value as any, c.leadNotes || '')}
                                      className="bg-zinc-950 border border-zinc-900 text-[10px] text-white rounded px-2 py-1 outline-none font-mono"
                                    >
                                      <option value="new">NEW OPPORTUNITY</option>
                                      <option value="contacted">CONTACTED</option>
                                      <option value="discussion">DISCUSSION</option>
                                      <option value="proposal_sent">PROPOSAL SENT</option>
                                      <option value="closed_won">CLOSED WON</option>
                                      <option value="closed_lost">CLOSED LOST</option>
                                    </select>
                                  </div>
                                </div>

                                <div className="space-y-1 text-left">
                                  <span className="text-[8.5px] font-mono text-zinc-550 uppercase tracking-widest block">ADMIN OPPORTUNITY NOTES</span>
                                  <textarea
                                    value={c.leadNotes || ''}
                                    placeholder="Add custom notes about budget, roadmap specifications, interview calendars, etc..."
                                    rows={2}
                                    onChange={(e) => updateCRMLead(c.id, c.leadStage || 'new', e.target.value)}
                                    className="w-full bg-zinc-950 text-xs text-white border border-zinc-900 focus:border-zinc-850 rounded-xl px-3 py-2 outline-none font-mono placeholder:text-zinc-800"
                                  />
                                </div>
                              </div>

                              <div className="flex justify-between items-center text-[10.5px] font-mono pt-1">
                                <div className="flex gap-2.5">
                                  <button
                                    onClick={() => toggleInboxReadStatus(c.id, c.status)}
                                    className="text-zinc-400 hover:text-white cursor-pointer"
                                  >
                                    {c.status === 'new' ? 'MARK_REVIEWS_READ' : 'MARK_UNREAD'}
                                  </button>
                                  <span className="text-zinc-800">|</span>
                                  <button
                                    onClick={() => deleteInboundLead(c.id, c.name)}
                                    className="text-red-400 hover:text-white cursor-pointer"
                                  >
                                    PURGE
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 4: VARIABLE CMS / VARIABLES SETTINGS / SEO MANAGER (Priority 9 & Priority 10) */}
                  {activeTab === 'settings' && (
                    <div className="space-y-6">
                      <div className="border-b border-zinc-900 pb-4">
                        <h2 className="text-lg md:text-xl font-bold text-white tracking-tight font-sans flex items-center gap-2">
                          <Settings className="w-5 h-5 text-blue-500 animate-spin" />
                          <span>Global Workspace Constants (SEO & Copy CMS)</span>
                        </h2>
                        <p className="text-zinc-500 text-xs mt-1 font-mono uppercase">
                          Modify homepage welcome content, spotlight project selection and SEO head attributes.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                        {/* Section 1: Desktop Welcome & Hero Strings */}
                        <div className="bg-[#08080a]/50 border border-zinc-900 p-6 rounded-3xl space-y-4">
                          <div className="border-b border-zinc-900 pb-2 flex items-center gap-2 leading-none">
                            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                            <h3 className="font-bold text-white text-xs uppercase font-mono tracking-wider">Homepage & Copy Management</h3>
                          </div>

                          <div className="space-y-3 text-xs">
                            <div className="space-y-1.5">
                              <label className="text-[9px] font-mono text-zinc-550 uppercase tracking-wider block">Desktop Welcome header string</label>
                              <input
                                value={settings.desktopWelcome || ''}
                                onChange={(e) => saveSettingsCMS('desktopWelcome', e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2 text-white outline-none"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[9px] font-mono text-zinc-550 uppercase tracking-wider block">Hero Display Title</label>
                              <input
                                value={settings.heroTitle || ''}
                                onChange={(e) => saveSettingsCMS('heroTitle', e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2 text-white outline-none"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[9px] font-mono text-zinc-550 uppercase tracking-wider block">Hero Display Subtitle</label>
                              <input
                                value={settings.heroSubtitle || ''}
                                onChange={(e) => saveSettingsCMS('heroSubtitle', e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2 text-white outline-none"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[9px] font-mono text-zinc-550 uppercase tracking-wider block">Hero Intro Description</label>
                              <textarea
                                value={settings.heroText || ''}
                                rows={3}
                                onChange={(e) => saveSettingsCMS('heroText', e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2 text-white outline-none"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[9px] font-mono text-zinc-550 uppercase tracking-wider block">Current Focus Activity status</label>
                              <input
                                value={settings.currentFocusWidget || ''}
                                onChange={(e) => saveSettingsCMS('currentFocusWidget', e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2 text-white outline-none"
                              />
                            </div>
                            
                            {/* Priority 2: Featured spotlight selector dropdown */}
                            <div className="space-y-1.5">
                              <label className="text-[9px] font-mono text-[#3B82F6] uppercase tracking-wider font-bold block">Featured Showcase Project (Spotlight Spotlight widget)</label>
                              <select
                                value={settings.featuredProjectId || 'dark-web-marketplaces'}
                                onChange={(e) => saveSettingsCMS('featuredProjectId', e.target.value)}
                                className="w-full bg-zinc-950 border border-[#3B82F6]/30 rounded-xl px-4 py-2 text-white outline-none font-mono"
                              >
                                {projects.map(p => (
                                  <option key={p.id} value={p.id}>{p.logo} - {p.title}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Section 2: SEO metadata parameters (Priority 10 SEO Management) */}
                        <div className="bg-[#08080a]/50 border border-zinc-900 p-6 rounded-3xl space-y-4">
                          <div className="border-b border-zinc-900 pb-2 flex items-center gap-2 leading-none">
                            <Globe className="w-3.5 h-3.5 text-blue-500" />
                            <h3 className="font-bold text-white text-xs uppercase font-mono tracking-wider">SEO Master Tags Manager</h3>
                          </div>

                          <div className="space-y-3 text-xs">
                            <div className="space-y-1.5">
                              <label className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block">HOMEPAGE Meta Title</label>
                              <input
                                value={settings.metaTitleHomepage || ''}
                                onChange={(e) => saveSettingsCMS('metaTitleHomepage', e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2 text-white outline-none text-xs"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block">HOMEPAGE Meta Description</label>
                              <textarea
                                value={settings.metaDescriptionHomepage || ''}
                                rows={2}
                                onChange={(e) => saveSettingsCMS('metaDescriptionHomepage', e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2 text-white outline-none text-xs"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block">HOMEPAGE Search Keywords</label>
                              <input
                                value={settings.metaKeywordsHomepage || ''}
                                onChange={(e) => saveSettingsCMS('metaKeywordsHomepage', e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2 text-white outline-none text-xs font-mono"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block">OpenGraph Preview Image URL</label>
                              <input
                                value={settings.ogImageHomepage || ''}
                                onChange={(e) => saveSettingsCMS('ogImageHomepage', e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2 text-white outline-none text-xs font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 5: BACKUP SNAPSHOT ENGINE & DIRECT ROLLBACK (Priority 4/5/11) */}
                  {activeTab === 'history' && (
                    <div className="space-y-6">
                      <div className="border-b border-zinc-900 pb-4">
                        <h2 className="text-lg md:text-xl font-bold text-white tracking-tight font-sans flex items-center gap-2">
                          <History className="w-5 h-5 text-blue-500 animate-pulse" />
                          <span>Backup & System Recovery Engine</span>
                        </h2>
                        <p className="text-zinc-500 text-xs mt-1 font-mono uppercase">
                          Download file schema backups or restore overall operating parameters directly from previous states snapshots.
                        </p>
                      </div>

                      {/* Backup and Import actions */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Download schema export */}
                        <div className="bg-[#08080a]/50 border border-zinc-900 p-6 rounded-3xl space-y-3">
                          <div className="leading-none flex items-center gap-2">
                            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                            <h3 className="font-bold text-white text-xs uppercase font-mono tracking-wider">Export State Archive</h3>
                          </div>
                          <p className="text-zinc-500 text-xs leading-relaxed">
                            Generate and download a single standalone JSON backup package containing all projects lists, whitepapers catalog, settings constants, styles appearance guidelines and release logs.
                          </p>
                          <button
                            onClick={() => PortfolioDB.exportStateBackup()}
                            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-mono text-[10.5px] uppercase font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-all shadow-md shadow-emerald-500/10"
                          >
                            <Upload className="w-3.5 h-3.5 rotate-180" />
                            <span>Export local Database backup</span>
                          </button>
                        </div>

                        {/* Restore schema uploads */}
                        <div className="bg-[#08080a]/50 border border-zinc-900 p-6 rounded-3xl space-y-3">
                          <div className="leading-none flex items-center gap-2">
                            <RefreshCw className="w-4 h-4 text-amber-500 animate-spin" />
                            <h3 className="font-bold text-white text-xs uppercase font-mono tracking-wider">Import State Recovery</h3>
                          </div>
                          <p className="text-zinc-500 text-[11px] leading-relaxed">
                            Restore the complete workspace database by uploading a valid exported JSON file. Replaces projects inventory, settings variables and appearance profiles dynamically without reloading page routes.
                          </p>
                          <div className="relative">
                            <input
                              type="file"
                              accept=".json"
                              onChange={handleBackupRestoreUpload}
                              className="hidden"
                              id="backup-importer-file-node"
                            />
                            <label
                              htmlFor="backup-importer-file-node"
                              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-mono text-[10.5px] uppercase font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-all shadow-md shadow-amber-500/10"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>Select backup file...</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Snapshots log registry (Priority 5 state rollback table) */}
                      <div className="space-y-3.5">
                        <div className="border-b border-zinc-900 pb-2 flex items-center gap-2 leading-none">
                          <History className="w-4 h-4 text-blue-500" />
                          <h3 className="font-bold text-white text-xs font-mono tracking-wider uppercase">Administrative rollback snapshots</h3>
                        </div>

                        <div className="bg-[#08080a]/50 border border-zinc-900 rounded-3xl overflow-hidden font-mono text-xs text-left">
                          <table className="w-full text-zinc-350">
                            <thead>
                              <tr className="bg-black/45 border-b border-zinc-900 text-[9.5px] font-mono text-zinc-550 uppercase font-bold">
                                <th className="p-4 pl-6">ID / Timestamp</th>
                                <th className="p-4">Action Event</th>
                                <th className="p-4">Modified targets summary</th>
                                <th className="p-4 pr-6 text-right">Recovery</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-900">
                              {logs.length === 0 ? (
                                <tr>
                                  <td colSpan={4} className="p-8 text-center text-zinc-650 font-mono text-xs">
                                    No administrative backup logs registered. Make edits or restore schema to view snapshots records.
                                  </td>
                                </tr>
                              ) : (
                                logs.map(l => (
                                  <tr key={l.id} className="hover:bg-zinc-950/20 transition-colors">
                                    <td className="p-4 pl-6 text-[10.5px]">
                                      <span className="text-white block font-bold">{l.id}</span>
                                      <span className="text-[8.5px] text-zinc-550 block mt-0.5">{new Date(l.timestamp).toLocaleString()}</span>
                                    </td>
                                    <td className="p-4 font-bold text-[10.5px] text-zinc-400">
                                      <span className="bg-zinc-950 border border-zinc-900 px-1.5 py-0.5 rounded leading-none text-blue-400">
                                        {l.action}
                                      </span>
                                    </td>
                                    <td className="p-4 text-[10.5px] max-w-[200px] truncate text-zinc-500" title={l.description}>
                                      {l.description}
                                    </td>
                                    <td className="p-4 pr-6 text-right">
                                      <button
                                        onClick={() => handleSystemRollback(l.id, l.description)}
                                        className="bg-zinc-950 hover:bg-blue-500 hover:text-white border border-zinc-850 px-3 py-1.5 rounded-xl font-mono text-[9px] uppercase font-bold cursor-pointer transition-all"
                                      >
                                        Rollback
                                      </button>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 6: CHANGELOG OPERATIONAL RECIPE (Priority 13 Changelog manager!) */}
                  {activeTab === 'cms_changelog' && (
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
                        <div>
                          <h2 className="text-lg md:text-xl font-bold text-white tracking-tight font-sans flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-500" />
                            <span>Changelog Database CMS Manager</span>
                          </h2>
                          <p className="text-zinc-500 text-xs mt-1 font-mono uppercase">
                            Manage release entries to populate public core changelog widgets seamlessly.
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            setEditingChangelog({ changes: [''] });
                            setChangelogFormMode('create');
                          }}
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-mono text-[10.5px] uppercase font-bold tracking-wider rounded-xl cursor-pointer flex items-center gap-1.5 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Version Log</span>
                        </button>
                      </div>

                      {/* Editing panel */}
                      {editingChangelog && (
                        <div className="bg-black/80 border border-zinc-900 rounded-3xl p-6 space-y-4">
                          <form onSubmit={saveChangelogForm} className="space-y-4 text-xs">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-1 text-left">
                                <label className="text-[9px] font-mono text-zinc-550 uppercase">Version Tag</label>
                                <input
                                  value={editingChangelog.version || ''}
                                  placeholder="e.g. v2.5"
                                  onChange={(e) => setEditingChangelog({ ...editingChangelog, version: e.target.value })}
                                  className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2 text-white outline-none"
                                  required
                                />
                              </div>
                              <div className="space-y-1 text-left">
                                <label className="text-[9px] font-mono text-zinc-550 uppercase">Date Str</label>
                                <input
                                  value={editingChangelog.date || ''}
                                  placeholder="YYYY-MM-DD"
                                  onChange={(e) => setEditingChangelog({ ...editingChangelog, date: e.target.value })}
                                  className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2 text-white outline-none"
                                />
                              </div>
                              <div className="space-y-1 text-left">
                                <label className="text-[9px] font-mono text-zinc-550 uppercase">Summary overview</label>
                                <input
                                  value={editingChangelog.summary || ''}
                                  placeholder="Title overview"
                                  onChange={(e) => setEditingChangelog({ ...editingChangelog, summary: e.target.value })}
                                  className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2 text-white outline-none"
                                />
                              </div>
                            </div>

                            <div className="space-y-2 text-left">
                              <label className="text-[9px] font-mono text-zinc-550 uppercase">List of Changes (one line per bullet)</label>
                              <textarea
                                value={editingChangelog.changes?.join('\n') || ''}
                                placeholder="Enter changes (one per line)"
                                rows={4}
                                onChange={(e) => setEditingChangelog({ ...editingChangelog, changes: e.target.value.split('\n') })}
                                className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-3 text-white outline-none font-sans"
                              />
                            </div>

                            <div className="flex gap-2 justify-end">
                              <button
                                type="button"
                                onClick={() => setEditingChangelog(null)}
                                className="px-4 py-2 bg-zinc-900 text-zinc-400 font-mono text-[9px] uppercase rounded-xl cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white font-mono text-[9px] uppercase rounded-xl cursor-pointer font-bold"
                              >
                                Save version log
                              </button>
                            </div>
                          </form>
                        </div>
                      )}

                      {/* Changelog Lists Table */}
                      <div className="bg-[#08080a]/50 border border-zinc-900 rounded-3xl overflow-hidden font-mono text-xs text-left">
                        <table className="w-full text-zinc-350">
                          <thead>
                            <tr className="bg-black/45 border-b border-zinc-900 text-[10px] uppercase font-bold text-zinc-550">
                              <th className="p-4 pl-6">Version</th>
                              <th className="p-4">Release details summary</th>
                              <th className="p-4 px-2">Bullets count</th>
                              <th className="p-4 pr-6 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-900">
                            {changelogs.map(cl => (
                              <tr key={cl.version} className="hover:bg-zinc-950/25 transition-colors">
                                <td className="p-4 pl-6 font-bold text-white text-[10.5px]">{cl.version}</td>
                                <td className="p-4 text-[10.5px]">
                                  <span className="font-bold text-zinc-300 block">{cl.summary}</span>
                                  <span className="text-[8.5px] text-zinc-550 mt-0.5">{cl.date}</span>
                                </td>
                                <td className="p-4 text-[10.5px] px-2 text-zinc-400">{cl.changes?.length || 0} bullets</td>
                                <td className="p-4 pr-6 text-right space-x-2">
                                  <button
                                    onClick={() => {
                                      setEditingChangelog(cl);
                                      setChangelogFormMode('edit');
                                    }}
                                    className="text-zinc-400 hover:text-white cursor-pointer"
                                  >
                                    EDIT
                                  </button>
                                  <button
                                    onClick={() => deleteChangelog(cl.version)}
                                    className="text-red-500 hover:text-red-400 cursor-pointer"
                                  >
                                    PURGE
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* TAB 7: PROFESSIONAL EXPERIENCES CMS */}
                  {activeTab === 'experience' && (
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
                        <div>
                          <h2 className="text-lg md:text-xl font-bold text-white tracking-tight font-sans flex items-center gap-2">
                            <Award className="w-5 h-5 text-blue-500 animate-pulse" />
                            <span>Experience Timeline CMS Terminal</span>
                          </h2>
                          <p className="text-zinc-500 text-xs mt-1 font-mono uppercase">
                            Configure companies, internship details and skills mapping records.
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            setExperienceForm({ bullets: [''] });
                            setExpFormMode('create');
                          }}
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-mono text-[10.5px] uppercase font-bold tracking-wider rounded-xl cursor-pointer flex items-center gap-1.5 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Experience Node</span>
                        </button>
                      </div>

                      {/* Display Experience dialog */}
                      {experienceForm && (
                        <div className="bg-black/80 border border-zinc-900 rounded-3xl p-6 space-y-4">
                          <form onSubmit={saveExperienceForm} className="space-y-4 text-xs">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1 text-left">
                                <label className="text-[9px] font-mono text-zinc-550 uppercase">Role / Title</label>
                                <input
                                  value={experienceForm.role || ''}
                                  placeholder="e.g. Systems Engineer Intern"
                                  onChange={(e) => setExperienceForm({ ...experienceForm, role: e.target.value })}
                                  className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2 text-white outline-none"
                                  required
                                />
                              </div>
                              <div className="space-y-1 text-left">
                                <label className="text-[9px] font-mono text-zinc-550 uppercase">Company Name</label>
                                <input
                                  value={experienceForm.company || ''}
                                  placeholder="e.g. IISc"
                                  onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })}
                                  className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2 text-white outline-none"
                                />
                              </div>
                              <div className="space-y-1 text-left">
                                <label className="text-[9px] font-mono text-zinc-550 uppercase">Location</label>
                                <input
                                  value={experienceForm.location || ''}
                                  placeholder="Bengaluru, India"
                                  onChange={(e) => setExperienceForm({ ...experienceForm, location: e.target.value })}
                                  className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2 text-white outline-none"
                                />
                              </div>
                              <div className="space-y-1 text-left">
                                <label className="text-[9px] font-mono text-zinc-550 uppercase">Duration</label>
                                <input
                                  value={experienceForm.duration || ''}
                                  placeholder="e.g. Q3 2025"
                                  onChange={(e) => setExperienceForm({ ...experienceForm, duration: e.target.value })}
                                  className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2 text-white outline-none"
                                />
                              </div>
                            </div>

                            <div className="space-y-2 text-left">
                              <label className="text-[9px] font-mono text-zinc-550 uppercase">Description Bullets (one per line)</label>
                              <textarea
                                value={experienceForm.bullets?.join('\n') || ''}
                                placeholder="Developed neural intrusion filters..."
                                rows={3}
                                onChange={(e) => setExperienceForm({ ...experienceForm, bullets: e.target.value.split('\n') })}
                                className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-3 text-white outline-none font-sans"
                              />
                            </div>

                            <div className="flex gap-2 justify-end">
                              <button
                                type="button"
                                onClick={() => setExperienceForm(null)}
                                className="px-4 py-2 bg-zinc-900 text-zinc-400 font-mono text-[9px] uppercase rounded-xl cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white font-mono text-[9px] uppercase rounded-xl cursor-pointer font-bold"
                              >
                                Save Experience Node
                              </button>
                            </div>
                          </form>
                        </div>
                      )}

                      {/* Display Experience Table */}
                      <div className="bg-[#08080a]/50 border border-zinc-900 rounded-3xl overflow-hidden font-mono text-xs text-left">
                        <table className="w-full text-zinc-350">
                          <thead>
                            <tr className="bg-black/45 border-b border-zinc-900 text-[10px] uppercase font-bold text-zinc-550">
                              <th className="p-4 pl-6">Company / Role</th>
                              <th className="p-4">Duration</th>
                              <th className="p-4">Type</th>
                              <th className="p-4 pr-6 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-900">
                            {experiences.length === 0 ? (
                              <tr>
                                <td colSpan={4} className="p-8 text-center text-zinc-650">
                                  No experience timelines registered. Add nodes to populate timeline.
                                </td>
                              </tr>
                            ) : (
                              experiences.map(ex => (
                                <tr key={ex.id} className="hover:bg-zinc-950/25 transition-colors">
                                  <td className="p-4 pl-6 font-bold text-white text-[10.5px]">
                                    <span className="text-white block font-bold">{ex.role}</span>
                                    <span className="text-[8.5px] text-zinc-550 block mt-0.5">{ex.company}</span>
                                  </td>
                                  <td className="p-4 text-[10.5px] text-zinc-400">{ex.duration}</td>
                                  <td className="p-4 text-[10.5px] text-zinc-500 uppercase">{ex.type}</td>
                                  <td className="p-4 pr-6 text-right space-x-2">
                                    <button
                                      onClick={() => {
                                        setExperienceForm(ex);
                                        setExpFormMode('edit');
                                      }}
                                      className="text-zinc-400 hover:text-white cursor-pointer"
                                    >
                                      EDIT
                                    </button>
                                    <button
                                      onClick={() => deleteExperience(ex.id)}
                                      className="text-red-500 hover:text-red-400 cursor-pointer"
                                    >
                                      PURGE
                                    </button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* TAB 8: VISUAL APPEARANCE WALLPAPERS & COLOR SCHEMES */}
                  {activeTab === 'appearance' && (
                    <div className="space-y-6">
                      <div className="border-b border-zinc-900 pb-4">
                        <h2 className="text-lg md:text-xl font-bold text-white tracking-tight font-sans flex items-center gap-2">
                          <Paintbrush className="w-5 h-5 text-blue-500 animate-pulse" />
                          <span>Appearance Profile Customization</span>
                        </h2>
                        <p className="text-zinc-500 text-xs mt-1 font-mono uppercase">
                          Set high fidelity operating system themes, color schemes and custom wallpapers.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                        {/* Section 1: Themes & Accents selection */}
                        <div className="bg-[#08080a]/50 border border-zinc-900 p-6 rounded-3xl space-y-4">
                          <div className="border-b border-zinc-900 pb-2 flex items-center gap-2 leading-none">
                            <Layers className="w-3.5 h-3.5 text-blue-500" />
                            <h3 className="font-bold text-white text-xs uppercase font-mono tracking-wider">Theme Profile Schemes</h3>
                          </div>

                          <div className="space-y-4">
                            {/* Color items */}
                            <div className="space-y-2 text-xs">
                              <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block">System Theme Matrix</span>
                              <div className="grid grid-cols-2 gap-2">
                                {[
                                  { id: 'midnight', name: 'Ambient Midnight' },
                                  { id: 'graphite', name: 'Cyberpunk Graphite' },
                                  { id: 'minimal-light', name: 'Operator Minimal Light' },
                                  { id: 'professional-dark', name: 'Executive Matte Dark' }
                                ].map(thm => (
                                  <button
                                    key={thm.id}
                                    onClick={() => updateTheme(thm.id as any)}
                                    className={`px-4 py-2.5 rounded-xl border text-left font-mono text-[10px] uppercase font-bold cursor-pointer transition-all
                                      ${appearance.theme === thm.id 
                                        ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' 
                                        : 'bg-zinc-950 border-zinc-900 text-zinc-500 hover:text-white hover:border-zinc-800'
                                      }
                                    `}
                                  >
                                    {thm.name}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Accent selectors */}
                            <div className="space-y-2 text-xs">
                              <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block">Accent Active Alignment Colors</span>
                              <div className="flex gap-2.5 flex-wrap">
                                {[
                                  { hex: '#3B82F6', label: 'SYSTEM BLUE' },
                                  { hex: '#10B981', label: 'SYS EMERALD' },
                                  { hex: '#EF4444', label: 'SYS WARNING RED' },
                                  { hex: '#F59E0B', label: 'SYS AMBER WARN' },
                                  { hex: '#8B5CF6', label: 'SYS COSMIC PURPLE' }
                                ].map(clr => (
                                  <button
                                    key={clr.hex}
                                    onClick={() => updateAccentColor(clr.hex)}
                                    className="px-3 py-1.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 rounded-lg text-[9px] font-mono flex items-center gap-2 cursor-pointer transition-all text-white"
                                  >
                                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: clr.hex }} />
                                    <span>{clr.label}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Section 2: Wallpaper Upload Vault */}
                        <div className="bg-[#08080a]/50 border border-[#3B82F6]/15 hover:border-[#3B82F6]/25 p-6 rounded-3xl space-y-4 transition-all duration-350">
                          <div className="border-b border-zinc-900 pb-2 flex items-center gap-2 leading-none">
                            <Paintbrush className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                            <h3 className="font-bold text-white text-xs uppercase font-mono tracking-wider">Dynamic Wallpaper Canvas</h3>
                          </div>

                          <div className="space-y-4">
                            <p className="text-zinc-500 text-[11px] leading-relaxed">
                              Configure high fidelity wallpaper images recursively. Standard preset operates on an ambient Matte Mesh gradient. Direct image files can be uploaded and applied immediately.
                            </p>

                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  const updated = { ...appearance, wallpaper: 'default-mesh' };
                                  PortfolioDB.saveAppearance(updated);
                                  syncDB();
                                }}
                                className={`px-4 py-2.5 rounded-xl border text-[10px] font-mono uppercase font-bold cursor-pointer transition-all
                                  ${appearance.wallpaper === 'default-mesh' 
                                    ? 'bg-blue-500/10 border-blue-500/25 text-blue-400' 
                                    : 'bg-zinc-950 border-zinc-900 text-zinc-500 hover:text-white'
                                  }
                                `}
                              >
                                Default Matte Mesh
                              </button>

                              <div className="relative">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleBinaryMediaUpload(e, 'wallpaper')}
                                  className="hidden"
                                  id="wp-direct-binary-uploader-file"
                                />
                                <label
                                  htmlFor="wp-direct-binary-uploader-file"
                                  className="px-4 py-2.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 rounded-xl text-[10px] font-mono text-white inline-block cursor-pointer uppercase font-bold font-sans transition-all text-center leading-none"
                                >
                                  Upload custom image file
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 9: TELEMETRY INTERACTIONS GRAPH */}
                  {activeTab === 'analytics' && (
                    <div className="space-y-6">
                      <div className="border-b border-zinc-900 pb-4">
                        <h2 className="text-lg md:text-xl font-bold text-white tracking-tight font-sans flex items-center gap-2">
                          <BarChart2 className="w-5 h-5 text-blue-500" />
                          <span>Showcase Interaction Statistics</span>
                        </h2>
                        <p className="text-zinc-500 text-xs mt-1 font-mono uppercase">
                          Review real page counts downloads, clicks telemetry details.
                        </p>
                      </div>

                      {/* Display click indicators */}
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="bg-[#08080a]/50 border border-zinc-900 p-4 rounded-xl text-left font-mono">
                          <span className="text-[8.5px] text-zinc-550 block">GitHub profile clicks</span>
                          <span className="text-lg font-bold text-white mt-1 block">{analytics.githubClicks}</span>
                        </div>
                        <div className="bg-[#08080a]/50 border border-zinc-900 p-4 rounded-xl text-left font-mono">
                          <span className="text-[8.5px] text-zinc-550 block">LinkedIn clicks</span>
                          <span className="text-lg font-bold text-white mt-1 block">{analytics.linkedinClicks}</span>
                        </div>
                        <div className="bg-[#08080a]/50 border border-zinc-900 p-4 rounded-xl text-left font-mono">
                          <span className="text-[8.5px] text-zinc-550 block">LeetCode clicks</span>
                          <span className="text-lg font-bold text-white mt-1 block">{analytics.leetcodeClicks}</span>
                        </div>
                        <div className="bg-[#08080a]/50 border border-zinc-900 p-4 rounded-xl text-left font-mono">
                          <span className="text-[8.5px] text-zinc-550 block">Resume views index</span>
                          <span className="text-lg font-bold text-white mt-1 block">{analytics.resumeDownloads}</span>
                        </div>
                        <div className="bg-[#08080a]/50 border border-zinc-900 p-4 rounded-xl text-left font-mono">
                          <span className="text-[8.5px] text-zinc-550 block">Cooperation conversions</span>
                          <span className="text-lg font-bold text-white mt-1 block">{analytics.workWithMeClicks}</span>
                        </div>
                      </div>

                      {/* Project views table (Priority 7 project analytics views) */}
                      <div className="space-y-3.5">
                        <div className="leading-none border-b border-zinc-900 pb-2 flex items-center gap-2">
                          <Code className="w-4 h-4 text-blue-500" />
                          <h3 className="font-bold text-white text-xs uppercase font-mono tracking-wider">Project-specific Interaction Analytics</h3>
                        </div>

                        <div className="bg-[#08080a]/50 border border-zinc-900 rounded-3xl overflow-hidden text-left font-mono text-xs">
                          <table className="w-full text-zinc-350">
                            <thead>
                              <tr className="bg-black/45 border-b border-zinc-900 text-[9.5px] font-mono text-zinc-550 uppercase font-bold">
                                <th className="p-4 pl-6">ID Logo / Title</th>
                                <th className="p-4 text-center">Interactive specs views</th>
                                <th className="p-4 text-center">Video demo Plays</th>
                                <th className="p-4 text-center">GitHub link clicks</th>
                                <th className="p-4 pr-6 text-right">Conversion score</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-900">
                              {projects.map(p => {
                                const views = p.analytics?.views || 34;
                                const plays = p.analytics?.demoPlays || 12;
                                const gitClicks = p.analytics?.githubClicks || 8;
                                const score = Math.floor((gitClicks / views) * 100) || 0;
                                return (
                                  <tr key={p.id} className="hover:bg-zinc-950/20 transition-colors">
                                    <td className="p-4 pl-6">
                                      <div className="flex items-center gap-2.5 font-bold text-white text-[10.5px]">
                                        <div className="w-5 h-5 rounded bg-zinc-950 border border-zinc-900 flex items-center justify-center font-bold text-[9px] text-zinc-500 select-none">
                                          {p.logo}
                                        </div>
                                        <span>{p.title}</span>
                                      </div>
                                    </td>
                                    <td className="p-4 text-center text-white text-[10.5px]">{views} views</td>
                                    <td className="p-4 text-center text-[10.5px] text-zinc-400">{plays} plays</td>
                                    <td className="p-4 text-center text-[10.5px] text-zinc-400">{gitClicks} clicks</td>
                                    <td className="p-4 pr-6 text-right text-[10.5px] text-emerald-400 font-bold">{score}% FNL</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 10: USER JOURNEYS TELEMETRY TABLE (Priority 6!) */}
                  {activeTab === 'sessions' && (
                    <div className="space-y-6">
                      <div className="border-b border-zinc-900 pb-4">
                        <h2 className="text-lg md:text-xl font-bold text-white tracking-tight font-sans flex items-center gap-2">
                          <Globe className="w-5 h-5 text-blue-500 animate-pulse" />
                          <span>Detailed Customer Sessions Tracker</span>
                        </h2>
                        <p className="text-zinc-500 text-xs mt-1 font-mono uppercase">
                          Monitor entry paths exit points, traffic referrer streams and durations sequence logs.
                        </p>
                      </div>

                      <div className="bg-[#08080a]/50 border border-zinc-900 rounded-3xl overflow-hidden text-left font-mono text-xs">
                        <table className="w-full text-zinc-350">
                          <thead>
                            <tr className="bg-black/45 border-b border-zinc-900 text-[10px] font-mono text-zinc-550 uppercase tracking-widest font-bold">
                              <th className="p-4 pl-6">Visitor Geo ID</th>
                              <th className="p-4">Entry / Exit Pages</th>
                              <th className="p-4 text-center">Duration log</th>
                              <th className="p-4">Referrer source</th>
                              <th className="p-4 pr-6 text-right">Device context</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-900">
                            {sessions.map(s => {
                              // Formatter duration
                              const dur = s.duration || 5;
                              const min = Math.floor(dur / 60);
                              const sec = dur % 60;
                              const durFormatted = min > 0 ? `${min}m ${sec}s` : `${sec}s`;
                              
                              const entryPage = s.pages?.[0] || 'Desktop Loaded';
                              const exitPage = s.pages?.length > 1 ? s.pages[s.pages.length - 1] : 'Desktop Idle';

                              return (
                                <tr key={s.id} className="hover:bg-zinc-950/25 transition-colors">
                                  <td className="p-4 pl-6">
                                    <div className="flex items-center gap-2">
                                      <MapPin className="w-3.5 h-3.5 text-blue-500" />
                                      <div>
                                        <span className="font-bold text-white block text-[10.5px]">{s.city ? `${s.city}, ${s.country}` : s.country}</span>
                                        <span className="text-[8.5px] text-zinc-550 block mt-0.5">{new Date(s.timestamp).toLocaleString()}</span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-4 text-[10.5px] text-zinc-400">
                                    <div className="flex items-center gap-1">
                                      <span className="text-blue-400">ENTRY:</span>
                                      <span className="text-white font-semibold">{entryPage}</span>
                                    </div>
                                    <div className="flex items-center gap-1 mt-1">
                                      <span className="text-zinc-500">EXIT:</span>
                                      <span className="text-zinc-450">{exitPage}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {s.pages?.map((p, pIdx) => (
                                        <span key={pIdx} className="bg-black/35 border border-zinc-900/40 text-[8.5px] text-zinc-500 px-1 rounded-sm leading-none">
                                          {p}
                                        </span>
                                      ))}
                                    </div>
                                  </td>
                                  <td className="p-4 text-center text-white text-[10.5px] font-bold">
                                    {durFormatted}
                                  </td>
                                  <td className="p-4 text-[10.5px] text-zinc-500 max-w-[150px] truncate" title={s.referrer}>
                                    {s.referrer}
                                  </td>
                                  <td className="p-4 pr-6 text-right text-[10.5px] text-zinc-500 truncate" title={`${s.device} / ${s.browser}`}>
                                    {s.device} // {s.browser}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </main>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
