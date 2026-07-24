"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useWindowManager } from "@/lib/os/window-manager";
import { APP_COMPONENTS, APP_REGISTRY } from "@/lib/os/apps";
import { cn } from "@/lib/utils";
import type { WindowInstance } from "@/types/os";

interface WindowProps {
  win: WindowInstance;
  dockTargetRef: React.RefObject<HTMLDivElement | null>;
}

export function Window({ win, dockTargetRef }: WindowProps) {
  const { closeWindow, focusWindow, minimizeWindow, toggleMaximize, moveWindow, resizeWindow, topWindowId } =
    useWindowManager();
  const reducedMotion = useReducedMotion();
  const dragState = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(
    null
  );
  const resizeState = useRef<{ startX: number; startY: number; originW: number; originH: number } | null>(
    null
  );
  const [live, setLive] = useState<{ x: number; y: number; width: number; height: number } | null>(
    null
  );

  const def = APP_REGISTRY[win.appId];
  const Content = APP_COMPONENTS[win.appId];
  const focused = topWindowId === win.id;
  const bounds = live ?? win.bounds;

  function onTitlePointerDown(e: React.PointerEvent) {
    if (win.maximized) return;
    focusWindow(win.id);
    (e.target as Element).setPointerCapture(e.pointerId);
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: win.bounds.x,
      originY: win.bounds.y,
    };
  }

  function onTitlePointerMove(e: React.PointerEvent) {
    if (!dragState.current) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    setLive({
      x: Math.max(0, dragState.current.originX + dx),
      y: Math.max(28, dragState.current.originY + dy),
      width: win.bounds.width,
      height: win.bounds.height,
    });
  }

  function onTitlePointerUp() {
    if (!dragState.current) return;
    if (live) moveWindow(win.id, live.x, live.y);
    dragState.current = null;
    setLive(null);
  }

  function onResizePointerDown(e: React.PointerEvent) {
    e.stopPropagation();
    focusWindow(win.id);
    (e.target as Element).setPointerCapture(e.pointerId);
    resizeState.current = {
      startX: e.clientX,
      startY: e.clientY,
      originW: win.bounds.width,
      originH: win.bounds.height,
    };
  }

  function onResizePointerMove(e: React.PointerEvent) {
    if (!resizeState.current) return;
    const dx = e.clientX - resizeState.current.startX;
    const dy = e.clientY - resizeState.current.startY;
    setLive({
      x: win.bounds.x,
      y: win.bounds.y,
      width: Math.max(def.minSize.width, resizeState.current.originW + dx),
      height: Math.max(def.minSize.height, resizeState.current.originH + dy),
    });
  }

  function onResizePointerUp() {
    if (!resizeState.current) return;
    if (live) resizeWindow(win.id, live.width, live.height);
    resizeState.current = null;
    setLive(null);
  }

  const dockOffset = (() => {
    if (typeof window === "undefined" || !dockTargetRef.current) return { x: 0, y: 400 };
    const dockRect = dockTargetRef.current.getBoundingClientRect();
    return {
      x: dockRect.left - win.bounds.x - win.bounds.width / 2,
      y: dockRect.top - win.bounds.y,
    };
  })();

  return (
    <motion.div
      role="dialog"
      aria-label={win.title}
      className={cn(
        "absolute flex flex-col overflow-hidden rounded-xl border shadow-2xl",
        "bg-surface-elevated/90 backdrop-blur-2xl",
        focused ? "border-black/10 dark:border-white/10" : "border-black/5 dark:border-white/5"
      )}
      style={{
        left: bounds.x,
        top: bounds.y,
        width: bounds.width,
        height: bounds.height,
        zIndex: win.zIndex,
      }}
      initial={reducedMotion ? false : { opacity: 0, scale: 0.92 }}
      animate={
        win.minimized
          ? { opacity: 0, scale: 0.1, x: dockOffset.x, y: dockOffset.y, pointerEvents: "none" }
          : { opacity: 1, scale: 1, x: 0, y: 0, pointerEvents: "auto" }
      }
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
      transition={reducedMotion ? { duration: 0 } : { duration: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
      onPointerDown={() => !focused && focusWindow(win.id)}
    >
      <div
        className="flex shrink-0 items-center gap-2 border-b border-border-subtle px-3 py-2 select-none"
        onPointerDown={onTitlePointerDown}
        onPointerMove={onTitlePointerMove}
        onPointerUp={onTitlePointerUp}
        onDoubleClick={() => toggleMaximize(win.id)}
      >
        <div className="group flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Close"
            onClick={() => closeWindow(win.id)}
            className="flex h-3 w-3 items-center justify-center rounded-full bg-[#ff5f57]"
          >
            <span className="text-[7px] leading-none text-[#4d0000] opacity-0 group-hover:opacity-100">
              ×
            </span>
          </button>
          <button
            type="button"
            aria-label="Minimize"
            onClick={() => minimizeWindow(win.id)}
            className="flex h-3 w-3 items-center justify-center rounded-full bg-[#febc2e]"
          >
            <span className="text-[7px] leading-none text-[#7a4a00] opacity-0 group-hover:opacity-100">
              −
            </span>
          </button>
          <button
            type="button"
            aria-label="Maximize"
            onClick={() => toggleMaximize(win.id)}
            className="flex h-3 w-3 items-center justify-center rounded-full bg-[#28c840]"
          >
            <span className="text-[7px] leading-none text-[#0a3d00] opacity-0 group-hover:opacity-100">
              +
            </span>
          </button>
        </div>
        <p className="pointer-events-none flex-1 text-center text-xs font-medium text-muted">
          {win.title}
        </p>
        <span className="w-[54px]" aria-hidden />
      </div>

      <div className="min-h-0 flex-1">
        <Content />
      </div>

      {!win.maximized && (
        <div
          onPointerDown={onResizePointerDown}
          onPointerMove={onResizePointerMove}
          onPointerUp={onResizePointerUp}
          className="absolute right-0 bottom-0 h-4 w-4 cursor-nwse-resize"
        />
      )}
    </motion.div>
  );
}
