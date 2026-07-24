"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Something went wrong. Try again.");
        setLoading(false);
        return;
      }

      const destination = searchParams.get("from") ?? "/admin";
      router.push(destination);
      router.refresh();
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <div className="rounded-2xl border border-border bg-surface-elevated p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground text-sm font-bold text-surface">
            D
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">DevOS Admin</p>
            <p className="text-xs text-muted-light">Sign in to manage your portfolio</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-muted">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-muted">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            />
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        <Button type="submit" loading={loading} className="mt-6 w-full">
          Sign in
        </Button>
      </div>
    </form>
  );
}
