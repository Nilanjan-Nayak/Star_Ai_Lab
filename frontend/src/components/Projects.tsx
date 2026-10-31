import { useContext, useEffect, useState, useMemo } from 'react';
import { ProjectContext } from '../context/ProjectContext';
import ProjectCard from './ProjectCard';
import ProjectFilter from './ProjectFilter';
import ProjectDetailModal from './ProjectDetailModal';
import { SectionShell, SectionHeader, Reveal } from './SectionKit.tsx';
import { Project } from '../types/project';
import {
  Loader2, AlertCircle, FolderOpen, ArrowRight,
  Sparkles, RefreshCw, ExternalLink, Layers, Zap, Award,
  Search, X, Filter, Users, UserCheck
} from 'lucide-react';

const demoProjects: Project[] = [
  {
    _id: 'demo-agri',
    title: 'AgriVision Al',
    description: 'A multimodal, agentic agricultural-intelligence platform combining machine learning, deep computer vision, GIS field analytics, weather intelligence, and retrieval-augmented generation (RAG) to provide farmers real-time decision support — fully localized in English (EN), Hindi (हिन्दी), and Bengali (বাংলা).',
    shortDescription: 'Intelligent AI/ML Platform for Smart Agriculture & Crop Health',
    category: 'AI/ML',
    status: 'In Progress',
    technologies: ['Python', 'PyTorch', 'OpenCV', 'LangChain', 'FastAPI', 'React', 'GIS Satellite APIs'],
    tags: ['LLM', 'AI', 'computer-vision', 'agriculture'],
    githubUrl: 'https://github.com/Nilanjan-Nayak/AgriVision-Al.git',
    liveUrl: '',
    featured: true,
    startDate: '2024-02-15',
    createdAt: '2024-02-15T00:00:00.000Z',
    imageUrl: '',
    howCompleted: 'Crafted as an all-in-one agricultural intelligence ecosystem. Combines computer vision models for instant leaf pest & blight detection, satellite GIS telemetry for moisture monitoring, and a multilingual Retrieval-Augmented Generation (RAG) assistant delivering localized farming advice in English, Hindi, and Bengali.',
    toolsUsed: ['Python', 'PyTorch', 'OpenCV', 'LangChain', 'FastAPI', 'React', 'JavaScript', 'HTML5/CSS3', 'GIS Satellite APIs'],
    futureScope: [
      'Drone automated aerial scouting & precision pesticide guidance',
      'Direct farmer-to-consumer decentralized mandi marketplace',
      'Solar-powered IoT edge cameras for continuous field scanning'
    ],
    projectType: 'Solo Project',
    teamMembers: [
      { name: 'Nilanjan Nayak', role: 'AI Architect & Lead Developer', contribution: 'Designed deep vision models, multilingual RAG pipelines, and farmer-first responsive UI' },
      { name: 'Agricultural Community Advisors', role: 'Field Testing & Dataset Validation', contribution: 'Contributed authentic crop disease samples and vernacular language nuances' }
    ],
    timelinePhases: [
      { phase: 'Phase 1: Research', title: 'Multilingual Dataset Collection & Field Studies', description: 'Collected 15,000+ crop leaves across West Bengal and northern farmlands.', completed: true },
      { phase: 'Phase 2: Deep Vision', title: 'Deep Vision & Blight Classification', description: 'Trained neural models reaching 97.8% diagnostic accuracy.', completed: true },
      { phase: 'Phase 3: Intelligence', title: 'RAG Advisory Engine & Vernacular Translation', description: 'Integrated English, Hindi, and Bengali agricultural knowledge bases.', completed: true },
      { phase: 'Phase 4: Scaling', title: 'Autonomous Drone Telemetry & Smart Irrigation', description: 'Developing automated hardware integration with localized soil stations.', completed: false }
    ]
  },
  {
    _id: 'demo-interview',
    title: 'Star Interview Preparation',
    description: 'An AI-powered technical interviewer platform developed to simulate real-world coding, system design, and behavioral interviews with real-time feedback.',
    shortDescription: 'AI Technical Interviewer Platform with interactive code evaluation.',
    category: 'AI/ML',
    status: 'Completed',
    technologies: ['React', 'JavaScript', 'Python', 'Node.js', 'LLMs', 'Web Speech API'],
    tags: ['LLM', 'AI', 'interview-prep', 'edtech'],
    githubUrl: '',
    liveUrl: 'https://star-interview.onrender.com/',
    featured: true,
    startDate: '2024-01-10',
    createdAt: '2024-01-10T00:00:00.000Z',
    imageUrl: '',
    howCompleted: 'Developed as a personal V0.1 breakthrough platform to simulate real-world technical coding and HR interviews. Engineered dynamic prompt chains, real-time code execution sandbox, speech synthesis, and tailored performance evaluation for aspiring software engineers.',
    toolsUsed: ['React', 'JavaScript', 'Python', 'Node.js', 'Large Language Models (LLM)', 'Web Speech API', 'CSS3', 'Express'],
    futureScope: [
      'Live AI voice conversation with latency under 300ms',
      'Real-time webcam body language and confidence analyzer',
      'Custom company-specific interview simulation tracks (FAANG, Startups)'
    ],
    projectType: 'Solo Project',
    teamMembers: [
      { name: 'Nilanjan Nayak', role: 'Creator & Solo Developer', contribution: 'Conceived, engineered, designed, and deployed the full system independently from scratch' }
    ],
    timelinePhases: [
      { phase: 'Phase 1: Curriculum', title: 'Interview Question Bank & Prompt Engineering', description: 'Engineered multi-turn technical evaluation prompts and rubric scores.', completed: true },
      { phase: 'Phase 2: Speech & UI', title: 'Speech-to-Text & Interactive UI', description: 'Integrated voice recognition and interactive coding workspace.', completed: true },
      { phase: 'Phase 3: Launch', title: 'V0.1 Launch on Render', description: 'Deployed public live platform for students and career switchers.', completed: true },
      { phase: 'Phase 4: Next-Gen', title: 'V2.0 AI Video & Multi-Agent Interviewer', description: 'Developing multi-agent panels with dynamic follow-up questioning.', completed: false }
    ]
  },
  {
    _id: 'demo-star-ai',
    title: 'Star AI',
    description: 'A comprehensive mobile health monitoring application with AI-powered health insights, vital anomaly detection, and patient telemetry.',
    shortDescription: 'AI-powered mobile app for comprehensive health monitoring and personalized insights.',
    category: 'AI/ML',
    status: 'In Progress',
    technologies: ['React Native', 'Python', 'TensorFlow', 'Firebase', 'Node.js', 'MongoDB'],
    tags: ['mobile-app', 'healthcare', 'ai-insights'],
    githubUrl: 'https://github.com/starailabs/health-monitor-app',
    liveUrl: '',
    featured: true,
    startDate: '2024-05-01',
    createdAt: '2024-05-01T00:00:00.000Z',
    imageUrl: '',
    howCompleted: 'Built as a next-generation mobile intelligent health companion. Leveraged React Native for cross-platform interfaces, trained lightweight on-device TensorFlow models for biometric anomaly detection, and integrated Firebase & Node.js for encrypted medical record sync.',
    toolsUsed: ['React Native', 'Python', 'TensorFlow Lite', 'Node.js', 'MongoDB Atlas', 'Firebase Auth', 'Tailwind CSS', 'Express'],
    futureScope: [
      'Integration with Apple HealthKit & Google Health Connect',
      'Real-time doctor tele-consultation video hub',
      'Multilingual voice AI assistant for elderly patients'
    ],
    projectType: 'Team Project',
    teamMembers: [
      { name: 'Nilanjan Nayak', role: 'Full Stack & AI Lead', contribution: 'Built mobile app architecture, ML prediction models, and RESTful microservices' },
      { name: 'Star AI Lab Team', role: 'Biometric Research & QA', contribution: 'Curated healthcare datasets, clinical validation, and UI/UX testing' }
    ],
    timelinePhases: [
      { phase: 'Phase 1: Discovery', title: 'Clinical Research & Concept Validation', description: 'Gathered medical guidelines and planned data privacy compliances.', completed: true },
      { phase: 'Phase 2: Machine Learning', title: 'AI Model Training & Optimization', description: 'Trained anomaly detection networks with 96.4% precision.', completed: true },
      { phase: 'Phase 3: Mobile Build', title: 'Mobile App & Real-time Cloud Sync', description: 'Built reactive UI and zero-latency Firebase streaming.', completed: true },
      { phase: 'Phase 4: Sensor IoT', title: 'Wearable Integration & Clinical Beta', description: 'Currently rolling out smart watch sensors and field trials.', completed: false }
    ]
  },
  {
    _id: 'demo-carreerkick',
    title: 'Carreerkick',
    description: 'A blockchain-based supply chain and verifiable credential tracking system that provides absolute transparency and tamper-proof verification.',
    shortDescription: 'Blockchain system for transparent credential and supply chain verification with smart contracts.',
    category: 'AI/ML',
    status: 'In Progress',
    technologies: ['Web3.js', 'Solidity', 'React', 'Tailwind CSS', 'Node.js', 'IPFS'],
    tags: ['blockchain', 'supply-chain', 'smart-contracts'],
    githubUrl: 'https://github.com/starailabs/blockchain-supply-chain',
    liveUrl: '',
    featured: false,
    startDate: '2024-06-01',
    createdAt: '2024-06-01T00:00:00.000Z',
    imageUrl: '',
    howCompleted: 'Created to solve credential forgery and career tracking through decentralized smart contracts. Utilizes Web3.js to sign transactions on EVM-compatible chains, coupled with a reactive Tailwind-styled student dashboard and a secure Node.js verification layer.',
    toolsUsed: ['Solidity', 'Web3.js', 'React 18', 'Tailwind CSS', 'Node.js', 'Ethers.js', 'IPFS', 'Hardhat'],
    futureScope: [
      'Zero-Knowledge (ZK) Proofs for privacy-preserving credential sharing',
      'Decentralized job matching DAO with automated crypto bounties',
      'Campus recruiter analytics portal'
    ],
    projectType: 'Group Collaboration',
    teamMembers: [
      { name: 'Nilanjan Nayak', role: 'Smart Contract & Frontend Architect', contribution: 'Authored Solidity smart contracts and designed Web3 client interactions' },
      { name: 'CareerKick Core Collaborators', role: 'Product Strategy & UI Review', contribution: 'Mapped student recruitment workflows and user experience journey' }
    ],
    timelinePhases: [
      { phase: 'Phase 1: Smart Contracts', title: 'Contract Design & Security Audits', description: 'Wrote verified EVM contracts for verifiable tamper-proof certificates.', completed: true },
      { phase: 'Phase 2: DApp Interface', title: 'Web3 DApp Frontend & Metamask Bridge', description: 'Connected wallet providers with reactive student and recruiter views.', completed: true },
      { phase: 'Phase 3: Verification', title: 'Recruiter Verification Portal', description: 'One-click hash verification for enterprise HR managers.', completed: true },
      { phase: 'Phase 4: Scaling', title: 'Multi-chain Rollout & Polygon L2', description: 'Scaling transactions with gas-efficient Layer-2 rollups.', completed: false }
    ]
  },
  {
    _id: 'demo-media-storage',
    title: 'Media Storage',
    description: 'An IoT-based environmental monitoring and distributed media archiving system that tracks telemetry and organizes assets with high throughput.',
    shortDescription: 'IoT system for real-time monitoring and cloud-integrated media asset management.',
    category: 'storage',
    status: 'Completed',
    technologies: ['Arduino', 'Raspberry Pi', 'Python', 'AWS IoT', 'InfluxDB', 'Grafana'],
    tags: ['iot', 'storage', 'sensors', 'cloud'],
    githubUrl: 'https://github.com/starailabs/iot-monitoring',
    liveUrl: '',
    featured: false,
    startDate: '2024-04-01',
    createdAt: '2024-04-01T00:00:00.000Z',
    imageUrl: '',
    howCompleted: 'Engineered as an IoT and cloud-integrated media archiving system. Employs Raspberry Pi & Arduino edge hardware to stream telemetry while Python services orchestrate file sharding, compression, and automated ingestion into InfluxDB and AWS cloud storage.',
    toolsUsed: ['Arduino Uno', 'Raspberry Pi 4', 'Python 3.11', 'AWS IoT Core', 'InfluxDB', 'Grafana', 'Docker', 'Node.js'],
    futureScope: [
      'Implement zero-knowledge encrypted media vaults for absolute privacy',
      'Automated AI metadata tagging for audio and video assets',
      'Edge AI caching for ultra-low latency multimedia playback'
    ],
    projectType: 'Solo Project',
    teamMembers: [
      { name: 'Nilanjan Nayak', role: 'Lead Architect & IoT Developer', contribution: 'Architected end-to-end hardware-to-cloud pipeline and cloud storage engines' }
    ],
    timelinePhases: [
      { phase: 'Phase 1: Hardware', title: 'Hardware Setup & Sensor Calibration', description: 'Configured microcontrollers and tested storage streaming telemetry.', completed: true },
      { phase: 'Phase 2: Pipelines', title: 'Cloud Pipeline & Ingestion', description: 'Set up AWS IoT pipelines and InfluxDB time-series streaming.', completed: true },
      { phase: 'Phase 3: Monitoring', title: 'Dashboard & Grafana Visualization', description: 'Designed real-time telemetry panels with alert thresholds.', completed: true },
      { phase: 'Phase 4: Optimization', title: 'Scale & Edge Caching', description: 'Ongoing optimizations for high-throughput distributed storage.', completed: false }
    ]
  }
];

