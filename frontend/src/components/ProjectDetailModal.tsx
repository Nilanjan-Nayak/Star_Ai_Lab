import React, { useEffect, useState, useRef } from 'react';
import {
  X, ExternalLink, Github, Calendar, CheckCircle2,
  Rocket, Users, Sparkles, Orbit, Compass, Clock, Award,
  Cpu, Share2, Check, Copy, ChevronRight, Terminal, Globe,
  ShieldCheck, UserCheck, Flame, Eye, Layers
} from 'lucide-react';
import { Project } from '../types/project';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=1200&q=80';

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState<'journey' | 'tools' | 'future' | 'crew'>('journey');
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [imgSrc, setImgSrc] = useState(FALLBACK_IMAGE);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize and handle image URL
  useEffect(() => {
    if (!project) return;
    setActiveTab('journey');
    setSelectedTech(null);
    setCopiedLink(false);

    const rawUrl = project.imageUrl;
    if (rawUrl) {
      if (rawUrl.startsWith('http')) {
        setImgSrc(rawUrl);
      } else if (rawUrl.startsWith('/')) {
        setImgSrc(`http://localhost:5000${rawUrl}`);
      } else {
        setImgSrc(FALLBACK_IMAGE);
      }
    } else {
      setImgSrc(FALLBACK_IMAGE);
    }

    // Escape listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    // Prevent body background scrolling
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [project, onClose]);

  // Dynamic Cosmic Starfield & Meteor Canvas Animation
  useEffect(() => {
    if (!project) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Generate stars
    const starCount = Math.floor((width * height) / 8000) || 50;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.4,
      alpha: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.3 + 0.05,
      delta: (Math.random() - 0.5) * 0.02
    }));

    // Shooting meteor
    let meteor: { x: number; y: number; length: number; speed: number; alpha: number; active: boolean } = {
      x: 0,
      y: 0,
      length: 0,
      speed: 0,
      alpha: 0,
      active: false
    };

    const triggerMeteor = () => {
      meteor = {
        x: Math.random() * width * 0.8,
        y: Math.random() * (height * 0.3),
        length: Math.random() * 80 + 50,
        speed: Math.random() * 6 + 4,
        alpha: 1,
        active: true
      };
    };

    let meteorTimer = setInterval(triggerMeteor, 5000);
    triggerMeteor();

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw stars
      stars.forEach(star => {
        star.y -= star.speed;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }

        star.alpha += star.delta;
        if (star.alpha > 0.9 || star.alpha < 0.2) {
          star.delta = -star.delta;
        }

        ctx.fillStyle = `rgba(186, 230, 253, ${Math.max(0.1, star.alpha)})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw shooting meteor
      if (meteor.active) {
        ctx.save();
        const grad = ctx.createLinearGradient(
          meteor.x, meteor.y,
          meteor.x - meteor.length, meteor.y - meteor.length * 0.6
        );
        grad.addColorStop(0, `rgba(34, 211, 238, ${meteor.alpha})`);
        grad.addColorStop(0.4, `rgba(168, 85, 247, ${meteor.alpha * 0.7})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(meteor.x - meteor.length, meteor.y - meteor.length * 0.6);
        ctx.stroke();
        ctx.restore();

        meteor.x += meteor.speed;
        meteor.y += meteor.speed * 0.6;
        meteor.alpha -= 0.015;

        if (meteor.alpha <= 0 || meteor.x > width || meteor.y > height) {
          meteor.active = false;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(meteorTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [project]);

  if (!project) return null;

  // Format date & duration
  const startDateObj = project.startDate ? new Date(project.startDate) : new Date('2024-02-01');
  const startDateStr = startDateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const monthsActive = Math.max(1, Math.round((Date.now() - startDateObj.getTime()) / (1000 * 60 * 60 * 24 * 30.4)));

  const isSolo = !project.teamMembers || project.teamMembers.length <= 1 || project.projectType?.toLowerCase().includes('solo');

  // Fallback enriched data
  const tools = (project.toolsUsed && project.toolsUsed.length > 0)
    ? project.toolsUsed
    : (project.technologies || ['React', 'TypeScript', 'Node.js', 'AI/ML', 'Tailwind CSS']);

  const futureScopeList = (project.futureScope && project.futureScope.length > 0)
    ? project.futureScope
    : [
        'Advanced Next-Gen AI agent automations and low-latency inference',
        'Cross-platform mobile optimization with offline-first caching',
        'Global multilingual localization and community expansion',
        'Enterprise-grade telemetry monitoring and automated analytics'
      ];

  const timelinePhases = (project.timelinePhases && project.timelinePhases.length > 0)
    ? project.timelinePhases
    : [
        {
          phase: 'Phase 1: Inception',
          title: 'Research & Problem Definition',
          description: 'Identified core friction points, conducted user research, and mapped architectural objectives.',
          completed: true
        },
        {
          phase: 'Phase 2: Architecture',
          title: 'System Design & Tech Prototyping',
          description: 'Engineered backend microservices, evaluated AI model latencies, and crafted UI design tokens.',
          completed: true
        },
        {
          phase: 'Phase 3: Development',
          title: 'Full-Stack Implementation',
          description: 'Constructed responsive client interfaces, optimized APIs, and ensured high-fidelity data flow.',
          completed: true
        },
        {
          phase: 'Phase 4: Evolution',
          title: 'Deployment & Continuous Innovation',
          description: 'Production hosting, live analytics tracking, and roadmap iterative rollouts.',
          completed: project.status === 'Completed'
        }
      ];

  const completedCount = timelinePhases.filter(p => p.completed).length;
  const progressPercent = Math.round((completedCount / timelinePhases.length) * 100);

  const teamMembers = (project.teamMembers && project.teamMembers.length > 0)
    ? project.teamMembers
    : [
        {
          name: 'Nilanjan Nayak',
          role: 'Lead AI Engineer & Full Stack Creator',
          contribution: 'Conceptualized, architected, and engineered the end-to-end platform and intelligence pipeline'
        }
      ];

  const handleShare = () => {
    const url = window.location.href.split('#')[0] + `#project-${project._id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
    >
      {/* ── Outer Cosmic Backdrop ── */}
      <div
        className="fixed inset-0 bg-[#020617]/90 backdrop-blur-2xl transition-opacity duration-300"
        onClick={onClose}
      />

      {/* ── Ambient Radial Space Lighting ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-cyan-500/12 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute -bottom-32 right-1/4 w-[500px] h-[500px] bg-violet-600/12 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* ── Main Modal Window with Hologram Conic Border ── */}
      <div
        className="relative z-10 w-full max-w-5xl my-auto bg-gradient-to-b from-[#090e1f] via-[#050814] to-[#02050e] rounded-3xl sm:rounded-[2.5rem] border border-cyan-500/30 shadow-[0_0_100px_rgba(6,182,212,0.22),0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[94vh] animate-in fade-in zoom-in-95 duration-300"
      >
        {/* Animated Starfield Background Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-0"
        />

        {/* Top glowing neon gradient line */}
        <div className="h-1 w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 relative overflow-hidden z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent animate-pulse" />
        </div>

        {/* ── Modal Sticky Header ── */}
        <div className="relative z-10 flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5 border-b border-white/[0.08] bg-slate-950/70 backdrop-blur-xl">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            {/* Spinning Orbit Ring Icon */}
            <div className="p-2 sm:p-2.5 rounded-2xl bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.35)] flex-shrink-0">
              <Orbit className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" style={{ animationDuration: '20s' }} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-[3px] text-cyan-400">
                  Mission Briefing
                </span>
                <span className="w-1 h-1 rounded-full bg-cyan-400/50" />
                <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">
                  {project.category}
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/10 text-[9px] font-mono text-cyan-300">
                  ID: #{project._id.slice(-6)}
                </span>
              </div>
              <h1
                id="modal-project-title"
                className="text-lg sm:text-2xl font-black text-white tracking-tight truncate drop-shadow"
              >
                {project.title}
              </h1>
            </div>
          </div>

          {/* Action buttons (Share & Close) */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
            <button
              onClick={handleShare}
              title="Copy shareable link"
              className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-white/60 hover:text-cyan-300 border border-white/10 transition-all active:scale-95 flex items-center gap-1.5 text-xs font-semibold"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white/[0.05] hover:bg-white/[0.12] text-white/50 hover:text-white border border-white/10 transition-all active:scale-95 group"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* ── Modal Scrollable Body ── */}
        <div className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-8 py-5 sm:py-7 space-y-6 sm:space-y-8 scrollbar-thin scrollbar-thumb-cyan-500/25 scrollbar-track-transparent">

          {/* Hero Banner with Space HUD Overlay */}
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-cyan-500/20 bg-black/60 shadow-[0_15px_40px_rgba(0,0,0,0.7)] group">
            <div className="relative h-52 sm:h-72 md:h-80 w-full overflow-hidden">
              <img
                src={imgSrc}
                alt={project.title}
                onError={() => setImgSrc(FALLBACK_IMAGE)}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050814] via-[#050814]/60 to-transparent" />
              
              {/* Floating Top HUD Badges */}
              <div className="absolute top-3.5 left-3.5 right-3.5 sm:top-5 sm:left-5 sm:right-5 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-cyan-400/30 text-cyan-300 text-xs font-semibold shadow-lg">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Initiated: {startDateStr}</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl backdrop-blur-md border text-xs font-bold uppercase tracking-wider ${
                    project.status === 'Completed'
                      ? 'bg-emerald-500/25 border-emerald-400/50 text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.35)]'
                      : 'bg-sky-500/25 border-sky-400/50 text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.35)] animate-pulse'
                  }`}>
                    <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                    <span>{project.status}</span>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-500/20 border border-violet-400/35 text-violet-300 text-xs font-bold backdrop-blur-md">
                    {isSolo ? <UserCheck className="w-3.5 h-3.5 text-violet-400" /> : <Users className="w-3.5 h-3.5 text-violet-400" />}
                    <span>{project.projectType || (isSolo ? 'Solo Mission' : 'Crew Project')}</span>
                  </div>
                </div>
              </div>

              {/* Title & Short Description on Image Bottom */}
              <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6">
                <p className="text-sm sm:text-base text-blue-100/90 max-w-3xl font-medium leading-relaxed drop-shadow-md">
                  {project.description || project.shortDescription}
                </p>
              </div>
            </div>

            {/* Quick Metrics HUD strip with Progress */}
            <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-white/[0.08] bg-slate-950/80 backdrop-blur-md divide-x divide-white/[0.06]">
              <div className="p-3 sm:p-4 text-center">
                <div className="text-[10px] text-white/40 uppercase tracking-widest font-semibold flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" /> Timeline
                </div>
                <div className="text-xs sm:text-sm font-bold text-white mt-1">{monthsActive} mos in development</div>
              </div>

              <div className="p-3 sm:p-4 text-center">
                <div className="text-[10px] text-white/40 uppercase tracking-widest font-semibold flex items-center justify-center gap-1">
                  <Cpu className="w-3 h-3 text-violet-400" /> Tech Constellation
                </div>
                <div className="text-xs sm:text-sm font-bold text-white mt-1">{tools.length} Tools Applied</div>
              </div>

              <div className="p-3 sm:p-4 text-center">
                <div className="text-[10px] text-white/40 uppercase tracking-widest font-semibold flex items-center justify-center gap-1">
                  <Users className="w-3 h-3 text-emerald-400" /> Creator Format
                </div>
                <div className="text-xs sm:text-sm font-bold text-white mt-1">{isSolo ? 'Solo Developer' : 'Team Crew'}</div>
              </div>

              <div className="p-3 sm:p-4 text-center">
                <div className="text-[10px] text-white/40 uppercase tracking-widest font-semibold flex items-center justify-center gap-1">
                  <Flame className="w-3 h-3 text-amber-400" /> Mission Progress
                </div>
                <div className="text-xs sm:text-sm font-bold text-amber-300 mt-1">{progressPercent}% Achieved</div>
              </div>
            </div>

            {/* Glowing progress line */}
            <div className="w-full bg-white/[0.05] h-1.5 relative overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 transition-all duration-1000 shadow-[0_0_12px_#22d3ee]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* ── Interactive Space Navigation Tabs ── */}
          <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('journey')}
              className={`flex-1 min-w-[120px] sm:min-w-[140px] flex items-center justify-center gap-2 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                activeTab === 'journey'
                  ? 'bg-gradient-to-r from-cyan-500/25 to-blue-500/25 text-cyan-300 border border-cyan-400/40 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                  : 'text-white/45 hover:text-white/80 hover:bg-white/[0.04]'
              }`}
            >
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>Development Journey</span>
            </button>

            <button
              onClick={() => setActiveTab('tools')}
              className={`flex-1 min-w-[120px] sm:min-w-[140px] flex items-center justify-center gap-2 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                activeTab === 'tools'
                  ? 'bg-gradient-to-r from-violet-500/25 to-indigo-500/25 text-violet-300 border border-violet-400/40 shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                  : 'text-white/45 hover:text-white/80 hover:bg-white/[0.04]'
              }`}
            >
              <Orbit className="w-4 h-4 text-violet-400" />
              <span>Tools & Space Tech</span>
            </button>

            <button
              onClick={() => setActiveTab('future')}
              className={`flex-1 min-w-[120px] sm:min-w-[140px] flex items-center justify-center gap-2 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                activeTab === 'future'
                  ? 'bg-gradient-to-r from-amber-500/25 to-orange-500/25 text-amber-300 border border-amber-400/40 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                  : 'text-white/45 hover:text-white/80 hover:bg-white/[0.04]'
              }`}
            >
              <Rocket className="w-4 h-4 text-amber-400" />
              <span>Future Horizons</span>
            </button>

            <button
              onClick={() => setActiveTab('crew')}
              className={`flex-1 min-w-[120px] sm:min-w-[140px] flex items-center justify-center gap-2 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                activeTab === 'crew'
                  ? 'bg-gradient-to-r from-emerald-500/25 to-teal-500/25 text-emerald-300 border border-emerald-400/40 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                  : 'text-white/45 hover:text-white/80 hover:bg-white/[0.04]'
              }`}
            >
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Crew & Credits</span>
            </button>
          </div>

          {/* ── TAB 1: Development Journey (কীভাবে সম্পন্ন হয়েছে) ── */}
          {activeTab === 'journey' && (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              {/* Detailed narrative card */}
              <div className="p-5 sm:p-7 rounded-2xl bg-white/[0.03] border border-cyan-500/25 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2.5 mb-3">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <span>How This Project Was Completed</span>
                </h3>
                <p className="text-sm sm:text-base text-blue-100/85 leading-relaxed font-normal">
                  {project.howCompleted || (
                    `This project was engineered through a rigorous iterative software lifecycle. Initiated in ${startDateStr}, the system went through deep prototyping, algorithm benchmarks, clean architectural modularization, and progressive optimization until reaching production stability.`
                  )}
                </p>
              </div>

              {/* Step-by-Step Interactive Timeline */}
              <div className="p-5 sm:p-7 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Compass className="w-4 h-4 text-blue-400" />
                    <span>Mission Roadmap & Milestones</span>
                  </h4>
                  <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-400/20">
                    {completedCount} of {timelinePhases.length} Phases Accomplished
                  </span>
                </div>

                <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-cyan-500 before:via-blue-500 before:to-violet-500/20">
                  {timelinePhases.map((phase, idx) => (
                    <div key={idx} className="relative group">
                      {/* Milestone glowing node */}
                      <div className={`absolute -left-[19px] sm:-left-[23px] top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-transform group-hover:scale-125 duration-300 ${
                        phase.completed
                          ? 'bg-slate-950 border-cyan-400 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.8)]'
                          : 'bg-slate-950 border-white/20 text-white/30'
                      }`}>
                        {phase.completed ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                        )}
                      </div>

                      <div className="bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] rounded-xl p-4 sm:p-5 transition-all duration-300">
                        <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                          <span className="text-[11px] font-mono font-bold text-cyan-400 tracking-wider">
                            {phase.phase}
                          </span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                            phase.completed
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          }`}>
                            {phase.completed ? '✓ Completed' : '⚡ In Evolution'}
                          </span>
                        </div>
                        <h5 className="text-sm sm:text-base font-bold text-white mb-1">{phase.title}</h5>
                        <p className="text-xs sm:text-sm text-white/60 leading-relaxed">{phase.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 2: Cosmic Tech Arsenal (টুলস ও স্পেস অ্যানিমেশন) ── */}
          {activeTab === 'tools' && (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              {/* Space animation centerpiece with Planetary Rings */}
              <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-violet-950/40 via-slate-950 to-cyan-950/40 border border-violet-500/35 overflow-hidden text-center">
                
                {/* Visual Orbit Graphic */}
                <div className="relative w-44 h-44 sm:w-56 sm:h-56 mx-auto my-3 sm:my-4 flex items-center justify-center">
                  {/* Outer Orbit Ring */}
                  <div className="absolute inset-0 rounded-full border border-violet-500/25 animate-spin" style={{ animationDuration: '32s' }}>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-[0_0_14px_#22d3ee]" />
                  </div>
                  {/* Middle Orbit Ring */}
                  <div className="absolute inset-4 sm:inset-5 rounded-full border border-cyan-400/35 animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }}>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4 h-4 rounded-full bg-violet-400 shadow-[0_0_16px_#a78bfa]" />
                  </div>
                  {/* Inner Orbit Ring */}
                  <div className="absolute inset-9 sm:inset-11 rounded-full border border-blue-400/40 animate-spin" style={{ animationDuration: '14s' }}>
                    <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_12px_#fbbf24]" />
                  </div>
                  {/* Core Star Node */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-violet-600 p-0.5 shadow-[0_0_40px_rgba(34,211,238,0.5)] flex items-center justify-center">
                    <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center">
                      <Cpu className="w-6 h-6 text-cyan-400 animate-pulse" />
                      <span className="text-[9px] font-black text-white/80 uppercase tracking-widest mt-0.5">CORE</span>
                    </div>
                  </div>
                </div>

                <h4 className="text-lg sm:text-xl font-black text-white mb-1.5">
                  Cosmic Technology Constellation
                </h4>
                <p className="text-xs sm:text-sm text-blue-200/70 max-w-lg mx-auto">
                  Click on any tool below to inspect its dedicated architectural role in this mission.
                </p>
              </div>

              {/* Technology Badges Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {tools.map((tech, idx) => {
                  const isSelected = selectedTech === tech;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedTech(isSelected ? null : tech)}
                      className={`group relative p-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center shadow-lg hover:-translate-y-1 active:scale-95 ${
                        isSelected
                          ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.4)]'
                          : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/[0.08] hover:border-cyan-400/40'
                      }`}
                    >
                      <div className={`w-2.5 h-2.5 rounded-full mb-2 transition-all shadow-[0_0_8px_currentColor] ${
                        isSelected ? 'bg-cyan-300 scale-125' : 'bg-cyan-400/60 group-hover:scale-125 group-hover:bg-cyan-300'
                      }`} />
                      <span className={`text-sm font-bold transition-colors ${isSelected ? 'text-cyan-300' : 'text-white group-hover:text-cyan-200'}`}>
                        {tech}
                      </span>
                      <span className="text-[9px] text-white/40 uppercase tracking-widest mt-1 font-mono">
                        Module #{idx + 1}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Tech Detail Drawer */}
              {selectedTech && (
                <div className="p-4 sm:p-5 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-between gap-3 animate-in fade-in-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-cyan-400/20 text-cyan-300">
                      <Terminal className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                        Active Orbital Component: {selectedTech}
                      </div>
                      <p className="text-xs sm:text-sm text-white/80 mt-0.5">
                        Integrated as a high-efficiency module within the {project.category} pipeline to guarantee resilience, speed, and real-time execution.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTech(null)}
                    className="p-1.5 text-white/40 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── TAB 3: Future Horizons (ভবিষ্যতের পরিকল্পনা) ── */}
          {activeTab === 'future' && (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              <div className="p-5 sm:p-7 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border border-amber-500/30 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="p-2 sm:p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                    <Rocket className="w-5 h-5 animate-bounce" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">Next Evolution & Future Roadmap</h3>
                    <p className="text-xs text-amber-300/80">Continuous development blueprint for {project.title}</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                  Innovation does not stop at V1. Here is our continuous development blueprint for architectural scaling, intelligent automated workflows, and ecosystem expansion:
                </p>
              </div>

              {/* Future Scope Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {futureScopeList.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-amber-400/40 hover:bg-white/[0.06] transition-all duration-300 flex items-start gap-4 group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-300 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-amber-500/25 transition-all shadow-[0_0_12px_rgba(245,158,11,0.25)]">
                      0{idx + 1}
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-white group-hover:text-amber-200 transition-colors">
                        Planned Horizon #{idx + 1}
                      </h5>
                      <p className="text-xs sm:text-sm text-white/60 leading-relaxed mt-1">
                        {item}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB 4: Crew & Credits (কে কে তৈরি করেছে) ── */}
          {activeTab === 'crew' && (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              <div className="p-5 sm:p-7 rounded-2xl bg-white/[0.03] border border-emerald-500/30 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 sm:p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">Project Creators & Collaborators</h3>
                    <p className="text-xs text-emerald-300/80">
                      {isSolo
                        ? 'Crafted independently as a focused Solo Mission'
                        : 'Developed collaboratively as a Group / Team Initiative'}
                    </p>
                  </div>
                </div>

                <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 font-bold text-xs">
                  {project.projectType || (isSolo ? 'Solo Developer' : 'Team Collaboration')}
                </div>
              </div>

              {/* Team Members List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {teamMembers.map((member, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.08] hover:border-emerald-400/40 transition-all duration-300 flex items-start gap-4 shadow-xl group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 p-0.5 shadow-lg flex-shrink-0 group-hover:scale-105 transition-transform">
                      <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center font-black text-lg text-emerald-300">
                        {member.name.charAt(0)}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-white group-hover:text-emerald-200 transition-colors">
                          {member.name}
                        </h4>
                        {idx === 0 && (
                          <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-400/30">
                            Creator
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-semibold text-emerald-400">{member.role}</div>
                      {member.contribution && (
                        <p className="text-xs text-white/50 leading-relaxed pt-1">
                          {member.contribution}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* ── Modal Sticky Footer Action Bar ── */}
        <div className="relative z-10 px-5 sm:px-8 py-4 sm:py-5 border-t border-white/[0.08] bg-slate-950/90 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-white/40">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Star AI Labs • Innovation Showcase</span>
            <span className="sm:hidden">Star AI Labs</span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-200 active:scale-95"
              >
                <Rocket className="w-4 h-4" />
                <span>Launch Live Demo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm border border-white/15 transition-all duration-200 active:scale-95"
              >
                <Github className="w-4 h-4" />
                <span>Source Code</span>
              </a>
            )}

            <button
              onClick={onClose}
              className="px-4 sm:px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs sm:text-sm font-semibold transition-all duration-200"
            >
              Close Briefing
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProjectDetailModal;
