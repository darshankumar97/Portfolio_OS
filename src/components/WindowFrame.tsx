/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Minus, Square, X, RotateCcw } from 'lucide-react';
import { AppWindowId, WindowInstance } from '../types/os';

interface WindowFrameProps {
  windowState: WindowInstance;
  onClose: (id: AppWindowId) => void;
  onMinimize: (id: AppWindowId) => void;
  onMaximize: (id: AppWindowId) => void;
  onFocus: (id: AppWindowId) => void;
  isActive: boolean;
  children: React.ReactNode;
  key?: React.Key;
}

export default function WindowFrame({
  windowState,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  isActive,
  children,
}: WindowFrameProps) {
  const { id, title, isMaximized, x, y, width, height, zIndex } = windowState;
  const constraintsRef = useRef<HTMLDivElement>(null);

  // If window is minimized, render nothing
  if (windowState.isMinimized) {
    return null;
  }

  const handleTitleBarDoubleClick = () => {
    onMaximize(id);
  };

  return (
    <motion.div
      id={`window-frame-${id}`}
      initial={{ opacity: 0, scale: 0.95, y: y + 20 }}
      animate={{
        opacity: 1,
        scale: 1,
        x: isMaximized ? 0 : x,
        y: isMaximized ? 0 : y,
        width: isMaximized ? '100vw' : width,
        height: isMaximized ? 'calc(100vh - 80px)' : height,
        transition: { type: 'spring', damping: 25, stiffness: 350 },
      }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      style={{
        position: 'absolute',
        zIndex: zIndex,
        maxHeight: isMaximized ? 'calc(100vh - 80px)' : '90vh',
      }}
      className={`pointer-events-auto flex flex-col rounded-xl overflow-hidden transition-all duration-300 select-none
        ${isActive 
          ? 'bg-[#121214] border border-zinc-500 shadow-[0_50px_120px_-15px_rgba(0,0,0,1)] scale-[1.002] ring-1 ring-white/10' 
          : 'bg-[#09090b] border border-zinc-800/70 shadow-[0_15px_40px_rgba(0,0,0,0.8)] opacity-95 brightness-[0.92]'
        }
      `}
      onClick={() => onFocus(id)}
      drag={!isMaximized}
      dragHandleClassName="window-drag-handle"
      dragMomentum={false}
      dragElastic={0.05}
      dragConstraints={{ left: -300, top: 0, right: 1000, bottom: 500 }}
    >
      {/* Title Bar */}
      <div
        id={`window-header-${id}`}
        className="window-drag-handle h-11 px-4 flex items-center justify-between border-b border-zinc-800 cursor-grab active:cursor-grabbing select-none bg-[#0D0D0D]"
        onDoubleClick={handleTitleBarDoubleClick}
      >
        {/* Left Windows Actions */}
        <div className="flex items-center gap-2 w-20">
          {/* Close */}
          <button
            id={`btn-close-${id}`}
            onClick={(e) => {
              e.stopPropagation();
              onClose(id);
            }}
            className="group flex items-center justify-center w-3 h-3 rounded-full bg-[#FF5F56] border border-black/10 cursor-pointer"
            title="Close"
          >
            <X className="w-2 h-2 text-[#4c0000] opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
 
          {/* Minimize */}
          <button
            id={`btn-minimize-${id}`}
            onClick={(e) => {
              e.stopPropagation();
              onMinimize(id);
            }}
            className="group flex items-center justify-center w-3 h-3 rounded-full bg-[#FFBD2E] border border-black/10 cursor-pointer"
            title="Minimize"
          >
            <Minus className="w-2 h-2 text-[#5c3e00] opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
 
          {/* Maximize */}
          <button
            id={`btn-maximize-${id}`}
            onClick={(e) => {
              e.stopPropagation();
              onMaximize(id);
            }}
            className="group flex items-center justify-center w-3 h-3 rounded-full bg-[#27C93F] border border-black/10 cursor-pointer"
            title="Toggle Maximize"
          >
            {isMaximized ? (
              <RotateCcw className="w-2 h-2 text-[#003d00] opacity-0 group-hover:opacity-100 transition-opacity" />
            ) : (
              <Square className="w-1.5 h-1.5 text-[#003d00] opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </button>
        </div>
 
        {/* Center Title */}
        <div className="flex-1 flex justify-center">
          <span className={`text-[12px] font-medium tracking-tight transition-colors duration-200
            ${isActive ? 'text-white font-semibold' : 'text-zinc-500'}
          `}>
            {title}
          </span>
        </div>
 
        {/* Right Status Accent */}
        <div className="w-20 flex justify-end items-center gap-1.5">
          <span className="hidden sm:inline text-[9px] font-sans text-white/30 uppercase tracking-widest">
            Specs
          </span>
        </div>
      </div>
 
      {/* Content Container */}
      <div id={`window-body-${id}`} className="flex-1 overflow-y-auto bg-[#121214] text-zinc-200">
        {children}
      </div>
    </motion.div>
  );
}
