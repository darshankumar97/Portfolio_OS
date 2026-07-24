"use client";

import { useEffect, useState } from "react";
import { useWindowManager } from "@/lib/os/window-manager";
import { APP_REGISTRY } from "@/lib/os/apps";

interface MenuBarProps {
  onOpenSpotlight: () => void;
}

function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function useOnlineStatus() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    setOnline(navigator.onLine);
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);
  return online;
}

export function MenuBar({ onOpenSpotlight }: MenuBarProps) {
  const { windows, topWindowId, openApp } = useWindowManager();
  const now = useClock();
  const online = useOnlineStatus();

  const activeWindow = windows.find((w) => w.id === topWindowId);
  const activeAppName = activeWindow ? APP_REGISTRY[activeWindow.appId].name : "Finder";

  const dateLabel = now
    ? now.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })
    : "";
  const timeLabel = now
    ? now.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
    : "";

  return (
    <div className="fixed inset-x-0 top-0 z-[9000] flex h-7 items-center justify-between bg-black/30 px-4 text-[13px] font-medium text-white backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <span className="flex h-4 w-4 items-center justify-center rounded-[4px] bg-white text-[9px] font-bold text-black">
          D
        </span>
        <span className="font-semibold">{activeAppName}</span>
      </div>

      <div className="flex items-center gap-3.5">
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          opacity={online ? 1 : 0.4}
          aria-label={online ? "Online" : "Offline"}
        >
          <path d="M2 8.5a17 17 0 0 1 20 0M5.5 12a12 12 0 0 1 13 0M9 15.5a7 7 0 0 1 6 0" />
          <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
        </svg>

        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="2" y="7" width="18" height="10" rx="2" />
          <path d="M22 10v4" />
          <rect x="4" y="9" width="12" height="6" fill="currentColor" stroke="none" />
        </svg>

        <button
          type="button"
          onClick={onOpenSpotlight}
          aria-label="Spotlight Search"
          className="flex items-center justify-center"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => openApp("settings")}
          aria-label="Control Center"
          className="flex items-center justify-center"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
          </svg>
        </button>

        <span className="tabular-nums">
          {dateLabel} {timeLabel}
        </span>
      </div>
    </div>
  );
}
