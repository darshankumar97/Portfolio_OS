/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Handshake, 
  Target, 
  Sparkles, 
  Code2, 
  Layout, 
  LineChart, 
  Database, 
  Layers, 
  Network, 
  ArrowRight,
  Clock,
  Workflow,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PortfolioDB } from '../../utils/portfolioDb';

// Target Audience Categories
const AUDIENCES = [
  {
    title: 'Startup Founders',
    desc: 'Translating product vision into robust, investment-ready MVP prototypes with scalable database schemas and bulletproof APIs.',
    focus: 'SaaS Architecture & Zero-Cold-Start MVPs'
  },
  {
    title: 'Early-Stage Teams',
    desc: 'Refactoring initial codebases to optimized cloud service instances, scaling systems, and building high-performance query lanes.',
    focus: 'Architecture Scaling & Infrastructure'
  },
  {
    title: 'Small Businesses',
    desc: 'Unlocking operations with custom tools, visual data dashboards, and structured database systems replacing manual processes.',
    focus: 'Operational Automation & Simplicity'
  },
  {
    title: 'Freelance Alliances',
    desc: 'Developing specialized integrations, high-performance web aggregators, API proxies, and bespoke React/TypeScript setups.',
    focus: 'Niche Implementations & Micro-Services'
  }
];

interface ServiceSpec {
  id: string;
  name: string;
  icon: any;
  tagline: string;
  whatIBuild: string[];
  techStack: string[];
  process: string[];
  timeline: string;
  expectedScope: string;
}

const SERVICES_CATALOG: ServiceSpec[] = [
  {
    id: 'saas-mvp',
    name: 'Need an MVP?',
    icon: Sparkles,
    tagline: 'Rapid-cycle fully functional product builds engineered specifically to validate product-market fit and impress investors.',
    whatIBuild: [
      'Core atomic user workflows integrated with dynamic state storage and safe cloud authentication',
      'Third-party subscription structures processed safely via backend proxy APIs',
      'Intuitive design modules and custom onboarding steps maximizing user retention metrics'
    ],
    techStack: ['React / Vite', 'TypeScript', 'Node.js', 'Firebase / PostgreSQL', 'Tailwind CSS', 'Motion'],
    process: [
      '1. Scope Definition & High-Yield Feature Alignment (Week 1)',
      '2. Complete Database Mapping & Secure Integration (Week 1.5)',
      '3. Functional UI Assembly & State Connectivity (Week 2)',
      '4. Beta Testing, Refinement, & Cloud Ingress Release (Week 3)'
    ],
    timeline: '3 Weeks',
    expectedScope: 'INQUIRY // NEED AN MVP'
  },
  {
    id: 'internal-tools',
    name: 'Need Internal Tools?',
    icon: Code2,
    tagline: 'Custom workflow managers, admin stations, and operations logs that replace brittle manual spreadsheets.',
    whatIBuild: [
      'Administrative controls with integrated secure role access boards',
      'Custom CRUD setups, bulk file uploads parsing, and direct DB write interfaces',
      'Unified logs and status trackers syncing live data records securely'
    ],
    techStack: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Tailwind CSS'],
    process: [
      '1. Operational Bottleneck Identification & Wireframing (Week 1)',
      '2. Secure Database Modeling & Access Rule Schema (Week 1.5)',
      '3. Feature Integration & Access Level Locks (Week 2-3)',
      '4. Performance Optimization & Production Release (Week 4)'
    ],
    timeline: '3 - 4 Weeks',
    expectedScope: 'INQUIRY // NEED INTERNAL TOOLS'
  },
  {
    id: 'dashboards',
    name: 'Need Dashboards?',
    icon: Layout,
    tagline: 'Sub-second loading interactive analytics stations displaying clean charts and quick data grids.',
    whatIBuild: [
      'Custom data visualization nodes using fluid, responsive charting systems',
      'Fast client-side live list searches, filters, and dynamic grouping pipelines',
      'Unified data views aggregating divergent telemetry threads into cohesive panels'
    ],
    techStack: ['React / Vite', 'Tailwind CSS', 'Recharts / D3', 'TypeScript', 'REST APIs'],
    process: [
      '1. Graphic Structure planning & negative space sizing (Week 1)',
      '2. Query bindings & real-time client state caching (Week 2)',
      '3. Chart interactions, controls & dynamic tooltips (Week 2.5)',
      '4. Speed tuning, rendering optimizations & launch (Week 3)'
    ],
    timeline: '2 - 3 Weeks',
    expectedScope: 'INQUIRY // NEED DASHBOARDS'
  },
  {
    id: 'analytics-platforms',
    name: 'Need Analytics Platforms?',
    icon: LineChart,
    tagline: 'Highly modular ingestion pipelines and data trackers organizing heavy tracking feeds.',
    whatIBuild: [
      'Optimized client-side events-dispatching scripts that do not impact user load metrics',
      'Robust backend queues buffering incoming records natively and securely',
      'Analytical reports dashboards presenting granular trends and historical curves'
    ],
    techStack: ['Go / Node.js', 'Redis Cache', 'PostgreSQL', 'TypeScript', 'Docker Compose'],
    process: [
      '1. Payload modeling & throughput goals definition (Week 1)',
      '2. Ingestion endpoint creation & rotating queues (Week 2)',
      '3. Aggregation workers & scheduled consolidation tasks (Week 3)',
      '4. analytical consoles, query indexes tuning & launch (Week 4)'
    ],
    timeline: '4 Weeks',
    expectedScope: 'INQUIRY // NEED ANALYTICS PLATFORMS'
  },
  {
    id: 'backend-apis',
    name: 'Need Backend APIs?',
    icon: Database,
    tagline: 'Performance-tuned, secure web services hosting data models and guarding API endpoints.',
    whatIBuild: [
      'Type-safe REST and JSON-RPC APIs crafted underneath solid input verification criteria',
      'Secure token setups, custom routing guidelines, and cryptographically safe keys',
      'Batch generation helpers, dynamic layout parsers, and cron reporting scripts'
    ],
    techStack: ['Node.js', 'Express', 'JWT Auth', 'PostgreSQL / Prisma', 'Redis'],
    process: [
      '1. Protocol interfaces design & exact API catalogs mapping (Week 1)',
      '2. Database migrations architecture & indexing strategy (Week 2)',
      '3. Core endpoint logic building & role validation handlers (Week 2.5)',
      '4. Extensive stress validations, error fallbacks & launch (Week 3)'
    ],
    timeline: '2 - 3 Weeks',
    expectedScope: 'INQUIRY // NEED BACKEND APIS'
  },
  {
    id: 'product-support',
    name: 'Need Product Engineering?',
    icon: Layers,
    tagline: 'On-demand high-fidelity layout styling, state optimization, and system refactoring support.',
    whatIBuild: [
      'Converting sophisticated design mockups into premium, responsive Tailwind pages',
      'Optimizing sluggish state pipelines and purging component re-renders',
      'Polishing interactive details, animation cues, and overall responsive integrity'
    ],
    techStack: ['React', 'Next.js', 'Tailwind CSS', 'Motion', 'TypeScript', 'Vite'],
    process: [
      '1. Codebase Audit, Styling Rules & Target Objectives Alignment (Week 1)',
      '2. Rapid component execution & state refactoring sprints (Week 2-3)',
      '3. Visual Polish, interactive transitions & test pass (Week 4)'
    ],
    timeline: 'Ongoing / Sprints',
    expectedScope: 'INQUIRY // NEED PRODUCT SUPPORT'
  }
];

