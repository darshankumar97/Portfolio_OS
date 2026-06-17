/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Compass, 
  Map, 
  Layers, 
  Terminal, 
  CheckSquare, 
  Rocket, 
  RefreshCw, 
  ArrowRight, 
  UserCheck, 
  ShieldCheck 
} from 'lucide-react';
import { motion } from 'motion/react';

const WORKFLOW_STEPS = [
  {
    phase: '01',
    title: 'Discovery & Needs Alignment',
    icon: Compass,
    color: 'border-blue-500/30 text-blue-400 bg-blue-500/5',
    focus: 'User Experience Map & MVP Constraints',
    desc: 'Deep discussion to extract product goals and critical problem domains. We define exact targets, map core user paths, and filter out speculative non-MVP feature bloat to focus on high-yield assets.'
  },
  {
    phase: '02',
    title: 'Planning & Product Specifications',
    icon: Map,
    color: 'border-orange-500/30 text-orange-400 bg-orange-500/5',
    focus: 'Sprint Schedules & Core Milestones',
    desc: 'Structuring details into solid specs and logical modules. Formulating milestone goals and sprint maps to guarantee transparent, continuous delivery visibility for startup founders.'
  },
  {
    phase: '03',
    title: 'Architecture & System Blueprints',
    icon: Layers,
    color: 'border-purple-500/30 text-purple-400 bg-purple-500/5',
    focus: 'Data Modeling, Schema Design & API Paths',
    desc: 'Designing durable relational databases (e.g. PostgreSQL) or flexible document graphs (e.g. Firestore). Detailing clean API interfaces, caching thresholds, and distributed gateway points.'
  },
  {
    phase: '04',
    title: 'Rapid Development & Native Code',
    icon: Terminal,
    color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5',
    focus: 'Type-Safe Code, Fluid UI & Modularity',
    desc: 'Writing clean, self-documenting TypeScript code. Constructing visually premium, responsive interface layouts with Tailwind CSS, utilizing clean re-render patterns and modular packages.'
  },
  {
    phase: '05',
    title: 'Defensive Testing & Verification',
    icon: CheckSquare,
    color: 'border-red-500/30 text-red-400 bg-red-500/5',
    focus: 'Integration Tests & Edge-Case Sweeps',
    desc: 'Verifying code behavior against strict latency goals, state-persistence failures, and security-rules integrity checks. Guaranteeing app resilience before merging code branches.'
  },
  {
    phase: '06',
    title: 'Seamless Container Deployment',
    icon: Rocket,
    color: 'border-sky-500/30 text-sky-400 bg-sky-500/5',
    focus: 'Vercel CDN, Docker & Serverless Assets',
    desc: 'Configuring safe, continuous deployment integrations. Deploying static components globally via Edge CDNs, and orchestration servers inside production-ready Cloud environments.'
  },
  {
    phase: '07',
    title: 'Active Iteration & Optimization',
    icon: RefreshCw,
    color: 'border-amber-500/30 text-amber-400 bg-amber-500/05',
    focus: 'Lighthouse Performance & User Signals',
    desc: 'Evaluating live tracking events anonymously to resolve performance bottlenecks. Fine-tuning queries, reducing bundle sizes, and iterating based on founder feedback.'
  }
];

