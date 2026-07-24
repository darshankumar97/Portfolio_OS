"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useWindowManager } from "@/lib/os/window-manager";
import { useSettings, WALLPAPERS, type WallpaperId } from "@/lib/os/settings-store";
import { Window } from "@/components/os/Window";
import { MenuBar } from "@/components/os/MenuBar";
import { Dock } from "@/components/os/Dock";
import { AppIcon } from "@/components/os/AppIcon";
import { Spotlight } from "@/components/os/Spotlight";
import type { AppId } from "@/types/os";

const DESKTOP_ICONS: { appId: AppId; label: string }[] = [
  { appId: "finder", label: "Projects" },
  { appId: "notes", label: "About.txt" },
  { appId: "preview", label: "Resume.pdf" },
];

const WALLPAPER_ORDER = Object.keys(WALLPAPERS) as WallpaperId[];

export function Desktop() {
  const { windows, openApp } = useWindowManager();
  const { wallpaper, setWallpaper } = useSettings();
  const dockRef = useRef<HTMLDivElement>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<AppId | null>(null);

  function cycleWallpaper() {
    const idx = WALLPAPER_ORDER.indexOf(wallpaper);
    setWallpaper(WALLPAPER_ORDER[(idx + 1) % WALLPAPER_ORDER.length]);
    setContextMenu(null);
  }

  return (
    <div
      className="relative h-dvh w-full overflow-hidden"
      style={{ background: WALLPAPERS[wallpaper].gradient }}
      onContextMenu={(e) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY });
      }}
      onClick={() => {
        setContextMenu(null);
        setSelectedIcon(null);
      }}
    >
      <MenuBar onOpenSpotlight={() => setSpotlightOpen(true)} />

      <div className="absolute top-10 right-4 flex flex-col gap-4">
        {DESKTOP_ICONS.map((icon) => (
          <button
            key={icon.appId}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIcon(icon.appId);
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              openApp(icon.appId);
            }}
            className={`flex w-20 flex-col items-center gap-1 rounded-md p-2 ${
              selectedIcon === icon.appId ? "bg-white/20" : ""
            }`}
          >
            <AppIcon appId={icon.appId} size={44} />
            <span className="text-center text-xs text-white drop-shadow">{icon.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {windows.map((win) => (
          <Window key={win.id} win={win} dockTargetRef={dockRef} />
        ))}
      </AnimatePresence>

      <Dock ref={dockRef} />

      <Spotlight open={spotlightOpen} onClose={() => setSpotlightOpen(false)} />

      {contextMenu && (
        <div
          className="absolute z-[9500] w-52 overflow-hidden rounded-lg border border-white/10 bg-black/70 py-1 text-sm text-white shadow-xl backdrop-blur-xl"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="block w-full px-3 py-1.5 text-left hover:bg-white/10"
            onClick={() => {
              openApp("finder");
              setContextMenu(null);
            }}
          >
            New Finder Window
          </button>
          <button
            type="button"
            className="block w-full px-3 py-1.5 text-left hover:bg-white/10"
            onClick={cycleWallpaper}
          >
            Change Wallpaper
          </button>
          <button
            type="button"
            className="block w-full px-3 py-1.5 text-left hover:bg-white/10"
            onClick={() => {
              openApp("settings");
              setContextMenu(null);
            }}
          >
            System Settings…
          </button>
        </div>
      )}
    </div>
  );
}
