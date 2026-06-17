/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import {
  Home,
  FolderGit2,
  Atom,
  Briefcase,
  FileText,
  Mail,
  Github,
  Linkedin,
  Code2,
  Command,
  AppWindow,
  Handshake,
  BookOpen,
  Star,
  ShieldCheck,
} from 'lucide-react';
import { AppWindowId, WindowInstance } from '../types/os';

interface DockProps {
  windows: WindowInstance[];
  activeWindowId: AppWindowId | null;
  onIconClick: (id: AppWindowId) => void;
  onOpenCommandPalette: () => void;
  onClearDesktop: () => void;
}

export default function Dock({
  windows,
  activeWindowId,
  onIconClick,
  onOpenCommandPalette,
  onClearDesktop,
}: DockProps) {
  // Map icons dynamically to lucide react elements
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'home':
        return Home;
      case 'projects':
        return FolderGit2;
      case 'research':
        return Atom;
      case 'experience':
        return Briefcase;
      case 'resume':
        return FileText;
      case 'contact':
        return Mail;
      case 'github':
        return Github;
      case 'linkedin':
        return Linkedin;
      case 'leetcode':
        return Code2;
      case 'cmd-palette':
        return Command;
      case 'work':
        return Handshake;
      case 'journal':
        return BookOpen;
      case 'reviews':
        return Star;
      case 'admin':
        return ShieldCheck;
      default:
        return AppWindow;
    }
  };

  const navItems: {
    id: AppWindowId | 'home' | 'github' | 'linkedin' | 'leetcode' | 'cmd-palette';
    label: string;
    icon: string;
    isExternal?: boolean;
    url?: string;
  }[] = [
    { id: 'home', label: 'DevOS Hub', icon: 'home' },
    { id: 'projects', label: 'Projects', icon: 'projects' },
    { id: 'research', label: 'Research Lab', icon: 'research' },
    { id: 'experience', label: 'Experience', icon: 'experience' },
    { id: 'resume', label: 'Resume.pdf', icon: 'resume' },
    { id: 'contact', label: 'Contact', icon: 'contact' },
    { id: 'github', label: 'GitHub', icon: 'github', isExternal: true, url: 'https://github.com/darshan-kumar-k-r' },
    { id: 'linkedin', label: 'LinkedIn', icon: 'linkedin', isExternal: true, url: 'https://linkedin.com/in/darshankumarkr97' },
    { id: 'leetcode', label: 'LeetCode', icon: 'leetcode', isExternal: true, url: 'https://leetcode.com/darshan_kumar_kr' },
    { id: 'cmd-palette', label: 'Palette (Ctrl+K)', icon: 'cmd-palette' },
  ];

  const handleItemClick = (item: typeof navItems[0]) => {
    if (item.isExternal && item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
      return;
    }

    if (item.id === 'home') {
      onClearDesktop();
      return;
    }

    if (item.id === 'cmd-palette') {
      onOpenCommandPalette();
      return;
    }

    onIconClick(item.id as AppWindowId);
  };

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[45] max-w-[95vw]">
      <div className="bg-black/25 backdrop-blur-md border border-white/5 px-2 py-1 rounded-xl flex items-center gap-1 shadow-md relative">
        {navItems.map((item) => {
          const Icon = getIconComponent(item.icon);
          
          // Check if this window corresponds to an actual open window state
          const targetWindow = windows.find((w) => w.id === item.id);
          const isOpen = targetWindow?.isOpen ?? false;
          const isMinimized = targetWindow?.isMinimized ?? false;
          const isActive = activeWindowId === item.id;

          return (
            <div key={item.id} className="relative group flex flex-col items-center">
              {/* Tooltip */}
              <div className="absolute -top-9 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none select-none bg-[#0a0a0a] border border-white/5 text-[9px] text-zinc-300 font-mono px-2 py-0.5 rounded shadow-sm whitespace-nowrap z-50">
                {item.label}
              </div>

              {/* Icon button */}
              <motion.button
                id={`dock-item-${item.id}`}
                whileHover={{ scale: 1.12, y: -2 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 450, damping: 18 }}
                onClick={() => handleItemClick(item)}
                className={`relative w-[38px] h-[38px] rounded-lg flex items-center justify-center transition-all cursor-pointer
                  ${isActive 
                    ? 'bg-white/10 text-white border border-white/10 shadow-[0_0_8px_rgba(255,255,255,0.08)]' 
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }
                `}
              >
                <Icon className="w-[17px] h-[17px]" />
              </motion.button>

              {/* Status Indicator LEDs */}
              {isOpen && (
                <div className="absolute top-0.5 right-0.5 flex">
                  <motion.span
                    layoutId={`dock-led-${item.id}`}
                    className={`h-[3px] rounded-full transition-all duration-300
                      ${isMinimized ? 'w-[3px] bg-zinc-550' : isActive ? 'w-[5px] bg-blue-500 shadow-[0_0_4px_#3b82f6]' : 'w-[3px] bg-zinc-400'}
                    `}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
