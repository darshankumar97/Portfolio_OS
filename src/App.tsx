/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AppWindowId,
  WindowInstance,
  DesktopIcon,
} from './types/os';
import { PortfolioDB } from './utils/portfolioDb';

// Components
import BootScreen from './components/BootScreen';
import WindowFrame from './components/WindowFrame';
import Dock from './components/Dock';
import DesktopIconItem from './components/DesktopIconItem';
import CommandPalette from './components/CommandPalette';

// Window Contents
import ProjectsView from './components/window-contents/ProjectsView';
import ResearchView from './components/window-contents/ResearchView';
import OpenSourceView from './components/window-contents/OpenSourceView';
import HowIWorkView from './components/window-contents/HowIWorkView';
import ArchitectureView from './components/window-contents/ArchitectureView';
import ExperienceView from './components/window-contents/ExperienceView';
import SkillsView from './components/window-contents/SkillsView';
import AchievementsView from './components/window-contents/AchievementsView';
import ResumeView from './components/window-contents/ResumeView';
import ContactView from './components/window-contents/ContactView';
import TerminalView from './components/window-contents/TerminalView';
import WorkView from './components/window-contents/WorkView';
import JournalView from './components/window-contents/JournalView';
import ReviewsView from './components/window-contents/ReviewsView';
import AdminView from './components/window-contents/AdminView';
import ChangelogView from './components/window-contents/ChangelogView';

import { Terminal, ShieldAlert, Cpu, Activity, Clock, Sparkles, Code2, ArrowUpRight, LayoutGrid, MapPin, User, Star, ExternalLink, Mail } from 'lucide-react';

const INITIAL_WINDOWS: WindowInstance[] = [
  { id: 'projects', title: 'Featured Projects', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 70, y: 50, width: 1080, height: 720 },
  { id: 'architecture', title: 'System Architecture', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 90, y: 60, width: 1120, height: 740 },
  { id: 'research', title: 'Research & Whitepapers', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 110, y: 70, width: 1080, height: 720 },
  { id: 'opensource', title: 'Open Source Contributions', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 130, y: 80, width: 1080, height: 720 },
  { id: 'howiwork', title: 'How I Work', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 150, y: 90, width: 1080, height: 720 },
  { id: 'experience', title: 'Professional Experience', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 170, y: 100, width: 1080, height: 720 },
  { id: 'resume', title: 'Curriculum Vitae', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 80, y: 55, width: 1060, height: 740 },
  { id: 'achievements', title: 'Awards & Milestones', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 190, y: 110, width: 1080, height: 720 },
  { id: 'skills', title: 'Technical Skills Matrix', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 210, y: 120, width: 1080, height: 720 },
  { id: 'terminal', title: 'Diagnostic Terminal', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 250, y: 150, width: 860, height: 540 },
  { id: 'work', title: 'Consulting & Development Services', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 120, y: 65, width: 1120, height: 740 },
  { id: 'journal', title: 'Engineering Journal', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 140, y: 85, width: 1060, height: 720 },
  { id: 'reviews', title: 'Peer Testimonials & Reviews', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 160, y: 95, width: 1080, height: 720 },
  { id: 'admin', title: 'Admin Console', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 100, y: 60, width: 1140, height: 760 },
  { id: 'changelog', title: 'DevOS Core Changelog', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 180, y: 105, width: 1080, height: 720 },
  { id: 'contact', title: 'Get in Touch', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 130, y: 75, width: 1040, height: 700 }
];

const PRIMARY_ICONS: DesktopIcon[] = [
  { id: 'projects', label: 'Projects', iconName: 'projects' },
  { id: 'research', label: 'Research', iconName: 'research' },
  { id: 'experience', label: 'Experience', iconName: 'experience' },
  { id: 'resume', label: 'Resume', iconName: 'resume' },
];

const SECONDARY_ICONS: DesktopIcon[] = [
  { id: 'architecture', label: 'Architecture', iconName: 'architecture' },
  { id: 'opensource', label: 'Open Source', iconName: 'opensource' },
  { id: 'howiwork', label: 'How I Work', iconName: 'howiwork' },
  { id: 'work', label: 'Services', iconName: 'work' },
];

