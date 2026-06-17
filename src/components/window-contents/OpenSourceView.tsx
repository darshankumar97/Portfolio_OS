/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  GitPullRequest, 
  Github, 
  CheckCircle2, 
  Code2, 
  Users, 
  MessageSquare, 
  BookOpen, 
  Cpu, 
  Globe2, 
  AlertCircle 
} from 'lucide-react';
import { motion } from 'motion/react';

export default function OpenSourceView() {
  return (
    <div id="opensource-view-container" className="p-6 md:p-8 space-y-6 font-sans text-white select-none selection:bg-neutral-800">
      
      {/* HEADER HERO */}
      <div className="border-b border-zinc-800/80 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono uppercase tracking-widest mb-1 font-semibold">
            <Globe2 className="w-4 h-4 text-sky-400 animate-spin-slow" />
            <span>Open Source Contributions Catalogue // Verified Status</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white font-display">
            Decentralized Ecosystem Contributions
          </h1>
          <p className="text-zinc-400 text-xs md:text-sm mt-1 max-w-xl font-sans">
            Giving back to the foundational tools and global frameworks. Showcasing linguistic scale expansion and code adaptations.
          </p>
        </div>

        {/* PR Status Block */}
        <div className="flex items-center gap-2.5 bg-sky-500/10 border border-sky-500/25 px-3 py-1.5 rounded-lg h-fit">
          <GitPullRequest className="w-4 h-4 text-sky-400" />
          <span className="text-[10px] font-mono text-sky-400 font-bold uppercase tracking-wider">
            STATUS: 100% MERGED PULL REQUEST
          </span>
        </div>
      </div>

      {/* HIGHLIGHT HEADER CARD: Hindi Internationalization (i18n) */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-[#0C0C0E] p-6 md:p-8 hover:border-zinc-700 transition-all">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 via-transparent to-transparent z-0 pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono bg-sky-500/10 text-sky-400 border border-sky-500/25 px-2.5 py-0.5 rounded uppercase font-bold tracking-wider">
              FEATURED CONTRIBUTION
            </span>
            <span className="text-zinc-650 font-mono text-[9px]">• MERGED IN 2025</span>
          </div>

          <h3 className="text-md md:text-lg font-bold text-white tracking-tight font-display">
            Hindi Internationalization (i18n) Contribution
          </h3>

          <p className="text-xs text-zinc-300 leading-relaxed max-w-3xl">
            Authored full localization, language maps, dynamic date formatters, and grammatical gender agreement utilities to bring native Hindi support to key developer platforms, opening tools to 600M+ native Hindi speakers globally.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="space-y-0.5">
              <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block font-bold">Repository</span>
              <span className="text-xs text-white font-mono font-medium">calcom/cal.com</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block font-bold">Impact Metric</span>
              <span className="text-xs text-emerald-400 font-mono font-bold">600M+ Speakers</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block font-bold">Contribution ID</span>
              <span className="text-xs text-zinc-300 font-mono">Cal-i18n-#14902</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block font-bold">Pull Request Link</span>
              <a 
                href="https://github.com/calcom/cal.com" 
                target="_blank" 
                rel="noreferrer" 
                className="text-xs text-blue-400 font-semibold font-sans hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>View Repository</span>
                <Github className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* SEGMENTED COHESIVE STORYTELLING MODULES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Overview, Problem Solved & Implementation details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Contribution Overview & Problem Solved */}
          <div className="p-5 bg-zinc-900/40 border border-zinc-800 rounded-xl space-y-3.5 text-left">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
              <BookOpen className="w-4 h-4 text-zinc-400" />
              <h4 className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-wider">
                1.0 Contribution Overview & Problem Solved
              </h4>
            </div>
            
            <div className="space-y-3 font-sans text-xs text-zinc-300 leading-relaxed font-medium">
              <p>
                <strong>The Opportunity:</strong> Scheduling platforms and collaborative calendars require highly accurate internationalization schemas because they drive remote work agreements across multiple continents and languages. When localized schemas lack clarity, users face friction setting timelines.
              </p>
              <p>
                <strong>The Core Problem:</strong> Hindi, despite being spoken by over 600 million people, lacked comprehensive coverage in the scheduling system's user onboarding flows, dynamic email notifications, and system settings. There were also syntax discrepancies surrounding date-range suffixes and hour indicators, leading to layout overflows in calendar views.
              </p>
            </div>
          </div>

          {/* Section 2: Implementation Details & Code Additions */}
          <div className="p-5 bg-zinc-900/40 border border-zinc-800 rounded-xl space-y-3.5 text-left">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
              <Code2 className="w-4 h-4 text-zinc-400" />
              <h4 className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-wider">
                2.0 Architectural Implementation & Code Additions
              </h4>
            </div>
            
            <div className="space-y-3 font-sans text-xs text-zinc-300 leading-relaxed font-medium">
              <p>
                I carefully mapped and translated <strong>1,200+ distinct translation keys</strong> within the locale dictionary files (including terms for booking confirmations, timezone changes, dynamic recurring schedules, and system errors).
              </p>
              <p>
                To resolve date presentation obstacles, I implemented a robust, customizable <strong>date localization adapter</strong> that maps relative hour markers (e.g., पूर्वाहन/अपराहन) and formatted strings properly across components without breaking CSS responsive parameters.
              </p>
            </div>
          </div>

          {/* Section 3: Review Process & Dialogue */}
          <div className="p-5 bg-zinc-900/40 border border-zinc-800 rounded-xl space-y-3.5 text-left">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
              <MessageSquare className="w-4 h-4 text-zinc-400" />
              <h4 className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-wider">
                3.0 Peer Review & Collaborative Refinements
              </h4>
            </div>
            
            <div className="space-y-2 text-xs font-sans leading-relaxed text-zinc-350 font-medium">
              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg space-y-1">
                <span className="text-[10px] font-mono text-sky-400 block font-bold">@maintainer_review:</span>
                <p>"Excellent accuracy on formal phrasing. Requesting a minor adjustment: could we decouple the date formatting helpers from main react runtime hooks to allow server-side layouts to access them safely?"</p>
              </div>
              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg space-y-1">
                <span className="text-[10px] font-mono text-emerald-400 block font-bold">@darshan_kumar_kr:</span>
                <p>"Extracted translation configurations and date adapters into a pure, stateless configuration object. Refined the relative format mappings to support standardized dynamic parameters."</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right column: Highlights, PR Spec, Merge Results & Lessons */}
        <div className="space-y-6">
          
          {/* Pull Request Specification Sheet */}
          <div className="p-5 bg-zinc-900/40 border border-zinc-800 rounded-xl space-y-4 text-left">
            <h4 className="text-xs font-bold font-mono text-zinc-500 uppercase tracking-wider border-b border-zinc-800 pb-2">
              PULL REQUEST PARAMETERS //
            </h4>

            <div className="space-y-3.5">
              <div>
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">Target Repository</span>
                <span className="text-xs text-white font-mono bg-black px-2 py-0.5 rounded border border-white/5 inline-block mt-0.5">calcom / cal.com</span>
              </div>

              <div>
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">Lines Touched</span>
                <span className="text-xs text-emerald-400 font-mono font-bold mt-0.5 inline-block">+1,200 insertions, 0 deletions</span>
              </div>

              <div>
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">Git Commit SHA</span>
                <span className="text-xs text-zinc-300 font-mono bg-black px-2 py-0.5 rounded border border-white/5 inline-block mt-0.5">8f21bc9e4a3d76e2</span>
              </div>

              <div>
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">Review Status</span>
                <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded uppercase font-bold inline-block mt-1">
                  Approved & Merged
                </span>
              </div>
            </div>
          </div>

          {/* Merge Result and Lessons Learned */}
          <div className="p-5 bg-zinc-900/40 border border-zinc-800 rounded-xl space-y-3 text-left">
            <h4 className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-wider">
              PR Merge Result & Takeaways
            </h4>
            
            <div className="space-y-3 text-xs text-zinc-350 font-sans leading-relaxed font-medium">
              <div className="flex gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Successfully Merged:</strong> Changes are active, serving hundreds of thousands of active booking panels worldwide.
                </p>
              </div>

              <div className="flex gap-2.5 pt-2 border-t border-zinc-805">
                <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Lesson Learned:</strong> Localization is never just simple static word substitution — it mandates continuous care on UI layouts, adaptive date conversions, and responsive alignments to block visual regressions.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
