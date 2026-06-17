/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Award, 
  Trophy, 
  GitPullRequest, 
  BookOpen, 
  ShieldCheck, 
  ExternalLink, 
  Sparkles, 
  Check, 
  FileCode, 
  Layers,
  ChevronRight,
  GitMerge
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AchievementItem {
  id: string;
  title: string;
  category: string;
  issuer: string;
  date: string;
  description: string;
  detailsLabel?: string;
  icon: 'publication' | 'ideathon' | 'opensource' | 'ta' | 'internship';
  tags: string[];
}

const ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 'ach-ieee-pub',
    title: 'IEEE ICASI 2026 Publication',
    category: 'Systems Security Research',
    issuer: 'IEEE ICASI Organizing Committee',
    date: 'March 2026',
    description: 'Researched, authored, and presented our paper "Vendor Profiling & Behaviour Analysis in Dark Web Marketplaces" focusing on automated cross-market cyberthreat intelligence systems.',
    icon: 'publication',
    tags: ['IEEE ICASI 2026', 'Cyber Forensics', 'Threat Intel'],
    detailsLabel: 'View abstract'
  },
  {
    id: 'ach-ideathon',
    title: 'IEEE Ideathon 2024 Winner',
    category: 'Socio-Technical Innovation',
    issuer: 'IEEE Student Branch Syndicate',
    date: 'Nov 2024',
    description: 'Awarded first place for designing a decentralized, resilience-first ad-hoc emergency communication mesh protocol using edge node handshakes during grid blackouts.',
    icon: 'ideathon',
    tags: ['First Place', 'Ad-hoc Networking', 'Mesh Protocol'],
    detailsLabel: 'View concept spec'
  },
  {
    id: 'ach-opensource',
    title: 'Open Source Contribution',
    category: 'Internationalization Engine',
    issuer: 'Global OSS Repository',
    date: 'June 2024',
    description: 'Designed and implemented Hindi internationalization support. Completed testing regimes and successfully merged the structural Pull Request into primary master tree.',
    icon: 'opensource',
    tags: ['GitHub PR Merged', 'Hindi L10n', 'Global Impact'],
    detailsLabel: 'Show merged PR diff'
  },
  {
    id: 'ach-ta',
    title: 'Cloud Computing Teaching Assistant',
    category: 'Academic Mentorship',
    issuer: 'Department of Computer Science',
    date: 'Academic Term 2024-2025',
    description: 'Appointed as lab TA under faculty review, coordinating practical modules on Docker engine namespaces, multihost Kubernetes pods, Jenkins automation, and distributed Consensus patterns.',
    icon: 'ta',
    tags: ['Docker/K8s Lab', 'Raft Consensus', 'MinIO'],
    detailsLabel: 'Review syllabi'
  },
  {
    id: 'ach-internship',
    title: 'Cloud Security Internship Credential',
    category: 'Threat Defense Internship',
    issuer: 'Centre for Computer Networks and Cyber Security',
    date: 'Jan Cluster 2025',
    description: 'Recognized for excellent contributions designing adaptive ML anomaly detection classification systems, analyzing large security logs, and managing sandboxed cluster infrastructure.',
    icon: 'internship',
    tags: ['Cloud IDS Intern', 'ML Threat Auditing', 'Firewall Logs'],
    detailsLabel: 'Verify performance logs'
  }
];

