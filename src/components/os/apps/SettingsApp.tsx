"use client";

import { cn } from "@/lib/utils";
import {
  ACCENTS,
  WALLPAPERS,
  useSettings,
  type AccentId,
  type ThemeMode,
  type WallpaperId,
} from "@/lib/os/settings-store";

const THEME_OPTIONS: { id: ThemeMode; label: string }[] = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "system", label: "System" },
];

export function SettingsApp() {
  const { theme, accent, wallpaper, setTheme, setAccent, setWallpaper } = useSettings();

  return (
    <div className="h-full overflow-y-auto bg-surface-elevated px-6 py-6 text-foreground">
      <h1 className="text-lg font-semibold">System Settings</h1>

      <section className="mt-6">
        <h2 className="text-xs font-semibold tracking-wide text-muted-light uppercase">
          Appearance
        </h2>
        <div className="mt-3 flex gap-2">
          {THEME_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setTheme(opt.id)}
              className={cn(
                "rounded-md border px-3.5 py-1.5 text-sm transition-colors",
                theme === opt.id
                  ? "border-accent/40 bg-accent-subtle text-accent"
                  : "border-border text-muted hover:bg-border-subtle"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xs font-semibold tracking-wide text-muted-light uppercase">
          Accent color
        </h2>
        <div className="mt-3 flex flex-wrap gap-3">
          {(Object.keys(ACCENTS) as AccentId[]).map((id) => (
            <button
              key={id}
              type="button"
              aria-label={ACCENTS[id].label}
              onClick={() => setAccent(id)}
              className={cn(
                "h-8 w-8 rounded-full ring-2 ring-offset-2 ring-offset-surface-elevated transition-all",
                accent === id ? "ring-foreground" : "ring-transparent"
              )}
              style={{ backgroundColor: ACCENTS[id].value }}
            />
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xs font-semibold tracking-wide text-muted-light uppercase">
          Wallpaper
        </h2>
        <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-5">
          {(Object.keys(WALLPAPERS) as WallpaperId[]).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setWallpaper(id)}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-lg border-2 p-1 transition-colors",
                wallpaper === id ? "border-accent" : "border-transparent"
              )}
            >
              <span
                className="h-12 w-full rounded-md"
                style={{ background: WALLPAPERS[id].gradient }}
              />
              <span className="text-xs text-muted">{WALLPAPERS[id].label}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
