/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProjectItem, ResearchItem, ExperienceItem, SkillGroup, JournalEntry } from '../types/os';

/**
 * DevOS Dynamic Loader Registry
 * This houses the architecture and loader frameworks for DevOS schema stores.
 * It is fully type-safe and simulates dynamic network queries/filesystem reads.
 */

// Schema Registry Interfaces
export interface ArchitectureMap {
  nodeId: string;
  label: string;
  type: 'microservice' | 'database' | 'queue' | 'cache' | 'gateway';
  connections: string[];
}

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'pdf' | 'diagram';
}

export const ProjectSchemaStore = {
  // Skeleton / Dynamic Blueprint for future validation
  validate: (data: unknown): data is ProjectItem => {
    if (typeof data !== 'object' || data === null) return false;
    const p = data as ProjectItem;
    return (
      typeof p.id === 'string' &&
      typeof p.title === 'string' &&
      typeof p.tagline === 'string' &&
      Array.isArray(p.technologies)
    );
  }
};

export const ResearchSchemaStore = {
  validate: (data: unknown): data is ResearchItem => {
    if (typeof data !== 'object' || data === null) return false;
    const r = data as ResearchItem;
    return typeof r.id === 'string' && typeof r.title === 'string' && Array.isArray(r.tags);
  }
};

// Dynamic data loaders (In Phase 1, these return the architectural blueprint structures)
export async function loadProjects(): Promise<ProjectItem[]> {
  // Architecture only - returns structural blueprints demonstrating loading pipelines
  return [
    {
      id: 'proj-omega',
      title: 'DevOS Core Engine',
      tagline: 'High-performance containerized UI system with native virtual machine, layout engine, and visual task scheduler.',
      category: 'Systems Engineering',
      technologies: ['React 19', 'Tailwind v4', 'Framer Motion', 'TypeScript'],
      status: 'production',
      metrics: [
        { label: 'Refresh Rate', value: '120Hz' },
        { label: 'Z-Index Stack Depth', value: '1,000+' },
        { label: 'Render Latency', value: '<2ms' }
      ]
    },
    {
      id: 'proj-distributed-db',
      title: 'Ultra-low Latency Multi-region Cache router',
      tagline: 'Event-driven consistent hash ring router over geo-distributed clusters with Raft consensus coordination.',
      category: 'Distributed Systems',
      technologies: ['C++', 'gRPC', 'Protobuf', 'Redis Cluster'],
      status: 'active-dev',
      metrics: [
        { label: 'P99 Latency', value: '0.8ms' },
        { label: 'Throughput', value: '250k rps' }
      ]
    },
    {
      id: 'proj-autonomous',
      title: 'Automated Pipeline Graph Scheduler',
      tagline: 'Direct Acyclic Graph (DAG) orchestration engine featuring dynamic prioritization and zero-overhead thread pools.',
      category: 'Compiler & Tooling',
      technologies: ['Go', 'WebAssembly', 'Docker Engine API'],
      status: 'active-dev',
      metrics: [
        { label: 'Scheduling Cost', value: 'O(log N)' },
        { label: 'Throughput', value: '1.2M jobs/sec' }
      ]
    }
  ];
}

export async function loadResearch(): Promise<ResearchItem[]> {
  return [
    {
      id: 'res-distributed-consensus',
      title: 'Optimizing Raft Consensuses under Heavy Network Partitioning and Partition Fluctuations',
      abstract: 'A rigorous evaluation of consensus protocols operating under high packet corruption and transient route drops common to deep-cloud topologies.',
      date: '2026-04-12',
      tags: ['Consensus', 'Raft', 'Network Jitter', 'Cloud Topologies'],
      publications: [{ outlet: 'IEEE Distributed Systems Journal', link: '#' }],
      keyFindings: [
        'Dynamically adjusting heartbeats based on sliding-window RTT reduces elect failures by 41%.',
        'Epoch-based term voting completely prevents split-brain loops in deep subnet configurations.'
      ]
    },
    {
      id: 'res-edge-inference',
      title: 'Sub-10ms Model Quantization Strategies for Deep Edge Runtime Processors',
      abstract: 'Analysis of aggressive INT4/MSB clipping inside dynamic container bounds to maximize inferencing density without sacrificing activation integrity.',
      date: '2025-11-20',
      tags: ['Edge AI', 'Quantization', 'Embedded Runtimes', 'Assembly Optimization'],
      keyFindings: [
        'INT4 dynamic scaling maintains 98.7% task precision under severe edge thermal throttling.',
        'Slicing convolution maps via SIMD pipeline registers speeds up local throughput by 3.2x.'
      ]
    }
  ];
}

export async function loadExperience(): Promise<ExperienceItem[]> {
  return [
    {
      id: 'exp-lead-system',
      role: 'Principal Systems Architect',
      company: 'NextGen Systems',
      location: 'Bengaluru, India',
      duration: '2024 - Present',
      highlights: [
        'Pioneered core orchestration platform executing over 5M parallel worker tasks globally.',
        'Migrated monolithic data pipelines into highly compliant event-driven microservices reducing ingress bandwidth cost by 35%.'
      ],
      skillsAssociated: ['Go', 'Kubernetes', 'gRPC', 'Distributed Databases']
    },
    {
      id: 'exp-senior-eng',
      role: 'Senior Software Engineer',
      company: 'Sigma Labs',
      location: 'Electronic City, Bengaluru',
      duration: '2022 - 2024',
      highlights: [
        'Spearheaded high-performance telemetry pipeline ingest handling 100TB daily streaming metrics.',
        'Crafted real-time visualization frameworks with sub-millisecond redraw pipelines.'
      ],
      skillsAssociated: ['Rust', 'WebAssembly', 'TypeScript', 'WebSockets']
    }
  ];
}

export async function loadSkills(): Promise<SkillGroup[]> {
  return [
    {
      category: 'Core Engineering',
      skills: [
        { name: 'Distributed Systems', proficiency: 95, years: 5 },
        { name: 'Systems Design & Architecture', proficiency: 92, years: 6 },
        { name: 'Performance Tuning & Optimization', proficiency: 90, years: 4 },
        { name: 'Compilers & DAG Orchestrators', proficiency: 85, years: 3 }
      ]
    },
    {
      category: 'Languages & Tech',
      skills: [
        { name: 'TypeScript / React', proficiency: 94, years: 5 },
        { name: 'Rust', proficiency: 88, years: 3 },
        { name: 'Go', proficiency: 90, years: 4 },
        { name: 'C++ / Assembly', proficiency: 80, years: 2 }
      ]
    }
  ];
}
