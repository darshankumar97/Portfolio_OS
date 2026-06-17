/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface BootScreenProps {
  onBootComplete: () => void;
}

export default function BootScreen({ onBootComplete }: BootScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 1200; // Fast premium load
    const intervalTime = 20;
    const increment = (100 / duration) * intervalTime;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + increment;
      });
    }, intervalTime);

    const completeTimer = setTimeout(() => {
      onBootComplete();
    }, duration + 200);

    return () => {
      clearInterval(timer);
      clearTimeout(completeTimer);
    };
  }, [onBootComplete]);

  return (
    <div id="boot-screen" className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] text-white select-none">
      <div className="max-w-md w-full px-8 flex flex-col items-center space-y-8">
        {/* Dynamic Minimal Emblem */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center space-y-3"
        >
          <div className="h-8 w-8 relative flex items-center justify-center mb-2">
            <div className="absolute inset-0 border border-white/20 rounded-full animate-ping opacity-10" />
            <div className="h-4 w-4 bg-white rounded-sm rotate-45" />
          </div>
          <h1 className="text-sm font-light tracking-[0.25em] text-white/95 uppercase font-sans">
            Darshan Kumar K R
          </h1>
          <p className="text-[10px] tracking-widest text-zinc-500 uppercase font-mono">
            Systems Portfolio
          </p>
        </motion.div>

        {/* Minimal thin loading indicator like Vercel/Apple */}
        <div className="w-48 space-y-2">
          <div className="w-full h-[1px] bg-zinc-900 rounded-full overflow-hidden relative">
            <motion.div
              id="boot-progress-bar"
              className="h-full bg-zinc-400"
              style={{ width: `${progress}%` }}
              transition={{ ease: "easeInOut" }}
            />
          </div>
          <div className="flex justify-between text-[9px] tracking-widest font-mono text-zinc-500 uppercase">
            <span>Systems Hub</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
