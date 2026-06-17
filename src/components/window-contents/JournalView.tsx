/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Terminal, 
  Search, 
  Calendar, 
  Clock, 
  Tag, 
  ArrowLeft, 
  Copy, 
  Check, 
  Share2, 
  ExternalLink,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface JournalPost {
  id: string;
  title: string;
  category: 'System Design' | 'Architecture' | 'Research' | 'Development Learnings';
  publishDate: string;
  readingTime: string;
  summary: string;
  tags: string[];
  content: string;
}

const JOURNAL_POSTS: JournalPost[] = [
  {
    id: 'dist-pipeline-ingest',
    title: 'Designing a High-Availability Distributed Ingestion Pipeline',
    category: 'System Design',
    publishDate: '2026-05-12',
    readingTime: '6 min read',
    summary: 'Architecting a fault-tolerant message pipeline utilizing Raft consensus agreements, multi-lane Redis memory tables, and parallel consumer groups.',
    tags: ['Distributed Systems', 'Raft Consensus', 'Redis', 'Node.js', 'Go'],
    content: `# Designing a High-Availability Distributed Ingestion Pipeline

## Executive Overview
When systems digest upwards of **50,000 requests per second (RPS)**, standard transactional routers choke on thread exhaustion and TCP socket locks. This publication evaluates the architecture of a fault-tolerant distributed ingestion pipeline capable of zero-loss operations during failover cycles.

We focus on isolating ingress nodes, establishing a reliable memory buffer, and coordinating worker clusters.

## 1. System Architecture Blueprint
The solution splits concerns into three independent scaling horizons:

\`\`\`
[ INGRESS NODES ] ---> [ DISTRIBUTED BUFFER ] ---> [ Parallel Consumer Pools ]
 (Nginx Proxy)             (Redis Clusters)                (Worker Nodes)
\`\`\`

- **Ingress Layer**: Stateless Express/Go microservices behind an Nginx packet proxy running IP-hashing load balancing.
- **Buffer Layer**: Redis cluster running partitioned hash rings with a primary replica set. Writes block only long enough to persist to memory.
- **Consumer Layer**: Autoscale workers pulling logs from streams using worker-specific group offsets.

## 2. Ingress Router Implementation (TypeScript Specmen)
Below is the highly micro-optimized Express server middleware for fast queuing:

\`\`\`typescript
import express from 'express';
import Redis from 'ioredis';

const app = express();
const redis = new Redis(process.env.REDIS_CLUSTER_URL!);

// Pre-allocated static buffers to avoid GC thrashing
const HEARTBEAT_PAYLOAD = Buffer.from(JSON.stringify({ status: 'ACK', offset_synced: true }));

app.post('/api/v1/telemetry/dispatch', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const payloadBuffer = req.body;
    
    // Non-blocking stream queue ingestion
    const streamKey = \`stream:telemetry:\${Date.now() % 8}\`;
    await redis.xadd(streamKey, '*', 'payload', payloadBuffer);
    
    res.setHeader('Content-Type', 'application/json');
    return res.end(HEARTBEAT_PAYLOAD);
  } catch (err) {
    console.error('[CRITICAL] Queue saturation:', err);
    res.statusCode = 503;
    return res.end(JSON.stringify({ error: 'BUFFER_SATURATED_FAIL' }));
  }
});
\`\`\`

## 3. Achieving Resiliency with Raft Consensus
To coordinate metadata offsets safely across multiple worker nodes, we apply a **Raft Consensus State Machine**:

> "State engines must reject corrupt worker offsets. A leader is elected uniformly using randomized timers, ensuring matching split-brain prevention."

### Consensus Benchmarks
During simulated failover where 2 of 5 coordination servers were forcefully shut down:
* **Detection window**: 150ms
* **Re-leader Convergence**: 280ms
* **Zero Message Losses Recorded** throughout the replication freeze.

---
*Note: Full benchmark logs are accessible in the Master Console / Admin view under telemetry.*`
  },
  {
    id: 'container-cold-starts',
    title: 'Zero-Cold-Start Container Boundary Isolation in Cloud Run',
    category: 'Architecture',
    publishDate: '2026-06-02',
    readingTime: '5 min read',
    summary: 'Evaluating techniques to compress container image sizes, bypass type-checking at boot, and maintain hot runtime routes in isolated cloud environments.',
    tags: ['Cloud Run', 'Docker Namespaces', 'Micro-Optimizations', 'esbuild'],
    content: `# Zero-Cold-Start Container Boundary Isolation

## The Anatomy of a Cold Start
In cloud-native serverless models, container scaling latency is dominated by two factors: **image fetch boundaries** and **index loading loops**. When a scale-from-zero event trigger occurs, the hypervisor allocates the CPU micro-cores, mounts network disks, fetches the container image metadata, and spawns the entry process.

We benchmarked a typical compiled microservice and compiled cold-start metrics:

* **Base OS loading**: 120ms
* **Node runtime allocation**: 280ms
* **Library package parsing (e.g. standard lodash/jwt imports)**: 650ms ! (The prime bottleneck)
* **Application module bindings**: 40ms

Total bootstrap cycle: **1,090ms**. For consumer applications, a 1-second delay results in double-digit dropoff rates.

## 1. Image Compaction Strategy
We replace bloated Debian-based base images with highly isolated alpine structures. By compiling all backend assets into a single combined file using \`esbuild\`, we bypass Node's nested \`node_modules\` filesystem scans.

### Optimized Dockerfile Specmen
\`\`\`dockerfile
# Stage 1: Build & Bundle
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx esbuild server.ts --bundle --platform=node --format=cjs --minify --outfile=dist/server.cjs

# Stage 2: Tiny runtime
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist/server.cjs .
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "server.cjs"]
\`\`\`

Using this multi-stage compilation pipeline, our container size shrank from **486MB** to **82MB**, reducing the fetch phase latency from **400ms to 45ms**.

## 2. Dynamic Initialization & Module Laziness
Instead of initializing third-party API clients at top-level module load time, wrap client construction in a lazy singleton getter. This avoids loading decryption libraries until the absolute moment they are invoked:

\`\`\`typescript
// Anti-pattern: saturates startup threads
// import StellarAuth from 'stellar-auth-sdk';
// const client = new StellarAuth({ key: process.env.API_KEY });

// Highly Optimized Singleton
let authClient: any = null;

export function getAuthClient() {
  if (!authClient) {
    const StellarAuth = require('stellar-auth-sdk'); // Loaded lazily dynamically
    authClient = new StellarAuth({ key: process.env.API_KEY });
  }
  return authClient;
}
\`\`\`

## 3. Empirical Results
By applying **Image Compaction** and **Lazy Singletons**, our container cold start plummeted from **1,090ms to 184ms**. 
This is virtually unnoticeable to endpoints, enabling true scale-from-zero cost savings with zero performance penalties.`
  },
  {
    id: 'stylometry-clustering',
    title: 'TF-IDF Stylometry & Spatial Clustering in Unsupervised ML',
    category: 'Research',
    publishDate: '2026-04-29',
    readingTime: '8 min read',
    summary: 'Using TF-IDF matrices, DBSCAN clustering algorithms, and cosine similarity fields to trace anonymous code fragments back to original developers.',
    tags: ['Machine Learning', 'TF-IDF', 'DBSCAN Clusters', 'Mathematics'],
    content: `# TF-IDF Stylometry & Spatial Clustering in Forensic Analysis

## Introduction
Can we uniquely identify who wrote a program simply by evaluating syntactic patterns? In forensics stylometry, we treat code as a fingerprint. Every developer carries micro-habits: indentation styles, variable length ratios, choices of loops, and particular library allocations.

This publication documents our research applying Unsupervised Machine Learning to classify anonymous software submissions.

## 1. Mathematical Formulation
To represent source code as a dense numerical vector room, we use a custom **Term Frequency-Inverse Document Frequency (TF-IDF)** formulation tuned for programming language lexers:

$$TF(t, d) = \\frac{\\text{Frequency of lexeme } t \\text{ in code } d}{\\text{Total lexemes in } d}$$

$$IDF(t, D) = \\log \\left( \\frac{1 + |D|}{1 + |\\{d \\in D : t \\in d\\}|} \\right) + 1$$

By calculating $W_{t, d} = TF(t, d) \\times IDF(t, d)$, we generate an $N$-dimensional vector for each file, where unique keywords and custom declarations receive high weights, while standard boilerplate tokens are deprioritized.

## 2. Spatial Clustering using DBSCAN
Standard $K$-Means clustering fails on programmatic signatures because the data is highly non-spherical and contains arbitrary noise. We instead apply **Density-Based Spatial Clustering of Applications with Noise (DBSCAN)**.

DBSCAN requires two hyperparameters:
- $\\epsilon$ (Epsilon): The maximum distance between two vector nodes to associate them.
- $MinPts$ (Minimum points): The structural core cluster threshold.

### Cosine Distance Algorithm Specmen
\`\`\`typescript
export function computeCosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
\`\`\`

## 3. Core Findings
Our model was trained on **4,200 anonymous files** submitted by 60 experimental candidates:
1. **DBSCAN successfully clustered 89.2% of submissions** into 57 clear author silos.
2. **Noise ratio capped at 10.8%**, representing developers switching between heavily-enforced prettier rulesets.
3. Code comments, bracket spaces, and binary logic expressions yielded the strongest stylometric entropy signals.`
  },
  {
    id: 'react19-learnings',
    title: 'Optimizing Complex Client States in React 19',
    category: 'Development Learnings',
    publishDate: '2026-06-15',
    readingTime: '4 min read',
    summary: 'Breaking down the new action abstractions, stabilization rules for Hook lists, and key methods to prevent unnecessary client-side DOM repaints.',
    tags: ['React 19', 'Performance', 'TypeScript', 'Web Architecture'],
    content: `# Optimizing Complex Client States in React 19

## Hook Stabilization Rules
React 19 brings exciting improvements, but managing state over virtual desktop environments (like our OS window manager) demands extreme rendering discipline. When users drag windows, they can cause hundreds of layout reassessments per second. If your rendering hooks are unstable, you will experience heavy lag and frame thrashing.

### Golden Rule of UseEffect Arrays
> "Never include arrays or custom objects directly in your Hook dependency lists unless they are memoized by \`useMemo\` or locked outside the React cycle. Always prefer primitive numbers and booleans."

## 1. Tracking State Cycles Efficiently
Instead of calling a parent setter on every pixel update during dragging, use a temporary React Ref to mutate layout variables in real-time, then flush the coordinates to persistent state only on window release (onMouseUp).

\`\`\`typescript
// ❌ High-latency redraw trigger on every mouse tick:
// onDrag={(x, y) => setCoordinates({ x, y })}

// ✅ Fluid 60fps Ref Buffer structure:
const dragOffsetRef = useRef({ x: 0, y: 0 });

const handleMouseMove = (e: MouseEvent) => {
  dragOffsetRef.current = {
    x: e.clientX - startX,
    y: e.clientY - startY
  };
  
  // Directly write to the raw HTML node style for 0ms rekey repaint
  const element = document.getElementById(activeWindowId);
  if (element) {
    element.style.transform = \`translate3d(\${dragOffsetRef.current.x}px, \${dragOffsetRef.current.y}px, 0)\`;
  }
};
\`\`\`

## 2. Preventing Multi-List Rendering Scenarios
When we render large tables (such as the Project Registry logs or Review indices), updating a single cell shouldn't re-paint all rows. Wrap individual children list cards in \`React.memo\` with a specialized comparator function checking ID match and rate states:

\`\`\`typescript
import React from 'react';

const ProjectRowItem = React.memo(({ item, onSelect }) => {
  return (
    <tr className="border-b border-zinc-900 font-mono text-[11px] hover:bg-white/5 transition-colors">
      <td>{item.id}</td>
      <td>{item.status}</td>
    </tr>
  );
}, (prevProps, nextProps) => {
    // Only repaint if status actually modified
    return prevProps.item.status === nextProps.item.status;
});
\`\`\`

## 3. Summary Performance Checklist
1. Wrap all dynamic SVG grids in isolated context nodes.
2. Run window dragging operations using lightweight CSS \`translate3d\` which utilizes GPU acceleration.
3. Leverage Node \`ResizeObserver\` rather than window-wide resize hooks to prevent global layout thrashing.`
  }
];

