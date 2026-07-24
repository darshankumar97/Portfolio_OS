"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminIcon } from "@/components/admin/AdminIcon";
import { cn } from "@/lib/utils";

interface PreviewToggleProps {
  previewing: boolean;
}

export function PreviewToggle({ previewing }: PreviewToggleProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    await fetch(`/api/admin/preview/${previewing ? "disable" : "enable"}`, { method: "POST" });
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      title={
        previewing
          ? "Draft content is visible on the live site for you — click to go back to published-only"
          : "See draft (unpublished) content on the live site before it goes public"
      }
      className={cn(
        "flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors disabled:opacity-50",
        previewing
          ? "border-accent/30 bg-accent-subtle text-accent"
          : "border-border text-muted hover:bg-border-subtle hover:text-foreground"
      )}
    >
      <AdminIcon name="eye" className="h-3.5 w-3.5" />
      {previewing ? "Previewing drafts" : "Preview site"}
    </button>
  );
}
