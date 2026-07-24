"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useWindowManager } from "@/lib/os/window-manager";
import { APP_ORDER, APP_REGISTRY } from "@/lib/os/apps";
import { useOSContent } from "@/lib/os/content-context";
import type { AppId } from "@/types/os";

interface SpotlightResult {
  id: string;
  label: string;
  sublabel: string;
  group: string;
  action: () => void;
}

function useSpotlightIndex(openApp: (appId: AppId) => void): SpotlightResult[] {
  const { projects, research, skills } = useOSContent();

  return useMemo(() => {
    const results: SpotlightResult[] = [];

    for (const appId of APP_ORDER) {
      results.push({
        id: `app-${appId}`,
        label: APP_REGISTRY[appId].name,
        sublabel: "Application",
        group: "Apps",
        action: () => openApp(appId),
      });
    }

    for (const project of projects) {
      results.push({
        id: `project-${project.id}`,
        label: project.title,
        sublabel: project.tagline,
        group: "Projects",
        action: () => openApp("finder"),
      });
    }

    for (const item of research) {
      results.push({
        id: `research-${item.id}`,
        label: item.title,
        sublabel: `${item.venue} · ${item.year}`,
        group: "Research",
        action: () => openApp("safari"),
      });
    }

    for (const category of skills) {
      for (const skill of category.skills) {
        results.push({
          id: `skill-${category.id}-${skill.name}`,
          label: skill.name,
          sublabel: `Skill · ${category.name}`,
          group: "Skills",
          action: () => openApp("notes"),
        });
      }
    }

    return results;
  }, [openApp, projects, research, skills]);
}

interface SpotlightProps {
  open: boolean;
  onClose: () => void;
}

export function Spotlight({ open, onClose }: SpotlightProps) {
  const { openApp } = useWindowManager();
  const index = useSpotlightIndex(openApp);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return index.slice(0, 8);
    return index
      .filter((r) => r.label.toLowerCase().includes(q) || r.sublabel.toLowerCase().includes(q))
      .slice(0, 8);
  }, [index, query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  function runResult(result: SpotlightResult | undefined) {
    if (!result) return;
    result.action();
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9800] flex items-start justify-center bg-black/30 pt-[16vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.16 }}
            className="w-full max-w-lg overflow-hidden rounded-xl border border-white/10 bg-black/70 shadow-2xl backdrop-blur-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Spotlight Search"
          >
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Spotlight Search"
              className="w-full bg-transparent px-5 py-4 text-lg text-white outline-none placeholder:text-white/40"
              onKeyDown={(e) => {
                if (e.key === "Escape") onClose();
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setActiveIndex((i) => Math.min(i + 1, results.length - 1));
                }
                if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setActiveIndex((i) => Math.max(i - 1, 0));
                }
                if (e.key === "Enter") {
                  e.preventDefault();
                  runResult(results[activeIndex]);
                }
              }}
            />
            {results.length > 0 && (
              <div className="max-h-80 overflow-y-auto border-t border-white/10 py-1.5">
                {results.map((result, i) => (
                  <button
                    key={result.id}
                    type="button"
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => runResult(result)}
                    className={`flex w-full items-center justify-between px-5 py-2 text-left text-sm ${
                      i === activeIndex ? "bg-white/15 text-white" : "text-white/80"
                    }`}
                  >
                    <span>{result.label}</span>
                    <span className="text-xs text-white/40">{result.sublabel}</span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
