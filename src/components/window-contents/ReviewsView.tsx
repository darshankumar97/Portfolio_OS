/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Star, 
  MessageSquare, 
  PenTool, 
  ThumbsUp, 
  CheckCircle, 
  Sliders, 
  Award, 
  Bookmark, 
  Lock,
  User,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface PeerReview {
  id: string;
  name: string;
  role: string | null;
  org: string | null;
  target: 'Entire Portfolio' | 'Projects Registry' | 'Systems Journal' | 'Specific Project';
  specificTargetName?: string;
  rating: number;
  comment: string;
  timestamp: string;
  isVerified: boolean;
}

const PRESET_TESTIMONIALS: PeerReview[] = [
  {
    id: 'test-1',
    name: 'Marcus Vance',
    role: 'CEO & Co-Founder',
    org: 'AI Launchpad',
    target: 'Entire Portfolio',
    rating: 5,
    comment: 'Darshan delivered our core SaaS MVP inside 3 weeks. Database schemas, rate limiting, and Stripe proxy configurations are exceptionally robust. Truly elite systems talent.',
    timestamp: '2026-06-01',
    isVerified: true
  },
  {
    id: 'test-2',
    name: 'Siddharth Nair',
    role: 'VP of Platform Engineering',
    org: 'BlockGrid',
    target: 'Projects Registry',
    specificTargetName: 'Distributed Ingestion Pipeline',
    rating: 5,
    comment: 'The Go microservices cluster and Kubernetes orchestration specs we licensed from Darshan are incredibly well-documented. Solved our scaling choke-points immediately.',
    timestamp: '2026-05-18',
    isVerified: true
  },
  {
    id: 'test-3',
    name: 'Lena Lindqvist',
    role: 'Product Lead',
    org: 'SpatialCloud AB',
    target: 'Entire Portfolio',
    rating: 5,
    comment: 'We hired Darshan to build our real-time spatial clustering dashboard. Custom visual filters process thousands of points instantly. Beautiful typography and high reliability.',
    timestamp: '2026-04-30',
    isVerified: true
  }
];

