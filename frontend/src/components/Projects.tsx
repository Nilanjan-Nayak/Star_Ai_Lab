import  { useContext, useEffect, useState } from 'react';
import { ProjectContext } from '../context/ProjectContext';
import ProjectCard from './ProjectCard';
import ProjectFilter from './ProjectFilter';
import { Loader2, AlertCircle, FolderOpen, ArrowRight, Sparkles, RefreshCw, ExternalLink } from 'lucide-react';

// Extended project type that includes both API and demo project structures
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

// Demo projects data for immediate display
const demoProjects = [
  
  
  
  {
    _id: 'demo-4',
    title: "Media Storage",
    description: "An IoT-based environmental monitoring system that tracks air quality, temperature, humidity, and noise levels. Uses sensor networks, edge computing, and cloud analytics to provide real-time environmental insights and alerts.",
    shortDescription: "IoT system for real-time environmental monitoring with sensor networks and cloud analytics.",
    category: "storage",
    status: "Completed",
    technologies: ["Arduino", "Raspberry Pi", "Python", "AWS IoT", "InfluxDB", "Grafana"],
    tags: ["iot", "environmental-monitoring", "sensors", "edge-computing"],
    githubUrl: "https://github.com/starailabs/iot-monitoring",
    liveUrl: "",
    featured: false,
    startDate: "2024-04-01",
    createdAt: "2024-04-01T00:00:00.000Z"
  },
  {
    _id: 'demo-5',
    title: "Star AI",
    description: "A comprehensive mobile health monitoring application with AI-powered health insights. Features symptom tracking, medication reminders, vital signs monitoring, and personalized health recommendations powered by machine learning.",
    shortDescription: "AI-powered mobile app for comprehensive health monitoring and personalized insights.",
    category: "AI/ML",
    status: "In Progress",
    technologies: ["React Native", "Python", "TensorFlow", "Firebase", "Node.js", "MongoDB"],
    tags: ["mobile-app", "healthcare", "ai-insights", "health-monitoring"],
    githubUrl: "https://github.com/starailabs/health-monitor-app",
    liveUrl: "",
    featured: true,
    startDate: "2024-05-01",
    createdAt: "2024-05-01T00:00:00.000Z"
  },
  {
    _id: 'demo-6',
    title: "Carreerkick",
    description: "A blockchain-based supply chain tracking system that provides transparency and traceability for products from manufacture to delivery. Features smart contracts, QR code integration, and immutable transaction records.",
    shortDescription: "Blockchain system for transparent supply chain tracking with smart contracts.",
    category: "AI/ML",
    status: "In Progress",
    technologies: [ "Web3.js", "React", "Tailwind Css", "Node.js"],
    tags: ["blockchain", "supply-chain", "smart-contracts", "transparency"],
    githubUrl: "https://github.com/starailabs/blockchain-supply-chain",
    liveUrl: "",
    featured: false,
    startDate: "2024-06-01",
    createdAt: "2024-06-01T00:00:00.000Z"
  }
];

