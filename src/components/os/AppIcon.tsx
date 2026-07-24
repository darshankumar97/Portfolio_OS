import { cn } from "@/lib/utils";
import type { AppId } from "@/types/os";

const GRADIENTS: Record<AppId, string> = {
  finder: "linear-gradient(160deg, #60a5fa 0%, #2563eb 55%, #1e3a8a 100%)",
  notes: "linear-gradient(160deg, #fde68a 0%, #f59e0b 60%, #b45309 100%)",
  terminal: "linear-gradient(160deg, #3f3f46 0%, #18181b 70%, #000000 100%)",
  mail: "linear-gradient(160deg, #7dd3fc 0%, #0ea5e9 55%, #075985 100%)",
  preview: "linear-gradient(160deg, #f4f4f5 0%, #d4d4d8 60%, #a1a1aa 100%)",
  safari: "linear-gradient(160deg, #67e8f9 0%, #0891b2 55%, #164e63 100%)",
  settings: "linear-gradient(160deg, #d4d4d8 0%, #71717a 55%, #3f3f46 100%)",
};

function Glyph({ appId }: { appId: AppId }) {
  const common = "h-[55%] w-[55%]";
  switch (appId) {
    case "finder":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="white" strokeWidth="1.6">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 9h18M8 4v16" />
        </svg>
      );
    case "notes":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="white" strokeWidth="1.6">
          <path d="M5 4h14v16H5z" />
          <path d="M8 9h8M8 13h8M8 17h5" />
        </svg>
      );
    case "terminal":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="#4ade80" strokeWidth="1.8">
          <path d="M5 7l5 5-5 5" />
          <path d="M13 17h6" />
        </svg>
      );
    case "mail":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="white" strokeWidth="1.6">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 6l9 7 9-7" />
        </svg>
      );
    case "preview":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="#3f3f46" strokeWidth="1.6">
          <path d="M7 3h7l4 4v14H7z" />
          <path d="M14 3v4h4" />
        </svg>
      );
    case "safari":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="white" strokeWidth="1.4">
          <circle cx="12" cy="12" r="9" />
          <path d="M15 9l-4 6-3-3z" fill="#ef4444" stroke="none" />
        </svg>
      );
    case "settings":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="white" strokeWidth="1.6">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
        </svg>
      );
  }
}

interface AppIconProps {
  appId: AppId;
  size?: number;
  className?: string;
}

export function AppIcon({ appId, size, className }: AppIconProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-[22%] shadow-sm ring-1 ring-black/10",
        className
      )}
      style={{
        width: size,
        height: size,
        background: GRADIENTS[appId],
      }}
    >
      <Glyph appId={appId} />
    </div>
  );
}
