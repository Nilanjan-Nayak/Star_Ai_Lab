import { useContext, useEffect, useState } from 'react';
import { ProjectContext } from '../context/ProjectContext';
import ProjectCard from './ProjectCard';
import ProjectFilter from './ProjectFilter';
import { Loader2, AlertCircle, FolderOpen } from 'lucide-react';

// Import the Project interface
interface Project {
  _id: string;
  title: string;
  description: string;
  shortDescription: string;
  technologies: string[];
  category: string;
  status: string;
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  startDate: string;
  tags: string[];
  createdAt: string;
}

const Projects = () => {
  const { projects, loading, error, fetchProjects } = useContext(ProjectContext);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(project => project.category === selectedCategory));
    }
  }, [projects, selectedCategory]);

  if (loading) {
    return (
      <section id="projects" className="py-20 bg-premium-void relative">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-400/5 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-blue-400 animate-spin mb-4" />
            <p className="text-blue-200 text-lg">Loading our amazing projects...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="projects" className="py-20 bg-premium-void relative">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-red-500/5 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-20">
            <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
            <p className="text-red-300 text-lg mb-4">Error loading projects</p>
            <button
              onClick={fetchProjects}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-400 text-white rounded-lg hover:from-cyan-400 hover:to-blue-600 transition-all duration-300 shadow-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 bg-premium-void relative">
      {/* Premium Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/5 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/5 w-80 h-80 bg-cyan-400/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 bg-premium-glass border border-premium-blue rounded-full text-blue-300 text-sm font-medium mb-6 backdrop-blur-lg">
            <FolderOpen className="h-4 w-4 mr-2" />
            Our Portfolio
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Innovative
            <span className="text-premium-gradient"> AI Projects</span>
          </h2>
          <p className="text-xl text-blue-200/90 max-w-3xl mx-auto">
            Explore our portfolio of cutting-edge AI and technology solutions that are transforming industries and solving real-world challenges.
          </p>
        </div>

        {/* Filter */}
        <ProjectFilter 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          projects={projects}
        />

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-premium-glass backdrop-blur-lg border border-premium-blue rounded-2xl p-12 max-w-md mx-auto">
              <FolderOpen className="h-16 w-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Projects Found</h3>
              <p className="text-blue-200/80">
                {selectedCategory === 'All' 
                  ? "We're working on adding some amazing projects. Check back soon!" 
                  : `No projects found in the "${selectedCategory}" category.`
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}

        {/* Featured Projects Highlight */}
        {projects.some(p => p.featured) && selectedCategory === 'All' && (
          <div className="mt-16 text-center">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-400 text-white rounded-full text-sm font-medium shadow-lg">
              ⭐ Featured Projects Above
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;