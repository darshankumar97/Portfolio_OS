/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  ProjectDetail, 
  ArchNode, 
  ArchEdge 
} from '../../content/projectsData';
import { PortfolioDB } from '../../utils/portfolioDb';
import { 
  Tv, 
  Github, 
  ExternalLink, 
  Play, 
  Pause, 
  RotateCcw, 
  Terminal, 
  BookOpen, 
  Activity, 
  Printer, 
  X, 
  Layers, 
  Search, 
  ChevronRight, 
  CheckCircle, 
  Award, 
  Workflow, 
  TrendingUp, 
  HelpCircle,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ProjectsView() {
  const [projectsList, setProjectsList] = useState<ProjectDetail[]>(() => PortfolioDB.getProjects());

  useEffect(() => {
    const handleUpdate = () => {
      setProjectsList(PortfolioDB.getProjects());
    };
    const handleSelectProj = (e: any) => {
      if (e.detail && e.detail.projectId) {
        setSelectedProjectId(e.detail.projectId);
      }
    };
    window.addEventListener('portfolio-db-updated-devos_cms_projects', handleUpdate);
    window.addEventListener('portfolio-db-updated-global', handleUpdate);
    window.addEventListener('devos-select-project', handleSelectProj);
    return () => {
      window.removeEventListener('portfolio-db-updated-devos_cms_projects', handleUpdate);
      window.removeEventListener('portfolio-db-updated-global', handleUpdate);
      window.removeEventListener('devos-select-project', handleSelectProj);
    };
  }, []);

  // Primary state managers
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'specs' | 'video' | 'topology' | 'retrospective' | 'casestudy'>('specs');
  
  // Terminal Simulator states (inside video mock)
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // Topology Inspector states
  const [selectedNode, setSelectedNode] = useState<ArchNode | null>(null);
  const [pathAnimationStep, setPathAnimationStep] = useState<number>(-1);

  // Filter search
  const [searchQuery, setSearchQuery] = useState('');

  // Auto-rotate featured projects when no detail panel is open
  useEffect(() => {
    if (selectedProjectId) return;
    if (projectsList.length === 0) return;
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % projectsList.length);
    }, 12000);
    return () => clearInterval(interval);
  }, [selectedProjectId, projectsList]);

  // Handle mock video progression
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setPlayProgress((prev) => {
          const next = prev + 1.25;
          if (next >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return next;
        });
      }, 250);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Sync steps and progression of video mock
  const activeProject = projectsList.find(p => p.id === selectedProjectId);
  
  useEffect(() => {
    if (!activeProject) return;
    const stepsCount = activeProject.videoSteps.length;
    const index = Math.min(
      Math.floor((playProgress / 100) * stepsCount),
      stepsCount - 1
    );
    setActiveStepIndex(index);
  }, [playProgress, activeProject]);

  // Set default node when selected project changes
  useEffect(() => {
    if (activeProject && activeProject.architectureNodes.length > 0) {
      setSelectedNode(activeProject.architectureNodes[0]);
      setPathAnimationStep(-1);
    }
    setPlayProgress(0);
    setIsPlaying(false);
    setActiveTab('specs');
  }, [selectedProjectId]);

  const handleOpenProject = (id: string) => {
    setSelectedProjectId(id);
  };

  const handleCloseProject = () => {
    setSelectedProjectId(null);
  };

  const handleStepClick = (idx: number) => {
    if (!activeProject) return;
    const totalSteps = activeProject.videoSteps.length;
    const targetProgress = (idx / totalSteps) * 100 + 5;
    setPlayProgress(targetProgress);
    setActiveStepIndex(idx);
  };

  // Filter project arrays
  const filteredProjects = projectsList.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase())) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredProject = projectsList[featuredIndex] || projectsList[0];

  // Grouping for rows
  const coreProductions = projectsList.filter(p => p.category === 'production' || p.id === 'creator-insight' || p.id === 'lifescore-predictor' || p.id === 'prompt-arena');
  const researchProjects = projectsList.filter(p => p.category === 'research' || p.id === 'dark-web-marketplaces' || p.id === 'cloud-ids');
  const advancedPrototypes = projectsList.filter(p => p.category === 'prototype' || p.id === 'neurospark' || p.id === 'color-rush' || (!['production', 'research', 'prototype'].includes(p.category) && !['creator-insight', 'lifescore-predictor', 'prompt-arena', 'dark-web-marketplaces', 'cloud-ids', 'neurospark', 'color-rush'].includes(p.id)));

  return (
    <div className="relative min-h-full bg-[#050505] text-[#EDEDED] font-sans overflow-x-hidden selection:bg-white/10 selection:text-white pb-20">
      
      {/* Search Bar HUD floating on the upper-right */}
      <div className="absolute top-4 right-6 z-30 hidden lg:flex items-center gap-2 bg-[#0E0E10] border border-white/10 px-3 py-1.5 rounded-lg">
        <Search className="w-3.5 h-3.5 text-white/40" />
        <input 
          type="text"
          placeholder="Filter repository..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent text-xs outline-none border-none text-white/9w-48 placeholder-white/30"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="text-[10px] text-white/40 hover:text-white">
            CLEAR
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!selectedProjectId ? (
          <motion.div
            key="billboard-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-6 md:p-8 space-y-12"
          >
            {/* NETFLIX BILLBOARD HERO SECTION */}
            {featuredProject && (
              <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.9)] bg-neutral-950 aspect-[21/9] flex flex-col justify-end">
                
                {/* Simulated Poster Image / Design Canvas */}
                <div className={`absolute inset-0 bg-gradient-to-t ${featuredProject.bannerGradient} to-transparent z-0 opacity-80`} />
                
                {/* Tech network lattice animation placeholder or grid accent */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.02)_0%,transparent_70%)] z-0" />
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050505] to-transparent z-10" />

                <div className="relative z-20 p-6 md:p-10 max-w-2xl space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-sans tracking-widest bg-white/10 text-white border border-white/20 px-2.5 py-0.5 rounded-full uppercase">
                      Featured Project
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] font-sans text-white/50">
                      Production Ready
                    </span>
                  </div>

                  <h1 className="text-xl md:text-3xl font-bold tracking-tight text-white leading-tight">
                    {featuredProject.title}
                  </h1>

                  <p className="text-xs md:text-sm text-white/70 font-sans leading-relaxed line-clamp-2 md:line-clamp-3">
                    {featuredProject.tagline}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {featuredProject.technologies.slice(0, 5).map(tech => (
                      <span key={tech} className="text-[9px] font-mono bg-black/60 text-white/80 border border-white/10 px-2 py-0.5 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-3 pt-3">
                    <button 
                      onClick={() => handleOpenProject(featuredProject.id)}
                      className="px-5 py-2 bg-white text-black font-semibold rounded-lg text-xs tracking-tight hover:bg-white/90 cursor-pointer flex items-center gap-1.5 shadow-lg active:scale-95 transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-black" />
                      <span>Inspect Spec Sheet</span>
                    </button>
                    
                    {featuredProject.githubUrl && (
                      <a 
                        href={featuredProject.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 bg-black/60 hover:bg-black/90 border border-white/10 text-white rounded-lg hover:border-white/30 transition-all cursor-pointer"
                        title="GitHub Respository"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {featuredProject.demoUrl && (
                      <a 
                        href={featuredProject.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 bg-black/60 hover:bg-black/90 border border-white/10 text-white rounded-lg hover:border-white/30 transition-all cursor-pointer"
                        title="Live Demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Hero indicator dots */}
                <div className="absolute right-6 bottom-6 z-20 flex gap-1.5">
                  {projectsList.map((_, i) => (
                    <button 
                      key={i}
                      onClick={() => setFeaturedIndex(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${featuredIndex === i ? 'w-4 bg-white' : 'w-1.5 bg-white/30'}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* SHELF RAIL ROW 1: "Top Picks / Production Work" */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-blue-500 rounded-full" />
                <h2 className="text-sm font-bold tracking-wider text-white/95 uppercase font-mono">
                  Live & High Output Systems
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {coreProductions.map(proj => (
                  <ProjectShelfCard key={proj.id} project={proj} onSelect={handleOpenProject} />
                ))}
              </div>
            </div>

            {/* SHELF RAIL ROW 2: "Cutting Edge Research & Security" */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-orange-500 rounded-full" />
                <h2 className="text-sm font-bold tracking-wider text-white/95 uppercase font-mono">
                  Research Laboratories & Cybersecurity
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {researchProjects.map(proj => (
                  <ProjectShelfCard key={proj.id} project={proj} onSelect={handleOpenProject} />
                ))}
              </div>
            </div>

            {/* SHELF RAIL ROW 3: "Under-Active Dev & Local Modules" */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-purple-500 rounded-full" />
                <h2 className="text-sm font-bold tracking-wider text-white/95 uppercase font-mono">
                  Full Stack Apps & Native Engines
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {advancedPrototypes.map(proj => (
                  <ProjectShelfCard key={proj.id} project={proj} onSelect={handleOpenProject} />
                ))}
              </div>
            </div>

          </motion.div>
        ) : (
          
          /* DETAILED IMMERSIVE EXPERIENCE PAGE (NETFLIX DETAILS PANEL OVERLAY) */
          activeProject && (
            <motion.div
              key="project-details"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="p-6 md:p-8 space-y-6"
            >
              {/* Back Button and Controls Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={handleCloseProject}
                    className="px-3.5 py-1.5 border border-white/10 hover:border-white/35 rounded-lg bg-zinc-900 text-xs font-mono tracking-tight text-white/85 hover:text-white cursor-pointer active:scale-95 transition-all"
                  >
                    ← Back to Registry
                  </button>
                  <div className="hidden sm:flex items-center gap-2">
                    <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                      PATH: /SYSTEMS/SPEC-SHEET/{activeProject.id}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {activeProject.githubUrl && (
                    <a 
                      href={activeProject.githubUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="px-3 py-1.5 border border-white/5 hover:border-white/20 bg-neutral-900 text-white rounded-lg text-xs font-mono tracking-tight cursor-pointer flex items-center gap-1.5 transition-all"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Source Code</span>
                    </a>
                  )}
                  {activeProject.demoUrl && (
                    <a 
                      href={activeProject.demoUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/30 text-blue-400 rounded-lg text-xs font-mono tracking-tight cursor-pointer flex items-center gap-1.5 transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Live Site</span>
                    </a>
                  )}
                </div>
              </div>

              {/* IMMERSIVE HEADER BANNER */}
              <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#09090b]">
                <div className={`absolute inset-0 bg-gradient-to-t ${activeProject.bannerGradient} to-[#050505]/40 opacity-80 z-0`} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.03),transparent)] z-0" />
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-zinc-950 to-transparent z-10" />

                <div className="relative z-20 p-6 md:p-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6 pointer-events-none">
                  <div className="space-y-2 max-w-2xl">
                    <span className="text-[9px] font-mono border border-white/10 bg-white/5 text-white/90 uppercase tracking-widest px-2.5 py-0.5 rounded shadow">
                      {activeProject.category}
                    </span>
                    <h2 className="text-xl md:text-3xl font-bold tracking-tight text-white leading-tight pt-2">
                      {activeProject.title}
                    </h2>
                    <p className="text-xs md:text-sm text-white/70 mt-1.5 font-sans leading-relaxed">
                      {activeProject.tagline}
                    </p>
                  </div>

                  {/* Quantitative metrics indicators */}
                  <div className="flex gap-4 border-l border-white/10 pl-6 shrink-0">
                    {activeProject.metrics.map((m, i) => (
                      <div key={i} className="text-right">
                        <div className="text-[10px] font-mono text-white/30 uppercase tracking-wider">
                          {m.label}
                        </div>
                        <div className="text-base font-semibold text-white tracking-tight">
                          {m.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* TAB NAVIGATION CHIPS */}
              <div className="flex flex-wrap gap-1.5 border-b border-white/5 pb-2">
                <TabButton 
                  active={activeTab === 'specs'} 
                  onClick={() => setActiveTab('specs')} 
                  icon={<BookOpen className="w-3.5 h-3.5" />}
                  label="System Specifications" 
                />
                <TabButton 
                  active={activeTab === 'video'} 
                  onClick={() => setActiveTab('video')} 
                  icon={<Tv className="w-3.5 h-3.5" />}
                  label="Interactive Playback Simulator" 
                />
                <TabButton 
                  active={activeTab === 'topology'} 
                  onClick={() => setActiveTab('topology')} 
                  icon={<Workflow className="w-3.5 h-3.5" />}
                  label="System Topology Map" 
                />
                <TabButton 
                  active={activeTab === 'retrospective'} 
                  onClick={() => setActiveTab('retrospective')} 
                  icon={<Award className="w-3.5 h-3.5" />}
                  label="Challenges & Lessons" 
                />
                <TabButton 
                  active={activeTab === 'casestudy'} 
                  onClick={() => setActiveTab('casestudy')} 
                  icon={<Printer className="w-3.5 h-3.5" />}
                  label="Download Case Study" 
                />
              </div>

              {/* MAIN CONTENT DISPLAY FOR ACTIVE TAB */}
              <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 min-h-[380px] shadow-lg">
                <AnimatePresence mode="wait">
                  
                  {/* TAB 1: SPEC SHEET */}
                  {activeTab === 'specs' && (
                    <motion.div
                      key="specs-tab"
                      initial={{ opacity: 0, x: 5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-5 text-left">
                          <div>
                            <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-blue-400 pb-1 border-b border-white/5">
                              01 // Project Abstract & Overview
                            </h3>
                            <p className="text-[13px] text-white/80 leading-relaxed font-sans font-medium mt-2">
                              {activeProject.overview}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 bg-zinc-900/30 border border-white/5 rounded-xl space-y-1.5 hover:bg-zinc-900/40 transition-colors">
                              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block font-bold">Why I Built This</span>
                              <p className="text-xs text-zinc-350 leading-relaxed font-sans font-medium">{activeProject.whyIBuiltThis}</p>
                            </div>

                            <div className="p-4 bg-emerald-950/10 border border-emerald-500/10 rounded-xl space-y-1.5 hover:bg-emerald-950/20 transition-colors">
                              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block font-bold">Measured Outcomes</span>
                              <p className="text-xs text-zinc-350 leading-relaxed font-sans font-medium">{activeProject.results}</p>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-white/40 pb-2 border-b border-white/5 mb-3">
                              02 // High-End Micro-Features
                            </h3>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {activeProject.features.map((feat, i) => (
                                <li key={i} className="flex gap-2 text-xs font-medium text-white/70">
                                  <CheckCircle className="w-4 h-4 text-blue-500 shrink-0" />
                                  <span>{feat}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* ENGINEERING DECISIONS SECTION */}
                          <div className="space-y-3.5 pt-2">
                            <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-blue-400 pb-2 border-b border-white/5">
                              03 // Critical Engineering Decisions
                            </h3>
                            <div className="space-y-3.5">
                              {activeProject.engineeringDecisions?.map((dec, i) => (
                                <div key={i} className="border border-zinc-800 bg-zinc-950 rounded-xl overflow-hidden shadow-inner text-left hover:border-zinc-700 transition-colors">
                                  <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 flex items-center justify-between">
                                    <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">DECISION // {dec.decision}</span>
                                    <span className="text-[8px] font-mono bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20 px-2 py-0.5 rounded">INDEXED</span>
                                  </div>
                                  <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
                                    <div className="space-y-1">
                                      <span className="text-[9px] font-bold font-mono uppercase text-zinc-400 tracking-wider">Reasoning</span>
                                      <p className="text-zinc-300 font-medium leading-relaxed">{dec.reason}</p>
                                    </div>
                                    <div className="space-y-1 border-t md:border-t-0 md:border-x border-zinc-900/80 pt-3 md:pt-0 md:px-4">
                                      <span className="text-[9px] font-bold font-mono uppercase text-amber-500/85 tracking-wider font-semibold">Tradeoff</span>
                                      <p className="text-zinc-300 font-medium leading-relaxed">{dec.tradeoff}</p>
                                    </div>
                                    <div className="space-y-1 border-t md:border-t-0 pt-3 md:pt-0 md:pl-2">
                                      <span className="text-[9px] font-bold font-mono uppercase text-emerald-400 tracking-wider font-semibold">Outcome Secured</span>
                                      <p className="text-zinc-300 font-medium leading-relaxed">{dec.outcome}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="bg-[#111] border border-white/10 rounded-xl p-5 space-y-4 h-fit">
                          <h4 className="text-[11px] font-bold uppercase font-mono tracking-wider text-white/50">
                            Engineering Specs
                          </h4>
                          
                          <div className="space-y-3.5 text-left">
                            <div>
                              <div className="text-[10px] uppercase font-mono tracking-wide text-white/40 mb-1">
                                Repository Domain
                              </div>
                              <span className="text-xs font-mono bg-black px-2.5 py-1 rounded inline-block text-white border border-white/5">
                                darshan-kumar-k-r / {activeProject.id}
                              </span>
                            </div>

                            <div>
                              <div className="text-[10px] uppercase font-mono tracking-wide text-white/40 mb-1.5">
                                Engine Technologies
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {activeProject.technologies.map(tech => (
                                  <span key={tech} className="text-[10px] font-mono bg-black text-white/90 border border-white/5 px-2 py-0.5 rounded">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="pt-2 border-t border-white/5">
                              <div className="text-[10px] uppercase font-mono tracking-wide text-white/40 mb-1">
                                Operational Status
                              </div>
                              <span className={`text-[10px] font-mono uppercase font-bold tracking-wider rounded px-2 py-0.5 inline-block
                                ${activeProject.status === 'production' 
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                  : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                }
                              `}>
                                ● {activeProject.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 2: INTERACTIVE VIDEO PLAYBACK SIMULATOR */}
                  {activeTab === 'video' && (
                    <motion.div
                      key="video-tab"
                      initial={{ opacity: 0, x: 5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Video Mock Container Player */}
                        <div className="lg:col-span-2 space-y-4">
                          <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-white/40 pb-1 border-b border-white/5">
                            {activeProject.videoMockTitle}
                          </h3>

                          {/* Monitor Frame */}
                          <div className="relative w-full aspect-[16/10] bg-[#020202] border border-white/10 rounded-xl overflow-hidden flex flex-col justify-between shadow-2xl">
                            
                            {/* CRT Line accents and scan highlights */}
                            <div className="absolute inset-0 bg-radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.5)) pointer-events-none z-10" />
                            <div className="absolute top-2 left-3 z-35 flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest leading-none">
                                {isPlaying ? 'LIVE STREAMING INFERENCE FEED' : 'STREAM STANDBY'}
                              </span>
                            </div>

                            {/* Main screen visuals */}
                            <div className="flex-1 flex flex-col justify-center items-center p-6 relative">
                              
                              <AnimatePresence mode="wait">
                                {isPlaying ? (
                                  <motion.div 
                                    key="playing-hud"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="w-full h-full flex flex-col justify-between pt-6 font-mono text-xs"
                                  >
                                    <div className="grid grid-cols-3 gap-3">
                                      <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg">
                                        <div className="text-[9px] text-[#27C93F] uppercase tracking-wider mb-1">DATA FLOW INGRESS</div>
                                        <div className="text-sm font-semibold text-white">{(playProgress * 14.5).toFixed(0)} records</div>
                                      </div>
                                      <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg">
                                        <div className="text-[9px] text-blue-400 uppercase tracking-wider mb-1">CONCURRENT PEAK</div>
                                        <div className="text-sm font-semibold text-white">{(Math.sin(playProgress / 10) * 150 + 400).toFixed(0)} req/s</div>
                                      </div>
                                      <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg">
                                        <div className="text-[9px] text-amber-400 uppercase tracking-wider mb-1">STATION LATENCY</div>
                                        <div className="text-sm font-semibold text-white">{(0.12 + Math.abs(Math.sin(playProgress)) * 0.05).toFixed(2)}s</div>
                                      </div>
                                    </div>

                                    {/* Rotating micro timeline log lines representing code logs */}
                                    <div className="bg-black/90 border border-white/5 rounded p-3 h-24 overflow-y-auto text-[9px] text-emerald-400/90 leading-tight space-y-1 mt-4">
                                      <div>[2026-06-17T07:33:26] DevOS Node sync initialization...</div>
                                      <div>[00:0{Math.floor(playProgress/25)}] Event thread pooling loaded successfully.</div>
                                      {playProgress > 20 && <div>[00:0{Math.floor(playProgress/25)}] Target nodes handshake completed. Ingesting active structures.</div>}
                                      {playProgress > 45 && <div>[00:0{Math.floor(playProgress/25)}] Evaluating operational metrics parameters on classification models.</div>}
                                      {playProgress > 70 && <div>[00:0{Math.floor(playProgress/25)}] Real-time websocket signal dispatch complete. Dashboard updated.</div>}
                                      {playProgress >= 100 && <div>[SYSTEM] Pipeline complete. Continuous polling loop inactive.</div>}
                                    </div>
                                  </motion.div>
                                ) : (
                                  <motion.div 
                                    key="idle-hud"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center text-center space-y-3 cursor-pointer"
                                    onClick={() => { setIsPlaying(true); if (playProgress >= 100) setPlayProgress(0); }}
                                  >
                                    <div className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 flex items-center justify-center transition-all shadow-lg active:scale-95 duration-200">
                                      <Play className="w-6 h-6 text-white fill-white ml-1" />
                                    </div>
                                    <div className="text-xs font-mono text-white/50 tracking-wider">
                                      {playProgress >= 100 ? 'SIMULATION SYSTEM HALTED - CLICK TO RESTART' : 'CLICK TO BOOT SYSTEM DEMO PIPELINE'}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>

                            </div>

                            {/* Control Slider Trackbar Bar */}
                            <div className="bg-neutral-950 border-t border-white/5 px-4 py-3 flex items-center gap-4 z-20">
                              <button 
                                onClick={() => { setIsPlaying(!isPlaying); if (playProgress >= 100) setPlayProgress(0); }}
                                className="text-white hover:text-blue-400 transition-colors focus:outline-none cursor-pointer"
                              >
                                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                              </button>

                              <button 
                                onClick={() => { setPlayProgress(0); setIsPlaying(false); }}
                                className="text-white/60 hover:text-white transition-colors focus:outline-none cursor-pointer"
                                title="Restart Demo"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>

                              {/* Clickable range trackbar */}
                              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden relative cursor-pointer">
                                <div 
                                  className="h-full bg-blue-500 rounded-full relative"
                                  style={{ width: `${playProgress}%` }}
                                >
                                  <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow border border-blue-500"></span>
                                </div>
                              </div>

                              <span className="text-[10px] font-mono text-zinc-500 select-none">
                                {Math.floor(playProgress)}%
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Steps List Indicator */}
                        <div className="space-y-4">
                          <h4 className="text-[11px] font-bold uppercase font-mono tracking-wider text-white/50">
                            Automation Milestones
                          </h4>

                          <div className="space-y-2.5">
                            {activeProject.videoSteps.map((step, idx) => {
                              const isActive = activeStepIndex === idx;
                              const isPassed = playProgress > (idx / activeProject.videoSteps.length) * 100;

                              return (
                                <button
                                  key={idx}
                                  onClick={() => handleStepClick(idx)}
                                  className={`w-full text-left p-3 border rounded-xl flex items-start gap-3 transition-all cursor-pointer
                                    ${isActive 
                                      ? 'bg-blue-500/10 border-blue-500/30 shadow' 
                                      : 'bg-neutral-900/40 border-white/5 hover:border-white/15'
                                    }
                                  `}
                                >
                                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 leading-none
                                    ${isActive 
                                      ? 'bg-blue-500 text-white' 
                                      : isPassed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-black text-white/40'
                                    }
                                  `}>
                                    {step.timestamp}
                                  </span>
                                  
                                  <div className="space-y-0.5 min-w-0">
                                    <div className={`text-xs font-medium truncate ${isActive ? 'text-white font-semibold' : 'text-white/70'}`}>
                                      {step.label}
                                    </div>
                                    <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
                                      {step.status === 'ACTIVE' && isActive ? 'EXECUTING DATA...' : step.status}
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}

                  {/* TAB 3: SYSTEM TOPOLOGY DIAGRAM */}
                  {activeTab === 'topology' && (
                    <motion.div
                      key="topology-tab"
                      initial={{ opacity: 0, x: 5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      className="space-y-6"
                    >
                      <div className="flex flex-col lg:flex-row gap-6">
                        
                        {/* Interactive diagram box using absolute mapping pointers */}
                        <div className="flex-1 bg-[#020202] border border-white/10 rounded-xl p-4 min-h-[380px] flex flex-col justify-between relative overflow-hidden shadow-2xl">
                          <div className="absolute top-2 left-3 z-20 flex items-center justify-between w-[95%]">
                            <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                              SYSTEM SCHEMATIC // VECTOR TOPOLOGY MAP
                            </span>

                            <button 
                              onClick={() => {
                                setPathAnimationStep((prev) => (prev + 1) % activeProject.architectureEdges.length);
                              }}
                              className="px-2.5 py-1 text-[10px] font-mono border border-white/10 hover:border-white/20 bg-neutral-900 rounded text-blue-400 font-bold active:scale-95 transition-all cursor-pointer"
                            >
                              {pathAnimationStep === -1 ? 'Trigger Story Path Engine' : `Walk step: ${pathAnimationStep + 1}/${activeProject.architectureEdges.length}`}
                            </button>
                          </div>

                          {/* Node grid board representation */}
                          <div id="svg-topology-container" className="flex-1 relative w-full h-[320px] bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:20px_20px] mt-6">
                            
                            {/* SVG connections drawing overlay */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                              {activeProject.architectureEdges.map((edge, idx) => {
                                const fromNode = activeProject.architectureNodes.find(n => n.id === edge.from);
                                const toNode = activeProject.architectureNodes.find(n => n.id === edge.to);
                                if (!fromNode || !toNode) return null;

                                const isHighlighted = pathAnimationStep === idx || (pathAnimationStep === -1 && edge.animated);

                                return (
                                  <g key={idx}>
                                    <line 
                                      x1={`${fromNode.x}%`} 
                                      y1={`${fromNode.y}px`} 
                                      x2={`${toNode.x}%`} 
                                      y2={`${toNode.y}px`} 
                                      stroke={isHighlighted ? '#3b82f6' : 'rgba(255,255,255,0.1)'} 
                                      strokeWidth={isHighlighted ? 2.5 : 1.25}
                                      strokeDasharray={edge.animated || isHighlighted ? '5 5' : 'none'}
                                      className={edge.animated || isHighlighted ? 'animate-dash' : ''}
                                    />
                                    {isHighlighted && (
                                      <text
                                        x={`${(fromNode.x + toNode.x) / 2}%`}
                                        y={`${(fromNode.y + toNode.y) / 2 - 6}px`}
                                        fill="#3b82f6"
                                        textAnchor="middle"
                                        className="text-[9px] font-mono font-bold bg-black fill-blue-400"
                                      >
                                        {edge.label}
                                      </text>
                                    )}
                                  </g>
                                );
                              })}
                            </svg>

                            {/* Node blocks mapping absolute styles */}
                            {activeProject.architectureNodes.map((node) => {
                              const isSelected = selectedNode?.id === node.id;
                              
                              let typeColor = 'from-blue-500/20 to-blue-900/10 text-blue-400 border-blue-500/30';
                              if (node.type === 'database') typeColor = 'from-emerald-500/20 to-emerald-950/10 text-emerald-400 border-emerald-500/30';
                              if (node.type === 'external') typeColor = 'from-red-500/20 to-red-950/10 text-red-450 border-red-500/30';
                              if (node.type === 'client') typeColor = 'from-pink-500/20 to-pink-950/20 text-pink-400 border-pink-500/30';

                              return (
                                <button
                                  key={node.id}
                                  onClick={() => setSelectedNode(node)}
                                  style={{ left: `${node.x}%`, top: `${node.y}px`, transform: 'translateX(-50%)' }}
                                  className={`absolute z-10 px-3 py-2 rounded-xl border bg-neutral-950 text-left min-w-[125px] transition-all cursor-pointer select-none focus:outline-none
                                    ${isSelected 
                                      ? 'ring-2 ring-blue-500 scale-105 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
                                      : 'border-white/10 hover:border-white/30 hover:scale-102'
                                    }
                                  `}
                                >
                                  <div className="text-[8px] font-mono text-white/40 uppercase tracking-widest leading-none mb-1">
                                    {node.type}
                                  </div>
                                  <div className="text-xs font-semibold text-white tracking-tight">
                                    {node.label}
                                  </div>
                                </button>
                              );
                            })}
                          </div>

                          <div className="text-[10px] font-mono text-zinc-500 bg-black/40 p-2 rounded border border-white/5 mt-2">
                            Interactive Map: Click nodes above to inspect, or run path engine logic to trace routing pathways.
                          </div>
                        </div>

                        {/* Sidebar details layout */}
                        <div className="w-full lg:w-80 space-y-4">
                          {selectedNode ? (
                            <div className="bg-[#111] border border-white/10 rounded-xl p-5 space-y-4 shadow-sm">
                              <span className="text-[9px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-semibold uppercase">
                                NODE DETAIL INSPECTOR
                              </span>

                              <div className="space-y-1">
                                <h4 className="text-sm font-semibold text-white tracking-tight">
                                  {selectedNode.label}
                                </h4>
                                <span className="text-[9px] font-mono text-zinc-500 uppercase">
                                  Type: {selectedNode.type} // Node_ID: {selectedNode.id}
                                </span>
                              </div>

                              <p className="text-xs text-white/70 leading-relaxed font-sans">
                                {selectedNode.description}
                              </p>

                              <div className="pt-2 border-t border-white/5 space-y-2">
                                <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                                  Operational Status
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                  <span className="text-xs font-mono font-medium text-emerald-400">Node telemetry optimal (100%)</span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-[#111] border border-white/5 rounded-xl p-5 text-center text-xs text-white/30 h-40 flex items-center justify-center">
                              Select a node on the system map to verify metrics.
                            </div>
                          )}

                          <div className="space-y-2">
                            <h4 className="text-[11px] font-bold uppercase font-mono tracking-wider text-white/50">
                              System Story Sequence
                            </h4>

                            <div className="p-4 bg-zinc-950 rounded-xl border border-white/5 space-y-2 text-xs text-white/75 leading-relaxed font-sans">
                              {activeProject.architectureStory.map((storyPoint, idx) => (
                                <div key={idx} className="flex gap-2.5 items-start">
                                  <span className="text-[9px] font-mono bg-white/10 px-1.5 py-0.2 rounded font-bold text-white mt-0.5 shrink-0">
                                    {(idx + 1)}
                                  </span>
                                  <span>{storyPoint}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}

                  {/* TAB 4: RETROSPECTIVE */}
                  {activeTab === 'retrospective' && (
                    <motion.div
                      key="retro-tab"
                      initial={{ opacity: 0, x: 5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        <div className="p-5 bg-red-950/10 border border-red-500/10 rounded-2xl space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full" />
                            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-red-400">
                              Engineering Obstacles & Challenges
                            </h4>
                          </div>
                          <p className="text-xs text-white/80 leading-relaxed font-medium font-sans">
                            {activeProject.challenges}
                          </p>
                        </div>

                        <div className="p-5 bg-emerald-950/10 border border-emerald-500/10 rounded-2xl space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-emerald-400">
                              Key Evolutionary Takeaways
                            </h4>
                          </div>
                          <p className="text-xs text-white/80 leading-relaxed font-medium font-sans">
                            {activeProject.learnings}
                          </p>
                        </div>

                      </div>

                      <div className="pt-2">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
                          <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-white/50">
                            Roadmap & Future Modifications
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {activeProject.futureImprovements.map((imp, idx) => (
                            <div key={idx} className="p-3.5 bg-[#111] border border-white/10 rounded-xl flex gap-3 items-center">
                              <span className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400 flex items-center justify-center shrink-0 font-bold">
                                {idx + 1}
                              </span>
                              <span className="text-xs text-white/80 font-medium font-sans">
                                {imp}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 5: DOWNLOADABLE CASE STUDY VIEW */}
                  {activeTab === 'casestudy' && (
                    <motion.div
                      key="casestudy-tab"
                      initial={{ opacity: 0, x: 5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10">
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold text-white">Print Professional Project Dossier</h4>
                          <p className="text-[11px] text-white/50">Generates a clean black-and-white print-styled layout for your records or portfolio sharing.</p>
                        </div>

                        <button 
                          onClick={() => window.print()}
                          className="px-4 py-2 bg-white text-black font-semibold rounded-lg text-xs leading-none hover:bg-white/95 cursor-pointer flex items-center gap-1.5 active:scale-95 transition-all shadow"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Print Specification / Save PDF</span>
                        </button>
                      </div>

                      {/* CASE STUDY CONTAINER DESIGN OPTIMIZED FOR PRINT AND PREVIEW */}
                      <div id="print-case-study" className="bg-white text-black p-8 rounded-xl border border-neutral-300 font-sans space-y-6 shadow-2xl relative overflow-hidden text-left" style={{ pageBreakInside: 'avoid' }}>
                        
                        {/* Dossier absolute watermark */}
                        <div className="absolute top-4 right-4 text-right border-l-2 border-neutral-800 pl-3">
                          <div className="text-[10px] font-mono font-bold tracking-widest text-neutral-800 uppercase leading-none">DEVOS DOSSIER SPEC</div>
                          <div className="text-[8px] font-mono text-neutral-500 mt-1 uppercase">DOCUMENT ID // DARSHANKUMAR_KR</div>
                        </div>

                        <div className="space-y-1 border-b pb-4 border-neutral-300">
                          <span className="text-[9px] font-mono bg-neutral-900 text-white rounded px-2 py-0.5 inline-block uppercase tracking-wider font-bold">
                            DevOS Dynamic Portfolio Specifications
                          </span>
                          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 pt-2">
                            {activeProject.title}
                          </h2>
                          <p className="text-xs text-neutral-600 italic mt-1 leading-relaxed">
                            {activeProject.tagline}
                          </p>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-3 gap-2 py-3 border-b border-neutral-200">
                          {activeProject.metrics.map((m, i) => (
                            <div key={i} className="text-left">
                              <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider leading-none">
                                {m.label}
                              </div>
                              <div className="text-sm font-bold text-neutral-800 mt-1">
                                {m.value}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Specs Section */}
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <h4 className="text-xs font-mono font-bold tracking-widest text-neutral-700 uppercase">
                              1.0 Executive Architecture & Summary
                            </h4>
                            <p className="text-xs text-neutral-700 leading-relaxed font-sans">
                              {activeProject.overview}
                            </p>
                          </div>

                          <div className="space-y-2.5">
                            <h4 className="text-xs font-mono font-bold tracking-widest text-neutral-700 uppercase">
                              2.0 Engineering Micro-Capabilities
                            </h4>
                            <ul className="list-disc pl-4 space-y-1 text-xs text-neutral-800 leading-relaxed">
                              {activeProject.features.map((feat, i) => (
                                <li key={i}>{feat}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-xs font-mono font-bold tracking-widest text-neutral-700 uppercase">
                              3.0 Core Technology Mapping
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                              {activeProject.technologies.map(tech => (
                                <span key={tech} className="text-[10px] font-mono border border-neutral-300 bg-neutral-100 text-neutral-900 px-2 py-0.5 rounded">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-neutral-200 text-xs">
                            <div className="space-y-1">
                              <span className="font-bold text-neutral-800 block">Critical Challenges encountered:</span>
                              <p className="text-neutral-600 leading-relaxed">{activeProject.challenges}</p>
                            </div>
                            <div className="space-y-1">
                              <span className="font-bold text-neutral-800 block">Identified Technical Learnings:</span>
                              <p className="text-neutral-600 leading-relaxed">{activeProject.learnings}</p>
                            </div>
                          </div>
                        </div>

                        {/* Printable stamp */}
                        <div className="pt-6 border-t border-neutral-200 flex justify-between items-end text-[10px] font-mono text-neutral-500">
                          <div>
                            <div>DEVOS SIGNATURE: <strong>DARSHAN KUMAR K R</strong></div>
                            <div>LOCATION COORDINATES: <strong>BENGALURU, INDIA</strong></div>
                          </div>
                          <div className="text-right">
                            <div>TIMESTAMP: <strong>2026-06-17</strong></div>
                            <div>STATUS: <strong>VERIFIED BLUEPRINT</strong></div>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
}

// Sub-component: Netflix Horizontal Shelf Cards
interface ProjectCardProps {
  key?: string;
  project: ProjectDetail;
  onSelect: (id: string) => void;
}

function ProjectShelfCard({ project, onSelect }: ProjectCardProps) {
  return (
    <motion.div
      onClick={() => onSelect(project.id)}
      whileHover={{ y: -6, scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-neutral-950 p-5 cursor-pointer hover:border-zinc-700 hover:shadow-xl transition-all duration-300 flex flex-col justify-between min-h-[195px] select-none group"
    >
      {/* Background visual neon dynamic accent glow */}
      <div className={`absolute inset-0 bg-gradient-to-t ${project.bannerGradient} to-transparent z-0 opacity-20 group-hover:opacity-35 transition-opacity duration-300`} />
      
      <div className="relative z-10 space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-[#3b82f6] uppercase tracking-widest">
            {project.status}
          </span>
          <span className="text-[9px] font-mono border border-zinc-700 bg-zinc-900/60 text-white/90 px-2 py-0.5 rounded uppercase font-semibold">
            {project.logo}
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="text-[13px] font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors duration-200">
            {project.title}
          </h3>
          <p className="text-[11px] text-zinc-400 leading-normal line-clamp-2">
            {project.tagline}
          </p>
        </div>
      </div>

      {/* Metrics board */}
      <div className="relative z-10 border-t border-zinc-800/80 pt-3.5 mt-auto flex items-center justify-between">
        <div className="flex gap-4">
          {project.metrics.slice(0, 2).map((m, i) => (
            <div key={i} className="text-left">
              <span className="text-[8px] font-mono text-zinc-500 block uppercase tracking-wider">{m.label}</span>
              <span className="text-[10px] font-bold text-zinc-200 mt-0.5 block">{m.value}</span>
            </div>
          ))}
        </div>

        {/* Floating action specs button */}
        <span className="text-[10px] font-mono text-blue-400 font-bold opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-350 flex items-center gap-1 shrink-0">
          <span>INSPECT</span>
          <ChevronRight className="w-3 h-3" />
        </span>
      </div>
    </motion.div>
  );
}

// Sub-component: Tab action button
interface TabBtnProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function TabButton({ active, onClick, icon, label }: TabBtnProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-2.5 border rounded-xl text-xs font-mono tracking-tight cursor-pointer transition-all flex items-center gap-1.5 active:scale-95 select-none
        ${active 
          ? 'bg-white text-black border-white font-bold shadow' 
          : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
        }
      `}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
