import dynamic from "next/dynamic";
import type { AppId, AppDefinition } from "@/types/os";

export const APP_REGISTRY: Record<AppId, AppDefinition> = {
  finder: {
    id: "finder",
    name: "Finder",
    defaultSize: { width: 720, height: 480 },
    minSize: { width: 480, height: 360 },
    singleton: true,
  },
  notes: {
    id: "notes",
    name: "Notes",
    defaultSize: { width: 560, height: 520 },
    minSize: { width: 360, height: 320 },
    singleton: true,
  },
  terminal: {
    id: "terminal",
    name: "Terminal",
    defaultSize: { width: 620, height: 420 },
    minSize: { width: 360, height: 260 },
    singleton: true,
  },
  mail: {
    id: "mail",
    name: "Mail",
    defaultSize: { width: 560, height: 520 },
    minSize: { width: 400, height: 380 },
    singleton: true,
  },
  preview: {
    id: "preview",
    name: "Preview",
    defaultSize: { width: 600, height: 560 },
    minSize: { width: 400, height: 380 },
    singleton: true,
  },
  safari: {
    id: "safari",
    name: "Safari",
    defaultSize: { width: 680, height: 560 },
    minSize: { width: 420, height: 380 },
    singleton: true,
  },
  settings: {
    id: "settings",
    name: "System Settings",
    defaultSize: { width: 520, height: 520 },
    minSize: { width: 400, height: 420 },
    singleton: true,
  },
};

const loading = () => (
  <div className="flex h-full items-center justify-center text-sm text-muted-light">
    Loading…
  </div>
);

export const APP_COMPONENTS: Record<AppId, React.ComponentType> = {
  finder: dynamic(() => import("@/components/os/apps/FinderApp").then((m) => m.FinderApp), {
    loading,
  }),
  notes: dynamic(() => import("@/components/os/apps/NotesApp").then((m) => m.NotesApp), {
    loading,
  }),
  terminal: dynamic(() => import("@/components/os/apps/TerminalApp").then((m) => m.TerminalApp), {
    loading,
  }),
  mail: dynamic(() => import("@/components/os/apps/MailApp").then((m) => m.MailApp), { loading }),
  preview: dynamic(() => import("@/components/os/apps/PreviewApp").then((m) => m.PreviewApp), {
    loading,
  }),
  safari: dynamic(() => import("@/components/os/apps/SafariApp").then((m) => m.SafariApp), {
    loading,
  }),
  settings: dynamic(
    () => import("@/components/os/apps/SettingsApp").then((m) => m.SettingsApp),
    { loading }
  ),
};

export const APP_ORDER: AppId[] = [
  "finder",
  "notes",
  "terminal",
  "mail",
  "preview",
  "safari",
  "settings",
];
