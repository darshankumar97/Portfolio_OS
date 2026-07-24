"use client";

import { cn } from "@/lib/utils";

interface PublishSwitchProps {
  published: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
}

export function PublishSwitch({ published, onChange, disabled }: PublishSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={published}
      aria-label={published ? "Published — click to unpublish" : "Draft — click to publish"}
      disabled={disabled}
      onClick={() => onChange(!published)}
      className={cn(
        "relative h-5 w-9 shrink-0 rounded-full transition-colors disabled:opacity-50",
        published ? "bg-accent" : "bg-border"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
          published ? "translate-x-[18px]" : "translate-x-0.5"
        )}
      />
    </button>
  );
}
