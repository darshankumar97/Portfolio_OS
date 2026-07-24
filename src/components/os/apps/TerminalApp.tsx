"use client";

import { useEffect, useRef, useState } from "react";
import { useOSContent, type OSContent } from "@/lib/os/content-context";

interface HistoryEntry {
  command: string;
  output: string[];
}

function buildCommands({ profile, projects, skills, social }: OSContent): Record<string, () => string[]> {
  return {
    help: () => [
      "Available commands:",
      "  about      — who I am",
      "  projects   — selected work",
      "  skills     — technical stack",
      "  contact    — how to reach me",
      "  resume     — open the resume viewer",
      "  clear      — clear the terminal",
      "  whoami",
    ],
    about: () => [profile.headline, "", profile.bio],
    projects: () =>
      projects.map((p) => `${p.title.padEnd(20)} ${p.tagline}`),
    skills: () =>
      skills.flatMap((category) => [
        `${category.name}:`,
        `  ${category.skills.map((s) => s.name).join(", ")}`,
      ]),
    contact: () => [
      `Email: ${profile.email}`,
      ...social.map((s) => `${s.label}: ${s.url}`),
    ],
    resume: () => ["Opening Preview.app…", "(use the Dock or type: open preview)"],
    whoami: () => [profile.name.toLowerCase().replace(/\s+/g, "-")],
    date: () => [new Date().toString()],
    "sudo hire-me": () => [
      "Permission granted.",
      `Let's talk — ${profile.email}`,
    ],
  };
}

const WELCOME = [
  "DevOS Terminal — type `help` to get started.",
];

interface TerminalAppProps {
  onOpenApp?: (appId: "preview") => void;
}

export function TerminalApp({ onOpenApp }: TerminalAppProps) {
  const content = useOSContent();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState("");
  const [navIndex, setNavIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [history]);

  function run(raw: string) {
    const command = raw.trim();
    if (!command) return;

    if (command === "clear") {
      setHistory([]);
      return;
    }

    const commands = buildCommands(content);
    let output: string[];

    if (command === "open preview" || command === "resume") {
      output = ["Opening Preview.app…"];
      onOpenApp?.("preview");
    } else if (commands[command]) {
      output = commands[command]();
    } else {
      output = [`command not found: ${command}`, "type \`help\` for a list of commands"];
    }

    setHistory((prev) => [...prev, { command, output }]);
  }

  return (
    <div
      className="h-full overflow-y-auto bg-[#0d0d0f] p-4 font-mono text-[13px] text-[#d4d4d8]"
      ref={scrollRef}
      onClick={() => inputRef.current?.focus()}
    >
      {WELCOME.map((line) => (
        <p key={line} className="text-[#71717a]">
          {line}
        </p>
      ))}

      {history.map((entry, i) => (
        <div key={i} className="mt-2">
          <p>
            <span className="text-[#4ade80]">devos@portfolio</span>
            <span className="text-[#71717a]"> ~ % </span>
            {entry.command}
          </p>
          {entry.output.map((line, j) => (
            <p key={j} className="whitespace-pre-wrap text-[#e4e4e7]">
              {line}
            </p>
          ))}
        </div>
      ))}

      <form
        className="mt-2 flex items-center gap-1.5"
        onSubmit={(e) => {
          e.preventDefault();
          run(input);
          setInput("");
          setNavIndex(null);
        }}
      >
        <span className="text-[#4ade80]">devos@portfolio</span>
        <span className="text-[#71717a]">~ %</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") {
              e.preventDefault();
              if (history.length === 0) return;
              const idx = navIndex === null ? history.length - 1 : Math.max(0, navIndex - 1);
              setNavIndex(idx);
              setInput(history[idx].command);
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              if (navIndex === null) return;
              const idx = navIndex + 1;
              if (idx >= history.length) {
                setNavIndex(null);
                setInput("");
              } else {
                setNavIndex(idx);
                setInput(history[idx].command);
              }
            }
          }}
          autoFocus
          spellCheck={false}
          className="flex-1 bg-transparent text-[#f4f4f5] outline-none"
        />
      </form>
    </div>
  );
}
