"use client";

import { useState } from "react";
import { inputClass } from "@/components/admin/FormField";

interface TagListInputProps {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}

export function TagListInput({ value, onChange, placeholder }: TagListInputProps) {
  const [draft, setDraft] = useState("");

  function commit() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onChange([...value, trimmed]);
    setDraft("");
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-2">
      {value.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {value.map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="flex items-center gap-1 rounded-md bg-border-subtle px-2 py-1 text-xs text-foreground"
            >
              {item}
              <button
                type="button"
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                aria-label={`Remove ${item}`}
                className="text-muted-light hover:text-foreground"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            commit();
          } else if (e.key === "Backspace" && !draft && value.length > 0) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={commit}
        placeholder={placeholder ?? "Type and press Enter"}
        className={`${inputClass} border-none bg-transparent p-0 focus:border-none`}
      />
    </div>
  );
}
