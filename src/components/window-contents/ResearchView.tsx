/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, 
  Layers, 
  Database, 
  BarChart4, 
  Compass, 
  Calendar, 
  ExternalLink, 
  Cpu, 
  Binary, 
  ShieldAlert, 
  LineChart, 
  Linkedin, 
  CheckCircle2, 
  Award,
  BookOpen,
  Eye,
  Server,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Core Dataset stats mock representation
const MARKETPLACE_CATEGORIES = [
  { name: 'Illicit Narcotics', count: '48%', color: 'bg-red-500' },
  { name: 'Malware & Exploits', count: '22%', color: 'bg-orange-500' },
  { name: 'Forged Docs & IDs', count: '15%', color: 'bg-amber-500' },
  { name: 'Leaked Credentials', count: '10%', color: 'bg-blue-500' },
  { name: 'Ancillary Services', count: '5%', color: 'bg-emerald-500' }
];

const JOURNEY_TIMELINES = [
  {
    phase: 'Phase 01 // Ideation & Ethics Approval',
    date: 'Q3 2024',
    title: 'Research Sandbox Conception',
    desc: 'Established operational guidelines under deep net crawling ethics. Designed isolation bounds for safe scraping of public Onion network forums.',
    status: 'Completed'
  },
  {
    phase: 'Phase 02 // Automated Scraping & Ingestion',
    date: 'Q1 2025',
    title: 'Onion Network Crawling',
    desc: 'Constructed custom distributed Tor-proxy cluster to rotate IPs, avoiding market anti-scraping triggers. Safely ingested 1.2M individual listings from 8 distinct dark net marketplaces.',
    status: 'Completed'
  },
  {
    phase: 'Phase 03 // ML Model Designing',
    date: 'Q3 2025',
    title: 'Stylometry & NLP Models',
    desc: 'Engineered feature spaces containing TF-IDF lexical structures, emoji usage metrics, and cryptopayment hashes. Evaluated unsupervised clusters via DBSCAN and TSNE.',
    status: 'Completed'
  },
  {
    phase: 'Phase 04 // Peer Review & Formatting',
    date: 'Q4 2025',
    title: 'IEEE Formatting & Undergoing Review',
    desc: 'Drafted paper. Underwent double-blind peer review, evaluating cryptographic hashes correlation & security classification paradigms.',
    status: 'Accepted'
  },
  {
    phase: 'Phase 05 // IEEE ICASI presentation',
    date: 'March 2026',
    title: 'Conference Milestone',
    desc: 'Presented findings at the 2026 International Conference on Applied System Innovation (ICASI), highlighting behavior correlations across cross-market vendors.',
    status: 'Published'
  }
];