interface WorkViewProps {
  onOpenContactWithService?: (subject: string, serviceName: string) => void;
}

export default function WorkView({ onOpenContactWithService }: WorkViewProps) {
  const [servicesList, setServicesList] = useState<ServiceSpec[]>([]);
  const [activeServiceId, setActiveServiceId] = useState<string>('saas-mvp');

  useEffect(() => {
    const loaded = PortfolioDB.getServices();
    if (loaded && loaded.length > 0) {
      setServicesList(loaded as any);
      setActiveServiceId(loaded[0].id);
    } else {
      setServicesList(SERVICES_CATALOG);
      setActiveServiceId(SERVICES_CATALOG[0].id);
    }
  }, []);

  const activeServices = servicesList && servicesList.length > 0 ? servicesList : SERVICES_CATALOG;
  const selectedService = activeServices.find(s => s.id === activeServiceId) || activeServices[0];

  const getSvcIcon = (id: string) => {
    switch (id) {
      case 'saas-mvp': return Sparkles;
      case 'internal-tools': return Code2;
      case 'dashboards': return Layout;
      default: return Sparkles;
    }
  };

  const ActiveServiceIcon = getSvcIcon(selectedService.id);

  const handleInquiryAction = () => {
    if (onOpenContactWithService) {
      onOpenContactWithService(selectedService.expectedScope, selectedService.name);
    } else {
      const event = new CustomEvent('devos-switch-window', { 
        detail: { 
          targetId: 'contact', 
          subject: selectedService.expectedScope,
          message: `Dear Darshan,\n\nI am writing to inquire about your "${selectedService.name}" service for an upcoming project. Let's arrange a call to discuss our engineering goals.\n\nBest regards,\n[Your Name]`
        } 
      });
      window.dispatchEvent(event);
    }
  };

  return (
    <div id="work-view-container" className="p-8 md:p-12 space-y-10 font-sans text-zinc-200 select-none selection:bg-zinc-800">
      
      {/* SECTION HEADER */}
      <div className="border-b border-zinc-800 pb-8">
        <div className="flex items-center gap-2 text-[10px] text-zinc-500 tracking-widest uppercase mb-2">
          <Handshake className="w-3.5 h-3.5 text-zinc-400" />
          <span>Services Portfolio</span>
        </div>
        <h1 className="text-xl md:text-2xl font-light text-white tracking-tight">
          Engineering Operations & Services
        </h1>
        <p className="text-zinc-400 text-xs md:text-sm mt-2 max-w-xl text-left leading-relaxed">
          I collaborate with startup founders, early-stage groups, and small businesses to construct high-performance full-stack web products, robust database architectures, and intuitive user interfaces.
        </p>
      </div>

      {/* TARGET LOBBY GROUPS */}
      <div className="space-y-4 text-left">
        <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-medium">
          Collaborative Focus Segments
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {AUDIENCES.map((aud, i) => (
            <div 
              key={i} 
              className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950 hover:border-zinc-700 transition-all duration-200 relative group"
            >
              <div className="absolute top-4 right-4 text-zinc-750 font-mono text-[9px]">
                0{i + 1}
              </div>
              <h3 className="text-xs font-semibold text-zinc-200 uppercase border-b border-zinc-800 pb-2 mb-3">
                {aud.title}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed min-h-[50px] font-sans">
                {aud.desc}
              </p>
              <div className="text-[9px] font-mono text-zinc-400 uppercase tracking-tight flex items-center gap-1.5 pt-3 mt-3 border-t border-zinc-805">
                <Target className="w-3 h-3 text-zinc-500" />
                <span>Focus: {aud.focus}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CORE SERVICES SPECIFICATION BOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left pt-4">
        
        {/* Left Side Tab Column */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-medium">
            Service Options
          </span>
          
          <div className="space-y-2">
            {activeServices.map((svc) => {
              const isActive = svc.id === activeServiceId;
              const SvcTabIcon = getSvcIcon(svc.id);
              return (
                <button
                  key={svc.id}
                  onClick={() => setActiveServiceId(svc.id)}
                  className={`w-full text-left p-4 rounded-xl border flex items-center gap-4 transition-all duration-200 cursor-pointer relative overflow-hidden group
                    ${isActive 
                      ? 'bg-zinc-900 border-zinc-650' 
                      : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                    }
                  `}
                >
                  {isActive && (
                    <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-zinc-400" />
                  )}

                  <span className={`p-2 rounded-lg bg-zinc-950 border transition-all
                    ${isActive ? 'border-zinc-700 text-white' : 'border-zinc-800 text-zinc-500 group-hover:text-zinc-350'}
                  `}>
                    <SvcTabIcon className="w-4 h-4" />
                  </span>

                  <div>
                    <h3 className={`text-xs font-semibold uppercase tracking-wider transition-colors ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-300'}`}>
                      {svc.name}
                    </h3>
                    <span className="text-[9px] font-mono text-zinc-500 block pt-0.5">EST: {svc.timeline}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side Frame View */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedService.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden"
            >
              {/* Header Tab Details */}
              <div className="space-y-3 border-b border-zinc-800 pb-5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-300 px-2.5 py-0.5 rounded-full uppercase tracking-widest font-mono">
                    Specifications
                  </span>
                  <div className="flex items-center gap-1.5 text-zinc-500 font-mono text-[9px]">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    <span>TIMELINE: {selectedService.timeline}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-1">
                  <span className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300">
                    <ActiveServiceIcon className="w-5 h-5" />
                  </span>
                  <div>
                    <h2 className="text-sm md:text-base font-semibold tracking-wider uppercase text-white">
                      {selectedService.name}
                    </h2>
                    <p className="text-xs text-zinc-400 mt-1 leading-normal max-w-md">
                      {selectedService.tagline}
                    </p>
                  </div>
                </div>
              </div>

              {/* Core Information Split Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-sans">
                
                {/* Deliverables */}
                <div className="space-y-4">
                  <h4 className="text-[10px] text-zinc-500 uppercase tracking-widest border-b border-zinc-800 pb-2 flex items-center gap-1.5 font-medium">
                    <Target className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Deliverables</span>
                  </h4>
                  <ul className="space-y-3 text-zinc-400">
                    {selectedService.whatIBuild.map((item, idx) => (
                      <li key={idx} className="flex gap-2.5 items-start leading-relaxed font-sans text-xs">
                        <CheckCircle2 className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Workflow Roadmap */}
                <div className="space-y-4">
                  <h4 className="text-[10px] text-zinc-500 uppercase tracking-widest border-b border-zinc-800 pb-2 flex items-center gap-1.5 font-medium">
                    <Workflow className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Delivery Workflow</span>
                  </h4>
                  <ul className="space-y-2.5 text-zinc-400 font-mono text-[10px]">
                    {selectedService.process.map((step, idx) => (
                      <li key={idx} className="text-zinc-400 hover:text-white transition-colors py-0.5 leading-relaxed">
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Technologies Column */}
              <div className="space-y-2 border-t border-zinc-800 pt-5 text-xs">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-medium">Aligned Technologies</span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedService.techStack.map(stack => (
                    <span key={stack} className="text-[9px] font-mono bg-zinc-900 px-2.5 py-1 rounded-md border border-zinc-805 text-zinc-350 select-text">
                      {stack}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-zinc-805">
                <button
                  onClick={handleInquiryAction}
                  className="w-full py-3 bg-zinc-100 hover:bg-white text-zinc-950 font-sans text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-colors font-medium cursor-pointer"
                >
                  <span>Initiate Consultation Inquiry</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
