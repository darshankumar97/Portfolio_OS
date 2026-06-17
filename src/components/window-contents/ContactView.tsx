/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Send, 
  CheckCircle2, 
  Loader2, 
  Mail, 
  MapPin, 
  ExternalLink, 
  Linkedin, 
  Github, 
  Copy, 
  Check 
} from 'lucide-react';
import { motion } from 'motion/react';
import { PortfolioDB } from '../../utils/portfolioDb';

export default function ContactView() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Consultation',
    message: '',
  });

  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [copied, setCopied] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('contact@darshankumar.me');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setFormStatus('sending');
    
    // Smooth professional latency simulation
    setTimeout(() => {
      const subj = formData.subject.toLowerCase();
      const type: 'general' | 'founder' | 'freelance' | 'recruiter' = 
        subj.includes('founder') || subj.includes('venture') ? 'founder' :
        subj.includes('freelance') || subj.includes('project') || subj.includes('contract') ? 'freelance' :
        subj.includes('recruit') || subj.includes('hiring') || subj.includes('job') ? 'recruiter' : 'general';

      const oldContacts = PortfolioDB.getContacts();
      const newContact = {
        id: `cont-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        date: new Date().toISOString().substring(0, 10),
        type,
        status: 'new' as const
      };
      PortfolioDB.saveContacts([newContact, ...oldContacts]);

      // Track contact request
      const summary = PortfolioDB.getAnalyticsSummary();
      summary.contactRequests++;
      PortfolioDB.saveAnalyticsSummary(summary);

      const sessions = PortfolioDB.getSessions();
      if (sessions.length > 0) {
        sessions[0].contactSubmitted = true;
        PortfolioDB.saveSessions(sessions);
      }

      setFormStatus('success');
    }, 1200);
  };

  return (
    <div id="contact-view-container" className="p-8 md:p-12 space-y-10 font-sans text-zinc-200 select-none selection:bg-zinc-800">
      
      {/* Structural Header */}
      <div className="border-b border-zinc-800 pb-8">
        <div className="flex items-center gap-2 text-[10px] text-zinc-500 tracking-widest uppercase mb-1.5 font-medium">
          <Mail className="w-3.5 h-3.5 text-zinc-400" />
          <span>Professional Contact Center</span>
        </div>
        <h1 className="text-xl md:text-2xl font-light text-white tracking-tight">
          Get in Touch
        </h1>
        <p className="text-zinc-400 text-xs md:text-sm mt-2 max-w-xl leading-relaxed">
          Have an upcoming project, venture capital proposal, or a technical inquiry? Drop a message here to establish connection lines.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Contact Form Block */}
        <div className="lg:col-span-7 bg-zinc-950 border border-zinc-800 rounded-3xl p-6 md:p-8 space-y-6">
          {formStatus === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 space-y-6"
            >
              <div className="mx-auto w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center text-zinc-200">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-white">Message Transmitted</h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                  Thank you for reaching out. Your inquiry has been processed successfully. Darshan will review your specifications shortly.
                </p>
              </div>

              <div className="pt-2">
                <button
                  id="btn-new-handshake"
                  onClick={() => {
                    setFormData({ name: '', email: '', subject: 'General Consultation', message: '' });
                    setFormStatus('idle');
                  }}
                  className="px-5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs font-medium text-white transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            </motion.div>
          ) : (
            <form id="contact-handshake-form" onSubmit={handleSubmit} className="space-y-6 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 text-xs">
                  <label className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider block">Your Name</label>
                  <input
                    id="contact-name-input"
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={formStatus !== 'idle'}
                    placeholder="e.g. Founder / Partner"
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-700 rounded-xl px-4 py-3 leading-relaxed text-zinc-100 outline-none transition-all placeholder:text-zinc-650"
                  />
                </div>

                <div className="space-y-2 text-xs">
                  <label className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider block">Your Email</label>
                  <input
                    id="contact-email-input"
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={formStatus !== 'idle'}
                    placeholder="partner@domain.com"
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-700 rounded-xl px-4 py-3 leading-relaxed text-zinc-100 outline-none transition-all placeholder:text-zinc-650"
                  />
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <label className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider block">Inquiry Type</label>
                <select
                  id="contact-subject-select"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  disabled={formStatus !== 'idle'}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-700 rounded-xl px-4 py-3 text-zinc-200 outline-none cursor-pointer"
                >
                  <option value="General Consultation">General Consultation / Discussion</option>
                  <option value="Full Stack Project">Full Stack Project Collaboration</option>
                  <option value="SaaS MVP Speedrun">SaaS MVP Speedrun</option>
                  <option value="System Design Review">System Design & Review</option>
                </select>
              </div>

              <div className="space-y-2 text-xs">
                <label className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider block">Message Body</label>
                <textarea
                  id="contact-message-input"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  disabled={formStatus !== 'idle'}
                  placeholder="Outline your project scope, timeline, and requirements..."
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-700 rounded-xl px-4 py-3 leading-relaxed text-zinc-100 outline-none transition-all placeholder:text-zinc-650 resize-none font-sans"
                />
              </div>

              {formStatus === 'sending' ? (
                <div className="w-full py-3.5 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center gap-2 text-zinc-400 font-medium text-xs">
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                  <span>TRANSMITTING MESSAGE PAYLOAD...</span>
                </div>
              ) : (
                <button
                  id="btn-transmit-signal"
                  type="submit"
                  className="w-full py-3.5 bg-zinc-105 hover:bg-white text-zinc-950 rounded-xl flex items-center justify-center gap-2 hover:text-black transition-all font-medium text-xs tracking-wider uppercase select-none cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              )}
            </form>
          )}
        </div>

        {/* Credentials & Social Networks panel */}
        <div className="lg:col-span-5 space-y-6 text-left">
          
          {/* Credentials Plate */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-5">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider pb-3 border-b border-zinc-805 flex items-center gap-2">
              <Mail className="w-4 h-4 text-zinc-450" />
              <span>Contact Coordinates</span>
            </h3>

            <div className="space-y-4 text-xs text-zinc-400">
              <div className="space-y-1.5">
                <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider block">Direct Email Address</span>
                <div className="flex items-center justify-between bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                  <span className="font-mono text-zinc-300 font-medium select-text">contact@darshankumar.me</span>
                  <button
                    onClick={handleCopyEmail}
                    className="p-1 px-2 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-lg transition-colors flex items-center gap-1 cursor-pointer font-sans text-[10px]"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 text-[9px]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider block">Office Location</span>
                <div className="flex items-center gap-2 text-zinc-350 py-1 font-sans">
                  <MapPin className="w-4 h-4 text-zinc-500" />
                  <span>Bengaluru, Karnataka, India</span>
                </div>
              </div>
            </div>
          </div>

          {/* Social Matrix links */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider pb-3 border-b border-zinc-800">
              Professional Identities
            </h3>

            <div className="space-y-2 text-xs">
              
              {/* LinkedIn */}
              <a 
                href="https://www.linkedin.com/in/darshan-kumar-kr-905579284/" 
                target="_blank" 
                rel="noreferrer referrer" 
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                  <span className="font-medium text-zinc-350">LinkedIn Profile</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-zinc-500 group-hover:text-white transition-colors">
                  <span>Connect</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </a>

              {/* GitHub */}
              <a 
                href="https://github.com/darshankumar97" 
                target="_blank" 
                rel="noreferrer referrer" 
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Github className="w-4 h-4 text-white" />
                  <span className="font-medium text-zinc-350">GitHub Repository</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-zinc-500 group-hover:text-white transition-colors">
                  <span>Explore</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </a>

              {/* LeetCode */}
              <a 
                href="https://leetcode.com/u/DARSHAN_KUMAR_KR/" 
                target="_blank" 
                rel="noreferrer referrer" 
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-orange-400 font-mono">LC</span>
                  <span className="font-medium text-zinc-355">LeetCode Algorithms</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-zinc-500 group-hover:text-white transition-colors">
                  <span>Review Solutions</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </a>

              {/* Instagram - Less Prominent */}
              <div className="pt-2 border-t border-zinc-800/80 mt-2">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noreferrer referrer" 
                  className="inline-flex items-center gap-1.5 text-[10px] text-zinc-500 hover:text-zinc-400 transition-colors py-1"
                >
                  <span>Instagram Profile</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>

            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
}