export default function ReviewsView() {
  const [reviews, setReviews] = useState<PeerReview[]>([]);
  const [targetType, setTargetType] = useState<PeerReview['target']>('Entire Portfolio');
  const [specificName, setSpecificName] = useState('');
  const [rating, setRating] = useState(5);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [org, setOrg] = useState('');
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  // Load reviews on Mount
  useEffect(() => {
    const saved = localStorage.getItem('devos-peer-evaluations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setReviews([...PRESET_TESTIMONIALS, ...parsed]);
      } catch (e) {
        setReviews(PRESET_TESTIMONIALS);
      }
    } else {
      setReviews(PRESET_TESTIMONIALS);
    }

    // Monitor custom event if opened with a specific article review context
    const handleAddContext = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.targetId === 'reviews') {
        setTargetType('Systems Journal');
        if (customEvent.detail.articleTitle) {
          setSpecificName(customEvent.detail.articleTitle);
        }
      }
    };

    window.addEventListener('devos-switch-window', handleAddContext);
    return () => window.removeEventListener('devos-switch-window', handleAddContext);
  }, []);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment) return;

    setIsSubmitting(true);

    const newReview: PeerReview = {
      id: `review-${Date.now()}`,
      name,
      role: role || null,
      org: org || null,
      target: targetType,
      specificTargetName: specificName || undefined,
      rating,
      comment,
      timestamp: new Date().toISOString().split('T')[0],
      isVerified: false
    };

    setTimeout(() => {
      const localOnly = localStorage.getItem('devos-peer-evaluations');
      let currentLocal: PeerReview[] = [];
      if (localOnly) {
        try {
          currentLocal = JSON.parse(localOnly);
        } catch (_) {}
      }
      const updatedLocal = [newReview, ...currentLocal];
      localStorage.setItem('devos-peer-evaluations', JSON.stringify(updatedLocal));

      setReviews([newReview, ...reviews]);
      setName('');
      setRole('');
      setOrg('');
      setComment('');
      setSpecificName('');
      setTargetType('Entire Portfolio');
      setRating(5);
      setIsSubmitting(false);
      setSuccessMsg(true);

      setTimeout(() => setSuccessMsg(false), 3000);
    }, 1200);
  };

  // Aggregation Calculations
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((acc, rev) => acc + rev.rating, 0);
    return Math.round((total / reviews.length) * 10) / 10;
  }, [reviews]);

  const ratingCounts = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      const rate = r.rating as 5 | 4 | 3 | 2 | 1;
      if (counts[rate] !== undefined) counts[rate]++;
    });
    return counts;
  }, [reviews]);

  return (
    <div id="reviews-view-container" className="p-6 md:p-8 space-y-6 font-sans text-zinc-100 selection:bg-neutral-800">
      
      {/* Editorial Header */}
      <div className="border-b border-zinc-800/80 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-zinc-550 font-mono uppercase tracking-widest mb-1.5">
            <Award className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
            <span>Section 10 // Consensus Evaluations & Testimony</span>
          </div>
          <h1 className="text-xl md:text-2xl font-display font-medium text-white tracking-tight">
            Peer Evaluations & Testimonials
          </h1>
          <p className="text-zinc-400 text-xs md:text-sm mt-1 max-w-xl text-left">
            Submit a diagnostic peer review of our systems and projects, or browse expert engineering testimonials from founders and CTOs.
          </p>
        </div>

        <div className="text-[10px] font-mono text-zinc-500 bg-zinc-950 border border-zinc-900 px-3 py-1.5 self-start rounded-lg">
          <span>{reviews.length} PROTOCOL REVIEWS REC</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
        
        {/* Left Aspect: Rating Summary & Submit Peer Form */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Average Rating Block */}
          <div className="p-5 bg-zinc-950/40 border border-zinc-900 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">ROLLING METRIC AVG</span>
              <div className="flex items-baseline gap-1.5 pt-1">
                <span className="text-2xl md:text-3xl font-display font-bold text-white font-mono">{averageRating}</span>
                <span className="text-xs text-zinc-550 font-mono">/ 5.0</span>
              </div>
              <div className="flex gap-0.5 pt-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star 
                    key={star} 
                    className={`w-3 h-3 ${star <= Math.round(averageRating) ? 'fill-blue-500 text-blue-500' : 'text-zinc-800'}`} 
                  />
                ))}
              </div>
            </div>

            {/* Micro rating bars */}
            <div className="w-[50%] space-y-1 font-mono text-[9px] text-zinc-550">
              {[5, 4, 3, 2, 1].map(stars => {
                const count = ratingCounts[stars as 5 | 4 | 3 | 2 | 1] || 0;
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={stars} className="flex items-center gap-1">
                    <span className="w-2">{stars}★</span>
                    <div className="flex-1 h-1 bg-zinc-900 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500/80" style={{ width: `${percentage}%` }} />
                    </div>
                    <span className="w-3 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit review Form */}
          <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold font-mono text-zinc-100 uppercase tracking-wider flex items-center gap-1.5">
              <PenTool className="w-4 h-4 text-blue-500" />
              <span>LOG PEER EVALUATION</span>
            </h3>

            <AnimatePresence mode="wait">
              {successMsg ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-emerald-950/20 border border-emerald-900/40 p-4 rounded-xl text-center space-y-2 font-mono"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-900 flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-white uppercase">EVALUATION TRANSMITTED</h4>
                    <p className="text-[9px] text-zinc-500 pt-0.5 leading-snug">Packet committed to browser local memory storage pool.</p>
                  </div>
                </motion.div>
              ) : (
                <form id="evaluation-submit-form" onSubmit={handleReviewSubmit} className="space-y-3 font-mono text-[11px]">
                  
                  {/* Rating selection digits */}
                  <div className="space-y-1">
                    <label className="text-[9px] text-zinc-500 uppercase tracking-wider">EVALUATION COUNT / STARS ({rating}★)</label>
                    <div className="flex items-center gap-2 pt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(null)}
                          className="p-1 rounded-md bg-zinc-950 border border-zinc-900 hover:border-zinc-750 transition-colors cursor-pointer"
                        >
                          <Star 
                            className={`w-4 h-4 ${
                              star <= (hoverRating ?? rating) 
                                ? 'fill-blue-500 text-blue-500' 
                                : 'text-zinc-750'
                            }`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name field */}
                  <div className="space-y-1">
                    <label className="text-[9px] text-zinc-500 uppercase">IDENTIFIER / NAME</label>
                    <input
                      id="rev-name-input"
                      type="text"
                      required
                      placeholder="e.g. Alexis Carter // Lead QA"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full bg-neutral-950 border border-zinc-850 focus:border-zinc-700 outline-none rounded-lg px-3 py-2 placeholder:text-zinc-650 text-white"
                    />
                  </div>

                  {/* Role / Org */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-500 uppercase">ROLE (OPTIONAL)</label>
                      <input
                        id="rev-role-input"
                        type="text"
                        placeholder="e.g. CTO"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        disabled={isSubmitting}
                        className="w-full bg-neutral-950 border border-zinc-850 focus:border-zinc-700 outline-none rounded-lg px-3 py-2 placeholder:text-zinc-650 text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-500 uppercase">ORG (OPTIONAL)</label>
                      <input
                        id="rev-org-input"
                        type="text"
                        placeholder="e.g. TechStart"
                        value={org}
                        onChange={(e) => setOrg(e.target.value)}
                        disabled={isSubmitting}
                        className="w-full bg-neutral-950 border border-zinc-850 focus:border-zinc-700 outline-none rounded-lg px-3 py-2 placeholder:text-zinc-650 text-white"
                      />
                    </div>
                  </div>

                  {/* Target Scope */}
                  <div className="space-y-1">
                    <label className="text-[9px] text-zinc-500 uppercase">EVALUATION TARGET TYPE</label>
                    <select
                      id="rev-target-select"
                      value={targetType}
                      onChange={(e) => setTargetType(e.target.value as PeerReview['target'])}
                      disabled={isSubmitting}
                      className="w-full bg-neutral-950 border border-zinc-850 focus:border-zinc-700 outline-none rounded-lg px-3 py-2 text-zinc-300 cursor-pointer"
                    >
                      <option value="Entire Portfolio">Entire Portfolio Systems</option>
                      <option value="Projects Registry">Projects Registry</option>
                      <option value="Systems Journal">Systems Journal Publication</option>
                      <option value="Specific Project">Specific Licensed Project</option>
                    </select>
                  </div>

                  {/* Specific Name */}
                  {(targetType === 'Specific Project' || targetType === 'Systems Journal') && (
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-500 uppercase">SPECIFIC WORKPIECE OR TOPIC NAME</label>
                      <input
                        id="rev-spec-target-input"
                        type="text"
                        placeholder="e.g. Ingestion Pipeline, React Learnings"
                        value={specificName}
                        onChange={(e) => setSpecificName(e.target.value)}
                        disabled={isSubmitting}
                        className="w-full bg-neutral-950 border border-zinc-850 focus:border-zinc-700 outline-none rounded-lg px-3 py-2 placeholder:text-zinc-650 text-white"
                      />
                    </div>
                  )}

                  {/* Text payload */}
                  <div className="space-y-1">
                    <label className="text-[9px] text-zinc-500 uppercase">EVAL_LOGS PAYLOAD / COMMENT</label>
                    <textarea
                      id="rev-comment-textarea"
                      required
                      placeholder="Input systems diagnosis evaluation logs..."
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full bg-neutral-950 border border-zinc-850 focus:border-zinc-700 outline-none rounded-lg px-3 py-2 placeholder:text-zinc-650 text-white resize-none"
                    />
                  </div>

                  {/* Submit buttons */}
                  <button
                    id="btn-submit-eval"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 bg-white text-zinc-950 tracking-wider text-[11px] font-bold uppercase rounded-lg hover:bg-zinc-200 transition-colors select-none cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Star className="w-3.5 h-3.5 text-zinc-950" />
                    <span>{isSubmitting ? 'TRANSMITTING REQS...' : 'COMMIT EVALUATION'}</span>
                  </button>

                </form>
              )}
            </AnimatePresence>

          </div>

        </div>

        {/* Right Aspect: Testimonials Stream & Feedbacks */}
        <div className="lg:col-span-8 space-y-4">
          <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block mb-1">
            VERIFIED NETWORK EVALUATIONS STREAM //
          </span>

          <div className="space-y-4 max-h-[560px] overflow-y-auto pr-2">
            {reviews.map((rev) => (
              <div 
                id={`peer-review-entry-${rev.id}`}
                key={rev.id} 
                className="p-5 rounded-2xl border border-zinc-900 bg-zinc-950/40 hover:border-zinc-850/80 transition-all space-y-4 relative overflow-hidden group"
              >
                {/* Backlit highlight */}
                <div className="absolute top-[-10%] right-[-5%] w-16 h-16 bg-blue-500/5 blur-xl group-hover:bg-blue-500/10 rounded-full transition-colors pointer-events-none" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                      <User className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="text-xs font-bold font-mono text-zinc-100 flex items-center gap-1">
                        <span>{rev.name}</span>
                        {rev.isVerified && (
                          <CheckCircle className="w-3.5 h-3.5 text-blue-400 fill-blue-500/10" />
                        )}
                      </h4>
                      {(rev.role || rev.org) && (
                        <p className="text-[10px] text-zinc-450 font-mono leading-none pt-0.5">
                          {rev.role} {rev.role && rev.org ? '@' : ''} {rev.org}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Stars list & timestamp */}
                  <div className="flex flex-col items-start sm:items-end font-mono text-[9px] text-zinc-550">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star 
                          key={star} 
                          className={`w-3.5 h-3.5 ${star <= rev.rating ? 'fill-blue-500 text-blue-500' : 'text-zinc-800'}`} 
                        />
                      ))}
                    </div>
                    <span className="pt-1">{rev.timestamp}</span>
                  </div>
                </div>

                {/* Scope target metadata pill */}
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-zinc-950 border border-zinc-900/60 font-mono text-[9px] text-zinc-450">
                  <Bookmark className="w-3 h-3 text-blue-500" />
                  <span>TARGET: {rev.target.toUpperCase()}</span>
                  {rev.specificTargetName && (
                    <span className="text-zinc-500 text-[8px] border-l border-zinc-900/80 pl-1 ml-1 truncate">
                      // {rev.specificTargetName.toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Comment body content */}
                <p className="text-xs font-sans text-zinc-350 leading-relaxed text-justify">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