const UTILITY_ICONS: DesktopIcon[] = [
  { id: 'contact', label: 'Contact', iconName: 'contact' },
  { id: 'admin', label: 'Admin Panel', iconName: 'admin' },
];

export default function App() {
  const [isBooting, setIsBooting] = useState(true);
  const [appearance, setAppearance] = useState(() => PortfolioDB.getAppearance());
  const [settings, setSettings] = useState(() => PortfolioDB.getSettings());
  const [projectsList, setProjectsList] = useState(() => PortfolioDB.getProjects());
  const [windows, setWindows] = useState<WindowInstance[]>(INITIAL_WINDOWS);
  const [activeWindowId, setActiveWindowId] = useState<AppWindowId | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [diagCommandList, setDiagCommandList] = useState<string[]>([]);

  // Reload appearance configurations from DB
  useEffect(() => {
    const sync = () => {
      setAppearance(PortfolioDB.getAppearance());
      setSettings(PortfolioDB.getSettings());
      setProjectsList(PortfolioDB.getProjects());
    };
    window.addEventListener('portfolio-db-updated-devos_cms_appearance', sync);
    window.addEventListener('portfolio-db-updated-devos_cms_settings', sync);
    window.addEventListener('portfolio-db-updated-global', sync);
    
    // Auto-initiate real visitor telemetry tracking session
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    const browserName = navigator.userAgent.includes('Chrome') ? 'Chrome' : navigator.userAgent.includes('Safari') ? 'Safari' : 'Firefox';
    PortfolioDB.initiateVisitorSession(
      isMobile ? 'Mobile' : 'Desktop',
      browserName,
      document.referrer || 'Direct Ingress'
    );

    return () => {
      window.removeEventListener('portfolio-db-updated-devos_cms_appearance', sync);
      window.removeEventListener('portfolio-db-updated-devos_cms_settings', sync);
      window.removeEventListener('portfolio-db-updated-global', sync);
    };
  }, []);

  // Simulated live station timestamp updater (Bengaluru/India Local Time format)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      setCurrentTime(now.toLocaleTimeString('en-US', options) + ' UTC+5.5');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard binding command handlers (Esc to close window/palette)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (paletteOpen) {
          setPaletteOpen(false);
        } else if (activeWindowId) {
          handleCloseWindow(activeWindowId);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [paletteOpen, activeWindowId]);

  // Handle custom dynamic window communication & routing gestures
  useEffect(() => {
    const handleSwitchWindowFromCta = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && detail.targetId) {
        handleLaunchWindow(detail.targetId as AppWindowId);
        
        // Contextual form prefilling
        if (detail.subject) {
          setTimeout(() => {
            const subjectSelect = document.getElementById('contact-subject-select') as HTMLSelectElement | null;
            if (subjectSelect) {
              subjectSelect.value = detail.subject;
            }
            const messageInp = document.getElementById('contact-message-input') as HTMLTextAreaElement | null;
            if (messageInp) {
              messageInp.value = detail.message || '';
            }
            const nameInp = document.getElementById('contact-name-input') as HTMLInputElement | null;
            if (nameInp) {
              nameInp.focus();
            }
          }, 350);
        }
      }
    };
    window.addEventListener('devos-switch-window', handleSwitchWindowFromCta);
    return () => window.removeEventListener('devos-switch-window', handleSwitchWindowFromCta);
  }, []);

  const handleLaunchWindow = (id: AppWindowId) => {
    setWindows((prev) => {
      const maxZ = Math.max(...prev.map((win) => win.zIndex), 10);
      return prev.map((win) => {
        if (win.id === id) {
          return {
            ...win,
            isOpen: true,
            isMinimized: false,
            zIndex: maxZ + 1,
          };
        }
        return win;
      });
    });
    setActiveWindowId(id);
  };

  const handleCloseWindow = (id: AppWindowId) => {
    setWindows((prev) =>
      prev.map((win) => (win.id === id ? { ...win, isOpen: false } : win))
    );
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const handleMinimizeWindow = (id: AppWindowId) => {
    setWindows((prev) =>
      prev.map((win) => (win.id === id ? { ...win, isMinimized: true } : win))
    );
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const handleMaximizeWindow = (id: AppWindowId) => {
    setWindows((prev) =>
      prev.map((win) => (win.id === id ? { ...win, isMaximized: !win.isMaximized } : win))
    );
  };

  const handleFocusWindow = (id: AppWindowId) => {
    setWindows((prev) => {
      const maxZ = Math.max(...prev.map((win) => win.zIndex), 10);
      return prev.map((win) => {
        if (win.id === id) {
          return {
            ...win,
            isMinimized: false,
            zIndex: maxZ + 1,
          };
        }
        return win;
      });
    });
    setActiveWindowId(id);
  };

  const handleClearWorkspace = () => {
    setWindows((prev) => prev.map((win) => ({ ...win, isMinimized: true })));
    setActiveWindowId(null);
  };

  const handleRunSystemDiagnostic = () => {
    setDiagCommandList(['diagnose', 'sysinfo']);
    handleLaunchWindow('terminal');
  };

  const renderWindowContent = (id: AppWindowId) => {
    switch (id) {
      case 'projects':
        return <ProjectsView />;
      case 'research':
        return <ResearchView />;
      case 'opensource':
        return <OpenSourceView />;
      case 'howiwork':
        return <HowIWorkView />;
      case 'architecture':
        return <ArchitectureView />;
      case 'experience':
        return <ExperienceView />;
      case 'skills':
        return <SkillsView />;
      case 'achievements':
        return <AchievementsView />;
      case 'resume':
        return <ResumeView />;
      case 'contact':
        return <ContactView />;
      case 'terminal':
        return <TerminalView initialCommandList={diagCommandList} />;
      case 'work':
        return <WorkView />;
      case 'journal':
        return <JournalView />;
      case 'reviews':
        return <ReviewsView />;
      case 'admin':
        return <AdminView />;
      case 'changelog':
        return <ChangelogView />;
      default:
        return <div className="p-6 font-mono text-xs text-zinc-500">Resource Registry Mismatch</div>;
    }
  };

  // Dynamic theme and accent parameters mappings
  const themeStyles = {
    midnight: {
      bg: "bg-[#050505] text-[#EDEDED]",
      header: "bg-[#0a0a0c]/60 border-white/5 text-white/40",
      logo: "text-white"
    },
    graphite: {
      bg: "bg-[#121212] text-[#D4D4D8]",
      header: "bg-zinc-900/60 border-zinc-800 text-zinc-400",
      logo: "text-zinc-200"
    },
    'minimal-light': {
      bg: "bg-[#FAFAFA] text-[#18181B]",
      header: "bg-white/60 border-zinc-200 text-zinc-650",
      logo: "text-black"
    },
    'professional-dark': {
      bg: "bg-black text-neutral-200",
      header: "bg-neutral-950/80 border-neutral-900 text-zinc-500",
      logo: "text-white"
    }
  };

  const currentTheme = themeStyles[appearance.theme] || themeStyles.midnight;
  const isAnyWindowOpen = windows.some((win) => win.isOpen && !win.isMinimized);

  return (
    <AnimatePresence mode="wait">
      {isBooting ? (
        <BootScreen onBootComplete={() => setIsBooting(false)} />
      ) : (
        <motion.main
          id="devos-workspace"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className={`relative h-screen w-screen overflow-hidden selection:bg-neutral-800 ${currentTheme.bg}`}
        >
          {/* Wallpaper Handler: Base64 Custom Image vs Ambient Matte Mesh */}
          {appearance.wallpaper && appearance.wallpaper !== 'default-mesh' ? (
            <div 
              className="absolute inset-0 bg-cover bg-center z-[1] transition-all duration-500"
              style={{ backgroundImage: `url(${appearance.wallpaper})` }}
            />
          ) : (
            <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none bg-[#020204]">
              {/* Refined Ambient Matte Mesh - Indigo, Steel Violet, Slate */}
              <div className="absolute top-[-15%] left-[-10%] w-[60%] h-[50%] bg-[#0f172a] blur-[140px] rounded-full opacity-75" />
              <div className="absolute top-[20%] right-[-10%] w-[45%] h-[45%] bg-[#1e1b4b]/40 blur-[150px] rounded-full opacity-55" />
              <div className="absolute bottom-[-15%] left-[20%] w-[55%] h-[50%] bg-[#090d16] blur-[120px] rounded-full opacity-85" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#111827]/60 border border-white/5 blur-[110px] rounded-full opacity-65" />
              
              {/* Ultra-fine technical mesh overlay */}
              <div 
                className="absolute inset-0 opacity-[0.035]"
                style={{
                  backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />
            </div>
          )}

          {/* Top Status Menu Bar */}
          <header className={`fixed top-0 inset-x-0 h-11 border-b backdrop-blur-md z-[40] flex items-center justify-between px-6 text-[10px] font-medium tracking-wider uppercase select-none ${currentTheme.header}`}>
            {/* Brand Logo & Title */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 font-sans tracking-[0.15em]" style={{ color: appearance.accentColor }}>
                <div className="w-1.5 h-1.5 rounded-sm rotate-45" style={{ backgroundColor: appearance.accentColor }}></div>
                <span className={`${currentTheme.logo} font-extrabold text-[12px] tracking-[0.2em]`}>DARSHAN KUMAR K R</span>
              </div>
              <span className="text-zinc-700/40">|</span>
              <span className="hidden md:inline text-[8px] font-mono tracking-[0.18em] text-zinc-500 uppercase leading-none font-medium">
                Systems Architect & Engineer
              </span>
            </div>

            {/* Active Alignment & Commands */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                <span className="text-[9px] tracking-widest font-mono">AVAILABLE FOR ALLIANCE</span>
              </div>
              
              <div 
                onClick={() => setPaletteOpen(true)}
                className="hidden sm:flex items-center gap-1.5 cursor-pointer hover:text-white/80 transition-colors"
              >
                <span className="bg-white/10 px-1.5 py-0.5 rounded text-[8px] tracking-normal font-sans text-white/70">⌘K</span>
                <span className="normal-case text-[10px] tracking-normal">Command Palette</span>
              </div>
            </div>
          </header>          {/* Desktop Work Space */}
          <div id="desktop-grid-workplace" className="pt-20 pb-24 px-8 h-full w-full relative flex focus:outline-none z-[2]">
            
            {/* Left Categorized Desktop Workspace Columns */}
            <div className="flex flex-row gap-12 lg:gap-20 items-start h-[75%] z-[2] transition-all duration-300 pointer-events-auto select-none">
              
              {/* PRIMARY GROUP */}
              <div className="flex flex-col gap-4">
                <div className="text-[8px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500 pb-1.5 border-b border-white/5 select-none opacity-80">
                  // Portfolio Pillars
                </div>
                <div className="flex flex-col gap-4">
                  {PRIMARY_ICONS.map((icon) => {
                    const targetWindow = windows.find((w) => w.id === icon.id);
                    return (
                      <DesktopIconItem
                        key={icon.id}
                        id={icon.id}
                        label={icon.label}
                        iconName={icon.iconName}
                        onClick={handleLaunchWindow}
                        isOpen={targetWindow?.isOpen ?? false}
                        dimmed={isAnyWindowOpen}
                      />
                    );
                  })}
                </div>
              </div>

              {/* SECONDARY GROUP */}
              <div className="flex flex-col gap-4">
                <div className="text-[8px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500 pb-1.5 border-b border-white/5 select-none opacity-80">
                  // Core Methods
                </div>
                <div className="flex flex-col gap-4">
                  {SECONDARY_ICONS.map((icon) => {
                    const targetWindow = windows.find((w) => w.id === icon.id);
                    return (
                      <DesktopIconItem
                        key={icon.id}
                        id={icon.id}
                        label={icon.label}
                        iconName={icon.iconName}
                        onClick={handleLaunchWindow}
                        isOpen={targetWindow?.isOpen ?? false}
                        dimmed={isAnyWindowOpen}
                      />
                    );
                  })}
                </div>
              </div>

              {/* UTILITY GROUP */}
              <div className="flex flex-col gap-4">
                <div className="text-[8px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500 pb-1.5 border-b border-white/5 select-none opacity-80">
                  // Connection & Admin
                </div>
                <div className="flex flex-col gap-4">
                  {UTILITY_ICONS.map((icon) => {
                    const targetWindow = windows.find((w) => w.id === icon.id);
                    return (
                      <DesktopIconItem
                        key={icon.id}
                        id={icon.id}
                        label={icon.label}
                        iconName={icon.iconName}
                        onClick={handleLaunchWindow}
                        isOpen={targetWindow?.isOpen ?? false}
                        dimmed={isAnyWindowOpen}
                      />
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Bento Grid Live Desktop Widgets Workspace Dashboard (CMS-editable! Priority 9 & Priority 2) */}
            <div className={`absolute right-8 top-20 bottom-24 w-[340px] xl:w-[380px] hidden lg:flex flex-col gap-4 text-left z-[2] overflow-y-auto pr-1 transition-all duration-300
              ${isAnyWindowOpen ? 'opacity-[0.85] brightness-[0.92]' : 'opacity-100'}
            `}>
              {/* Card 1: Main Greetings */}
              <div className="bg-black/20 border border-white/5 p-5 rounded-2xl backdrop-blur-md space-y-3.5">
                <div className="flex items-center gap-2 text-zinc-400 font-mono text-[8px] uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  <span>{settings.desktopWelcome || "DevOS Live Central Operator"}</span>
                </div>
                <div className="space-y-1">
                  <h1 className="text-2xl font-extrabold tracking-tight text-white font-sans leading-none">
                    {settings.heroTitle || "Darshan Kumar K R"}
                  </h1>
                  <p className="text-zinc-500 font-mono text-[8.5px] uppercase tracking-[0.16em] leading-normal pt-1 flex items-center gap-1.5 font-semibold">
                    <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                    {settings.heroSubtitle || "Systems Architect & Cloud Security"}
                  </p>
                </div>
                <p className="text-zinc-400 text-[11px] leading-relaxed select-text font-medium opacity-90">
                  {settings.heroText || "I engineer robust distributed infrastructures, develop deep learning threat intelligence classifiers, and build secure systems pipelines."}
                </p>
              </div>

              {/* Card 2: Current Focus Status Indicator */}
              <div className="bg-black/20 border border-white/5 p-5 rounded-2xl backdrop-blur-md space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-400 font-mono text-[8px] uppercase tracking-wider">
                    <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                    <span>LATEST CORE FOCUS OBJECTS</span>
                  </div>
                  <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[7px] px-1.5 py-0.5 rounded leading-none uppercase tracking-wider font-bold">
                    ACTIVE
                  </span>
                </div>
                <p className="text-zinc-350 text-[11px] font-sans leading-relaxed select-text font-medium opacity-90">
                  {settings.currentFocusWidget || "Cloud Security Research, Container Orchestration Lab, & Enterprise CMS Deployments"}
                </p>
              </div>
            </div>

            {/* Subtle Desktop Backdrop Overlay when window is open */}
            <AnimatePresence>
              {isAnyWindowOpen && (
                <motion.div
                  key="desktop-backdrop-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 z-[5] pointer-events-none"
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.06)' }}
                />
              )}
            </AnimatePresence>

            {/* Draggable Active Floating Window Stack */}
            <div className="absolute inset-0 pointer-events-none z-[10] pt-16 pb-24 px-6">
              <div className="relative w-full h-full pointer-events-none">
                <AnimatePresence>
                  {windows.map((win) => {
                    if (!win.isOpen) return null;
                    return (
                      <WindowFrame
                        key={win.id}
                        windowState={win}
                        onClose={handleCloseWindow}
                        onMinimize={handleMinimizeWindow}
                        onMaximize={handleMaximizeWindow}
                        onFocus={handleFocusWindow}
                        isActive={activeWindowId === win.id}
                      >
                        {renderWindowContent(win.id)}
                      </WindowFrame>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Bottom dock (Mac/iOS Vibe Taskbar Interface) */}
          <Dock
            windows={windows}
            activeWindowId={activeWindowId}
            onIconClick={handleFocusWindow}
            onOpenCommandPalette={() => setPaletteOpen(true)}
            onClearDesktop={handleClearWorkspace}
          />

          {/* Keyboard bindings accessible Command Palette */}
          <AnimatePresence>
            {paletteOpen && (
              <CommandPalette
                isOpen={paletteOpen}
                onClose={() => setPaletteOpen(false)}
                onLaunchWindow={handleLaunchWindow}
                onRunDiagnostic={handleRunSystemDiagnostic}
                onClearWorkspace={handleClearWorkspace}
              />
            )}
          </AnimatePresence>
        </motion.main>
      )}
    </AnimatePresence>
  );
}