/* ── Inline stat pill ── */
const StatPill = ({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) => (
  <div className="flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm shadow-md">
    <div className="p-1.5 sm:p-2 rounded-xl bg-white/[0.05] text-cyan-400">{icon}</div>
    <div>
      <div className="text-base sm:text-lg font-bold text-white leading-none">{value}</div>
      <div className="text-[9px] sm:text-[10px] text-white/40 uppercase tracking-widest mt-0.5">{label}</div>
    </div>
  </div>
);

const Projects = () => {
  const { projects, loading, error, fetchProjects } = useContext(ProjectContext);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTeamFormat, setSelectedTeamFormat] = useState<'All' | 'Solo' | 'Team'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [displayProjects, setDisplayProjects] = useState<Project[]>(demoProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const normalizeProjects = (apiProjects: any[]): Project[] =>
    apiProjects.map((p) => {
      const match = demoProjects.find(d => d.title.toLowerCase() === (p.title || '').toLowerCase());
      return {
        ...p,
        githubUrl: p.githubUrl || '',
        liveUrl: p.liveUrl || '',
        howCompleted: p.howCompleted || match?.howCompleted,
        toolsUsed: p.toolsUsed || match?.toolsUsed || p.technologies,
        futureScope: p.futureScope || match?.futureScope,
        teamMembers: p.teamMembers || match?.teamMembers,
        projectType: p.projectType || match?.projectType,
        timelinePhases: p.timelinePhases || match?.timelinePhases,
      };
    });

  useEffect(() => {
    fetchProjects().catch(() => console.log('Using demo projects as fallback'));
  }, []);

  useEffect(() => {
    const list = projects.length > 0 ? normalizeProjects(projects) : demoProjects;
    setDisplayProjects(list);

    // Deep link from URL hash (e.g. #project-demo-agri)
    const hash = window.location.hash;
    if (hash && hash.startsWith('#project-')) {
      const targetId = hash.replace('#project-', '');
      const found = list.find(p => p._id === targetId);
      if (found) {
        setSelectedProject(found);
      }
    }
  }, [projects]);

  // Dynamic Multi-Dimensional Filtering (Category + Search + Team Format)
  const filteredProjects = useMemo(() => {
    return displayProjects.filter((project) => {
      // Category Match
      const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;

      // Team Format Match
      const isSolo = !project.teamMembers || project.teamMembers.length <= 1 || project.projectType?.toLowerCase().includes('solo');
      const matchesFormat =
        selectedTeamFormat === 'All' ||
        (selectedTeamFormat === 'Solo' && isSolo) ||
        (selectedTeamFormat === 'Team' && !isSolo);

      // Search Query Match (Title, Short Desc, Tech, Tags)
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        project.title.toLowerCase().includes(q) ||
        project.shortDescription.toLowerCase().includes(q) ||
        (project.technologies && project.technologies.some(t => t.toLowerCase().includes(q))) ||
        (project.tags && project.tags.some(tag => tag.toLowerCase().includes(q)));

      return matchesCategory && matchesFormat && matchesSearch;
    });
  }, [displayProjects, selectedCategory, selectedTeamFormat, searchQuery]);

  const sortedProjects = useMemo(() => {
    return [...filteredProjects].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [filteredProjects]);

  const displayedProjects = showAll ? sortedProjects : sortedProjects.slice(0, 6);
  const hasMoreProjects = sortedProjects.length > 6;

  /* ── Loading ── */
  if (loading && displayProjects.length === 0) {
    return (
      <section
        id="projects"
        className="py-32 relative"
        style={{ background: 'linear-gradient(180deg,rgba(5,8,18,0) 0%,rgba(5,8,18,1) 6%)' }}
      >
        <div className="flex flex-col items-center justify-center py-24 gap-5">
          <div className="relative">
            <Loader2 className="h-10 w-10 text-cyan-400 animate-spin" />
            <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20 animate-ping" />
          </div>
          <p className="text-white/40 text-sm" role="status">Loading projects…</p>
        </div>
      </section>
    );
  }

  /* ── Error ── */
  if (error && displayProjects.length === 0) {
    return (
      <section
        id="projects"
        className="py-32 relative"
        style={{ background: 'linear-gradient(180deg,rgba(5,8,18,0) 0%,rgba(5,8,18,1) 6%)' }}
      >
        <div className="flex flex-col items-center justify-center py-24 gap-5 max-w-sm mx-auto text-center">
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
          <h3 className="text-lg font-bold text-white">Unable to Load Projects</h3>
          <p className="text-white/40 text-sm">We're having trouble connecting. Please try again.</p>
          <div className="flex gap-3">
            <button
              onClick={() => fetchProjects()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-sm font-semibold hover:bg-cyan-500/20 transition-colors"
            >
              <RefreshCw className="h-4 w-4" /> Retry
            </button>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              <ExternalLink className="h-4 w-4" /> Contact
            </button>
          </div>
        </div>
      </section>
    );
  }

  /* ── Main render ── */
  return (
    <SectionShell id="projects" tone="violet" bare aria-label="Star AI Labs project showcase">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <SectionHeader
          headingId="projects-heading"
          icon={<Sparkles className="h-4 w-4" />}
          badge="Innovation Portfolio"
          title="Transforming Ideas "
          highlight="Into Reality"
          subtitle="Explore our state-of-the-art AI, IoT, and Web3 solutions. Click on any project card to reveal its full development process, space-animated tech stack, future roadmap, and contributors."
        />
        <Reveal className="-mt-6 mb-12 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <StatPill icon={<Layers className="h-4 w-4" />} value={`${displayProjects.length}`} label="Projects" />
          <StatPill icon={<Award className="h-4 w-4" />} value={`${displayProjects.filter((p) => p.featured).length}`} label="Featured" />
          <StatPill icon={<Zap className="h-4 w-4" />} value={`${displayProjects.filter((p) => p.status === 'In Progress').length}`} label="In Progress" />
        </Reveal>

        {/* ── Dynamic Live Search & Creator Filter Controls ── */}
        <div className="max-w-3xl mx-auto mb-8 sm:mb-10 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search missions by name, technology (e.g. Python, React, AI), or tags..."
              className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.1] hover:border-cyan-400/40 focus:border-cyan-400 focus:bg-white/[0.06] text-white text-sm placeholder-white/35 outline-none transition-all duration-300 shadow-lg backdrop-blur-md"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sub-Filter: Creator Format (All vs Solo vs Team) */}
          <div className="flex items-center justify-between flex-wrap gap-2 px-1">
            <div className="flex items-center gap-1.5 text-xs text-white/40">
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              <span>Format:</span>
            </div>

            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <button
                onClick={() => setSelectedTeamFormat('All')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${selectedTeamFormat === 'All'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                  : 'text-white/40 hover:text-white/70'
                  }`}
              >
                All Missions
              </button>
              <button
                onClick={() => setSelectedTeamFormat('Solo')}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${selectedTeamFormat === 'Solo'
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-400/30'
                  : 'text-white/40 hover:text-white/70'
                  }`}
              >
                <UserCheck className="w-3 h-3" /> Solo
              </button>
              <button
                onClick={() => setSelectedTeamFormat('Team')}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${selectedTeamFormat === 'Team'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                  : 'text-white/40 hover:text-white/70'
                  }`}
              >
                <Users className="w-3 h-3" /> Team
              </button>
            </div>

            <div className="text-xs font-mono text-cyan-400/70">
              Showing {filteredProjects.length} of {displayProjects.length} Projects
            </div>
          </div>
        </div>

        {/* ── Category Filter ── */}
        <ProjectFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          projects={displayProjects}
        />

        {/* ── Grid ── */}
        {displayedProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
              <FolderOpen className="h-10 w-10 text-white/25" />
            </div>
            <h3 className="text-xl font-bold text-white">No Matching Missions Found</h3>
            <p className="text-white/40 text-sm text-center max-w-sm">
              No projects matched your search criteria. Try a different query or reset filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedTeamFormat('All');
                setSearchQuery('');
              }}
              className="mt-2 px-5 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-bold hover:bg-cyan-500/20 transition-all"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <>
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12"
              role="list"
              aria-labelledby="projects-heading"
            >
              {displayedProjects.map((project, index) => (
                <Reveal key={project._id} role="listitem" delay={(index % 3) * 90} className="h-full">
                  <ProjectCard
                    project={project}
                    onClick={() => setSelectedProject(project)}
                  />
                </Reveal>
              ))}
            </div>

            {/* CTA row */}
            <div className="flex justify-center gap-4">
              {hasMoreProjects && !showAll && (
                <button
                  onClick={() => setShowAll(true)}
                  className="group relative flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black"
                  style={{
                    background: 'linear-gradient(135deg,rgba(34,211,238,0.12),rgba(99,102,241,0.12))',
                    border: '1px solid rgba(34,211,238,0.2)',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span>View All Projects</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  <span className="px-2.5 py-1 text-xs font-bold bg-cyan-500/20 border border-cyan-400/30 rounded-lg text-cyan-300">
                    +{sortedProjects.length - 6}
                  </span>
                </button>
              )}

              {showAll && hasMoreProjects && (
                <button
                  onClick={() => setShowAll(false)}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-semibold text-white/50 border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:text-white/70 transition-all duration-200 focus:outline-none"
                >
                  Show Less
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* ── Interactive Cosmic Project Detail Modal ── */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => {
            setSelectedProject(null);
            // Reset URL hash if opened from deep link
            if (window.location.hash.startsWith('#project-')) {
              window.history.replaceState(null, '', window.location.pathname);
            }
          }}
        />
      )}
    </SectionShell>
  );
};

export default Projects;