export type AppId =
  | "finder"
  | "notes"
  | "terminal"
  | "mail"
  | "preview"
  | "safari"
  | "settings";

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WindowInstance {
  id: string;
  appId: AppId;
  title: string;
  bounds: Rect;
  prevBounds: Rect | null;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
}

export interface AppDefinition {
  id: AppId;
  name: string;
  defaultSize: { width: number; height: number };
  minSize: { width: number; height: number };
  singleton?: boolean;
}