export default function JournalView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  // Filter posts based on search and category tab
  const filteredPosts = useMemo(() => {
    return JOURNAL_POSTS.filter((post) => {
      const matchSearch = 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchCategory = selectedCategory === 'All' || post.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [searchTerm, selectedCategory]);

  const activePost = JOURNAL_POSTS.find(p => p.id === activePostId);

  // Customized monospaced Markdown-to-HTML element translator
  const parseMarkdownToReact = (text: string) => {
    return text.split('\n').map((line, idx) => {
      const trimmedLine = line.trim();

      // Heading 1
      if (trimmedLine.startsWith('# ')) {
        return (
          <h1 key={idx} className="text-lg md:text-xl font-bold font-mono tracking-tight text-white uppercase border-b border-zinc-900 pb-2 mt-6 mb-4">
            {trimmedLine.replace('# ', '')}
          </h1>
        );
      }

      // Heading 2
      if (trimmedLine.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-xs md:text-sm font-bold font-mono text-blue-400 uppercase mt-5 mb-2 flex items-center gap-1">
            <span>&gt;&gt;</span> {trimmedLine.replace('## ', '')}
          </h2>
        );
      }

      // Heading 3
      if (trimmedLine.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-xs font-bold font-mono text-zinc-300 mt-4 mb-2">
            {trimmedLine.replace('### ', '')}
          </h3>
        );
      }

      // Blockquotes
      if (trimmedLine.startsWith('> ')) {
        return (
          <blockquote key={idx} className="border-l-2 border-blue-500 bg-neutral-950 px-4 py-3 text-zinc-400 italic rounded text-[11px] font-sans my-4 leading-relaxed">
            {trimmedLine.replace('> ', '').replace(/"/g, '')}
          </blockquote>
        );
      }

      // Bullet Lists
      if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
        const listText = trimmedLine.substring(2);
        
        // Render simple inline backticks inside lists
        const parsedListText = parseInlineCodeAndMath(listText);
        return (
          <ul key={idx} className="list-disc pl-5 py-0.5 space-y-1 font-sans text-xs text-zinc-350">
            <li>{parsedListText}</li>
          </ul>
        );
      }

      // Code blocks (very simple check - handled separately in larger code block parsing if needed, 
      // but we do simple line-by-line helper or block checks)
      if (trimmedLine.startsWith('`') && trimmedLine.endsWith('`') && !trimmedLine.startsWith('```')) {
        return (
          <div key={idx} className="bg-neutral-950 border border-zinc-900 text-emerald-400 px-3 py-1.5 rounded-md font-mono text-[10px] my-2 overflow-x-auto">
            {trimmedLine.replace(/\`/g, '')}
          </div>
        );
      }

      // Math/Formula markers block rendering
      if (trimmedLine.startsWith('$$') && trimmedLine.endsWith('$$')) {
        return (
          <div key={idx} className="bg-neutral-950/60 border border-zinc-900/60 text-indigo-300 p-4 rounded-xl text-center font-mono text-[10px] my-3">
            {trimmedLine.replace(/\$\$/g, '')}
          </div>
        );
      }

      // Block separator Rule line
      if (trimmedLine === '---') {
        return <hr key={idx} className="border-zinc-900 my-6" />;
      }

      // Handle lines which are part of code snippets (we style code snippets highly)
      // Note: for simplistic approach, code block chunks inside content are filtered beautifully
      return (
        <p key={idx} className="text-zinc-300 font-sans text-xs md:text-[13px] leading-relaxed mb-3.5 text-justify">
          {parseInlineCodeAndMath(trimmedLine)}
        </p>
      );
    });
  };

  // Safe helper to render strings with high-fidelity `code` tags inline
  const parseInlineCodeAndMath = (line: string) => {
    if (!line) return '';
    const parts: React.ReactNode[] = [];
    let currentIdx = 0;
    
    // Process markdown inline code blocks like `esbuild` or mathematical formulas like $TF-IDF$
    const inlineRegex = /`([^`]+)`|\$([^\$]+)\$/g;
    let match;
    
    while ((match = inlineRegex.exec(line)) !== null) {
      // Add text before match
      if (match.index > currentIdx) {
        parts.push(line.substring(currentIdx, match.index));
      }
      
      // If code match
      if (match[1]) {
        parts.push(
          <code key={match.index} className="px-1.5 py-0.5 bg-neutral-950 border border-zinc-900 text-emerald-400 rounded text-[11px] font-mono">
            {match[1]}
          </code>
        );
      } 
      // If math match
      else if (match[2]) {
        parts.push(
          <span key={match.index} className="px-1.5 py-0.5 bg-neutral-950/45 border border-zinc-900/50 text-indigo-300 font-mono text-[11px]">
            {match[2]}
          </span>
        );
      }
      
      currentIdx = inlineRegex.lastIndex;
    }
    
    if (currentIdx < line.length) {
      parts.push(line.substring(currentIdx));
    }
    
    return parts.length > 0 ? parts : line;
  };

  const handleCopyPostLink = (id: string) => {
    const fakeUrl = `https://darshankumar.me/journal/${id}`;
    navigator.clipboard.writeText(fakeUrl).then(() => {
      setCopiedPostId(id);
      setTimeout(() => setCopiedPostId(null), 2000);
    });
  };

  const handleLeaveArticleReview = () => {
    // Switch to peer evaluation window dynamically
    const event = new CustomEvent('devos-switch-window', { 
      detail: { 
        targetId: 'reviews',
        articleId: activePostId,
        articleTitle: activePost?.title
      } 
    });
    window.dispatchEvent(event);
  };

  return (
    <div id="journal-view-container" className="h-full flex flex-col font-sans text-zinc-100 select-none bg-black/15 selection:bg-neutral-800">
      
      {/* HEADER SECTION (Static inside window) */}
      <div className="p-6 border-b border-zinc-900 bg-neutral-950/20 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] text-zinc-550 font-mono uppercase tracking-widest mb-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
              <span>Section 09 // Systems Publications</span>
            </div>
            <h1 className="text-xl font-display font-medium text-white tracking-tight">
              Systems Engineering Journal
            </h1>
            <p className="text-zinc-500 text-[11px] font-mono mt-0.5 uppercase tracking-wide">
              Markdown telemetry detailing system design, micro-optimization metrics, and machine learning models.
            </p>
          </div>

          {/* Search box */}
          {!activePostId && (
            <div className="relative max-w-xs w-full self-start md:self-center">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="journal-search"
                type="text"
                placeholder="Search telemetry..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-neutral-950 border border-zinc-900 focus:border-zinc-700 outline-none rounded-lg pl-9 pr-4 py-2 text-xs font-mono placeholder:text-zinc-650 text-white"
              />
            </div>
          )}
        </div>

        {/* Tab Filters (Visible only in Catalog view) */}
        {!activePostId && (
          <div className="flex gap-2 mt-4 flex-wrap text-[10px] font-mono">
            {['All', 'System Design', 'Architecture', 'Research', 'Development Learnings'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer
                  ${selectedCategory === cat 
                    ? 'border-blue-500/20 bg-blue-500/10 text-blue-400 font-bold' 
                    : 'border-zinc-900 bg-zinc-950/40 text-zinc-400 hover:text-white hover:border-zinc-800'
                  }
                `}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* WINDOW VIEW CONTENTS */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <AnimatePresence mode="wait">
          {!activePostId ? (
            // CATALOG GRID LAYOUT
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <motion.div
                    id={`journal-post-card-${post.id}`}
                    key={post.id}
                    layoutId={`post-${post.id}`}
                    className="p-5 border border-zinc-900 hover:border-zinc-800 bg-zinc-950/40 rounded-xl flex flex-col justify-between hover:scale-[1.01] transition-all group cursor-pointer text-left"
                    onClick={() => setActivePostId(post.id)}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500">
                        <span className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-900/60 px-2 py-0.5 rounded text-zinc-400 font-bold uppercase">
                          {post.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{post.publishDate}</span>
                        </div>
                      </div>

                      <h3 className="text-xs md:text-sm font-bold font-mono group-hover:text-blue-400 transition-colors uppercase tracking-wide leading-tight">
                        {post.title}
                      </h3>

                      <p className="text-[11px] text-zinc-400 leading-relaxed font-sans line-clamp-3">
                        {post.summary}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-zinc-900/60 flex items-center justify-between text-[10px] font-mono text-zinc-550">
                      <div className="flex gap-1 overflow-hidden max-w-[70%]">
                        {post.tags.slice(0, 2).map(t => (
                          <span key={t} className="text-[8px] bg-neutral-950 px-1 py-0.5 border border-zinc-900 rounded text-zinc-500 truncate">
                            #{t.replace(' ', '')}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-1 text-blue-500 font-black tracking-wide group-hover:translate-x-1 transition-transform">
                        <span>OPEN DATA</span>
                        <span>&rarr;</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-16 text-center text-zinc-550 space-y-2">
                  <Terminal className="w-6 h-6 mx-auto text-zinc-750 animate-bounce" />
                  <p className="font-mono text-xs">NO CHRONO ENTRIES COHERENT FOR: "{searchTerm.toUpperCase()}"</p>
                </div>
              )}
            </motion.div>
          ) : (
            // SEPARATED ARTICLE DETAILED VIEW
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto space-y-6 text-left relative"
            >
              
              {/* Back navigation */}
              <button
                id="btn-journal-back"
                onClick={() => setActivePostId(null)}
                className="flex items-center gap-2 group text-xs font-mono text-zinc-450 hover:text-white cursor-pointer select-none bg-neutral-950/80 px-2.5 py-1.5 rounded-lg border border-zinc-900"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>RETURN TO MATRIX CATALOGUE</span>
              </button>

              {/* Publication Header */}
              <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 space-y-4">
                
                <div className="flex flex-wrap items-center gap-2.5 text-[10px] font-mono text-zinc-400">
                  <span className="bg-blue-500/10 border border-blue-500/25 px-2.5 py-0.5 rounded text-blue-400 font-bold uppercase">
                    {activePost?.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{activePost?.publishDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{activePost?.readingTime}</span>
                  </div>
                </div>

                <h1 className="text-base md:text-xl font-bold font-mono uppercase tracking-wide leading-snug text-white">
                  {activePost?.title}
                </h1>

                {/* Article Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activePost?.tags.map((t) => (
                    <span key={t} className="text-[9px] font-mono px-2 py-0.5 bg-neutral-950 border border-zinc-900 rounded text-zinc-400">
                      #{t}
                    </span>
                  ))}
                </div>

                {/* Meta actions bar */}
                <div className="flex items-center justify-between border-t border-zinc-900 pt-3 text-[10px] font-mono text-zinc-500">
                  <div className="flex gap-4">
                    <button 
                      onClick={() => handleCopyPostLink(activePost?.id || '')} 
                      className="flex items-center gap-1 hover:text-zinc-250 cursor-pointer transition-colors"
                    >
                      {copiedPostId ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">LINK COPIED</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>MOCK LINK COPY</span>
                        </>
                      )}
                    </button>

                    <button 
                      onClick={handleLeaveArticleReview}
                      className="flex items-center gap-1 hover:text-zinc-250 cursor-pointer transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                      <span>EVALUATE THIS POST</span>
                    </button>
                  </div>

                  <span>NODE // INTEL_GEN_A1</span>
                </div>
              </div>

              {/* Rendered markdown body */}
              <div className="bg-zinc-950/20 border border-zinc-900/40 rounded-2xl p-6 md:p-8 text-white space-y-4 md:text-sm text-xs selection:bg-blue-500/20">
                {activePost && parseMarkdownToReact(activePost.content)}
              </div>

              {/* CTA bottom segment */}
              <div className="p-6 border border-zinc-900/60 rounded-2xl bg-zinc-950/45 text-center space-y-3">
                <div className="inline-flex p-2 bg-blue-500/10 rounded-full border border-blue-500/20 text-blue-400">
                  <Sparkles className="w-4 h-4 animate-spin" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold font-mono uppercase tracking-wide text-zinc-100">Review & Leave Feedback</h4>
                  <p className="text-[11px] text-zinc-400 font-sans max-w-md mx-auto">
                    Help calibrate this systems engineering network by rating this technical publication.
                  </p>
                </div>
                <div>
                  <button
                    onClick={handleLeaveArticleReview}
                    className="px-4 py-2 bg-white text-zinc-950 text-xs font-mono uppercase tracking-widest rounded-lg font-bold hover:bg-zinc-200 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>LOG EVALUATION SIGS</span>
                  </button>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
