"use client";

import { useOSContent } from "@/lib/os/content-context";

export function PreviewApp() {
  const { site, profile, experience, skills } = useOSContent();

  return (
    <div className="flex h-full flex-col bg-surface">
      <div className="flex items-center justify-between border-b border-border-subtle bg-surface-elevated px-5 py-2.5">
        <p className="text-sm font-medium text-foreground">Resume.pdf</p>
        {site.resumeUrl ? (
          <a
            href={site.resumeUrl}
            download
            className="rounded-md bg-foreground px-3 py-1 text-xs font-medium text-surface"
          >
            Download
          </a>
        ) : (
          <span className="rounded-md border border-border px-3 py-1 text-xs text-muted-light">
            Not uploaded yet
          </span>
        )}
      </div>

      <div className="mx-auto w-full max-w-2xl flex-1 overflow-y-auto px-8 py-8">
        {!site.resumeUrl && (
          <p className="mb-6 rounded-md border border-dashed border-border bg-surface-elevated px-4 py-2 text-xs text-muted-light">
            No resume PDF uploaded yet — upload one from the admin panel and it&apos;ll appear
            here. Shown below is a summary generated from portfolio content.
          </p>
        )}

        <h1 className="text-xl font-semibold text-foreground">{profile.name}</h1>
        <p className="text-sm text-muted">
          {profile.title} · {profile.location} · {profile.email}
        </p>

        <div className="mt-6 border-t border-border-subtle pt-4">
          <h2 className="text-xs font-semibold tracking-wide text-muted-light uppercase">
            Experience
          </h2>
          <div className="mt-3 space-y-4">
            {experience.map((item) => (
              <div key={item.id}>
                <p className="text-sm font-medium text-foreground">
                  {item.role} <span className="font-normal text-muted">· {item.company}</span>
                </p>
                <p className="text-xs text-muted-light">{item.period}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 border-t border-border-subtle pt-4">
          <h2 className="text-xs font-semibold tracking-wide text-muted-light uppercase">
            Skills
          </h2>
          <div className="mt-3 space-y-2">
            {skills.map((category) => (
              <p key={category.id} className="text-sm text-muted">
                <span className="font-medium text-foreground">{category.name}:</span>{" "}
                {category.skills.map((s) => s.name).join(", ")}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
