import React, { useState, useEffect } from 'react';
import {
  X,
  Trophy,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Globe,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Sparkles
} from 'lucide-react';
import cornerLogoImg from '../img/_Pngtree_n_circle_letter_initial_logo_4835121-removebg-preview.png';

// Inline Unstop SVG Icon for authentic Unstop branding
const UnstopIcon = ({ className = 'h-4 w-4' }: { className?: string }) => (
  <svg role="img" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 0C5.394 0 0 5.394 0 12s5.394 12 12 12 12-5.394 12-12S18.606 0 12 0Zm-1.2 16.86H8.303v-1.127c-.715 1.091-1.588 1.552-2.897 1.552-2.085 0-3.248-1.2-3.248-3.333V7.248h2.509v6.182c0 1.164.533 1.722 1.6 1.722 1.224 0 2.012-.752 2.012-1.891V7.236h2.509v9.625zm8.533 0v-5.939c0-1.14-.533-1.721-1.6-1.721-1.224 0-2.012.752-2.012 1.89v5.77h-2.509V7.237h2.497V8.63c.715-1.09 1.588-1.551 2.897-1.551 2.085 0 3.249 1.2 3.249 3.333v6.449z" />
  </svg>
);

export interface TeamMember {
  id: string;
  name: string;
  isMainLeader?: boolean;
  role: string;
  category: 'founder' | 'hackathon' | 'contributor';
  badge?: string;
  badgeColor?: string;
  tagline?: string;
  avatarUrl?: string;
  fallbackInitials?: string;
  bio?: string;
  competitions?: {
    name: string;
    year: string;
    roleInCompetition: string;
    track: string;
    outcome: string;
  }[];
  projectContributions?: {
    project: string;
    role: string;
    highlights: string;
  }[];
  skills?: string[];
  socials?: {
    portfolio?: string;
    github?: string;
    linkedin?: string;
    unstop?: string;
    email?: string;
  };
}

