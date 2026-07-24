"use client";

import { useState } from "react";
import { useOSContent } from "@/lib/os/content-context";

export function MailApp() {
  const { profile, social } = useOSContent();
  const [name, setName] = useState("");
  const [replyTo, setReplyTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body = `${message}\n\n— ${name}${replyTo ? ` (${replyTo})` : ""}`;
    const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(
      subject || "Hello from DevOS"
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  }

  return (
    <div className="flex h-full flex-col bg-surface-elevated">
      <div className="border-b border-border-subtle px-5 py-3">
        <p className="text-sm font-semibold text-foreground">New Message</p>
        <p className="text-xs text-muted-light">To: {profile.email}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-3 overflow-y-auto p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
          <input
            required
            type="email"
            value={replyTo}
            onChange={(e) => setReplyTo(e.target.value)}
            placeholder="Your email"
            className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </div>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
        />
        <textarea
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your message…"
          rows={8}
          className="flex-1 resize-none rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
        />

        <div className="flex items-center justify-between border-t border-border-subtle pt-3">
          <div className="flex flex-wrap gap-3">
            {social
              .filter((s) => s.icon !== "email")
              .map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
          </div>
          <button
            type="submit"
            className="rounded-md bg-accent px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-accent-hover"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
