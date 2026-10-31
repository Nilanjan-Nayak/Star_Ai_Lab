import { useContext, useEffect, useState, useMemo } from 'react';
import { ProjectContext } from '../context/ProjectContext';
import ProjectCard from './ProjectCard';
import ProjectFilter from './ProjectFilter';
import ProjectDetailModal from './ProjectDetailModal';
import { isSoloProject } from './projectVisuals';
import { SectionShell, SectionHeader, Reveal } from './SectionKit.tsx';
import { Project } from '../types/project';
import {
  Loader2, AlertCircle, FolderOpen, ArrowRight, RefreshCw,
  ExternalLink, Layers, Search, X, Users, UserCheck, Mail, Github
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
    category: 'Blockchain',
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
    category: 'IoT',
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

const FORMATS = [
  { id: 'All', label: 'All', Icon: null },
  { id: 'Solo', label: 'Solo', Icon: UserCheck },
  { id: 'Team', label: 'Team', Icon: Users },
] as const;

const INITIAL_WITH_SPOTLIGHT = 5; // 1 spotlight + 2 rows of 2
const INITIAL_WITHOUT = 6;

/* Count-up that runs once on mount (skipped for reduced-motion users) */
const useCountUp = (target: number, ms = 900) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - t0) / ms, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return value;
};

