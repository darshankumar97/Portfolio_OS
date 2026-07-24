"use client";

import { forwardRef, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useWindowManager } from "@/lib/os/window-manager";
import { APP_ORDER, APP_REGISTRY } from "@/lib/os/apps";
import { AppIcon } from "@/components/os/AppIcon";
import type { AppId } from "@/types/os";

interface DockIconProps {
  appId: AppId;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  isOpen: boolean;
  bouncing: boolean;
  onClick: () => void;
}

function DockIcon({ appId, mouseX, isOpen, bouncing, onClick }: DockIconProps) {
  const ref = useRef<HTMLButtonElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return Infinity;
    return val - (bounds.left + bounds.width / 2);
  });
  const widthSync = useTransform(distance, [-160, 0, 160], [44, 68, 44]);
  const width = useSpring(widthSync, { mass: 0.15, stiffness: 200, damping: 14 });

  return (
    <div className="flex flex-col items-center">
      <motion.button
        ref={ref}
        type="button"
        onClick={onClick}
        style={{ width }}
        animate={bouncing ? { y: [0, -16, 0] } : { y: 0 }}
        transition={bouncing ? { duration: 0.42, ease: "easeOut" } : { duration: 0.15 }}
        aria-label={APP_REGISTRY[appId].name}
        className="flex aspect-square items-center justify-center"
      >
        <AppIcon appId={appId} className="h-full w-full" />
      </motion.button>
      <span
        className="mt-1 h-1 w-1 rounded-full bg-white/80 transition-opacity"
        style={{ opacity: isOpen ? 1 : 0 }}
      />
    </div>
  );
}

export const Dock = forwardRef<HTMLDivElement>(function Dock(_props, ref) {
  const { openApp, isAppOpen } = useWindowManager();
  const mouseX = useMotionValue(Infinity);
  const [bouncingApp, setBouncingApp] = useState<AppId | null>(null);

  function handleOpen(appId: AppId) {
    openApp(appId);
    setBouncingApp(appId);
    window.setTimeout(() => setBouncingApp((cur) => (cur === appId ? null : cur)), 450);
  }

  return (
    <div ref={ref} className="fixed inset-x-0 bottom-3 z-[9000] flex justify-center">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="flex items-end gap-2.5 rounded-2xl border border-white/10 bg-black/25 px-3 py-2 backdrop-blur-2xl"
      >
        {APP_ORDER.map((appId) => (
          <DockIcon
            key={appId}
            appId={appId}
            mouseX={mouseX}
            isOpen={isAppOpen(appId)}
            bouncing={bouncingApp === appId}
            onClick={() => handleOpen(appId)}
          />
        ))}
      </motion.div>
    </div>
  );
});
