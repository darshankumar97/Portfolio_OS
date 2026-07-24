"use client";

import { useOSContent } from "@/lib/os/content-context";

export function SafariApp() {
  const { research, social } = useOSContent();

  return (
    <div className="flex h-full flex-col bg-surface">
      <div className="flex items-center gap-2 border-b border-border-subtle bg-surface-elevated px-4 py-2">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="mx-auto flex max-w-md flex-1 items-center justify-center rounded-md bg-surface px-3 py-1 text-xs text-muted-light">
          darshankumar.me/research
        </div>
      </div>

      <div className="mx-auto w-full max-w-2xl flex-1 overflow-y-auto px-8 py-8">
        <h1 className="text-lg font-semibold text-foreground">Research &amp; Publications</h1>
        <div className="mt-5 space-y-5">
          {research.map((item) => (
            <div key={item.id} className="rounded-lg border border-border bg-surface-elevated p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h2 className="text-sm font-semibold text-foreground">{item.title}</h2>
                <span className="rounded-md border border-border-subtle px-2 py-0.5 text-xs text-muted-light">
                  {item.type}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted">
                {item.authors.join(", ")} · {item.venue}, {item.year}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.abstract}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-border-subtle px-2 py-0.5 text-xs text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-border-subtle pt-6">
          <h2 className="text-xs font-semibold tracking-wide text-muted-light uppercase">
            Elsewhere
          </h2>
          <div className="mt-3 flex flex-wrap gap-4">
            {social.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target={link.icon === "email" ? undefined : "_blank"}
                rel={link.icon === "email" ? undefined : "noopener noreferrer"}
                className="text-sm text-accent hover:underline"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
