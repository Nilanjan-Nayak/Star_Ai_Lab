import React from 'react';
import { ExternalLink, Github, Calendar, Tag, ArrowUpRight, Clock, CheckCircle } from 'lucide-react';

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
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const {
    title,
    shortDescription,
    technologies,
    category,
    status,
    imageUrl,
    githubUrl,
    liveUrl,
    startDate,
    tags
  } = project;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Completed':
        return {
          color: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
          icon: <CheckCircle className="h-3 w-3" />,
          pulse: false
        };
      case 'In Progress':
        return {
          color: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
          icon: <Clock className="h-3 w-3" />,
          pulse: true
        };
      case 'On Hold':
        return {
          color: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
          icon: <Clock className="h-3 w-3" />,
          pulse: false
        };
      case 'Planning':
        return {
          color: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
          icon: <Clock className="h-3 w-3" />,
          pulse: false
        };
      default:
        return {
          color: 'bg-slate-500/20 text-slate-300 border-slate-400/30',
          icon: <Clock className="h-3 w-3" />,
          pulse: false
        };
    }
  };

  const getCategoryConfig = (category: string) => {
    switch (category) {
      case 'AI/ML':
        return { color: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30', gradient: 'from-indigo-500 to-purple-600' };
      case 'Web Development':
        return { color: 'bg-blue-500/20 text-blue-300 border-blue-400/30', gradient: 'from-blue-500 to-cyan-600' };
      case 'Mobile App':
        return { color: 'bg-green-500/20 text-green-300 border-green-400/30', gradient: 'from-green-500 to-emerald-600' };
      case 'Data Science':
        return { color: 'bg-purple-500/20 text-purple-300 border-purple-400/30', gradient: 'from-purple-500 to-pink-600' };
      case 'IoT':
        return { color: 'bg-orange-500/20 text-orange-300 border-orange-400/30', gradient: 'from-orange-500 to-red-600' };
      case 'Blockchain':
        return { color: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30', gradient: 'from-yellow-500 to-orange-600' };
      case 'storage':
        return { color: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30', gradient: 'from-cyan-500 to-blue-600' };
      default:
        return { color: 'bg-slate-500/20 text-slate-300 border-slate-400/30', gradient: 'from-slate-500 to-slate-600' };
    }
  };

  const statusConfig = getStatusConfig(status);
  const categoryConfig = getCategoryConfig(category);

  return (
    <article 
      className="group relative bg-gradient-to-br from-slate-900/95 via-blue-950/90 to-slate-800/95 backdrop-blur-xl rounded-3xl shadow-[0_32px_64px_rgba(0,0,0,0.9),0_16px_32px_rgba(30,58,138,0.4),0_8px_16px_rgba(59,130,246,0.3),0_4px_8px_rgba(6,182,212,0.2),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(59,130,246,0.2)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.95),0_20px_40px_rgba(30,58,138,0.5),0_10px_20px_rgba(59,130,246,0.4),0_5px_10px_rgba(6,182,212,0.3),inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(59,130,246,0.3)] transition-shadow duration-300 overflow-hidden border-2 border-blue-400/30 hover:border-blue-300/50 focus-within:ring-2 focus-within:ring-blue-400 focus-within:ring-offset-2 focus-within:ring-offset-slate-900"
      role="article"
      aria-labelledby={`project-title-${project._id}`}
      tabIndex={0}
    >
      

      {/* Project Image with Overlay */}
      <div className="relative h-64 bg-gradient-to-br from-slate-800 via-blue-900 to-slate-700 overflow-hidden rounded-t-3xl" role="img" aria-label={`${title} project preview`}>
        {imageUrl ? (
          <>
            <img
              src={imageUrl.startsWith('http') ? imageUrl : imageUrl.startsWith('/') ? `http://localhost:5000${imageUrl}` : `https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80`}
              alt={`${title} project screenshot`}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                // Fallback to a default tech image if image fails to load
                e.currentTarget.src = 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center relative" aria-label={`${title} project placeholder`}>
            {/* Default tech background image */}
            <img
              src="https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              alt={`${title} project background`}
              className="w-full h-full object-cover opacity-40"
              loading="lazy"
            />
            <div className={`absolute text-7xl font-bold bg-gradient-to-r ${categoryConfig.gradient} bg-clip-text text-transparent opacity-80 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]`}>
              {title.charAt(0).toUpperCase()}
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-transparent"></div>
          </div>
        )}
        
        {/* Quick Action Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100" role="toolbar" aria-label="Project quick actions">
          <div className="flex space-x-4">
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-white/95 backdrop-blur-sm text-slate-900 rounded-full hover:bg-white transition-colors duration-200 shadow-[0_8px_16px_rgba(0,0,0,0.4)] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black"
                aria-label={`View live demo of ${title}`}
                tabIndex={0}
              >
                <ExternalLink className="h-5 w-5" />
              </a>
            )}
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-white/95 backdrop-blur-sm text-slate-900 rounded-full hover:bg-white transition-colors duration-200 shadow-[0_8px_16px_rgba(0,0,0,0.4)] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black"
                aria-label={`View source code of ${title}`}
                tabIndex={0}
              >
                <Github className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Project Content */}
      <div className="p-6" role="main">
        {/* Header with Category and Status */}
        <div className="flex items-center justify-between mb-4" role="group" aria-label="Project metadata">
          <span 
            className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryConfig.color} border`}
            role="badge"
            aria-label={`Category: ${category}`}
          >
            {category}
          </span>
          <div 
            className={`flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.color} ${statusConfig.pulse ? 'animate-pulse' : ''}`}
            role="status"
            aria-label={`Project status: ${status}`}
          >
            {statusConfig.icon}
            <span className="ml-1">{status}</span>
          </div>
        </div>

        {/* Project Title */}
        <h3 
          id={`project-title-${project._id}`}
          className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300 mb-3 line-clamp-2 leading-tight focus:outline-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
          tabIndex={0}
        >
          {title}
        </h3>

        {/* Description */}
        <p className="text-blue-200/80 text-sm leading-relaxed mb-4 line-clamp-3 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" role="doc-subtitle">
          {shortDescription}
        </p>

        {/* Technologies */}
        {technologies && technologies.length > 0 && (
          <div className="mb-6" role="group" aria-label="Technologies used">
            <span className="sr-only">Technologies used in this project:</span>
            <div className="flex flex-wrap gap-2">
              {technologies.slice(0, 4).map((tech, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-slate-800/80 to-slate-700/80 text-slate-200 text-xs font-medium rounded-lg border border-slate-600/40 hover:border-slate-500/60 transition-colors duration-200 backdrop-blur-sm shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                  role="badge"
                  aria-label={`Technology: ${tech}`}
                >
                  {tech}
                </span>
              ))}
              {technologies.length > 4 && (
                <span 
                  className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-600/30 to-blue-500/30 text-blue-200 text-xs font-semibold rounded-lg border border-blue-400/40 backdrop-blur-sm shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                  role="badge"
                  aria-label={`${technologies.length - 4} additional technologies`}
                >
                  +{technologies.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="mb-6" role="group" aria-label="Project tags">
            <div className="flex items-center gap-2 text-xs text-blue-300/80">
              <Tag className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
              <span className="sr-only">Tags:</span>
              <span className="truncate font-medium">
                {tags.slice(0, 3).join(' • ')}
                {tags.length > 3 && ' • ...'}
              </span>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="flex items-center justify-between pt-6 border-t border-blue-500/30" role="contentinfo">
          {/* Date */}
          <div className="flex items-center text-sm text-blue-300/80 font-medium" role="group" aria-label="Project date">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" aria-hidden="true" />
            <time dateTime={startDate}>
              {new Date(startDate).toLocaleDateString('en-US', { 
                month: 'short', 
                year: 'numeric' 
              })}
            </time>
          </div>

          {/* Action Links */}
          <nav className="flex items-center gap-3" role="navigation" aria-label="Project links">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 text-blue-300/80 hover:text-white hover:bg-slate-700/60 rounded-xl transition-colors duration-200 shadow-[0_2px_4px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.4)] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                aria-label={`View ${title} source code`}
              >
                <Github className="h-4 w-4" />
              </a>
            )}
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 text-blue-300/80 hover:text-blue-200 hover:bg-blue-500/30 rounded-xl transition-colors duration-200 shadow-[0_2px_4px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_8px_rgba(59,130,246,0.2)] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                aria-label={`View ${title} live demo`}
              >
                <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
          </nav>
        </footer>
      </div>
    </article>
  );
};

export default ProjectCard;