/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  History, 
  Calendar, 
  GitCommit, 
  Tag, 
  ChevronRight, 
  Sparkles, 
  Terminal,
  RefreshCw
} from 'lucide-react';
import { motion } from 'motion/react';
import { PortfolioDB, ChangelogEntry } from '../../utils/portfolioDb';

export default function ChangelogView() {
  const [changelogs, setChangelogs] = useState<ChangelogEntry[]>([]);

  useEffect(() => {
    // Sync initial log registry values
    setChangelogs(PortfolioDB.getChangelogs());
    
    const sync = () => {
      setChangelogs(PortfolioDB.getChangelogs());
    };
    window.addEventListener('portfolio-db-updated-devos_cms_changelogs', sync);
    window.addEventListener('portfolio-db-updated-global', sync);
    return () => {
      window.removeEventListener('portfolio-db-updated-devos_cms_changelogs', sync);
      window.removeEventListener('portfolio-db-updated-global', sync);
    };
  }, []);

  return (
    <div className="h-full overflow-y-auto px-6 py-6 font-sans text-xs bg-[#030303]">
      {/* Visual Header banner */}
      <div className="border-b border-zinc-800 pb-5 mb-8 text-left">
        <div className="flex items-center gap-2.5">
          <History className="w-5 h-5 text-blue-500 animate-pulse" />
          <h1 className="text-xl font-bold tracking-tight text-white font-sans uppercase">DevOS Core Changelog</h1>
        </div>
        <p className="text-zinc-500 text-[11px] font-mono mt-1.5 leading-relaxed max-w-xl">
          Historical records of engineering platform updates, performance matrices, security hardening milestones, and distributed additions.
        </p>
      </div>

      <div className="relative border-l border-zinc-805 pl-6 ml-4 text-left space-y-10">
        {changelogs.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 font-mono text-[11px] space-y-2">
            <RefreshCw className="w-5 h-5 text-zinc-700 animate-spin mx-auto" />
            <p>Initializing standard changelog records...</p>
          </div>
        ) : (
          changelogs.map((log, index) => (
            <motion.div 
              key={log.version}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="relative space-y-3.5 group"
            >
              {/* Timeline bubble node indicator */}
              <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-zinc-950 border-2 border-blue-500 ring-4 ring-neutral-950 transition-all duration-300 group-hover:bg-blue-400 group-hover:scale-125" />

              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider leading-none">
                    {log.version}
                  </span>
                  <span className="text-zinc-400 font-sans font-bold text-sm">
                    {log.summary}
                  </span>
                </div>
                
                <span className="hidden sm:inline text-zinc-700 font-mono text-[9px]">•</span>
                
                <div className="flex items-center gap-1.5 text-zinc-550 font-mono text-[10px]">
                  <Calendar className="w-3.5 h-3.5 text-zinc-650 shrink-0" />
                  <span>{log.date}</span>
                </div>
              </div>

              {/* Nested container inside timeline */}
              <div className="bg-[#08080a]/50 border border-zinc-800 p-4 rounded-2xl max-w-2xl space-y-3 hover:border-zinc-700 transition-all duration-300">
                <div className="flex items-center gap-2 text-zinc-500 font-mono text-[10px]">
                  <Terminal className="w-3.5 h-3.5 text-blue-500/70" />
                  <span>COMMITS DEPLOYED</span>
                </div>
                
                <ul className="space-y-2 text-[11px] text-zinc-400 leading-relaxed font-sans">
                  {log.changes.map((item, iIdx) => (
                    <li key={iIdx} className="flex items-start gap-2 text-zinc-350">
                      <ChevronRight className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