const Projects = () => {
  const { projects, loading, error, fetchProjects } = useContext(ProjectContext);
  const [filteredProjects, setFilteredProjects] = useState<DisplayProject[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAll, setShowAll] = useState(false);
  const [displayProjects, setDisplayProjects] = useState<DisplayProject[]>(demoProjects);

  // Helper function to normalize projects from API to match DisplayProject interface
  const normalizeProjects = (apiProjects: any[]): DisplayProject[] => {
    return apiProjects.map(project => ({
      ...project,
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || ''
    }));
  };

  useEffect(() => {
    // Try to fetch projects from API, but don't block UI
    fetchProjects().catch(() => {
      // If API fails, we'll continue with demo projects
      console.log('Using demo projects as fallback');
    });
  }, []);

  useEffect(() => {
    // Use API projects if available, otherwise use demo projects
    const projectsToUse = projects.length > 0 ? normalizeProjects(projects) : demoProjects;
    setDisplayProjects(projectsToUse);
  }, [projects]);

  // Retry mechanism for failed loads
  const handleRetry = () => {
    fetchProjects();
  };

  useEffect(() => {
    let filtered = displayProjects;
    
    if (selectedCategory !== 'All') {
      filtered = displayProjects.filter(project => project.category === selectedCategory);
    }
    
    setFilteredProjects(filtered);
  }, [displayProjects, selectedCategory]);

  // Get featured projects first, then others
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Show only 6 projects initially for landing page, unless "Show All" is clicked
  const displayedProjects = showAll ? sortedProjects : sortedProjects.slice(0, 6);
  const hasMoreProjects = sortedProjects.length > 6;

  if (loading && displayProjects.length === 0) {
    return (
      <section id="projects" className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50" role="main" aria-label="Projects showcase">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
              <div className="absolute inset-0 h-12 w-12 border-4 border-blue-200 rounded-full animate-pulse"></div>
            </div>
            <p className="text-gray-600 text-lg mt-6 animate-pulse" role="status" aria-live="polite">
              Loading our innovative projects...
            </p>
            <div className="mt-4 text-sm text-gray-500">
              Fetching the latest AI and technology projects
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error && displayProjects.length === 0) {
    return (
      <section id="projects" className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50" role="main" aria-label="Projects showcase">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="p-4 bg-red-50 rounded-full mb-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-red-600 mb-2" role="alert">
              Unable to Load Projects
            </h3>
            <p className="text-red-500 text-center mb-6 max-w-md" role="alert">
              We're experiencing technical difficulties. Please try again in a moment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleRetry}
                className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                aria-label="Retry loading projects"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </button>
              <button
                onClick={() => {
                  const element = document.getElementById('contact');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                aria-label="Contact us for support"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="projects" 
      className="py-20 relative overflow-hidden"
      style={{ background: '' }}
      role="main"
      aria-label="Star AI Labs project showcase"
            >
      
      
      {/* Sophisticated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-blue-600/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-cyan-500/6 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-800/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-black/90 via-slate-900/80 to-black/90 border border-blue-500/40 rounded-full text-blue-300 text-sm font-medium mb-6 backdrop-blur-lg shadow-[0_8px_16px_rgba(0,0,0,0.6),0_4px_8px_rgba(59,130,246,0.2)]">
            <Sparkles className="h-4 w-4 mr-2 text-cyan-400" />
            Our Innovation Portfolio
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]" id="projects-heading">
            Transforming Ideas Into
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 drop-shadow-[0_2px_4px_rgba(59,130,246,0.4)]">
              Intelligent Solutions
            </span>
          </h2>
          
          <p className="text-xl text-blue-200/90 max-w-4xl mx-auto leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" role="doc-subtitle">
            Explore our cutting-edge AI and technology projects that are reshaping industries and solving complex challenges. 
            Each project represents our commitment to innovation and excellence in artificial intelligence.
          </p>
        </header>

        {/* Project Filter */}
        <ProjectFilter 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          projects={displayProjects}
        />

        {/* Projects Grid */}
        {displayedProjects.length === 0 ? (
          <div className="text-center py-20" role="status" aria-live="polite">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-800/50 rounded-full mb-6 backdrop-blur-lg border border-blue-500/20">
              <FolderOpen className="h-10 w-10 text-blue-300" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">No Projects Found</h3>
            <p className="text-blue-200/80 max-w-md mx-auto drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
              {selectedCategory === 'All' 
                ? "We're working on adding some amazing projects. Check back soon for exciting updates!" 
                : `No projects found in the "${selectedCategory}" category. Try selecting a different category.`
              }
            </p>
          </div>
        ) : (
          <>
            {/* Projects Grid */}
            <div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
              role="list"
              aria-labelledby="projects-heading"
            >
              {displayedProjects.map((project) => (
                <div
                  key={project._id}
                  role="listitem"
                >
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>

            {/* View All Projects Button */}
            {hasMoreProjects && !showAll && (
              <div className="text-center" role="navigation" aria-label="View more projects">
                <button
                  onClick={() => setShowAll(true)}
                  className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-2xl shadow-[0_16px_32px_rgba(0,0,0,0.6),0_8px_16px_rgba(59,130,246,0.4),0_4px_8px_rgba(6,182,212,0.3)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.7),0_10px_20px_rgba(59,130,246,0.5)] transition-shadow duration-300 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 backdrop-blur-lg border border-blue-400/30"
                  aria-label="View all projects"
                  aria-describedby="more-projects-count"
                >
                  <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">View All Projects</span>
                  <ArrowRight className="ml-3 h-5 w-5" />
                  <span 
                    id="more-projects-count"
                    className="ml-3 px-3 py-1.5 bg-white/25 rounded-xl text-sm font-bold border border-white/30 backdrop-blur-sm"
                    aria-label={`${sortedProjects.length - 6} more projects available`}
                  >
                    +{sortedProjects.length - 6}
                  </span>
                </button>
              </div>
            )}

            {/* Show Less Button */}
            {showAll && hasMoreProjects && (
              <div className="text-center" role="navigation" aria-label="Show fewer projects">
                <button
                  onClick={() => setShowAll(false)}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-slate-900/80 via-blue-950/60 to-slate-800/80 text-blue-200 font-medium rounded-2xl border-2 border-blue-500/30 hover:border-blue-400/50 hover:text-white shadow-[0_8px_16px_rgba(0,0,0,0.6),0_4px_8px_rgba(30,58,138,0.2)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.7),0_6px_12px_rgba(59,130,246,0.3)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 backdrop-blur-lg"
                  aria-label="Show fewer projects"
                >
                  <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Show Less Projects</span>
                </button>
              </div>
            )}
          </>
        )}

        
        
      </div>

          </section>
  );
};

export default Projects;