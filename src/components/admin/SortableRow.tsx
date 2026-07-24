"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

interface SortableRowProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function SortableRow({ id, children, className }: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center gap-3 border-b border-border-subtle bg-surface-elevated last:border-b-0",
        isDragging && "relative z-10 shadow-lg",
        className
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        className="flex h-8 w-6 shrink-0 cursor-grab touch-none items-center justify-center text-muted-light hover:text-muted active:cursor-grabbing"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
          <circle cx="9" cy="6" r="1.3" />
          <circle cx="15" cy="6" r="1.3" />
          <circle cx="9" cy="12" r="1.3" />
          <circle cx="15" cy="12" r="1.3" />
          <circle cx="9" cy="18" r="1.3" />
          <circle cx="15" cy="18" r="1.3" />
        </svg>
      </button>
      <div className="min-w-0 flex-1 py-3">{children}</div>
    </div>
  );
}
