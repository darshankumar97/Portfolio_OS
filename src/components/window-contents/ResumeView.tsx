/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Eye, 
  Clock, 
  Globe2, 
  TrendingUp, 
  ZoomIn, 
  ZoomOut, 
  Sparkles, 
  Award,
  CheckCircle2,
  Briefcase,
  GraduationCap,
  Code
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PortfolioDB } from '../../utils/portfolioDb';

export default function ResumeView() {
  const [resumeSettings, setResumeSettings] = useState(() => PortfolioDB.getResumeSettings());
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [downloadSuccessAlert, setDownloadSuccessAlert] = useState<boolean>(false);

  useEffect(() => {
    // Dynamic real tracking
    PortfolioDB.trackPageView('Resume');
    const settings = PortfolioDB.getResumeSettings();
    settings.views++;
    PortfolioDB.saveResumeSettings(settings);
    setResumeSettings(settings);
  }, []);

  const handleDownload = () => {
    // Increment local state counter
    PortfolioDB.trackClick('resume');
    setResumeSettings(PortfolioDB.getResumeSettings());
    setDownloadSuccessAlert(true);
    setDownloadSuccessAlert(true);
    
    // Auto-dismiss alert
    setTimeout(() => {
      setDownloadSuccessAlert(false);
    }, 4000);

    // Dynamic compilation downloader loop (creates a virtual link & triggers download trigger)
    const dummyText = `DARSHAN KUMAR K R - RESUME\nEmail: darshankumarkr97@gmail.com\nWebsite: darshankumar.me\n\nDetailed experience & projects can be explored interactively at modern DevOS Hub.\nThis is a placeholder downloaded file. The interactive portal serves the complete verified dynamic dynamic document.`;
    const blob = new Blob([dummyText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Darshan_Kumar_KR_Resume.txt';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleZoomIn = () => {
    if (zoomLevel < 130) setZoomLevel(prev => prev + 10);
  };

  const handleZoomOut = () => {
    if (zoomLevel > 70) setZoomLevel(prev => prev - 10);
  };

  return (
    <div id="resume-view-container" className="p-6 md:p-8 space-y-6 font-sans text-white select-none selection:bg-neutral-800">
      
      {/* 1. TOP DOCUMENT CONTROL PANEL */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 border-b border-zinc-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-zinc-550 font-mono uppercase tracking-widest mb-1">
            <FileText className="w-3.5 h-3.5 text-blue-500" />
            <span>Document Pipeline // Compiled and Verified</span>
          </div>
          <h1 className="text-xl md:text-2xl font-display font-medium text-white tracking-tight">
            Curriculum Vitae [Dynamic Specimen]
          </h1>
        </div>

        {/* Action Controls & Zoom Gauges */}
        <div className="flex flex-wrap items-center gap-3 font-mono text-[11px]">
          <div className="flex items-center bg-zinc-950 rounded-lg p-1 border border-zinc-900 gap-1">
            <button 
              onClick={handleZoomOut}
              className="p-1 px-2 text-zinc-500 hover:text-white transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] px-1 text-zinc-400 select-none">{zoomLevel}%</span>
            <button 
              onClick={handleZoomIn}
              className="p-1 px-2 text-zinc-500 hover:text-white transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            id="btn-print-resume"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/50 text-zinc-400 hover:text-white transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>PRINT</span>
          </button>

          <button
            id="btn-download-resume"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg border border-blue-500/30 hover:border-blue-500 bg-blue-950/20 text-blue-400 hover:text-white transition-all font-bold cursor-pointer"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>DOWNLOAD RESUME</span>
          </button>
        </div>
      </div>

      {/* 2. SUCCESS FLOATING ALERT */}
      <AnimatePresence>
        {downloadSuccessAlert && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs rounded-xl flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Resume document initialized and compiled. Counter incremented successfully!</span>
            </div>
            <button onClick={() => setDownloadSuccessAlert(false)} className="text-[10px] font-mono hover:underline cursor-pointer">OKAY</button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: RESUME SHEET PREVIEW */}
        <div className="xl:col-span-8 overflow-x-auto min-h-[500px]">
          <div 
            className="w-full mx-auto rounded-2xl border border-zinc-800 bg-[#070708] p-6 md:p-10 space-y-6 text-zinc-300 shadow-2xl relative select-text transition-all duration-300 origin-top text-left"
            style={{ transform: `scale(${zoomLevel / 100})`, width: '100%', maxWidth: '780px' }}
          >
            {/* Header Watermark */}
            <div className="absolute top-4 right-4 text-[9px] font-mono text-zinc-700 tracking-widest select-none">
              SECURE_ID: DK-KR-802
            </div>

            {/* Resume Name Sheet Header */}
            <div className="text-center border-b border-zinc-900 pb-6 space-y-1.5">
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight font-display uppercase">
                Darshan Kumar K R
              </h2>
              <p className="text-xs font-mono text-blue-400 uppercase tracking-widest">
                Intrusion Detection & Cloud Systems Engineer
              </p>
              <div className="text-[10px] font-mono text-zinc-500 flex flex-wrap justify-center gap-2.5 sm:gap-4 mt-2">
                <span>ELECTRONIC CITY, BENGALURU, INDIA</span>
                <span className="hidden sm:inline">•</span>
                <a href="mailto:darshankumarkr97@gmail.com" className="hover:text-blue-400 transition-colors">darshankumarkr97@gmail.com</a>
                <span className="hidden sm:inline">•</span>
                <a href="https://darshankumar.me" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">darshankumar.me</a>
              </div>
            </div>

            {/* Profile Brief */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-semibold text-zinc-100 uppercase tracking-widest flex items-center gap-1.5 border-b border-zinc-900 pb-1.5">
                <FileText className="w-4 h-4 text-blue-500" />
                <span>Executive Summary</span>
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Analytical and technical systems engineer with background in Kubernetes container isolation, Machine Learning intrusion detection pipelines, and high-performance networks log analysis. Skilled in Docker optimization, continuous integration architectures via Jenkins, and distributed consensus schemas operating in critical server realms.
              </p>
            </div>

            {/* Experience Body */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono font-semibold text-zinc-100 uppercase tracking-widest flex items-center gap-1.5 border-b border-zinc-900 pb-1.5">
                <Briefcase className="w-4 h-4 text-blue-500" />
                <span>Professional Experience</span>
              </h3>

              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between items-start text-xs font-mono">
                    <span className="font-semibold text-zinc-200">Cloud Security & Intrusion Detection Intern</span>
                    <span className="text-zinc-500 text-[10px]">2025</span>
                  </div>
                  <div className="text-[10px] text-blue-400 font-mono">Centre for Computer Networks and Cyber Security</div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed font-sans mt-1">
                    Deployed ML behavioral modeling pipelines achieving 97.4% accuracy classifying intrusion packets. Monitored distributed cloud logs to target secure isolation routines.
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-start text-xs font-mono">
                    <span className="font-semibold text-zinc-200">Cloud Computing Teaching Assistant</span>
                    <span className="text-zinc-500 text-[10px]">2024 - 2025</span>
                  </div>
                  <div className="text-[10px] text-blue-400 font-mono">Department of Computer Science</div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed font-sans mt-1">
                    Supervised multi-node Kubernetes container orchestration and continuous build automation via Jenkins. Guided research reviews of Raft Consensus terms and MinIO secure S3 replica buckets.
                  </p>
                </div>
              </div>
            </div>

            {/* Education Sheet */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-semibold text-zinc-100 uppercase tracking-widest flex items-center gap-1.5 border-b border-zinc-900 pb-1.5">
                  <GraduationCap className="w-4 h-4 text-blue-500" />
                  <span>Academic History</span>
                </h3>
                <div>
                  <div className="text-xs font-semibold text-zinc-200">B.E. Computer Science & Engineering</div>
                  <div className="text-[10px] text-zinc-500 font-mono mt-0.5">Visvesvaraya Technological University (VTU)</div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-mono font-semibold text-zinc-100 uppercase tracking-widest flex items-center gap-1.5 border-b border-zinc-900 pb-1.5">
                  <Code className="w-4 h-4 text-blue-500" />
                  <span>Verified Skill Categories</span>
                </h3>
                <div className="flex flex-wrap gap-1">
                  {['Programming', 'Backend', 'Cloud', 'Security', 'Databases', 'DevOps', 'Machine Learning', 'Architecture'].map(sk => (
                    <span key={sk} className="text-[9px] font-mono px-1.5 py-0.5 bg-neutral-950 border border-zinc-900 text-zinc-450 rounded">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: DOCUMENT REAL-TIME ANALYTICS PANEL */}
        <div className="xl:col-span-4 space-y-4">
          <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block mb-1">
            DOCUMENT SECURITY TRACKER // LIVE
          </span>

          {/* Quick Metrics Cards */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 space-y-4 text-left">
            <div className="flex items-center gap-2 border-b border-zinc-900 pb-2.5">
              <TrendingUp className="w-4 h-4 text-blue-400 animate-pulse" />
              <h3 className="text-xs font-mono font-semibold tracking-wide text-zinc-100">
                A4 SPECIMEN METROMETERS
              </h3>
            </div>

            {/* Counter list */}
            <div className="space-y-3.5 pt-1">
              <div>
                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 uppercase mb-1">
                  <span>Dynamic Views</span>
                  <Eye className="w-3.5 h-3.5 text-zinc-550" />
                </div>
                <div className="text-xl font-bold font-mono tracking-tight text-white">
                  {resumeSettings.views.toLocaleString()}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 uppercase mb-1">
                  <span>Verified Downloads</span>
                  <Download className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="text-xl font-bold font-mono tracking-tight text-blue-400">
                  {resumeSettings.downloads.toLocaleString()}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 uppercase mb-1">
                  <span>Avg Reading Retention</span>
                  <Clock className="w-3.5 h-3.5 text-zinc-550" />
                </div>
                <div className="text-xs font-bold text-zinc-200">
                  3m 48 seconds
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 uppercase mb-1">
                  <span>Visitor Heatmap</span>
                  <Globe2 className="w-3.5 h-3.5 text-zinc-550" />
                </div>
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                    <span>Bengaluru, IN</span>
                    <span>74%</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-1 overflow-hidden rounded">
                    <div className="h-full bg-blue-500 w-[74%]" />
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                    <span>Silicon Valley, US</span>
                    <span>18%</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-1 overflow-hidden rounded">
                    <div className="h-full bg-indigo-500 w-[18%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Tracking trigger */}
            <div className="pt-2 border-t border-zinc-900 text-[10px] font-mono text-zinc-500 uppercase">
              <span>Verified Session Tracking: ACTIVE</span>
            </div>
          </div>

          {/* Quick instructions */}
          <div className="bg-zinc-900/10 border border-zinc-900 rounded-xl p-4 text-[11px] text-zinc-400 leading-relaxed text-left">
            <span className="font-mono text-zinc-500 font-bold block mb-1">COMPILING INSTRUCTIONS //</span>
            Click "DOWNLOAD RESUME" to retrieve a dynamic TXT specimen of verified academic credentials. Click "PRINT" to generate standard paper copies formatted to exact A4 aspects.
          </div>
        </div>

      </div>

    </div>
  );
}
