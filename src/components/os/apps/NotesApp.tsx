"use client";

import { useOSContent } from "@/lib/os/content-context";

export function NotesApp() {
  const { profile } = useOSContent();

  return (
    <div className="h-full overflow-y-auto bg-surface-elevated px-8 py-8 text-foreground">
      <p className="text-xs font-medium tracking-wide text-muted-light uppercase">
        {profile.title} · {profile.location}
      </p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">{profile.name}</h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">{profile.bio}</p>

      <div className="mt-8 grid gap-4 border-t border-border-subtle pt-6 sm:grid-cols-3">
        {profile.highlights.map((item) => (
          <div key={item.label}>
            <p className="text-xs font-medium tracking-wide text-muted-light uppercase">
              {item.label}
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-4 border-t border-border-subtle pt-6">
        {profile.audiences.map((audience) => (
          <div key={audience.id}>
            <h3 className="text-sm font-semibold text-foreground">{audience.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted">{audience.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
