"use client";

import { useState } from "react";
import { useOSContent } from "@/lib/os/content-context";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/content";

type ViewMode = "grid" | "list";

export function FinderApp() {
  const { projects } = useOSContent();
  const [view, setView] = useState<ViewMode>("grid");
  const [selected, setSelected] = useState<Project | null>(projects[0] ?? null);

  return (
    <div className="flex h-full">
      <div className="flex w-56 shrink-0 flex-col border-r border-border-subtle bg-surface/60 py-3">
        <p className="px-4 pb-2 text-xs font-semibold tracking-wide text-muted-light uppercase">
          Favorites
        </p>
        <button
          type="button"
          className="mx-2 flex items-center gap-2 rounded-md bg-accent-subtle px-2.5 py-1.5 text-left text-sm font-medium text-accent"
        >
          <span className="h-2 w-2 rounded-full bg-accent" />
          Projects
        </button>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-border-subtle px-4 py-2">
          <p className="text-sm font-medium text-foreground">Projects</p>
          <div className="flex overflow-hidden rounded-md border border-border text-xs">
            <button
              type="button"
              onClick={() => setView("grid")}
              className={cn(
                "px-2.5 py-1",
                view === "grid" ? "bg-foreground text-surface" : "text-muted hover:bg-border-subtle"
              )}
            >
              Grid
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              className={cn(
                "px-2.5 py-1",
                view === "list" ? "bg-foreground text-surface" : "text-muted hover:bg-border-subtle"
              )}
            >
              List
            </button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1">
          <div className="min-w-0 flex-1 overflow-y-auto p-4">
            {view === "grid" ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => setSelected(project)}
                    className={cn(
                      "flex flex-col items-start gap-2 rounded-lg border p-3 text-left transition-colors",
                      selected?.id === project.id
                        ? "border-accent/40 bg-accent-subtle"
                        : "border-transparent hover:bg-border-subtle"
                    )}
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-foreground/5 text-sm font-semibold text-muted">
                      {project.title.slice(0, 1)}
                    </div>
                    <p className="line-clamp-1 text-xs font-medium text-foreground">
                      {project.title}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="divide-y divide-border-subtle">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => setSelected(project)}
                    className={cn(
                      "flex w-full items-center justify-between px-2 py-2.5 text-left text-sm transition-colors",
                      selected?.id === project.id
                        ? "bg-accent-subtle text-accent"
                        : "text-foreground hover:bg-border-subtle"
                    )}
                  >
                    <span>{project.title}</span>
                    <span className="text-xs text-muted-light">{project.status}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {selected && (
            <div className="w-72 shrink-0 overflow-y-auto border-l border-border-subtle bg-surface/60 p-5">
              <p className="text-xs font-medium tracking-wide text-accent uppercase">
                {selected.category}
              </p>
              <h2 className="mt-1 text-base font-semibold text-foreground">{selected.title}</h2>
              <p className="mt-1 text-sm text-muted">{selected.tagline}</p>

              <p className="mt-4 text-sm leading-relaxed text-muted">{selected.description}</p>

              {selected.metrics && selected.metrics.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-4 border-t border-border-subtle pt-4">
                  {selected.metrics.map((metric) => (
                    <div key={metric.label}>
                      <p className="text-lg font-semibold text-foreground">{metric.value}</p>
                      <p className="text-xs text-muted-light">{metric.label}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-1.5 border-t border-border-subtle pt-4">
                {selected.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border border-border bg-surface-elevated px-2 py-0.5 text-xs text-muted"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex flex-col gap-2">
                {selected.links.live && (
                  <a
                    href={selected.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md bg-foreground px-3 py-1.5 text-center text-xs font-medium text-surface"
                  >
                    View live
                  </a>
                )}
                {selected.links.github && (
                  <a
                    href={selected.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md border border-border px-3 py-1.5 text-center text-xs font-medium text-foreground"
                  >
                    GitHub
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
