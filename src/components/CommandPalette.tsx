/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Command, ArrowRight, FolderKanban, Terminal, GraduationCap, FileText, Blocks, Award, Send, Sliders, Handshake, BookOpen, Star, ShieldCheck } from 'lucide-react';
import { AppWindowId } from '../types/os';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchWindow: (id: AppWindowId) => void;
  onRunDiagnostic: () => void;
  onClearWorkspace: () => void;
}

interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Applications' | 'System Controls' | 'Technical Schema';
  icon: typeof FolderKanban;
  action: () => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
  onLaunchWindow,
  onRunDiagnostic,
  onClearWorkspace,
}: CommandPaletteProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Command items catalog
  const commands: CommandItem[] = [
    {
      id: 'app-projects',
      title: 'Featured Projects',
      subtitle: 'Browse portfolio case studies, system architectures, and live deployments.',
      category: 'Applications',
      icon: FolderKanban,
      action: () => onLaunchWindow('projects'),
    },
    {
      id: 'app-research',
      title: 'Research & Whitepapers',
      subtitle: 'Review academic papers, network analysis, and specialized technical publications.',
      category: 'Applications',
      icon: GraduationCap,
      action: () => onLaunchWindow('research'),
    },
    {
      id: 'app-architecture',
      title: 'System Architecture',
      subtitle: 'View interactive zoomable system architecture diagrams and cloud topologies.',
      category: 'Technical Schema',
      icon: Blocks,
      action: () => onLaunchWindow('architecture'),
    },
    {
      id: 'app-experience',
      title: 'Professional Experience',
      subtitle: 'Examine detailed backend engineering and cloud architecture work history.',
      category: 'Applications',
      icon: Terminal,
      action: () => onLaunchWindow('experience'),
    },
    {
      id: 'app-skills',
      title: 'Technical Skills Matrix',
      subtitle: 'Review programming proficiency, framework depths, and toolkit experiences.',
      category: 'Technical Schema',
      icon: Sliders,
      action: () => onLaunchWindow('skills'),
    },
    {
      id: 'app-achievements',
      title: 'Milestones & Achievements',
      subtitle: 'Inspect hackathon victories, engineering certifications, and academic honors.',
      category: 'Technical Schema',
      icon: Award,
      action: () => onLaunchWindow('achievements'),
    },
    {
      id: 'app-resume',
      title: 'Curriculum Vitae',
      subtitle: 'Access the single-page technical resume profile directly.',
      category: 'Applications',
      icon: FileText,
      action: () => onLaunchWindow('resume'),
    },
    {
      id: 'app-contact',
      title: 'Get In Touch',
      subtitle: 'Submit an inquiry form, copy direct email, or connect on LinkedIn.',
      category: 'Applications',
      icon: Send,
      action: () => onLaunchWindow('contact'),
    },
    {
      id: 'app-work',
      title: 'Consulting Services',
      subtitle: 'Review options for MVPs, APIs, full-stack systems, and dashboards.',
      category: 'Applications',
      icon: Handshake,
      action: () => onLaunchWindow('work'),
    },
    {
      id: 'app-journal',
      title: 'Engineering Journal',
      subtitle: 'Read publications and deep-dives regarding modern computing topics.',
      category: 'Technical Schema',
      icon: BookOpen,
      action: () => onLaunchWindow('journal'),
    },
    {
      id: 'app-reviews',
      title: 'Peer Testimonials',
      subtitle: 'Read reviews or write your own peer evaluation directly.',
      category: 'Applications',
      icon: Star,
      action: () => onLaunchWindow('reviews'),
    },
    {
      id: 'app-admin',
      title: 'Admin Console',
      subtitle: 'Access reviews moderation and analytical performance panels.',
      category: 'System Controls',
      icon: ShieldCheck,
      action: () => onLaunchWindow('admin'),
    },
    {
      id: 'sys-clear',
      title: 'Clear Active Workspace',
      subtitle: 'Minimize all open viewport windows to see the clean desktop background.',
      category: 'System Controls',
      icon: Blocks,
      action: () => {
        onClearWorkspace();
        onClose();
      },
    },
    {
      id: 'sys-diagnostic',
      title: 'Run Diagnostic Terminal',
      subtitle: 'Verify client state files validation and configuration schemas.',
      category: 'System Controls',
      icon: Terminal,
      action: () => {
        onRunDiagnostic();
        onClose();
      },
    },
  ];

  // Global CTRL + K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // Close first if duplicate, trigger toggle at parent
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle focus when open
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const filteredCommands = commands.filter((cmd) => {
    const searchString = `${cmd.title} ${cmd.subtitle} ${cmd.category}`.toLowerCase();
    return searchString.includes(searchQuery.toLowerCase());
  });

  // Handle keyboard select navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div id="command-palette-overlay" className="fixed inset-0 z-[100] flex items-start justify-center pt-24 bg-black/60 backdrop-blur-md px-4">
      <motion.div
        id="command-palette-container"
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.97, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: -10 }}
        transition={{ duration: 0.16, ease: 'easeOut' }}
        className="w-full max-w-xl rounded-xl border border-zinc-800/80 bg-zinc-950/95 shadow-[0_32px_64px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-zinc-900 bg-neutral-900/40">
          <Search className="w-5 h-5 text-zinc-500" />
          <input
            id="cmd-palette-input"
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-500 outline-none border-none focus:ring-0 font-mono"
            placeholder="Search platform or type system control commands..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
          <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-[10px] text-zinc-400 font-mono">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </div>

        {/* Search Results */}
        <div id="cmd-palette-results" className="max-h-[350px] overflow-y-auto p-2 space-y-1">
          {filteredCommands.length > 0 ? (
            (() => {
              let currentCat: string | null = null;
              return filteredCommands.map((cmd, idx) => {
                const isSelected = idx === selectedIndex;
                const CmdIcon = cmd.icon;
                const showCatHeader = currentCat !== cmd.category;
                if (showCatHeader) {
                  currentCat = cmd.category;
                }

                return (
                  <div key={cmd.id}>
                    {showCatHeader && (
                      <div className="text-[10px] uppercase tracking-wider font-mono text-zinc-500 font-semibold px-3 pt-3 pb-1">
                        {cmd.category}
                      </div>
                    )}
                    <button
                      id={`cmd-palette-item-${cmd.id}`}
                      onClick={() => {
                        cmd.action();
                        onClose();
                      }}
                      className={`w-full text-left flex items-start gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer
                        ${isSelected ? 'bg-zinc-800/80 text-white' : 'text-zinc-300 hover:bg-zinc-900/60'}
                      `}
                    >
                      <div className={`p-1.5 rounded-md mt-0.5 ${isSelected ? 'bg-zinc-700' : 'bg-zinc-900 border border-zinc-800'}`}>
                        <CmdIcon className="w-4 h-4 text-zinc-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-mono font-medium text-zinc-200">
                          {cmd.title}
                        </div>
                        <div className="text-[10px] text-zinc-500 mt-0.5 truncate font-sans">
                          {cmd.subtitle}
                        </div>
                      </div>
                      {isSelected && (
                        <ArrowRight className="w-4 h-4 text-zinc-400 self-center animate-pulse" />
                      )}
                    </button>
                  </div>
                );
              });
            })()
          ) : (
            <div className="py-8 text-center text-xs text-zinc-500 font-mono">
              No matching framework endpoints found.
            </div>
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-zinc-900 bg-neutral-900/20 text-[9px] font-mono text-zinc-500">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to execute</span>
          </div>
          <span>ESC to dismiss</span>
        </div>
      </motion.div>
    </div>
  );
}
