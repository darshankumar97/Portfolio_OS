"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminIcon } from "@/components/admin/AdminIcon";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-border-subtle hover:text-foreground disabled:opacity-50"
    >
      <AdminIcon name="logout" className="h-3.5 w-3.5" />
      Sign out
    </button>
  );
}
