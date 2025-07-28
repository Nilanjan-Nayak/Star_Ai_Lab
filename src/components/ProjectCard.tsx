import React from 'react';
import { ExternalLink, Github, Calendar, Tag, Star, ArrowUpRight, Clock, CheckCircle } from 'lucide-react';

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
    featured,
    startDate,
    tags
  } = project;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Completed':
        return {
          color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          icon: <CheckCircle className="h-3 w-3" />,
          pulse: false
        };
      case 'In Progress':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: <Clock className="h-3 w-3" />,
          pulse: true
        };
      case 'On Hold':
        return {
          color: 'bg-amber-100 text-amber-800 border-amber-200',
          icon: <Clock className="h-3 w-3" />,
          pulse: false
        };
      case 'Planning':
        return {
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          icon: <Clock className="h-3 w-3" />,
          pulse: false
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <Clock className="h-3 w-3" />,
          pulse: false
        };
    }
  };

  const getCategoryConfig = (category: string) => {
    switch (category) {
      case 'AI/ML':
        return { color: 'bg-indigo-100 text-indigo-800', gradient: 'from-indigo-500 to-purple-600' };
      case 'Web Development':
        return { color: 'bg-blue-100 text-blue-800', gradient: 'from-blue-500 to-cyan-600' };
      case 'Mobile App':
        return { color: 'bg-green-100 text-green-800', gradient: 'from-green-500 to-emerald-600' };
      case 'Data Science':
        return { color: 'bg-purple-100 text-purple-800', gradient: 'from-purple-500 to-pink-600' };
      case 'IoT':
        return { color: 'bg-orange-100 text-orange-800', gradient: 'from-orange-500 to-red-600' };
      case 'Blockchain':
        return { color: 'bg-yellow-100 text-yellow-800', gradient: 'from-yellow-500 to-orange-600' };
      default:
        return { color: 'bg-gray-100 text-gray-800', gradient: 'from-gray-500 to-gray-600' };
    }
  };

  const statusConfig = getStatusConfig(status);
  const categoryConfig = getCategoryConfig(category);

  return (
    <article 
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2 hover:scale-[1.02]"
      role="article"
      aria-labelledby={`project-title-${project._id}`}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-4 right-4 z-20">
          <div className="flex items-center px-3 py-1.5 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-yellow-900 text-xs font-bold rounded-full shadow-lg animate-pulse">
            <Star className="h-3 w-3 mr-1 fill-current" />
            Featured
          </div>
        </div>
      )}

      {/* Project Image with Overlay */}
      <div className="relative h-56 bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 overflow-hidden">
        {imageUrl ? (
          <>
            <img
              src={imageUrl.startsWith('http') ? imageUrl : `http://localhost:5000${imageUrl}`}
              alt={`${title} project screenshot`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent group-hover:from-black/40 transition-all duration-500"></div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center relative">
            <div className={`text-6xl font-bold bg-gradient-to-r ${categoryConfig.gradient} bg-clip-text text-transparent opacity-60`}>
              {title.charAt(0).toUpperCase()}
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          </div>
        )}
        
        {/* Quick Action Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-3">
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/90 backdrop-blur-sm text-gray-900 rounded-full hover:bg-white transition-all duration-200 transform hover:scale-110 shadow-lg"
                aria-label={`View live demo of ${title}`}
              >
                <ExternalLink className="h-5 w-5" />
              </a>
            )}
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/90 backdrop-blur-sm text-gray-900 rounded-full hover:bg-white transition-all duration-200 transform hover:scale-110 shadow-lg"
                aria-label={`View source code of ${title}`}
              >
                <Github className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Project Content */}
      <div className="p-6">
        {/* Header with Category and Status */}
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryConfig.color} border`}>
            {category}
          </span>
          <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.color} ${statusConfig.pulse ? 'animate-pulse' : ''}`}>
            {statusConfig.icon}
            <span className="ml-1">{status}</span>
          </div>
        </div>

        {/* Project Title */}
        <h3 
          id={`project-title-${project._id}`}
          className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-3 line-clamp-2 leading-tight"
        >
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {shortDescription}
        </p>

        {/* Technologies */}
        {technologies && technologies.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1.5">
              {technologies.slice(0, 4).map((tech, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-1 bg-gray-50 text-gray-700 text-xs rounded-md border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
                >
                  {tech}
                </span>
              ))}
              {technologies.length > 4 && (
                <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-md border border-blue-200 font-medium">
                  +{technologies.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Tag className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">
                {tags.slice(0, 3).join(' • ')}
                {tags.length > 3 && ' • ...'}
              </span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {/* Date */}
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1.5 flex-shrink-0" />
            <time dateTime={startDate}>
              {new Date(startDate).toLocaleDateString('en-US', { 
                month: 'short', 
                year: 'numeric' 
              })}
            </time>
          </div>

          {/* Action Links */}
          <div className="flex items-center gap-2">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 group/link"
                aria-label={`View ${title} source code`}
              >
                <Github className="h-4 w-4 group-hover/link:scale-110 transition-transform duration-200" />
              </a>
            )}
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group/link"
                aria-label={`View ${title} live demo`}
              >
                <ArrowUpRight className="h-4 w-4 group-hover/link:scale-110 transition-transform duration-200" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/0 via-blue-500/0 to-purple-500/0 group-hover:from-blue-400/5 group-hover:via-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500 pointer-events-none"></div>
    </article>
  );
};

export default ProjectCard;