/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import {
  FolderGit2,
  Atom,
  Briefcase,
  Sliders,
  Award,
  FileText,
  Mail,
  Network,
  LucideIcon,
  Handshake,
  BookOpen,
  Star,
  ShieldCheck,
  History,
} from 'lucide-react';
import { AppWindowId } from '../types/os';

interface DesktopIconItemProps {
  id: AppWindowId;
  label: string;
  iconName: string;
  onClick: (id: AppWindowId) => void;
  isOpen: boolean;
  dimmed?: boolean;
  key?: React.Key;
}

export default function DesktopIconItem({
  id,
  label,
  iconName,
  onClick,
  isOpen,
  dimmed = false,
}: DesktopIconItemProps) {
  // Map icons dynamically to elements
  const getIcon = (name: string): LucideIcon => {
    switch (name) {
      case 'projects':
        return FolderGit2;
      case 'research':
        return Atom;
      case 'architecture':
        return Network;
      case 'experience':
        return Briefcase;
      case 'skills':
        return Sliders;
      case 'achievements':
        return Award;
      case 'resume':
        return FileText;
      case 'contact':
        return Mail;
      case 'work':
        return Handshake;
      case 'journal':
        return BookOpen;
      case 'reviews':
        return Star;
      case 'admin':
        return ShieldCheck;
      case 'changelog':
        return History;
      default:
        return FolderGit2;
    }
  };

  const IconComponent = getIcon(iconName);

  return (
    <motion.button
      id={`desktop-icon-${id}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(id)}
      className={`flex flex-col items-center gap-2 group cursor-default w-24 select-none relative focus:outline-none transition-all duration-300
        ${dimmed ? 'opacity-[0.85] brightness-[0.92]' : 'opacity-100'}
      `}
    >
      <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white/10 transition-all shadow-xl relative duration-300">
        <IconComponent className="w-6 h-6 text-white/70 group-hover:text-white transition-colors" strokeWidth={1.5} />
        
        {/* LED indicating whether application window is active/open */}
        {isOpen && (
          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
        )}
      </div>

      <span className={`text-[11px] font-medium text-center tracking-wide block max-w-full truncate transition-colors duration-200
        ${isOpen ? 'text-white' : (dimmed ? 'text-zinc-200 group-hover:text-white' : 'text-white/80 group-hover:text-white')}
      `}>
        {label}
      </span>
    </motion.button>
  );
}
