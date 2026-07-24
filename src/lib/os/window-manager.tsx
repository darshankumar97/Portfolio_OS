"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";
import type { AppId, Rect, WindowInstance } from "@/types/os";
import { APP_REGISTRY } from "@/lib/os/apps";

interface OSState {
  windows: WindowInstance[];
  nextZIndex: number;
  openOrder: string[];
}

type Action =
  | { type: "OPEN"; appId: AppId; title: string }
  | { type: "CLOSE"; id: string }
  | { type: "FOCUS"; id: string }
  | { type: "MINIMIZE"; id: string }
  | { type: "RESTORE"; id: string }
  | { type: "TOGGLE_MAXIMIZE"; id: string }
  | { type: "MOVE"; id: string; x: number; y: number }
  | { type: "RESIZE"; id: string; width: number; height: number };

const CASCADE_STEP = 28;
const CASCADE_BASE = { x: 96, y: 72 };

function viewportSize() {
  if (typeof window === "undefined") return { width: 1280, height: 800 };
  return { width: window.innerWidth, height: window.innerHeight };
}

function nextCascadeOrigin(count: number): { x: number; y: number } {
  const { width, height } = viewportSize();
  const slot = count % 6;
  const x = Math.min(CASCADE_BASE.x + slot * CASCADE_STEP, width - 480);
  const y = Math.min(CASCADE_BASE.y + slot * CASCADE_STEP, height - 420);
  return { x: Math.max(x, 24), y: Math.max(y, 40) };
}

function reducer(state: OSState, action: Action): OSState {
  switch (action.type) {
    case "OPEN": {
      const def = APP_REGISTRY[action.appId];
      const existing = def.singleton
        ? state.windows.find((w) => w.appId === action.appId)
        : undefined;

      if (existing) {
        return reducer(state, { type: "RESTORE", id: existing.id });
      }

      const origin = nextCascadeOrigin(state.windows.length);
      const bounds: Rect = {
        x: origin.x,
        y: origin.y,
        width: def.defaultSize.width,
        height: def.defaultSize.height,
      };

      const win: WindowInstance = {
        id: `${action.appId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        appId: action.appId,
        title: action.title,
        bounds,
        prevBounds: null,
        zIndex: state.nextZIndex,
        minimized: false,
        maximized: false,
      };

      return {
        windows: [...state.windows, win],
        nextZIndex: state.nextZIndex + 1,
        openOrder: [...state.openOrder, win.id],
      };
    }

    case "CLOSE": {
      return {
        ...state,
        windows: state.windows.filter((w) => w.id !== action.id),
        openOrder: state.openOrder.filter((id) => id !== action.id),
      };
    }

    case "FOCUS": {
      return {
        ...state,
        nextZIndex: state.nextZIndex + 1,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, zIndex: state.nextZIndex } : w
        ),
      };
    }

    case "MINIMIZE": {
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, minimized: true } : w
        ),
      };
    }

    case "RESTORE": {
      return {
        ...state,
        nextZIndex: state.nextZIndex + 1,
        windows: state.windows.map((w) =>
          w.id === action.id
            ? { ...w, minimized: false, zIndex: state.nextZIndex }
            : w
        ),
      };
    }

    case "TOGGLE_MAXIMIZE": {
      const { width, height } = viewportSize();
      return {
        ...state,
        windows: state.windows.map((w) => {
          if (w.id !== action.id) return w;
          if (w.maximized) {
            return {
              ...w,
              maximized: false,
              bounds: w.prevBounds ?? w.bounds,
              prevBounds: null,
            };
          }
          return {
            ...w,
            maximized: true,
            prevBounds: w.bounds,
            bounds: { x: 0, y: 28, width, height: height - 28 - 78 },
          };
        }),
      };
    }

    case "MOVE": {
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id
            ? { ...w, bounds: { ...w.bounds, x: action.x, y: action.y } }
            : w
        ),
      };
    }

    case "RESIZE": {
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id
            ? {
                ...w,
                bounds: { ...w.bounds, width: action.width, height: action.height },
              }
            : w
        ),
      };
    }

    default:
      return state;
  }
}

interface OSContextValue {
  windows: WindowInstance[];
  openApp: (appId: AppId) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  toggleMaximize: (id: string) => void;
  moveWindow: (id: string, x: number, y: number) => void;
  resizeWindow: (id: string, width: number, height: number) => void;
  isAppOpen: (appId: AppId) => boolean;
  topWindowId: string | null;
}

const OSContext = createContext<OSContextValue | null>(null);

export function WindowManagerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    windows: [],
    nextZIndex: 1,
    openOrder: [],
  });

  const openApp = useCallback((appId: AppId) => {
    dispatch({ type: "OPEN", appId, title: APP_REGISTRY[appId].name });
  }, []);

  const closeWindow = useCallback((id: string) => {
    dispatch({ type: "CLOSE", id });
  }, []);

  const focusWindow = useCallback((id: string) => {
    dispatch({ type: "FOCUS", id });
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    dispatch({ type: "MINIMIZE", id });
  }, []);

  const restoreWindow = useCallback((id: string) => {
    dispatch({ type: "RESTORE", id });
  }, []);

  const toggleMaximize = useCallback((id: string) => {
    dispatch({ type: "TOGGLE_MAXIMIZE", id });
  }, []);

  const moveWindow = useCallback((id: string, x: number, y: number) => {
    dispatch({ type: "MOVE", id, x, y });
  }, []);

  const resizeWindow = useCallback((id: string, width: number, height: number) => {
    dispatch({ type: "RESIZE", id, width, height });
  }, []);

  const isAppOpen = useCallback(
    (appId: AppId) => state.windows.some((w) => w.appId === appId),
    [state.windows]
  );

  const topWindowId = useMemo(() => {
    const visible = state.windows.filter((w) => !w.minimized);
    if (visible.length === 0) return null;
    return visible.reduce((top, w) => (w.zIndex > top.zIndex ? w : top)).id;
  }, [state.windows]);

  const value = useMemo<OSContextValue>(
    () => ({
      windows: state.windows,
      openApp,
      closeWindow,
      focusWindow,
      minimizeWindow,
      restoreWindow,
      toggleMaximize,
      moveWindow,
      resizeWindow,
      isAppOpen,
      topWindowId,
    }),
    [
      state.windows,
      openApp,
      closeWindow,
      focusWindow,
      minimizeWindow,
      restoreWindow,
      toggleMaximize,
      moveWindow,
      resizeWindow,
      isAppOpen,
      topWindowId,
    ]
  );

  return <OSContext.Provider value={value}>{children}</OSContext.Provider>;
}

export function useWindowManager(): OSContextValue {
  const ctx = useContext(OSContext);
  if (!ctx) {
    throw new Error("useWindowManager must be used within WindowManagerProvider");
  }
  return ctx;
}