const Stat = ({ value, label }: { value: number; label: string }) => {
  const shown = useCountUp(value);
  return (
    <div className="px-6 text-center sm:px-9">
      <div className="text-2xl font-semibold tabular-nums text-white">{shown}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
};

const GroupLabel = ({ title, count }: { title: string; count?: number }) => (
  <div className="mb-5 flex items-center gap-4">
    <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
    <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" aria-hidden="true" />
    {count !== undefined && <span className="text-xs tabular-nums text-slate-500">{count}</span>}
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
      const match = demoProjects.find((d) => d.title.toLowerCase() === (p.title || '').toLowerCase());
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
      const found = list.find((p) => p._id === hash.replace('#project-', ''));
      if (found) setSelectedProject(found);
    }
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return displayProjects.filter((project) => {
      const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
      const solo = isSoloProject(project);
      const matchesFormat =
        selectedTeamFormat === 'All' ||
        (selectedTeamFormat === 'Solo' && solo) ||
        (selectedTeamFormat === 'Team' && !solo);
      const matchesSearch =
        !q ||
        project.title.toLowerCase().includes(q) ||
        project.shortDescription.toLowerCase().includes(q) ||
        project.technologies?.some((t) => t.toLowerCase().includes(q)) ||
        project.tags?.some((tag) => tag.toLowerCase().includes(q));
      return matchesCategory && matchesFormat && matchesSearch;
    });
  }, [displayProjects, selectedCategory, selectedTeamFormat, searchQuery]);

  const sortedProjects = useMemo(
    () =>
      [...filteredProjects].sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }),
    [filteredProjects]
  );

  // Layout: a featured project gets a full-width spotlight; the rest sit in a 2-column grid.
  // If the rest is odd, the last card goes full-width too, so the grid always ends flush.
  const hasSpotlight = !!sortedProjects[0]?.featured;
  const initialCount = hasSpotlight ? INITIAL_WITH_SPOTLIGHT : INITIAL_WITHOUT;
  const displayedProjects = showAll ? sortedProjects : sortedProjects.slice(0, initialCount);
  const hasMoreProjects = sortedProjects.length > initialCount;
  const spotlight = hasSpotlight ? displayedProjects[0] : null;
  const rest = hasSpotlight ? displayedProjects.slice(1) : displayedProjects;
  const lastIsWide = rest.length % 2 === 1;

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedTeamFormat('All');
    setSearchQuery('');
  };

  /* ── Loading ── */
  if (loading && displayProjects.length === 0) {
    return (
      <section id="projects" className="relative py-32">
        <div className="flex flex-col items-center justify-center gap-4 py-24">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-300" />
          <p className="text-sm text-slate-400" role="status">Loading projects…</p>
        </div>
      </section>
    );
  }

  /* ── Error ── */
  if (error && displayProjects.length === 0) {
    return (
      <section id="projects" className="relative py-32">
        <div className="mx-auto flex max-w-sm flex-col items-center justify-center gap-4 py-24 text-center">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <AlertCircle className="h-7 w-7 text-slate-300" />
          </div>
          <h3 className="text-lg font-semibold text-white">Projects could not be loaded</h3>
          <p className="text-sm text-slate-400">Check your connection and try again.</p>
          <div className="flex gap-3">
            <button
              onClick={() => fetchProjects()}
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-200"
            >
              <RefreshCw className="h-4 w-4" /> Retry
            </button>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-white/[0.06]"
            >
              <ExternalLink className="h-4 w-4" /> Contact
            </button>
          </div>
        </div>
      </section>
    );
  }

  const renderCard = (project: Project, horizontal: boolean) => (
    <ProjectCard
      project={project}
      variant={horizontal ? 'horizontal' : 'stacked'}
      onClick={() => setSelectedProject(project)}
    />
  );

  /* ── Main render ── */
  return (
    <SectionShell id="projects" tone="violet" bare aria-label="Project showcase">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Atmosphere: faint dot grid fading out + one soft glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[560px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(148,163,184,0.18) 1px, transparent 0)', backgroundSize: '28px 28px' }}
        />
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-72 w-[42rem] max-w-full -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative">
          <SectionHeader
            headingId="projects-heading"
            icon={<Layers className="h-4 w-4" />}
            badge="Projects"
            title="Projects across "
            highlight="AI, IoT and Web3"
            subtitle="Open any project to see how it was built, the technology behind it, what is planned next and who worked on it."
          />

          <Reveal className="-mt-6 mb-10 flex justify-center">
            <div className="flex divide-x divide-white/10 rounded-xl border border-white/10 bg-white/[0.04] py-3 backdrop-blur">
              <Stat value={displayProjects.length} label="Projects" />
              <Stat value={displayProjects.filter((p) => p.featured).length} label="Featured" />
              <Stat value={displayProjects.filter((p) => p.status === 'In Progress').length} label="In progress" />
            </div>
          </Reveal>

          {/* ── Toolbar ── */}
          <div className="mb-10 space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur sm:p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search projects"
                  placeholder="Search by name, technology or tag"
                  className="w-full rounded-lg border border-white/10 bg-[#0a0f1c]/60 py-2.5 pl-10 pr-10 text-sm text-white outline-none transition-colors placeholder:text-slate-500 hover:border-white/20 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div role="group" aria-label="Filter by team format" className="flex shrink-0 rounded-lg border border-white/10 bg-[#0a0f1c]/60 p-1">
                {FORMATS.map(({ id, label, Icon }) => {
                  const active = selectedTeamFormat === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setSelectedTeamFormat(id)}
                      className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-4 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 ${active ? 'bg-cyan-300/15 text-cyan-200' : 'text-slate-400 hover:text-white'
                        }`}
                    >
                      {Icon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <ProjectFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} projects={displayProjects} />
              <p aria-live="polite" className="shrink-0 text-xs tabular-nums text-slate-400">
                Showing {filteredProjects.length} of {displayProjects.length}
              </p>
            </div>
          </div>

          {/* ── Projects ── */}
          {displayedProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <FolderOpen className="h-8 w-8 text-slate-500" />
              </div>
              <h3 className="text-lg font-semibold text-white">No projects match</h3>
              <p className="max-w-sm text-sm text-slate-400">Try a different search term or clear the filters.</p>
              <button
                onClick={resetFilters}
                className="mt-2 rounded-lg border border-cyan-300/40 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-200 transition-colors hover:bg-cyan-300/20"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              {spotlight && (
                <div className="mb-12">
                  <GroupLabel title="Featured project" />
                  <Reveal>{renderCard(spotlight, true)}</Reveal>
                </div>
              )}

              {rest.length > 0 && (
                <div>
                  {spotlight && <GroupLabel title="More projects" count={sortedProjects.length - 1} />}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2" role="list" aria-labelledby="projects-heading">
                    {rest.map((project, i) => {
                      const wide = lastIsWide && i === rest.length - 1;
                      return (
                        <Reveal
                          key={project._id}
                          role="listitem"
                          delay={(i % 2) * 80}
                          className={`h-full ${wide ? 'md:col-span-2' : ''}`}
                        >
                          {renderCard(project, wide)}
                        </Reveal>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mt-10 flex justify-center">
                {hasMoreProjects && !showAll && (
                  <button
                    onClick={() => setShowAll(true)}
                    className="inline-flex items-center gap-3 rounded-lg border border-cyan-300/40 bg-cyan-300/10 px-6 py-3 text-sm font-medium text-cyan-100 transition-colors hover:bg-cyan-300/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60"
                  >
                    View all projects
                    <span className="rounded bg-cyan-300/20 px-1.5 py-0.5 text-xs tabular-nums">+{sortedProjects.length - initialCount}</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
                {showAll && hasMoreProjects && (
                  <button
                    onClick={() => setShowAll(false)}
                    className="rounded-lg border border-white/10 px-6 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60"
                  >
                    Show fewer
                  </button>
                )}
              </div>
            </>
          )}

          {/* ── Closing call to action ── */}
          <Reveal className="mt-16">
            <div className="relative flex flex-col gap-6 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7 sm:flex-row sm:items-center sm:justify-between sm:p-10">
              <div aria-hidden="true" className="pointer-events-none absolute -left-10 top-1/2 h-48 w-80 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
              <div className="relative">
                <h3 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">Have a project in mind?</h3>
                <p className="mt-1 text-sm text-slate-400">Tell me what you want to build and let's talk about it.</p>
              </div>
              <div className="relative flex flex-wrap gap-3">
                <button
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center gap-2 rounded-lg bg-cyan-300 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0f1c]"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" /> Get in touch
                </button>
                <a
                  href="https://github.com/Nilanjan-Nayak"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-5 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-white/[0.06] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60"
                >
                  <Github className="h-4 w-4" aria-hidden="true" /> GitHub profile
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => {
            setSelectedProject(null);
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