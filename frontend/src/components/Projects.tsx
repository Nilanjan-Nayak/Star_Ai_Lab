import { useContext, useEffect, useState } from 'react';
import { ProjectContext } from '../context/ProjectContext';
import ProjectCard from './ProjectCard';
import ProjectFilter from './ProjectFilter';
import {
  Loader2, AlertCircle, FolderOpen, ArrowRight,
  Sparkles, RefreshCw, ExternalLink, Layers, Zap, Award
} from 'lucide-react';

interface DisplayProject {
  _id: string;
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  status: string;
  technologies: string[];
  tags: string[];
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  startDate: string;
  createdAt: string;
  imageUrl?: string;
}

const demoProjects: DisplayProject[] = [
  {
    _id: 'demo-4',
    title: 'Media Storage',
    description: 'An IoT-based environmental monitoring system that tracks air quality, temperature, humidity, and noise levels.',
    shortDescription: 'IoT system for real-time environmental monitoring with sensor networks and cloud analytics.',
    category: 'storage',
    status: 'Completed',
    technologies: ['Arduino', 'Raspberry Pi', 'Python', 'AWS IoT', 'InfluxDB', 'Grafana'],
    tags: ['iot', 'environmental-monitoring', 'sensors'],
    githubUrl: 'https://github.com/starailabs/iot-monitoring',
    liveUrl: '',
    featured: false,
    startDate: '2024-04-01',
    createdAt: '2024-04-01T00:00:00.000Z',
  },
  {
    _id: 'demo-5',
    title: 'Star AI',
    description: 'A comprehensive mobile health monitoring application with AI-powered health insights.',
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
  },
  {
    _id: 'demo-6',
    title: 'Carreerkick',
    description: 'A blockchain-based supply chain tracking system that provides transparency and traceability.',
    shortDescription: 'Blockchain system for transparent supply chain tracking with smart contracts.',
    category: 'AI/ML',
    status: 'In Progress',
    technologies: ['Web3.js', 'React', 'Tailwind CSS', 'Node.js'],
    tags: ['blockchain', 'supply-chain', 'smart-contracts'],
    githubUrl: 'https://github.com/starailabs/blockchain-supply-chain',
    liveUrl: '',
    featured: false,
    startDate: '2024-06-01',
    createdAt: '2024-06-01T00:00:00.000Z',
  },
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
  <div className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm">
    <div className="p-2 rounded-xl bg-white/[0.05] text-cyan-400">{icon}</div>
    <div>
      <div className="text-lg font-bold text-white leading-none">{value}</div>
      <div className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">{label}</div>
    </div>
  </div>
);

const Projects = () => {
  const { projects, loading, error, fetchProjects } = useContext(ProjectContext);
  const [filteredProjects, setFilteredProjects] = useState<DisplayProject[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAll, setShowAll] = useState(false);
  const [displayProjects, setDisplayProjects] = useState<DisplayProject[]>(demoProjects);

  const normalizeProjects = (apiProjects: any[]): DisplayProject[] =>
    apiProjects.map((p) => ({ ...p, githubUrl: p.githubUrl || '', liveUrl: p.liveUrl || '' }));

  useEffect(() => {
    fetchProjects().catch(() => console.log('Using demo projects as fallback'));
  }, []);

  useEffect(() => {
    setDisplayProjects(projects.length > 0 ? normalizeProjects(projects) : demoProjects);
  }, [projects]);

  useEffect(() => {
    setFilteredProjects(
      selectedCategory === 'All'
        ? displayProjects
        : displayProjects.filter((p) => p.category === selectedCategory)
    );
  }, [displayProjects, selectedCategory]);

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

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
    <section
      id="projects"
      className="py-28 relative overflow-hidden bg-transparent"
      aria-label="Star AI Labs project showcase"
    >
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/[0.05] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-500/[0.05] rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.04),transparent)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Header ── */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/[0.07] text-blue-300 text-xs font-bold tracking-widest uppercase mb-8 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            Innovation Portfolio
          </div>

          <h2
            id="projects-heading"
            className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-5"
          >
            Transforming Ideas
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-500 bg-clip-text text-transparent inline-block pb-3 pt-1">
              Into Reality
            </span>
          </h2>

          <p className="text-lg text-white/45 max-w-2xl mx-auto leading-relaxed mb-12">
            Cutting-edge AI and technology projects that reshape industries.
            Each one built with precision, purpose, and a passion for excellence.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
            <StatPill icon={<Layers className="h-4 w-4" />} value={`${displayProjects.length}+`} label="Projects" />
            <StatPill icon={<Zap className="h-4 w-4" />} value="99%" label="Uptime" />
            <StatPill icon={<Award className="h-4 w-4" />} value="1+" label="Years" />
          </div>
        </div>

        {/* ── Filter ── */}
        <ProjectFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          projects={displayProjects}
        />

        {/* ── Grid ── */}
        {displayedProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-5">
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
              <FolderOpen className="h-10 w-10 text-white/25" />
            </div>
            <h3 className="text-xl font-bold text-white">No Projects Found</h3>
            <p className="text-white/35 text-sm text-center max-w-xs">
              {selectedCategory === 'All'
                ? "We're working on some amazing projects. Check back soon!"
                : `No projects in the "${selectedCategory}" category yet.`}
            </p>
          </div>
        ) : (
          <>
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12"
              role="list"
              aria-labelledby="projects-heading"
            >
              {displayedProjects.map((project) => (
                <div key={project._id} role="listitem" className="h-full">
                  <ProjectCard project={project} />
                </div>
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
    </section>
  );
};

export default Projects;