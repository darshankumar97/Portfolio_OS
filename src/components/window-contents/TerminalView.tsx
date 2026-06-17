/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Shield, RefreshCw, Cpu, Activity } from 'lucide-react';

interface TerminalViewProps {
  initialCommandList?: string[];
}

export default function TerminalView({ initialCommandList = [] }: TerminalViewProps) {
  const [logs, setLogs] = useState<string[]>([
    'DevOS Terminal Diagnostics v1.0.0',
    'Session coordinates: ELECTRONIC_CITY_BENGALURU_IN',
    'Kernel encryption verified: ECDH_256_AES_GCM_SECURE',
    'Type "help" or "diagnose" to query dynamic registers.',
    '',
  ]);
  const [inputValue, setInputValue] = useState('');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialCommandList && initialCommandList.length > 0) {
      initialCommandList.forEach((cmd) => {
        executeCommand(cmd);
      });
    }
  }, [initialCommandList]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const executeCommand = (cmdText: string) => {
    const trimmed = cmdText.trim().toLowerCase();
    let response: string[] = [];

    switch (trimmed) {
      case 'help':
        response = [
          'AVAILABLE PROTOCOLS:',
          '  diagnose     Assert schema directories and check filesystem integrity',
          '  sysinfo      Read CPU node loads, station delays, and system version',
          '  clear        Clear console terminal cache logs',
          '  help         Retrieve list of diagnostic protocols',
        ];
        break;
      case 'diagnose':
        response = [
          '[PROBE] Asserting schema files...',
          '  Checking /src/content/projects/schema.ts ... [OK]',
          '  Checking /src/content/research/schema.ts ... [OK]',
          '  Checking /src/content/experience/schema.ts ... [OK]',
          '  Checking /src/content/skills/schema.ts ... [OK]',
          '  Checking /src/content/journal/schema.ts ... [OK]',
          '  Checking /src/content/resume/schema.ts ... [OK]',
          '  Checking /src/content/media/schema.ts ... [OK]',
          '[INTEGRITY] Content architecture schemas fully congruent with DevOS.',
          '[OK] Structural Assertions complete.',
        ];
        break;
      case 'sysinfo':
        response = [
          'DEVOS SYSTEMS SPECIFICATION:',
          '  Platform Version : DevOS v1.0.0 Stable (Phase 1)',
          '  Local Station ID : darshankumar.me',
          '  Location Coordinates : Electronic City, Bengaluru, Karnataka, India',
          `  Total Heap Allocation : ${((performance as any).memory ? Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024) : 42)} MB`,
          '  Encryption Engine : AES-256-GCM Secure Enclave',
        ];
        break;
      case 'clear':
        setLogs([]);
        return;
      case '':
        response = [''];
        break;
      default:
        response = [`Command parsing mismatch: "${cmdText}". Try "help" to list available systems protocols.`];
    }

    setLogs((prev) => [...prev, `devos@darshankumar:~# ${cmdText}`, ...response, '']);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(inputValue);
    setInputValue('');
  };

  return (
    <div id="terminal-view-panel" className="bg-neutral-950 font-mono text-xs p-5 h-full flex flex-col justify-between selection:bg-zinc-800">
      <div className="flex-grow overflow-y-auto space-y-1 max-h-[300px]">
        {logs.map((log, idx) => (
          <div key={idx} className={log.startsWith('devos@') ? 'text-blue-400' : log.includes('[OK]') ? 'text-emerald-400' : 'text-zinc-300'}>
            {log}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-zinc-900 pt-3 mt-4">
        <span className="text-blue-500 font-bold">devos@darshankumar:~#</span>
        <input
          id="terminal-view-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Execute system commands..."
          className="flex-1 bg-transparent text-zinc-100 outline-none border-none font-mono focus:ring-0"
        />
        <span className="text-[10px] text-zinc-650 tracking-wider">ENTER TO EXEC</span>
      </form>
    </div>
  );
}
