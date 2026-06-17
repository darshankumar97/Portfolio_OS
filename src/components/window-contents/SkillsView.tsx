/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Sliders, 
  Terminal, 
  Cpu, 
  Settings, 
  ShieldAlert, 
  Layers, 
  Database,
  Cloud,
  Workflow,
  Cpu as MLIcon,
  Server
} from 'lucide-react';
import { motion } from 'motion/react';

interface SkillVector {
  category: string;
  proficiency: number;
  icon: any;
  color: string;
  description: string;
  subskills: string[];
}

const SKILL_MATRIX: SkillVector[] = [
  {
    category: 'Programming',
    proficiency: 94,
    icon: Terminal,
    color: 'from-blue-600 to-sky-400 border-blue-500/20',
    description: 'Expertise writing highly optimized native, compiled, and type-safe codebase architectures.',
    subskills: ['TypeScript', 'Go', 'Rust', 'C++', 'Java']
  },
  {
    category: 'Backend',
    proficiency: 92,
    icon: Server,
    color: 'from-purple-600 to-indigo-400 border-purple-500/20',
    description: 'Constructing resilient web architectures, RPC controllers, and low-latency network routes.',
    subskills: ['Express', 'gRPC / Protobuf', 'WebSockets', 'REST APIs', 'Node.js']
  },
  {
    category: 'Cloud',
    proficiency: 88,
    icon: Cloud,
    color: 'from-cyan-600 to-blue-450 border-cyan-500/20',
    description: 'Provisioning distributed hosting pipelines, virtual networking, sub-network isolation, and load balancers.',
    subskills: ['Google Cloud Platform', 'AWS Services', 'Cloud Run', 'VPC Routing', 'IP Rotation']
  },
  {
    category: 'Security',
    proficiency: 91,
    icon: ShieldAlert,
    color: 'from-red-600 to-rose-400 border-red-500/20',
    description: 'Evaluating intrusion vulnerabilities, active threat intelligence pipelines, and cryptography guidelines.',
    subskills: ['Intrusion Detection (IDS)', 'Vulnerability Sandboxing', 'Network Forensics', 'Tor Proxy Nodes']
  },
  {
    category: 'Databases',
    proficiency: 89,
    icon: Database,
    color: 'from-emerald-600 to-teal-400 border-emerald-500/20',
    description: 'Designing transactional models, hash ring routers, cache systems, and objects storage clusters.',
    subskills: ['PostgreSQL', 'Redis Clusters', 'MinIO/S3 Storage', 'Dynamic SQL', 'NoSQL Engines']
  },
  {
    category: 'DevOps',
    proficiency: 93,
    icon: Workflow,
    color: 'from-orange-600 to-amber-400 border-orange-500/20',
    description: 'Automating continuous integration, containerization boundaries, and multi-node cluster deployments.',
    subskills: ['Docker Namespaces', 'Kubernetes Clusters', 'Jenkins CI/CD', 'Helm Charts', 'Service Accounts']
  },
  {
    category: 'Machine Learning',
    proficiency: 86,
    icon: MLIcon,
    color: 'from-pink-600 to-rose-450 border-pink-500/20',
    description: 'Applying NLP word embeddings, unsupervised spatial clustering models, and classification trees.',
    subskills: ['Anomaly Classification', 'DBSCAN Clusters', 'BERT/TF-IDF Stylometry', 'Random Forests']
  },
  {
    category: 'Architecture',
    proficiency: 95,
    icon: Layers,
    color: 'from-violet-600 to-fuchsia-400 border-violet-500/20',
    description: 'Designing highly consistent cluster agreements, state nodes synchronization, and event-driven routes.',
    subskills: ['Raft Consensus', 'Distributed Hash Rings', 'Event-Driven Microservices', 'DAG Schedulers']
  }
];

export default function SkillsView() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div id="skills-view-container" className="p-6 md:p-8 space-y-6 font-sans text-white select-none selection:bg-neutral-800">
      
      {/* Editorial Header */}
      <div className="border-b border-zinc-800/80 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-zinc-550 font-mono uppercase tracking-widest mb-1">
            <Sliders className="w-3.5 h-3.5 text-blue-500" />
            <span>Section 05 // Technical Competencies</span>
          </div>
          <h1 className="text-xl md:text-2xl font-display font-medium text-white tracking-tight">
            Comprehensive Skill Index
          </h1>
          <p className="text-zinc-400 text-xs md:text-sm mt-1 max-w-xl">
            Multi-dimensional evaluation across systems coordination, container configurations, and active threat telemetry vectors.
          </p>
        </div>

        <div className="text-[10px] font-mono text-zinc-500 bg-zinc-950 border border-zinc-900 rounded-lg px-3 py-1.5 self-start">
          <span>8 BLOCKS CALIBRATED</span>
        </div>
      </div>

      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {SKILL_MATRIX.map((item, idx) => {
          const SkillIcon = item.icon;
          const isSelected = selectedCategory === item.category;

          return (
            <motion.div
              id={`skills-bento-card-${idx}`}
              key={item.category}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelectedCategory(isSelected ? null : item.category)}
              className={`p-5 rounded-xl border bg-zinc-950/40 text-left transition-all duration-200 cursor-pointer overflow-hidden relative group
                ${isSelected 
                  ? 'border-white/20 select-text scale-102 ring-1 ring-white/10' 
                  : 'border-zinc-900 hover:border-zinc-800'
                }
              `}
            >
              {/* Backlit glow for hover */}
              <div className="absolute top-[-20%] right-[-10%] w-20 h-20 bg-white/5 blur-[25px] rounded-full group-hover:bg-white/10 transition-colors" />

              <div className="flex justify-between items-center mb-3">
                <span className="p-2 rounded-lg bg-zinc-950 border border-zinc-900 group-hover:border-zinc-850 text-zinc-400 group-hover:text-white transition-colors">
                  <SkillIcon className="w-4 h-4" />
                </span>
                <span className="text-xs font-mono text-blue-400 font-bold">
                  {item.proficiency}%
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-xs font-bold text-zinc-100 font-mono tracking-wide uppercase">
                  {item.category}
                </h3>
                <p className="text-[11px] text-zinc-400 leading-snug font-sans block pt-1 min-h-[50px]">
                  {item.description}
                </p>
              </div>

              {/* Progress Gauge bar */}
              <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden mt-3 mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.proficiency}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.05 }}
                  className={`h-full bg-gradient-to-r ${item.color}`}
                />
              </div>

              {/* Tag pills */}
              <div className="flex flex-wrap gap-1 pt-1.5">
                {item.subskills.map(sub => (
                  <span key={sub} className="text-[9px] font-mono px-1.5 py-0.5 bg-neutral-950 border border-zinc-900/60 text-zinc-500 group-hover:text-zinc-400 rounded transition-colors">
                    {sub}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Auxiliary Matrix Stats */}
      <div className="flex items-center justify-between border-t border-zinc-900 pt-6 text-[10px] font-mono text-zinc-550">
        <div className="flex items-center gap-1.5">
          <Settings className="w-3.5 h-3.5 animate-spin" />
          <span>SELF-DIAGNOSING SKILL CALIBRATION ENGINE</span>
        </div>
        <span>COMPLIANCE STATE: ACCREDITED</span>
      </div>

    </div>
  );
}