const DEFAULT_MEMBERS: TeamMember[] = [
  {
    id: 'nilanjan-nayak',
    name: 'Nilanjan Nayak',
    isMainLeader: true,
    role: 'Founder & Chief AI Architect',
    category: 'founder',
    badge: 'Founder & Principal Architect',
    badgeColor: 'border-amber-400/50 bg-amber-500/10 text-amber-300',
    tagline: 'Architect of Star AI Lab and creator of its flagship intelligent neural prototypes.',
    avatarUrl: 'https://github.com/Nilanjan-Nayak.png',
    fallbackInitials: 'NN',
    bio: 'Pioneering founder and lead AI engineer behind Star AI Lab. Sole creator and primary architect of the lab\'s core AI models, multimodal RAG systems, and distributed telemetry. Guides students, collaborators, and team members to represent Star AI Lab across national hackathons and agricultural summits.',
    competitions: [
      {
        name: 'National Agro-Tech Innovation Expo',
        year: '2024 - 2025',
        roleInCompetition: 'Team Lead & Model Architect (Representing Star AI Lab)',
        track: 'AgriVision AI — Deep Vision Crop Diagnostics & Multilingual RAG',
        outcome: 'Top National Finalist & Live Field Showcase'
      },
      {
        name: 'National AI & Developer Tools Hackathon',
        year: '2024',
        roleInCompetition: 'Lead Innovator (Solo Developer under Star AI Lab)',
        track: 'Star Interview Preparation — Real-Time Evaluation Engine',
        outcome: 'Featured AI Prototype & High Distinction'
      },
      {
        name: 'Web3 & Campus Innovation Summit',
        year: '2024',
        roleInCompetition: 'Smart Contract & Architecture Lead (Star AI Lab Team)',
        track: 'CareerKick — Decentralized Student Credentialing & Verification',
        outcome: 'Recognized Innovation in Tamper-Proof Portfolio Credentials'
      },
      {
        name: 'Smart Hardware & IoT Tech Expo',
        year: '2024',
        roleInCompetition: 'IoT Systems Architect (Star AI Lab)',
        track: 'Smart Storage Telemetry — InfluxDB Time-Series Pipeline',
        outcome: 'High-Throughput Distributed Telemetry Finalist'
      }
    ],
    projectContributions: [
      {
        project: 'AgriVision AI',
        role: 'AI Architect & Lead Developer',
        highlights: 'Trained CNN/Vision models reaching 97.8% diagnostic accuracy, engineered voice-first multilingual RAG advisory pipeline.'
      },
      {
        project: 'Star Interview Preparation',
        role: 'Creator & Solo Developer',
        highlights: 'Engineered real-time audio and speech analysis, adaptive technical question generation, and instant feedback algorithms.'
      },
      {
        project: 'Star AI Assistant',
        role: 'Lead Architect',
        highlights: 'Context-aware conversational intelligence, task execution toolchain, and low-latency client integration.'
      },
      {
        project: 'Smart Storage Telemetry',
        role: 'End-to-End Systems Architect',
        highlights: 'Designed edge-to-cloud telemetry ingest pipeline with AWS IoT, InfluxDB time-series storage, and Grafana dashboarding.'
      },
      {
        project: 'CareerKick',
        role: 'Smart Contract & Web3 Architect',
        highlights: 'Authored audited Solidity smart contracts for tamper-proof digital certificates and client Web3 wallet bridge.'
      }
    ],
    skills: [
      'Deep Learning (PyTorch)',
      'Computer Vision',
      'Multilingual RAG',
      'Full-Stack Architecture (React/TS/Node)',
      'Solidity & Web3',
      'IoT Telemetry',
      'Vector Databases'
    ],
    socials: {
      github: 'https://github.com/Nilanjan-Nayak',
      linkedin: 'https://www.linkedin.com/in/nilanjan-nayak-73b475322/',
      unstop: 'https://unstop.com/u/nilannay77458',
      portfolio: 'https://nilanjan-nayak.my-board.org',
      email: 'starailab.info@gmail.com'
    }
  },
  {
    id: 'suman-rana',
    name: 'Suman Rana',
    isMainLeader: false,
    role: 'CareerKick Co-Creator & Full-Stack Web3 Developer',
    category: 'hackathon',
    badge: 'CareerKick Co-Creator',
    badgeColor: 'border-cyan-400/50 bg-cyan-500/10 text-cyan-300',
    tagline: 'Co-created CareerKick and represented Star AI Lab at Web3 & Campus Innovation Summit.',
    avatarUrl: 'https://github.com/RanaSuman.png',
    fallbackInitials: 'SR',
    bio: 'Full-Stack and Web3 engineer who partnered with Star AI Lab to co-create CareerKick. Architected responsive student portfolio interfaces, mapped recruiter verification workflows, and integrated client-side Web3 application components for tamper-proof credentials.',
    competitions: [
      {
        name: 'Web3 & Campus Innovation Summit',
        year: '2024',
        roleInCompetition: 'Co-Creator & Web3 Full-Stack Developer (Star AI Lab)',
        track: 'CareerKick — Decentralized Student Credentialing & Verification',
        outcome: 'Finalist Prototype & Credentialing Showcase'
      }
    ],
    projectContributions: [
      {
        project: 'CareerKick',
        role: 'Co-Creator & Full-Stack Web3 Developer',
        highlights: 'Engineered student portfolio dashboard, designed responsive recruiter verification interfaces, and co-developed Web3 client integration.'
      }
    ],
    skills: [
      'Full-Stack Web Development',
      'React & JavaScript',
      'Web3 Application UX',
      'UI/UX Architecture',
      'Responsive Frontend Design'
    ],
    socials: {
      portfolio: 'https://suman-rana.netlify.app/',
      github: 'https://github.com/RanaSuman',
      linkedin: 'https://www.linkedin.com/in/suman-rana-champ/',
      email: 'ranasuman6699@gmail.com',
      unstop: 'https://unstop.com/u/nilannay77458'
    }
  },
  {
    id: 'ankan-sen',
    name: 'Ankan Sen',
    isMainLeader: false,
    role: 'Field Testing & Agricultural ML Contributor',
    category: 'hackathon',
    badge: 'Hackathon Squad & ML Researcher',
    badgeColor: 'border-emerald-400/50 bg-emerald-500/10 text-emerald-300',
    tagline: 'Represented Star AI Lab at National Agro-Tech Innovation Expo & Field Dataset Lead.',
    avatarUrl: 'https://github.com/Nilanjan-Nayak.png',
    fallbackInitials: 'AS',
    bio: 'Key agricultural field researcher and dataset contributor who represented Star AI Lab in national hackathon initiatives. Conducted field studies across regional farmlands, collecting and labeling over 15,000 crop disease leaf samples to calibrate AgriVision AI\'s vision models with real-world accuracy.',
    competitions: [
      {
        name: 'National Agro-Tech Innovation Expo',
        year: '2024 - 2025',
        roleInCompetition: 'Field ML & Validation Track (Star AI Lab Delegation)',
        track: 'AgriVision AI — Field Pathology Testing & Vernacular Evaluation',
        outcome: 'Top National Finalist & Farmer Demonstration'
      }
    ],
    projectContributions: [
      {
        project: 'AgriVision AI',
        role: 'Field Testing & Dataset Validation',
        highlights: 'Curated 15,000+ crop leaves across rural regions, validated vernacular linguistic nuances (Bengali/Hindi), and tested real farmer UX.'
      }
    ],
    skills: [
      'Field Data Collection',
      'Crop Pathology Labeling',
      'Vernacular NLP Testing',
      'Ground-Truth Validation'
    ],
    socials: {
      github: 'https://github.com/Nilanjan-Nayak',
      unstop: 'https://unstop.com/u/nilannay77458'
    }
  }
];

