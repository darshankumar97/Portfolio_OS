"use client";

import { useState } from "react";

interface RowActionsProps {
  onEdit: () => void;
  onDelete: () => void | Promise<void>;
}

export function RowActions({ onEdit, onDelete }: RowActionsProps) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex shrink-0 items-center gap-2 text-xs">
        <span className="text-muted">Delete?</span>
        <button
          type="button"
          onClick={() => onDelete()}
          className="rounded-md bg-red-600 px-2 py-1 font-medium text-white hover:bg-red-700"
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="rounded-md border border-border px-2 py-1 text-muted hover:bg-border-subtle"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="flex shrink-0 items-center gap-1">
      <button
        type="button"
        onClick={onEdit}
        aria-label="Edit"
        className="rounded-md p-1.5 text-muted transition-colors hover:bg-border-subtle hover:text-foreground"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        aria-label="Delete"
        className="rounded-md p-1.5 text-muted transition-colors hover:bg-red-500/10 hover:text-red-600"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M4 7h16" />
          <path d="M9 7V4h6v3" />
          <path d="M6 7l1 13h10l1-13" />
        </svg>
      </button>
    </div>
  );
}
