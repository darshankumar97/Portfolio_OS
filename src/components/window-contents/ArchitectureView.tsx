/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  PROJECTS_DATA, 
  ArchNode, 
  ArchEdge 
} from '../../content/projectsData';
import { 
  Network, 
  Search, 
  Maximize2, 
  Minimize2, 
  Move, 
  ChevronRight, 
  ChevronLeft,
  Info,
  Layers,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Default pristine Architecture Nodes representing portfolio platform core
const DEVOS_CORE_NODES: ArchNode[] = [
  { id: 'c1', label: 'Client Application Frame', type: 'client', description: 'Embedded sandboxed browser viewport rendering modern reactive client views and component layers.', x: 10, y: 160 },
  { id: 'c2', label: 'API Navigation Router', type: 'gateway', description: 'Central client-side state router handling view mapping and deep linking parameters.', x: 30, y: 160 },
  { id: 'c3', label: 'Local Storage State Shard', type: 'cache', description: 'Synchronized browser storage buffering user preferences, drafts, and custom peer reviews.', x: 50, y: 100 },
  { id: 'c4', label: 'Static Site Bundler', type: 'process', description: 'Vite compiler bundling asset segments, stylesheets, and custom micro-components securely.', x: 50, y: 240 },
  { id: 'c5', label: 'Event Coordinates Bus', type: 'api', description: 'Event dispatch managers matching client interactions with systemic active outputs.', x: 70, y: 160 },
  { id: 'c6', label: 'System Spec Sheets', type: 'external', description: 'Static JSON manifests defining complex architecture layouts and projects data structures.', x: 90, y: 160 }
];

const DEVOS_CORE_EDGES: ArchEdge[] = [
  { from: 'c1', to: 'c2', label: 'State Routing Path', animated: true },
  { from: 'c2', to: 'c3', label: 'Storage Sync Lookup' },
  { from: 'c2', to: 'c4', label: 'Asset Compilation', animated: true },
  { from: 'c3', to: 'c5', label: 'Event Handshakes' },
  { from: 'c4', to: 'c5', label: 'Static Metadata Loading' },
  { from: 'c5', to: 'c6', label: 'External API Dispatch', animated: true }
];

const DEVOS_CORE_STORY = [
  'Client Frame triggers state actions based on direct user clicks.',
  'API state router intercepts interactions, determining appropriate workspace viewport alignments.',
  'Local storage caches verify user credentials and peer feedback, persisting draft entries securely in-browser.',
  'The event bus coordinates structural updates, serving responsive and compiled components instantly.'
];

export default function ArchitectureView() {
  // Navigation project selector
  const [selectedProjectId, setSelectedProjectId] = useState<string>('devos-core');
  
  // Interactive zoom & pan states
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Story walkthrough state
  const [storyStep, setStoryStep] = useState<number>(-1);

  // Selected node inspection state
  const [activeNode, setActiveNode] = useState<ArchNode | null>(null);

  // Ref for canvas measurements
  const canvasRef = useRef<HTMLDivElement>(null);

  // Selected target project nodes list
  const currentProject = PROJECTS_DATA.find(p => p.id === selectedProjectId);
  const nodes = currentProject ? currentProject.architectureNodes : DEVOS_CORE_NODES;
  const edges = currentProject ? currentProject.architectureEdges : DEVOS_CORE_EDGES;
  const story = currentProject ? currentProject.architectureStory : DEVOS_CORE_STORY;

  // Reset viewport configurations when projects change
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setStoryStep(-1);
    if (nodes.length > 0) {
      setActiveNode(nodes[0]);
    }
  }, [selectedProjectId, nodes]);

  // Mouse pan handlers on container workspace
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.node-btn') || (e.target as HTMLElement).closest('.hud-control')) {
      return;
    }
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Zoom manipulation rules
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.15, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.15, 0.6));
  const handleResetViewport = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setStoryStep(-1);
  };

  const handleNextStory = () => {
    setStoryStep(prev => (prev + 1) % edges.length);
  };

  const handlePrevStory = () => {
    setStoryStep(prev => (prev - 1 + edges.length) % edges.length);
  };

  return (
    <div className="p-8 md:p-12 space-y-8 font-sans selection:bg-zinc-800 text-zinc-200 select-none">
      
      {/* Header Panel */}
      <div className="border-b border-zinc-900 pb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-zinc-500 tracking-widest uppercase mb-1.5 font-medium">
            <Network className="w-3.5 h-3.5 text-zinc-400" />
            <span>Architecture & Topology</span>
          </div>
          <h1 className="text-xl md:text-2xl font-light text-white tracking-tight">
            System Architecture Explorer
          </h1>
          <p className="text-zinc-400 text-xs md:text-sm mt-2 max-w-xl leading-relaxed">
            A fully zoomable and interactive schematic diagram highlighting database links, processing modules, and API connections for my featured project solutions.
          </p>
        </div>

        {/* Dynamic Project Schema Selector */}
        <div className="flex flex-wrap items-center gap-2 bg-zinc-900/50 border border-zinc-800 px-3 py-1.5 rounded-xl">
          <label className="text-[10px] text-zinc-400 uppercase font-mono tracking-widest font-medium">Select System Architecture:</label>
          <select 
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="bg-transparent border-0 font-sans text-xs text-white outline-none cursor-pointer pr-1"
          >
            <option value="devos-core" className="bg-zinc-950">Portfolio Core System</option>
            {PROJECTS_DATA.map(p => (
              <option key={p.id} value={p.id} className="bg-zinc-950">{p.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* INTERACTIVE ZOOM/PAN CANVAS */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="flex items-center justify-between bg-zinc-950/40 border border-zinc-905 px-4 py-2.5 rounded-xl text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">Active Schema:</span>
              <span className="font-mono text-xs font-semibold text-white uppercase">{selectedProjectId}</span>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">Double-Click Node to Inspect</span>
          </div>

          <div 
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`relative h-[420px] bg-zinc-950/20 border border-zinc-900 rounded-3xl overflow-hidden cursor-grab transition-shadow
              ${isDragging ? 'cursor-grabbing' : ''}
            `}
          >
            {/* Gridded background board aligning with matrix scale size */}
            <div 
              className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:25px_25px] pointer-events-none"
              style={{
                transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                transformOrigin: '0 0',
                transition: isDragging ? 'none' : 'transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)'
              }}
            />

            {/* TRANSFORMABLE NODES & CONNECTIONS RENDER LAYER */}
            <div 
              className="absolute inset-0 z-10 p-10"
              style={{
                transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                transformOrigin: '0 0',
                transition: isDragging ? 'none' : 'transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)'
              }}
            >
              <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                {edges.map((edge, idx) => {
                  const fromNode = nodes.find(n => n.id === edge.from);
                  const toNode = nodes.find(n => n.id === edge.to);
                  if (!fromNode || !toNode) return null;

                  const isStoryHighlighted = storyStep === idx;
                  const isNormalAnimated = edge.animated && storyStep === -1;

                  return (
                    <g key={idx}>
                      {/* Connection Line */}
                      <line 
                        x1={`${fromNode.x}%`} 
                        y1={`${fromNode.y}px`} 
                        x2={`${toNode.x}%`} 
                        y2={`${toNode.y}px`} 
                        stroke={isStoryHighlighted ? '#EDEDED' : 'rgba(255,255,255,0.08)'} 
                        strokeWidth={isStoryHighlighted ? 2.5 : 1}
                        strokeDasharray={isNormalAnimated || isStoryHighlighted ? '4 4' : 'none'}
                        className={isNormalAnimated || isStoryHighlighted ? 'animate-dash' : ''}
                      />
                      
                      {/* Connection Text label */}
                      {isStoryHighlighted && (
                        <text
                          x={`${(fromNode.x + toNode.x) / 2}%`}
                          y={`${(fromNode.y + toNode.y) / 2 - 8}px`}
                          textAnchor="middle"
                          fill="#FFFFFF"
                          className="text-[9px] font-mono fill-current"
                          style={{ filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.8))' }}
                        >
                          {edge.label}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Vector Node Blocks placement */}
              {nodes.map((node) => {
                const isSelected = activeNode?.id === node.id;
                
                return (
                  <button
                    key={node.id}
                    onClick={() => setActiveNode(node)}
                    style={{ left: `${node.x}%`, top: `${node.y}px`, transform: 'translateX(-50%)' }}
                    className={`absolute z-20 node-btn px-4 py-3 rounded-2xl border bg-zinc-900/90 text-left min-w-[155px] shadow-lg select-none duration-150 cursor-pointer focus:outline-none
                      ${isSelected 
                        ? 'ring-1 ring-zinc-500 border-zinc-400 scale-102' 
                        : 'border-zinc-800 hover:border-zinc-700'
                      }
                    `}
                  >
                    <span className="text-[8px] font-mono px-2 py-0.5 rounded-full bg-zinc-950 border border-zinc-800 uppercase tracking-wider text-zinc-400 inline-block mb-2 select-none">
                      {node.type || 'module'}
                    </span>
                    <h4 className="text-xs font-semibold text-white tracking-wide leading-tight">
                      {node.label}
                    </h4>
                  </button>
                );
              })}
            </div>

            {/* HUD Zoom/Pan Controls */}
            <div className="absolute right-4 bottom-4 z-30 hud-control flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-xl shadow-lg text-[10px]">
              <button 
                onClick={handleZoomIn}
                className="p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                title="Zoom In"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              
              <button 
                onClick={handleZoomOut}
                className="p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>

              <span className="font-mono text-zinc-400 px-1 select-none">
                {Math.round(zoom * 100)}%
              </span>

              <button 
                onClick={handleResetViewport}
                className="p-1.5 border border-zinc-800 hover:border-zinc-700 rounded bg-zinc-900 hover:bg-zinc-800 text-[9px] font-mono px-2 text-zinc-300 transition-all cursor-pointer"
              >
                RESET
              </button>
            </div>

            {/* FLOATING NAVIGATION HINT CARD */}
            <div className="absolute left-4 bottom-4 z-30 bg-zinc-950 border border-zinc-900 rounded-xl p-3 max-w-[190px] pointer-events-none shadow">
              <div className="flex items-center gap-1.5 text-[9px] font-mono text-zinc-500 mb-1">
                <Move className="w-3 h-3 text-zinc-400" />
                <span>WORKSPACE GUIDE</span>
              </div>
              <p className="text-[9px] text-zinc-400 leading-normal font-sans">
                Hold & drag to pan diagram bounds. Zoom using controls or wheel.
              </p>
            </div>
          </div>
        </div>

        {/* SIDE BAR DETAILS */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Active node detail panel */}
          {activeNode ? (
            <div className="bg-zinc-950/40 border border-zinc-900 rounded-3xl p-5 space-y-4 shadow-sm text-left">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-medium">
                  Specifications
                </span>
                <span className="text-[9px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded uppercase">
                  Node Selected
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-white tracking-wide uppercase">
                  {activeNode.label}
                </h3>
                <span className="text-[9px] font-mono text-zinc-500 block">
                  NODE TYPE: {activeNode.type}
                </span>
              </div>

              <p className="text-xs text-zinc-455 leading-relaxed font-sans">
                {activeNode.description}
              </p>
            </div>
          ) : (
            <div className="bg-zinc-950/40 border border-zinc-900 rounded-3xl p-6 text-center text-xs text-zinc-500 h-40 flex items-center justify-center font-mono">
              [Click system node to inspect metadata]
            </div>
          )}

          {/* SYSTEM STORY WALKTHROUGH */}
          <div className="bg-zinc-950/40 border border-zinc-900 rounded-3xl p-5 space-y-4 shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-semibold uppercase tracking-widest font-sans">
                <Sparkles className="w-4 h-4 text-zinc-455 hover:text-white transition-colors" />
                <span>Story Walkthrough</span>
              </div>

              <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-900 rounded px-2 py-1">
                <button 
                  onClick={handlePrevStory}
                  className="p-0.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  title="Previous Step"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-[9px] font-mono text-zinc-400 px-1 select-none">
                  {storyStep === -1 ? 'OFF' : `${storyStep + 1}/${edges.length}`}
                </span>
                <button 
                  onClick={handleNextStory}
                  className="p-0.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  title="Next Step"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="min-h-[140px] flex flex-col justify-between pt-1">
              <p className="text-xs text-zinc-400 leading-relaxed bg-zinc-950/70 border border-zinc-900 p-4 rounded-2xl font-sans mt-1.5 text-left select-text">
                {storyStep === -1 
                  ? 'Use the step arrow controls above to dry-run transaction flows and visualize sequential operations along this architecture diagram.'
                  : story[storyStep] || story[0]
                }
              </p>

              <button
                onClick={() => {
                  if (storyStep === -1) {
                    setStoryStep(0);
                  } else {
                    setStoryStep(-1);
                  }
                }}
                className={`w-full mt-4 py-3 rounded-xl text-center text-xs font-sans uppercase tracking-widest border transition-all duration-200 cursor-pointer flex items-center justify-center gap-2
                  ${storyStep !== -1 
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-400' 
                    : 'bg-zinc-100 hover:bg-white text-zinc-900 font-medium'
                  }
                `}
              >
                {storyStep !== -1 ? 'Halt Walkthrough' : 'Begin Walkthrough'}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