export default function AchievementsView() {
  const [selectedAchId, setSelectedAchId] = useState<string>('ach-opensource');
  const [showConfettiEffect, setShowConfettiEffect] = useState<boolean>(false);

  const selectedAch = ACHIEVEMENTS.find(a => a.id === selectedAchId) || ACHIEVEMENTS[0];

  const handleInteract = (id: string) => {
    setSelectedAchId(id);
    if (id === 'ach-opensource') {
      setShowConfettiEffect(true);
      setTimeout(() => setShowConfettiEffect(false), 2000);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'publication': return BookOpen;
      case 'ideathon': return Trophy;
      case 'opensource': return GitPullRequest;
      case 'ta': return Award;
      case 'internship': return ShieldCheck;
      default: return Award;
    }
  };

  const IconComponent = getIcon(selectedAch.icon);

  return (
    <div id="achievements-view-container" className="p-6 md:p-8 space-y-6 font-sans text-white select-none selection:bg-neutral-800">
      
      {/* Editorial Header */}
      <div className="border-b border-zinc-800 pb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-zinc-500 tracking-widest uppercase mb-1.5 font-medium">
            <Award className="w-4 h-4 text-zinc-400" />
            <span>Honors & Academic Milestones</span>
          </div>
          <h1 className="text-xl md:text-2xl font-light text-white tracking-tight">
            Technical Honors & Key Achievements
          </h1>
          <p className="text-zinc-400 text-xs md:text-sm mt-2 max-w-xl text-left leading-relaxed">
            Verified academic accomplishments, open source contributions, and peer-reviewed research publications demonstrating cyber defense and cloud systems engineering capabilities.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: LIST OF HONORS */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-[9px] font-mono text-zinc-555 uppercase tracking-widest block">
            HONORS SPECIMENS //
          </span>

          <div className="space-y-2.5">
            {ACHIEVEMENTS.map((ach) => {
              const isActive = ach.id === selectedAchId;
              const CardIcon = getIcon(ach.icon);

              return (
                <button
                  key={ach.id}
                  onClick={() => handleInteract(ach.id)}
                  className={`w-full text-left p-4 rounded-xl border flex gap-3.5 transition-all duration-200 cursor-pointer relative overflow-hidden group
                    ${isActive 
                      ? 'bg-orange-500/10 border-orange-500/35' 
                      : 'bg-zinc-950 border-zinc-805 hover:border-zinc-700'
                    }
                  `}
                >
                  <span className={`p-2 bg-zinc-950 border rounded-lg self-start transition-colors
                    ${isActive ? 'border-orange-500/30 text-orange-400' : 'border-zinc-800 text-zinc-500 group-hover:text-zinc-300'}
                  `}>
                    <CardIcon className="w-4.5 h-4.5" />
                  </span>

                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-zinc-500 block uppercase">
                      {ach.date}
                    </span>
                    <h3 className={`text-xs font-bold leading-snug transition-colors ${isActive ? 'text-orange-400 font-extrabold' : 'text-zinc-300'}`}>
                      {ach.title}
                    </h3>
                    <p className="text-[10px] text-zinc-500 font-sans truncate max-w-[200px]">
                      {ach.issuer}
                    </p>
                  </div>

                  <ChevronRight className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-all
                    ${isActive ? 'translate-x-0 text-orange-400' : 'opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-zinc-500'}
                  `} />
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: HIGH-FIDELITY DETAILS PANELS */}
        <div className="lg:col-span-7 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedAch.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="space-y-6"
            >
              {/* PRIMARY HONOR BOARD */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 md:p-8 space-y-6 relative overflow-hidden text-left">
                
                {/* Visual Accent glow */}
                <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-orange-500/5 blur-[50px] rounded-full pointer-events-none" />

                <div className="space-y-1.5 flex flex-col items-start">
                  <span className="text-[10px] font-mono bg-orange-500/10 border border-orange-500/25 text-orange-400 px-2.5 py-1 rounded inline-block font-bold">
                    {selectedAch.category}
                  </span>
                  <h2 className="text-base md:text-lg font-bold font-display text-zinc-100 tracking-tight mt-2.5">
                    {selectedAch.title}
                  </h2>
                  <div className="text-xs font-mono text-zinc-500">
                    <span className="text-zinc-400">{selectedAch.issuer}</span>
                    <span className="mx-2">•</span>
                    <span>{selectedAch.date}</span>
                  </div>
                </div>

                <p className="text-xs text-zinc-350 leading-relaxed font-sans">
                  {selectedAch.description}
                </p>

                <div className="space-y-2">
                  <span className="text-[9px] font-mono text-zinc-555 uppercase tracking-wider block">VERIFICATION METRIC INDEX</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedAch.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-mono bg-zinc-950 px-2.5 py-0.5 rounded border border-zinc-800 text-zinc-350 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* DYNAMIC CASE: SENSORY SPECIAL DETAIL PANELS */}
              
              {/* CASE 1: GLOBAL OPEN SOURCE CONTRIBUTION PULL REQUEST (DEFAULT/SELECTED INTERACTIVITY FOCUS) */}
              {selectedAch.id === 'ach-opensource' && (
                <div id="github-pr-diff-panel" className="bg-[#0c0c0c] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl text-left">
                  {/* PR Header */}
                  <div className="bg-zinc-950 border-b border-zinc-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1 px-1.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 rounded font-mono text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <GitMerge className="w-3.5 h-3.5" />
                        <span>MERGED</span>
                      </div>
                      <div className="font-mono text-xs text-zinc-200">
                        <span className="font-bold">darshan-kumar-k-r</span> / <span className="text-zinc-450 text-[11px]">i18n-lang-repo</span> #412
                      </div>
                    </div>
                    {showConfettiEffect && (
                      <span className="text-[10px] font-mono text-emerald-400 animate-pulse font-bold bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20 rounded">
                        ★ BUILD SUCCESS
                      </span>
                    )}
                  </div>

                  {/* PR description details */}
                  <div className="p-4 border-b border-zinc-800 bg-zinc-950 space-y-2">
                    <h4 className="text-xs font-bold text-zinc-200">
                      feat: Implemented Hindi internationalization support
                    </h4>
                    <p className="text-[11px] text-zinc-400 font-sans">
                      Successfully translated core terminal telemetry components, prompt dictionaries, and operational diagnostics headers. Integrated dynamic locale routing with full RTL fallback matrices.
                    </p>
                  </div>

                  {/* Interactive Code Git Diff block */}
                  <div className="p-4 font-mono text-[10px] bg-black text-zinc-400 select-text overflow-x-auto">
                    <div className="text-zinc-650 text-[9px] border-b border-zinc-800 pb-1.5 mb-2 uppercase">
                      Git Branch Code Diff // locale/hi.json
                    </div>
                    
                    <div className="space-y-1 leading-snug">
                      <div className="text-zinc-550">@@ -0,0 +1,11 @@</div>
                      <div className="text-emerald-400 bg-emerald-950/15 px-1 font-bold">+ {"{"}</div>
                      <div className="text-emerald-400 bg-emerald-950/15 px-1 font-bold">+   "SYS_STATUS": "प्रणाली की स्थिति",</div>
                      <div className="text-emerald-400 bg-emerald-950/15 px-1 font-bold">+   "SYS_BOOT": "बूट अनुक्रम प्रारंभ",</div>
                      <div className="text-emerald-400 bg-emerald-950/15 px-1 font-bold">+   "COMS_DIAGNOSTICS": "संचार नैदानिक",</div>
                      <div className="text-emerald-400 bg-emerald-950/15 px-1 font-bold">+   "LEADER_DECLARED": "प्रमुख नोड घोषित",</div>
                      <div className="text-emerald-400 bg-emerald-950/15 px-1 font-bold">+   "ANOMALY_DETECTION": "विसंगति का पता लगाना",</div>
                      <div className="text-emerald-400 bg-emerald-950/15 px-1 font-bold">+   "THREAT_IDENTIFIED": "खतरे की पहचान की गई"</div>
                      <div className="text-emerald-400 bg-emerald-950/15 px-1 font-bold">+ {"}"}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* CASE 2: IEEE ICASI 2026 PUBLICATION ABSTRACT EXTENSION */}
              {selectedAch.id === 'ach-ieee-pub' && (
                <div className="p-4.5 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2 text-left">
                  <div className="flex items-center gap-1.5 text-[9px] font-mono text-orange-400 font-bold uppercase mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>PUBLIC MANUSCRIPT MEMO</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                    "This research demonstrates clustering capabilities over volatile dark web datasets. By translating cryptokey structures and using stylometry classifiers, we successfully mapped seller nodes operating on different marketplaces with 96.4% verified accuracy."
                  </p>
                </div>
              )}

              {/* CASE 3: TA & INTERNSHIP OTHER QUICK MEMOS */}
              {(selectedAch.id !== 'ach-opensource' && selectedAch.id !== 'ach-ieee-pub') && (
                <div className="p-4 bg-zinc-900/40 border border-zinc-800 rounded-xl space-y-2.5 text-left">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase block">CREDENTIAL META DIRECTIVES</span>
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Academic advisor approval signed // VTU CS Head</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>All operational hours checked and archived</span>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