export default function HowIWorkView() {
  return (
    <div id="howiwork-view-container" className="p-6 md:p-8 space-y-6 font-sans text-white select-none selection:bg-neutral-800">
      
      {/* HEADER HERO */}
      <div className="border-b border-zinc-800/80 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono uppercase tracking-widest mb-1 font-semibold">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Process Blueprints // Built for Collaboration</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white font-display">
            How I Work & Build Products
          </h1>
          <p className="text-zinc-400 text-xs md:text-sm mt-1 max-w-xl font-sans">
            A structured, engineering-first execution framework engineered specifically for startup founders, product teams, and freelance clients.
          </p>
        </div>

        {/* CTA Banner info */}
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1.5 rounded-lg h-fit text-left">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
            GUARANTEE: FULL-STACK AUTONOMY
          </span>
        </div>
      </div>

      {/* CORE TIMELINE GRAPHICS LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Staggered Timeline Modules */}
        <div className="lg:col-span-8 space-y-4">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">
            THE DEVELOPMENT PIPELINE CYCLE //
          </span>

          <div className="space-y-4">
            {WORKFLOW_STEPS.map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <div 
                  key={idx} 
                  className="relative p-5 border border-zinc-800/60 bg-[#09090b] rounded-2xl flex flex-col md:flex-row gap-4 items-start hover:border-zinc-700 hover:bg-[#0a0a0c] transition-all text-left"
                >
                  {/* Indicator stamp */}
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${step.color}`}>
                    <StepIcon className="w-5 h-5" />
                  </div>

                  <div className="space-y-1 md:pt-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-zinc-500">PHASE {step.phase} •</span>
                      <h4 className="text-sm font-bold text-white tracking-tight">{step.title}</h4>
                    </div>
                    
                    <span className="text-[9px] font-mono bg-white/5 border border-white/5 text-zinc-300 font-bold uppercase tracking-wide px-2 py-0.5 rounded inline-block">
                      Focus: {step.focus}
                    </span>

                    <p className="text-xs text-zinc-350 leading-relaxed font-sans pt-1 font-medium">
                      {step.desc}
                    </p>
                  </div>

                  {/* Connecting indicator */}
                  {idx < WORKFLOW_STEPS.length - 1 && (
                    <div className="hidden md:block absolute -bottom-5 left-10 w-0.5 h-6 bg-gradient-to-b from-zinc-800 to-transparent z-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Quick Summary / Values for Founders */}
        <div className="space-y-6 lg:col-span-4 h-fit">
          
          {/* Alignment card */}
          <div className="p-5 bg-zinc-900/40 border border-zinc-800 rounded-2xl space-y-4 text-left">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-805 pb-2">
              Values for Startup Founders
            </h4>

            <div className="space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <span className="font-bold text-white block">1. Speed Meets Architecture</span>
                <p className="text-zinc-400 leading-relaxed font-medium">
                  We build fast, functional MVPs within 3-4 weeks. But we design them defensively, ensuring that your data schema supports continuous scaling.
                </p>
              </div>

              <div className="space-y-1 pt-3 border-t border-zinc-805">
                <span className="font-bold text-white block">2. Strong Technical Accountability</span>
                <p className="text-zinc-400 leading-relaxed font-medium">
                  I operate completely independently. Every trade-off, architectural path decision, and milestone logic is reported transparently.
                </p>
              </div>

              <div className="space-y-1 pt-3 border-t border-zinc-805">
                <span className="font-bold text-white block">3. Clear, Jargon-Free Communication</span>
                <p className="text-zinc-400 leading-relaxed font-medium">
                  Whether presenting code architectures, API design models, or styling loops, I translate technical definitions into actionable business benefits.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats card */}
          <div className="p-5 bg-emerald-950/5 border border-emerald-500/10 rounded-2xl space-y-3 text-left">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 pb-1.5 border-b border-emerald-500/10">
              COLLABORATION STATUS // Open
            </h4>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans font-medium">
              Want to take your product concept from discovery to scaled release seamlessly? Tap into clean full-stack autonomy and robust system systems.
            </p>
            
            <button 
              onClick={() => {
                const event = new CustomEvent('devos-switch-window', { 
                  detail: { targetId: 'contact', subject: 'Collaboration Inquiry', message: 'Hello Darshan, I reviewed your "How I Work" blueprint and would like to discuss building a custom project...' } 
                });
                window.dispatchEvent(event);
              }}
              className="w-full mt-2 py-2.5 bg-emerald-500 text-black font-semibold rounded-lg text-xs tracking-tight hover:bg-emerald-400 active:scale-95 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer shadow"
            >
              <span>Build With Me</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