interface StarAiTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StarAiTeamModal: React.FC<StarAiTeamModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'founder' | 'teammates' | 'lab'>('founder');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [members, setMembers] = useState<TeamMember[]>(DEFAULT_MEMBERS);

  // Fetch dynamic team members from backend API
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiBase}/api/team`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.members) && data.members.length > 0) {
            setMembers(data.members);
          }
        }
      } catch (err) {
        // Fallback silently to DEFAULT_MEMBERS
      }
    };
    if (isOpen) {
      fetchTeam();
    }
  }, [isOpen]);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const copyEmail = () => {
    navigator.clipboard.writeText('starailab.info@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  if (!isOpen) return null;

  const founder = members.find(m => m.isMainLeader || m.category === 'founder') || members[0] || DEFAULT_MEMBERS[0];
  const teammates = members.filter(m => m.id !== founder.id);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/80 backdrop-blur-xl transition-opacity animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Star AI Lab Directory"
    >
      {/* Outer Modal Container */}
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl border border-white/[0.12] bg-[#070b18]/95 shadow-[0_24px_80px_rgba(0,0,0,0.85),0_0_60px_rgba(56,189,248,0.12)] flex flex-col text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Ambient Radial Glows */}
        <div className="pointer-events-none absolute -top-28 left-1/3 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 right-10 h-64 w-64 rounded-full bg-blue-600/15 blur-3xl" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

        {/* Modal Top Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-white/[0.08] px-5 py-4 sm:px-7 sm:py-4.5 bg-slate-950/70 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-950/40 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              <img
                src={cornerLogoImg}
                alt="Star AI Lab"
                className="h-7 w-7 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-semibold tracking-wider text-cyan-400 uppercase">
                  STAR AI LAB
                </span>
                <span className="text-[10px] font-mono text-slate-400">•</span>
                <span className="text-[11px] font-mono text-slate-400">RESEARCH & ENGINEERING DIRECTORY</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                The People Behind Star AI Lab
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
            title="Close (Esc)"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Clean Segmented Tab Navigation */}
        <div className="relative z-10 border-b border-white/[0.08] bg-[#050814]/80 px-5 py-2.5 sm:px-7 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('founder')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'founder'
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.35)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            Founder & Lead Architect
          </button>
          <button
            onClick={() => setActiveTab('teammates')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'teammates'
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.35)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            Hackathon & Research Teammates ({teammates.length})
          </button>
          <button
            onClick={() => setActiveTab('lab')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'lab'
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.35)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            Lab Ecosystem & Inquiries
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="relative z-10 flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">

          {/* ==================== TAB 1: FOUNDER & LEAD ARCHITECT ==================== */}
          {activeTab === 'founder' && founder && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Executive Profile Card */}
              <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#0c142b]/80 via-[#070d1e]/90 to-[#050814] p-5 sm:p-6 shadow-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  
                  {/* Avatar with Status Ring */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={founder.avatarUrl || 'https://github.com/Nilanjan-Nayak.png'}
                      alt={founder.name}
                      className="h-20 w-20 sm:h-22 sm:w-22 rounded-2xl object-cover border-2 border-cyan-400/40 shadow-[0_0_25px_rgba(34,211,238,0.2)]"
                      onError={(e) => {
                        e.currentTarget.src = cornerLogoImg;
                      }}
                    />
                    <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500 text-slate-950 shadow-md" title="Verified Creator & Founder">
                      <ShieldCheck className="h-4 w-4 stroke-[2.5]" />
                    </div>
                  </div>

                  {/* Identity & Social Badges */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        {founder.name}
                      </h3>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                        {founder.badge || 'FOUNDER & CHIEF AI ARCHITECT'}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 mb-3.5 font-medium">
                      {founder.role}
                    </p>

                    {/* Verified Links Bar */}
                    <div className="flex flex-wrap items-center gap-2">
                      {founder.socials?.unstop && (
                        <a
                          href={founder.socials.unstop}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/15 border border-cyan-400/40 text-cyan-200 text-xs font-semibold hover:bg-cyan-500/25 transition-all"
                          title="View Official Unstop Profile"
                        >
                          <UnstopIcon className="h-3.5 w-3.5 text-cyan-300" />
                          <span>Unstop Profile</span>
                          <ExternalLink className="h-3 w-3 opacity-70" />
                        </a>
                      )}

                      {founder.socials?.github && (
                        <a
                          href={founder.socials.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-200 text-xs font-medium hover:bg-white/10 hover:text-white transition-all"
                        >
                          <Github className="h-3.5 w-3.5" />
                          <span>GitHub</span>
                          <ExternalLink className="h-3 w-3 opacity-60" />
                        </a>
                      )}

                      {founder.socials?.linkedin && (
                        <a
                          href={founder.socials.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/15 border border-blue-500/30 text-blue-200 text-xs font-medium hover:bg-blue-600/25 transition-all"
                        >
                          <Linkedin className="h-3.5 w-3.5" />
                          <span>LinkedIn</span>
                          <ExternalLink className="h-3 w-3 opacity-60" />
                        </a>
                      )}

                      {founder.socials?.portfolio && (
                        <a
                          href={founder.socials.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-200 text-xs font-medium hover:bg-white/10 transition-all"
                        >
                          <Globe className="h-3.5 w-3.5 text-cyan-300" />
                          <span>Portfolio</span>
                          <ExternalLink className="h-3 w-3 opacity-60" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Narrative */}
                <div className="mt-5 pt-4 border-t border-white/[0.08] text-xs sm:text-sm text-slate-300/90 leading-relaxed">
                  {founder.bio || 'Nilanjan established Star AI Lab to pioneer applied neural systems, computer vision, and real-time distributed engineering.'}
                </div>
              </div>

              {/* National Competitions & Hackathons */}
              {founder.competitions && founder.competitions.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                      <Trophy className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Proven Across National Competitions & Hackathons</span>
                    </h4>
                    <span className="text-[11px] font-mono text-slate-400">Representing Star AI Lab</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {founder.competitions.map((comp, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-white/[0.08] bg-slate-900/40 hover:border-cyan-500/30 transition-all">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-semibold text-white">{comp.name}</span>
                          <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">{comp.year}</span>
                        </div>
                        <p className="text-xs text-slate-300 mb-1.5 font-medium">
                          {comp.track}
                        </p>
                        <div className="flex items-center gap-1.5 text-[11px] text-cyan-300/90">
                          <CheckCircle2 className="h-3 w-3 text-cyan-400" />
                          <span>{comp.outcome}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Core Technical Stack & Specializations */}
              {founder.skills && founder.skills.length > 0 && (
                <div className="p-4 rounded-xl border border-white/[0.08] bg-slate-950/40">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2.5">
                    Core Engineering & Architecture Domains
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {founder.skills.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-white/5 border border-white/10 text-slate-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ==================== TAB 2: HACKATHON & RESEARCH TEAMMATES ==================== */}
          {activeTab === 'teammates' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-xs text-slate-300 leading-relaxed pb-1">
                Star AI Lab actively collaborates with student engineers, research contributors, and domain developers who build flagship systems and compete under the lab's banner.
              </div>

              {teammates.map((teammate) => (
                <div
                  key={teammate.id}
                  className="p-5 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#0a1226]/60 to-[#040816] hover:border-cyan-500/30 transition-all"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
                    <div className="flex items-center gap-3.5">
                      {teammate.avatarUrl ? (
                        <img
                          src={teammate.avatarUrl}
                          alt={teammate.name}
                          className="h-12 w-12 rounded-xl object-cover border border-cyan-400/30 shadow-md"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div
                        className={`h-12 w-12 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white font-bold text-base shadow-md ${
                          teammate.avatarUrl ? 'hidden' : 'flex'
                        }`}
                      >
                        {teammate.fallbackInitials || teammate.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-white">{teammate.name}</h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                            {teammate.badge || 'TEAMMATE'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-medium">
                          {teammate.role}
                        </p>
                      </div>
                    </div>

                    {/* Social Action Links */}
                    <div className="flex flex-wrap items-center gap-2">
                      {teammate.socials?.portfolio && (
                        <a
                          href={teammate.socials.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-500/15 border border-cyan-400/40 text-cyan-200 text-xs font-semibold hover:bg-cyan-500/25 transition-all"
                          title="Visit Website"
                        >
                          <Globe className="h-3 w-3 text-cyan-300" />
                          <span>Website</span>
                          <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                        </a>
                      )}

                      {teammate.socials?.github && (
                        <a
                          href={teammate.socials.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs transition-colors border border-white/10"
                        >
                          <Github className="h-3 w-3" />
                          <span>GitHub</span>
                        </a>
                      )}

                      {teammate.socials?.linkedin && (
                        <a
                          href={teammate.socials.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-600/15 border border-blue-500/30 text-blue-200 text-xs font-medium hover:bg-blue-600/25 transition-all"
                        >
                          <Linkedin className="h-3 w-3" />
                          <span>LinkedIn</span>
                        </a>
                      )}

                      {teammate.socials?.email && (
                        <a
                          href={`mailto:${teammate.socials.email}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs transition-colors border border-white/10"
                          title={teammate.socials.email}
                        >
                          <Mail className="h-3 w-3" />
                          <span>Email</span>
                        </a>
                      )}

                      {teammate.socials?.unstop && (
                        <a
                          href={teammate.socials.unstop}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 text-xs transition-colors border border-white/10"
                          title="Unstop Profile"
                        >
                          <UnstopIcon className="h-3 w-3" />
                          <span>Unstop</span>
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="pt-3.5 space-y-2 text-xs text-slate-300/90 leading-relaxed">
                    {teammate.bio && <p>{teammate.bio}</p>}

                    {teammate.competitions && teammate.competitions.map((comp, ci) => (
                      <p key={ci}>
                        <strong>Competition:</strong> {comp.name} ({comp.year}) — <em>{comp.track}</em>. {comp.outcome && <span>Outcome: {comp.outcome}</span>}
                      </p>
                    ))}

                    {teammate.skills && teammate.skills.length > 0 && (
                      <div className="pt-2 flex flex-wrap gap-1.5">
                        {teammate.skills.map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-slate-900 border border-white/10 text-cyan-300">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ==================== TAB 3: LAB OVERVIEW & CONTACT ==================== */}
          {activeTab === 'lab' && (
            <div className="space-y-5 animate-fadeIn">
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl border border-white/[0.08] bg-slate-900/40 text-center">
                  <div className="text-2xl font-bold text-cyan-300 font-mono">5</div>
                  <div className="text-[11px] text-slate-400 mt-1">Flagship Prototypes</div>
                </div>
                <div className="p-4 rounded-xl border border-white/[0.08] bg-slate-900/40 text-center">
                  <div className="text-2xl font-bold text-cyan-300 font-mono">4</div>
                  <div className="text-[11px] text-slate-400 mt-1">National Challenges</div>
                </div>
                <div className="p-4 rounded-xl border border-white/[0.08] bg-slate-900/40 text-center">
                  <div className="text-2xl font-bold text-cyan-300 font-mono">15K+</div>
                  <div className="text-[11px] text-slate-400 mt-1">Validated Samples</div>
                </div>
                <div className="p-4 rounded-xl border border-white/[0.08] bg-slate-900/40 text-center">
                  <div className="text-2xl font-bold text-cyan-300 font-mono">97.8%</div>
                  <div className="text-[11px] text-slate-400 mt-1">Diagnostic Accuracy</div>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-white/[0.08] bg-slate-950/50 space-y-3">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                  <span>Participating & Collaborating with Star AI Lab</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Star AI Lab welcomes researchers, student engineers, and agricultural experts who want to collaborate on applied artificial intelligence, build open prototypes, or represent our engineering teams in hackathons.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-white/[0.08]">
                  <div>
                    <div className="text-[11px] font-mono text-slate-400 uppercase">Official Lab Contact</div>
                    <div className="text-sm font-mono text-cyan-300 font-semibold">starailab.info@gmail.com</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={copyEmail}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-200 transition-colors border border-white/10"
                    >
                      {copiedEmail ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedEmail ? 'Copied' : 'Copy Email'}</span>
                    </button>
                    <a
                      href="mailto:starailab.info@gmail.com"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 text-xs font-semibold hover:bg-cyan-400 transition-colors"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      <span>Send Message</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="text-center pt-2">
                <p className="text-xs text-slate-400">
                  Star AI Lab • Designed and Maintained by Nilanjan Nayak
                </p>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="relative z-10 border-t border-white/[0.08] bg-slate-950/80 px-5 py-3 sm:px-7 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Official Star AI Lab Registry</span>
          </div>
          <div className="text-[11px] font-mono text-slate-500">
            Press <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400">ESC</kbd> to exit
          </div>
        </div>

      </div>
    </div>
  );
};

export default StarAiTeamModal;