export default function ResearchView() {
  const [activeTab, setActiveTab] = useState<'overview' | 'methodology' | 'findings' | 'journey'>('overview');
  const [selectedListingCategory, setSelectedListingCategory] = useState<number | null>(null);
  const [methodologyStep, setMethodologyStep] = useState(0);

  const linkedInPostUrl = "https://www.linkedin.com/posts/darshan-kumar-kr-905579284_excited-to-share-that-our-research-paper-ugcPost-7453106469220073472-Ugek/";

  const pipelineSteps = [
    { title: 'Ingestion', icon: Server, desc: 'Tor-proxy rotation pipeline crawling Tor addresses to scrape marketplace listings and forum threads safely.', status: 'Inactive - Offline' },
    { title: 'NLP Parsing', icon: Binary, desc: 'BERT embeddings parsing textual description vectors, extracting stylometric signatures and writing frequency logs.', status: 'Ready' },
    { title: 'Correlation', icon: Layers, desc: 'Analyzing overlapping PGP public keys, bitcoin destination hashes, and structural listings attributes.', status: 'Ready' },
    { title: 'Profiling', icon: Cpu, desc: 'Aggreating similarity clusters to isolate cross-market sellers and construct unified behavioral dossiers.', status: 'Optimal' }
  ];

  return (
    <div id="research-view-container" className="p-6 md:p-8 space-y-6 font-sans select-none text-white selection:bg-neutral-800">
      
      {/* HEADER SECTION */}
      <div className="border-b border-zinc-800/80 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-zinc-550 font-mono uppercase tracking-widest mb-1">
            <ShieldAlert className="w-4 h-4 text-orange-500" />
            <span>Academic Investigation Log // IEEE ICASI 2026</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white font-display">
            Dark Web Threat Intelligence Lab
          </h1>
          <p className="text-zinc-400 text-xs md:text-sm mt-1 max-w-xl">
            Model parameters, behavioral analytics, and stylometry pipelines for vendor correlation across encrypted marketplaces.
          </p>
        </div>

        {/* Publication indicator */}
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1.5 rounded-lg">
          <Award className="w-4 h-4 text-emerald-400" />
          <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
            IEEE Publication Complete // 2026
          </span>
        </div>
      </div>

      {/* TOP TAB NAV */}
      <div className="flex flex-wrap gap-1 border-b border-zinc-800 pb-2">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-xs font-mono tracking-tight rounded-lg cursor-pointer flex items-center gap-2 transition-all
            ${activeTab === 'overview' 
              ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold' 
              : 'border border-transparent text-zinc-400 hover:text-white hover:bg-neutral-900/40'
            }
          `}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Research Overview</span>
        </button>

        <button 
          onClick={() => setActiveTab('methodology')}
          className={`px-4 py-2 text-xs font-mono tracking-tight rounded-lg cursor-pointer flex items-center gap-2 transition-all
            ${activeTab === 'methodology' 
              ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold' 
              : 'border border-transparent text-zinc-400 hover:text-white hover:bg-neutral-900/40'
            }
          `}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Methodology & Dataset</span>
        </button>

        <button 
          onClick={() => setActiveTab('findings')}
          className={`px-4 py-2 text-xs font-mono tracking-tight rounded-lg cursor-pointer flex items-center gap-2 transition-all
            ${activeTab === 'findings' 
              ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold' 
              : 'border border-transparent text-zinc-400 hover:text-white hover:bg-neutral-900/40'
            }
          `}
        >
          <BarChart4 className="w-3.5 h-3.5" />
          <span>Findings & Scanned Gallery</span>
        </button>

        <button 
          onClick={() => setActiveTab('journey')}
          className={`px-4 py-2 text-xs font-mono tracking-tight rounded-lg cursor-pointer flex items-center gap-2 transition-all
            ${activeTab === 'journey' 
              ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold' 
              : 'border border-transparent text-zinc-400 hover:text-white hover:bg-neutral-900/40'
            }
          `}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Research Journey & Milestone</span>
        </button>
      </div>

      {/* DYNAMIC TAB BODY */}
      <div className="bg-neutral-950 border border-zinc-800 rounded-2xl p-6 min-h-[360px] shadow-2xl relative">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-4">
                  <span className="text-[10px] font-mono text-zinc-550 uppercase tracking-wider block">
                    PROJECT MANUSCRIPT ABSTRACT //
                  </span>
                  
                  <h3 className="text-base font-semibold text-zinc-100 font-display">
                    Vendor Profiling & Behaviour Analysis in Dark Web Marketplaces
                  </h3>

                  <p className="text-xs text-zinc-350 leading-relaxed font-sans">
                    Multi-platform encrypted commerce portals, operating under Tor routing layers, present deep challenges to cybersecurity analysts due to complete pseudonymity. This research introduces a holistic, automated stylometric and behavioral ingestion model designed to trace, map, and correlate vendor dossiers across disparate marketplaces.
                  </p>
                  
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans block">
                    By constructing lexical signature vectors (written styles, emoji patterns, correlation matrices of cryptopayment gateways), we prove that sellers often share digital fingerprints despite resetting IDs in different system databases. This decreases cyber investigation latency and uncovers key operation patterns.
                  </p>

                  {/* RESEARCH IMPACT DASHBOARD SECTION */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] font-mono text-zinc-550 uppercase tracking-widest block">
                      CORE RESEARCH KEYWORDS & FIELD IMPACT //
                    </span>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      <div className="p-3.5 bg-zinc-900/10 border border-zinc-800 rounded-xl space-y-1 hover:bg-zinc-900/20 transition-all text-left">
                        <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-wider block font-bold leading-tight">Listings Analyzed</span>
                        <div className="text-lg font-bold font-mono text-blue-400">25,000+</div>
                        <span className="text-[8px] text-zinc-500 block leading-tight">Unique Tor Shards</span>
                      </div>

                      <div className="p-3.5 bg-zinc-900/10 border border-zinc-800 rounded-xl space-y-1 hover:bg-zinc-900/20 transition-all text-left">
                        <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-wider block font-bold leading-tight">Platforms Studied</span>
                        <div className="text-lg font-bold font-mono text-orange-400">8 Marketplaces</div>
                        <span className="text-[8px] text-zinc-500 block leading-tight">Onion Networks</span>
                      </div>

                      <div className="p-3.5 bg-zinc-900/10 border border-zinc-800 rounded-xl space-y-1 hover:bg-zinc-900/20 transition-all text-left">
                        <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-wider block font-bold leading-tight">Vendor Matches</span>
                        <div className="text-lg font-bold font-mono text-emerald-400">1,200+ Profiles</div>
                        <span className="text-[8px] text-zinc-500 block leading-tight">Cross-link Identified</span>
                      </div>

                      <div className="p-3.5 bg-zinc-900/10 border border-zinc-800 rounded-xl space-y-1 hover:bg-zinc-900/20 transition-all text-left">
                        <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-wider block font-bold leading-tight">Publication Status</span>
                        <div className="text-lg font-bold font-mono text-purple-400">IEEE ICASI 2026</div>
                        <span className="text-[8px] text-zinc-500 block leading-tight">Accepted & Presented</span>
                      </div>

                      <div className="p-3.5 bg-zinc-900/10 border border-zinc-800 rounded-xl space-y-1 hover:bg-zinc-900/20 transition-all text-left col-span-2 sm:col-span-1">
                        <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-wider block font-bold leading-tight">Research Span</span>
                        <div className="text-lg font-bold font-mono text-amber-500">18 Months</div>
                        <span className="text-[8px] text-zinc-500 block leading-tight">End-to-End Trial</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-zinc-900/20 border border-zinc-800 rounded-xl space-y-2">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">
                      CORE RESEARCH KEYWORDS //
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {['Dark Web Intelligence', 'Stylometry Signature NLP', 'Cryptocurrency Correlation', 'Cross-market Profiling', 'DBSCAN Vendor Clustering', 'Onion Scraper Proxy'].map(kw => (
                        <span key={kw} className="text-[10px] font-mono bg-zinc-950 px-2.5 py-0.5 rounded border border-zinc-800 text-zinc-400 font-medium">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 bg-zinc-900/10 border border-zinc-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wide block border-b border-zinc-800 pb-2">
                      MANUSCRIPT DETAILS
                    </span>

                    <div className="space-y-2">
                      <div className="text-[10px] text-zinc-500 uppercase font-mono">Conference</div>
                      <div className="text-xs text-white font-semibold">IEEE International Conference on Applied System Innovation (ICASI) 2026</div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-[10px] text-zinc-500 uppercase font-mono">Current Status</div>
                      <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded uppercase font-bold inline-block">
                        PUBLISHED & ARCHIVED
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="text-[10px] text-zinc-500 uppercase font-mono">Primary Authors</div>
                      <div className="text-xs text-zinc-300">Darshan Kumar K R, Labs Syndicate</div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-zinc-800">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase block mb-2">
                      VERIFIABLE PUBLICATION LINKS
                    </span>
                    
                    <a 
                      href={linkedInPostUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 bg-blue-500/10 border border-blue-500/25 hover:bg-blue-500/20 text-blue-400 rounded-lg text-xs font-mono tracking-tight cursor-pointer flex items-center justify-center gap-2 font-bold transition-all active:scale-98"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                      <span>VISIT LINKEDIN POST</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: METHODOLOGY & DATASET */}
          {activeTab === 'methodology' && (
            <motion.div
              key="methodology"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Methodology Pipeline Interactive */}
                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">
                      THREAT PIPELINE PIPELINE INTERCONNECTED STAGES
                    </span>
                    <span className="text-[9px] font-mono text-blue-400 underline cursor-pointer" onClick={() => setMethodologyStep((prev) => (prev + 1) % pipelineSteps.length)}>
                      Click to cycle steps
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {pipelineSteps.map((step, i) => {
                      const StepIcon = step.icon;
                      const isSelected = methodologyStep === i;
                      return (
                        <div 
                          key={i}
                          onClick={() => setMethodologyStep(i)}
                          className={`p-4 rounded-xl border text-left cursor-pointer transition-all duration-200
                            ${isSelected 
                              ? 'bg-blue-500/10 border-blue-500/40 ring-1 ring-blue-500/20' 
                              : 'bg-zinc-950/50 border-zinc-800 hover:border-zinc-700'
                            }
                          `}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[9px] font-mono text-zinc-500">STAGE 0{i + 1}</span>
                            <StepIcon className={`w-4 h-4 ${isSelected ? 'text-blue-400' : 'text-zinc-550'}`} />
                          </div>
                          <h4 className="text-xs font-bold text-zinc-100 mb-1">{step.title}</h4>
                          <span className="text-[9px] font-mono text-zinc-500">{step.status}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Detail Panel for chosen step */}
                  <div className="p-3.5 bg-black/60 border border-zinc-800 rounded-xl">
                    <div className="flex items-center gap-1.5 text-[9px] font-mono text-blue-400 font-bold uppercase mb-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Pipeline Focus: {pipelineSteps[methodologyStep].title}</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {pipelineSteps[methodologyStep].desc}
                    </p>
                  </div>
                </div>

                {/* Dataset metrics */}
                <div className="bg-zinc-900/10 border border-zinc-800 rounded-2xl p-5 space-y-4">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wide block border-b border-zinc-805 pb-2">
                    DATASET STATS & AUDITS
                  </span>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
                      <div className="text-[9px] font-mono text-zinc-555 uppercase">ONION MARKETS</div>
                      <div className="text-base font-bold text-white tracking-tight">8 Distinct</div>
                    </div>
                    <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
                      <div className="text-[9px] font-mono text-zinc-555 uppercase">TOTAL SELLERS</div>
                      <div className="text-base font-bold text-white tracking-tight">12,450</div>
                    </div>
                    <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
                      <div className="text-[9px] font-mono text-zinc-555 uppercase">LISTINGS INDEXED</div>
                      <div className="text-base font-bold text-white tracking-tight">1.2M+</div>
                    </div>
                    <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
                      <div className="text-[9px] font-mono text-zinc-555 uppercase">CLUSTERING ACC</div>
                      <div className="text-base font-bold text-emerald-400 tracking-tight">96.4%</div>
                    </div>
                  </div>

                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg space-y-2">
                    <div className="text-[9px] font-mono text-zinc-550 uppercase">SECURE ETHICAL BOUNDS</div>
                    <p className="text-[10px] text-zinc-400 leading-relaxed">
                      Scraping loops avoided indexing PII or vendor messages, adhering to academic privacy frameworks and anonymizing crawled handles immediately.
                    </p>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 3: FINDINGS & GALLERY */}
          {activeTab === 'findings' && (
            <motion.div
              key="findings"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Findings & Category Graph */}
                <div className="lg:col-span-7 space-y-4">
                  <span className="text-[10px] font-mono text-zinc-550 uppercase tracking-wider block">
                    INVESTIGATION FINDINGS & CATEGORY MIX
                  </span>

                  <div className="p-4 bg-zinc-950/60 border border-zinc-800 rounded-xl space-y-4">
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                      Our models successfully uncovered stylometry signature overlaps indicating a high volume of vendor redundancy. Click a category to highlight distribution ratios:
                    </p>

                    <div className="space-y-3">
                      {MARKETPLACE_CATEGORIES.map((cat, idx) => {
                        const isSelected = selectedListingCategory === idx;
                        return (
                          <div 
                            key={idx}
                            onClick={() => setSelectedListingCategory(isSelected ? null : idx)}
                            className={`p-2 rounded-lg border cursor-pointer transition-all duration-150
                              ${isSelected ? 'bg-zinc-900 border-zinc-750 scale-102' : 'bg-zinc-950/20 border-zinc-800 hover:border-zinc-750'}
                            `}
                          >
                            <div className="flex justify-between items-center text-xs text-zinc-300 font-mono mb-1">
                              <span>{cat.name}</span>
                              <span className="font-bold text-zinc-100">{cat.count}</span>
                            </div>
                            <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                              <div className={`h-full ${cat.color}`} style={{ width: cat.count }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Research gallery */}
                <div className="lg:col-span-5 space-y-4">
                  <span className="text-[10px] font-mono text-zinc-550 uppercase tracking-widest block">
                    RESEARCH COMPILATION GALLERY //
                  </span>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 space-y-2 text-left hover:border-zinc-700 transition-colors">
                      <div className="aspect-square bg-blue-950/40 rounded-lg flex flex-col justify-center items-center p-4 text-center border border-zinc-800 relative overflow-hidden group">
                        <Binary className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform mb-2" />
                        <span className="text-[10px] font-mono text-zinc-400">Stylometry Scatter</span>
                        <div className="absolute inset-0 bg-transparent group-hover:bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Eye className="w-4 h-4 text-zinc-300" />
                        </div>
                      </div>
                      <div className="text-[10px] font-mono text-zinc-400">Fig 1. Stylometric clusters mapping TF-IDF profiles.</div>
                    </div>

                    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 space-y-2 text-left hover:border-zinc-700 transition-colors">
                      <div className="aspect-square bg-emerald-950/30 rounded-lg flex flex-col justify-center items-center p-4 text-center border border-zinc-800 relative overflow-hidden group">
                        <LineChart className="w-8 h-8 text-emerald-500 group-hover:scale-110 transition-transform mb-2" />
                        <span className="text-[10px] font-mono text-zinc-400">Cryptolink Node</span>
                        <div className="absolute inset-0 bg-transparent group-hover:bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Eye className="w-4 h-4 text-zinc-300" />
                        </div>
                      </div>
                      <div className="text-[10px] font-mono text-zinc-400">Fig 2. Correlation of bitcoin deposit nodes.</div>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 4: RESEARCH JOURNEY TIMELINE */}
          {activeTab === 'journey' && (
            <motion.div
              key="journey"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-6"
            >
              <div className="relative border-l border-zinc-800 pl-6 space-y-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar text-left">
                {JOURNEY_TIMELINES.map((tl, i) => (
                  <div key={i} className="relative">
                    <span className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full bg-black border-2 border-orange-500 flex items-center justify-center">
                      <span className="h-1.5 w-1.5 bg-orange-400 rounded-full" />
                    </span>

                    <div className="space-y-1 bg-zinc-950/30 border border-zinc-800 hover:border-zinc-700 p-4 rounded-xl transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                        <span className="text-[9px] font-mono text-orange-400 uppercase tracking-widest">{tl.phase}</span>
                        <span className="text-[10px] font-mono text-zinc-500 bg-zinc-950 px-2 rounded border border-zinc-800 self-start">{tl.date}</span>
                      </div>
                      <h4 className="text-xs font-bold text-zinc-200">{tl.title}</h4>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        {tl.desc}
                      </p>
                      <div className="flex items-center gap-1.5 pt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[9px] font-mono text-zinc-555 font-bold uppercase">{tl.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
