"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type ThemeMode = "light" | "dark" | "system";
export type AccentId = "blue" | "purple" | "pink" | "orange" | "green" | "graphite";
export type WallpaperId = "aurora" | "sunset" | "graphite" | "forest" | "mono";

export const ACCENTS: Record<AccentId, { label: string; value: string }> = {
  blue: { label: "Blue", value: "#2563eb" },
  purple: { label: "Purple", value: "#7c3aed" },
  pink: { label: "Pink", value: "#db2777" },
  orange: { label: "Orange", value: "#ea580c" },
  green: { label: "Green", value: "#16a34a" },
  graphite: { label: "Graphite", value: "#525252" },
};

export const WALLPAPERS: Record<WallpaperId, { label: string; gradient: string }> = {
  aurora: {
    label: "Aurora",
    gradient: "linear-gradient(135deg, #1e3a8a 0%, #7c3aed 50%, #db2777 100%)",
  },
  sunset: {
    label: "Sunset",
    gradient: "linear-gradient(135deg, #7c2d12 0%, #ea580c 50%, #facc15 100%)",
  },
  graphite: {
    label: "Graphite",
    gradient: "linear-gradient(135deg, #18181b 0%, #3f3f46 60%, #71717a 100%)",
  },
  forest: {
    label: "Forest",
    gradient: "linear-gradient(135deg, #052e16 0%, #15803d 55%, #4ade80 100%)",
  },
  mono: {
    label: "Mono",
    gradient: "linear-gradient(135deg, #0a0a0a 0%, #262626 100%)",
  },
};

interface SettingsState {
  theme: ThemeMode;
  accent: AccentId;
  wallpaper: WallpaperId;
}

interface SettingsContextValue extends SettingsState {
  setTheme: (theme: ThemeMode) => void;
  setAccent: (accent: AccentId) => void;
  setWallpaper: (wallpaper: WallpaperId) => void;
}

const STORAGE_KEY = "devos:settings";

const DEFAULTS: SettingsState = {
  theme: "system",
  accent: "blue",
  wallpaper: "aurora",
};

function readStoredSettings(): SettingsState {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

function applySettings(settings: SettingsState) {
  const root = document.documentElement;
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = settings.theme === "dark" || (settings.theme === "system" && systemDark);
  root.classList.toggle("dark", isDark);
  root.style.setProperty("--color-accent", ACCENTS[settings.accent].value);
  root.dataset.wallpaper = settings.wallpaper;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SettingsState>(DEFAULTS);

  useEffect(() => {
    const stored = readStoredSettings();
    setSettings(stored);
    applySettings(stored);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applySettings(stored);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persist = useCallback((next: SettingsState) => {
    setSettings(next);
    applySettings(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const setTheme = useCallback(
    (theme: ThemeMode) => persist({ ...settings, theme }),
    [settings, persist]
  );
  const setAccent = useCallback(
    (accent: AccentId) => persist({ ...settings, accent }),
    [settings, persist]
  );
  const setWallpaper = useCallback(
    (wallpaper: WallpaperId) => persist({ ...settings, wallpaper }),
    [settings, persist]
  );

  const value = useMemo<SettingsContextValue>(
    () => ({ ...settings, setTheme, setAccent, setWallpaper }),
    [settings, setTheme, setAccent, setWallpaper]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}

export function themeInitScript() {
  return `(function(){try{var raw=localStorage.getItem('${STORAGE_KEY}');var s=raw?JSON.parse(raw):{};var theme=s.theme||'system';var accent=s.accent||'blue';var wallpaper=s.wallpaper||'aurora';var accents=${JSON.stringify(
    Object.fromEntries(Object.entries(ACCENTS).map(([k, v]) => [k, v.value]))
  )};var dark=theme==='dark'||(theme==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var root=document.documentElement;if(dark)root.classList.add('dark');root.style.setProperty('--color-accent',accents[accent]||accents.blue);root.dataset.wallpaper=wallpaper;}catch(e){}})();`;
}
