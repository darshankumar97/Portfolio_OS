/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  ChevronRight, 
  CheckCircle2, 
  Award,
  Layers,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ExperienceDetail {
  id: string;
  role: string;
  company: string;
  location: string;
  duration: string;
  type: string;
  tags: string[];
  bullets: string[];
  projectLink?: string;
  keyAchievement: string;
}

const EXPERIENCES: ExperienceDetail[] = [
  {
    id: 'exp-cyber-intern',
    role: 'Cloud Security & Intrusion Detection Systems Intern',
    company: 'Centre for Computer Networks and Cyber Security',
    location: 'Bengaluru, India',
    duration: '2025 (Internship)',
    type: 'Security Research',
    tags: ['ML Anomaly Detection', 'IDS Security Monitoring', 'Network Log Analysis', 'Cloud Security Practices', 'Distributed Environments'],
    bullets: [
      'Engineered Machine Learning models for anomaly detection, classifying high-threat network intrusion indicators and identifying threat vectors in real-time.',
      'Configured proactive security monitoring pipelines, analyzing heterogeneous network connection logs to trace scanning loops and spoofing vectors.',
      'Conducted packet-level deep network log analysis over large, high-throughput pipelines, storing forensics records in distributed environments.',
      'Evaluated cloud security practices against compliance baselines, sandboxing vulnerable endpoints inside isolated subnets.'
    ],
    keyAchievement: 'Successfully improved threat classification metrics by optimizing classification models to sub-millisecond latencies.'
  },
  {
    id: 'exp-cloud-ta',
    role: 'Cloud Computing Teaching Assistant',
    company: 'Department of Computer Science',
    location: 'B.E. Academic Lab',
    duration: '2024 - 2025',
    type: 'Academic Mentor',
    tags: ['Docker', 'Kubernetes', 'Jenkins CI/CD', 'Raft Consensus', 'MinIO Storage', 'Distributed Systems'],
    bullets: [
      'Instructed undergraduate engineers on Core Containers engineering, leading lab sessions on Dockerfile structures and isolated networking bridging.',
      'Supervised containerized deployments over multi-node Kubernetes clusters, focusing on Service accounts, LoadBalancers, and Ingress routing logs.',
      'Coordinated continuous integration pipelines with Jenkins, building automated compilation hooks and Docker build registries.',
      'Evaluated algorithmic simulation projects mapping Raft Consensuses and secure distributed object storage architectures using MinIO clusters.'
    ],
    keyAchievement: 'Led mentoring programs for over 120 students, assisting teams in completing complex multi-node container orchestrations.'
  }
];

export default function ExperienceView() {
  const [selectedExpId, setSelectedExpId] = useState<string>('exp-cyber-intern');

  const selectedExp = EXPERIENCES.find(e => e.id === selectedExpId) || EXPERIENCES[0];

  return (
    <div id="experience-view-container" className="p-8 md:p-12 space-y-10 font-sans text-zinc-200 select-none selection:bg-zinc-800">
      
      {/* Editorial Header */}
      <div className="border-b border-zinc-800 pb-8">
        <div className="flex items-center gap-2 text-[10px] text-zinc-500 tracking-widest uppercase mb-1.5 font-medium">
          <Briefcase className="w-3.5 h-3.5 text-zinc-400" />
          <span>Professional Experience</span>
        </div>
        <h1 className="text-xl md:text-2xl font-light text-white tracking-tight">
          Engineering & Research History
        </h1>
        <p className="text-zinc-400 text-xs md:text-sm mt-2 max-w-xl leading-relaxed text-left">
          Track record operating machine learning threat detection models, analyzing system architectures, and mentoring academic groups.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* LEFT COLUMN: ROLES NAVIGATION */}
        <div className="lg:col-span-5 space-y-4 text-left">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-medium">
            Professional Roles
          </span>

          <div className="space-y-2">
            {EXPERIENCES.map((exp) => {
              const isActive = exp.id === selectedExpId;
              return (
                <button
                  key={exp.id}
                  onClick={() => setSelectedExpId(exp.id)}
                  className={`w-full text-left p-4 rounded-2xl border flex flex-col gap-2 relative overflow-hidden group transition-all duration-200 cursor-pointer
                    ${isActive 
                      ? 'bg-zinc-900 border-zinc-650' 
                      : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                    }
                  `}
                >
                  {isActive && (
                    <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-zinc-400" />
                  )}

                  <div className="flex justify-between items-center w-full">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
                      {exp.duration}
                    </span>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'text-zinc-300' : 'text-zinc-600 group-hover:text-zinc-450'}`} />
                  </div>

                  <div>
                    <h3 className={`text-xs font-semibold leading-normal uppercase tracking-wider transition-colors ${isActive ? 'text-white' : 'text-zinc-450 group-hover:text-zinc-300'}`}>
                      {exp.role}
                    </h3>
                    <p className="text-[10px] font-mono text-zinc-550 mt-1">
                      {exp.company}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Core Competency focus highlights (Not fake decorative percentages) */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 space-y-4">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-medium">Core Capabilities</span>
            <div className="space-y-3 font-sans text-xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-medium block">Machine Learning Security</span>
                  <span className="text-zinc-500 text-[11px] leading-relaxed block">Classifying telemetry patterns and evaluating neural logs at microseconds speeds.</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-medium block">Distributed Databases & Storage</span>
                  <span className="text-zinc-500 text-[11px] leading-relaxed block">Maintaining failover replication states, S3 integrations, and transaction logs.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DETAIL SHEET */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedExp.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 md:p-8 space-y-6 text-left"
            >
              <div className="space-y-3 border-b border-zinc-805 pb-5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-300 px-2.5 py-0.5 rounded-full uppercase tracking-widest font-mono">
                    {selectedExp.type}
                  </span>
                  <div className="flex items-center gap-1 text-zinc-500 font-mono text-[9px] uppercase tracking-wider">
                    <span>{selectedExp.location}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h2 className="text-sm md:text-base font-semibold tracking-wider text-white uppercase">
                    {selectedExp.role}
                  </h2>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-xs text-zinc-400">
                    <span className="font-semibold text-zinc-300">{selectedExp.company}</span>
                    <span className="text-zinc-600 font-mono">•</span>
                    <span className="text-zinc-500 font-mono text-[11px]">{selectedExp.duration}</span>
                  </div>
                </div>
              </div>

              {/* Bullets */}
              <div className="space-y-4">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-medium">
                  Operational Experience Scope
                </span>
                <ul className="space-y-3 text-zinc-400 font-sans text-xs">
                  {selectedExp.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex gap-3 leading-relaxed">
                      <span className="text-zinc-600 shrink-0 select-none">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Milestone Achievement Indicator */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex gap-3 text-xs leading-relaxed items-start text-zinc-300">
                <Award className="w-4.5 h-4.5 text-zinc-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Key Technical Milestone</span>
                  <p className="text-zinc-400 text-[11px] mt-0.5 font-sans leading-normal">
                    {selectedExp.keyAchievement}
                  </p>
                </div>
              </div>

              {/* Tech Tags */}
              <div className="space-y-2 border-t border-zinc-805 pt-5 text-xs">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-medium">Applied Domain Tools</span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedExp.tags.map(tag => (
                    <span key={tag} className="text-[9px] font-mono bg-zinc-900 px-2.5 py-1 rounded-md border border-zinc-800 text-zinc-300 select-text">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
