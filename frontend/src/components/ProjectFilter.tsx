import React from 'react';
import { Filter, Sparkles } from 'lucide-react';

interface Project {
  category: string;
  featured: boolean;
}

interface ProjectFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  projects: Project[];
}

const ProjectFilter: React.FC<ProjectFilterProps> = ({
  selectedCategory,
  onCategoryChange,
  projects
}) => {
  // Get unique categories from projects with counts
  const categoryStats = projects.reduce((acc, project) => {
    const category = project.category;
    if (!acc[category]) {
      acc[category] = { total: 0, featured: 0 };
    }
    acc[category].total++;
    if (project.featured) {
      acc[category].featured++;
    }
    return acc;
  }, {} as Record<string, { total: number; featured: number }>);

  const categories = ['All', ...Object.keys(categoryStats).sort()];

  const getCategoryCount = (category: string) => {
    if (category === 'All') {
      return {
        total: projects.length,
        featured: projects.filter(p => p.featured).length
      };
    }
    return categoryStats[category] || { total: 0, featured: 0 };
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AI/ML':
        return '🤖';
      case 'Web Development':
        return '🌐';
      case 'Mobile App':
        return '📱';
      case 'Data Science':
        return '📊';
      case 'IoT':
        return '🔗';
      case 'Blockchain':
        return '⛓️';
      case 'All':
        return '🚀';
      default:
        return '💡';
    }
  };

  const getCategoryGradient = (category: string, isActive: boolean) => {
    if (!isActive) return '';
    
    switch (category) {
      case 'AI/ML':
        return 'from-indigo-600 to-purple-700';
      case 'Web Development':
        return 'from-blue-600 to-cyan-700';
      case 'Mobile App':
        return 'from-green-600 to-emerald-700';
      case 'Data Science':
        return 'from-purple-600 to-pink-700';
      case 'IoT':
        return 'from-orange-600 to-red-700';
      case 'Blockchain':
        return 'from-yellow-600 to-orange-700';
      case 'All':
        return 'from-blue-600 to-blue-700';
      default:
        return 'from-gray-600 to-gray-700';
    }
  };

  if (projects.length === 0) {
    return null;
  }

  return (
    <div className="mb-16" role="region" aria-label="Project category filter">
      {/* Filter Header */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center text-blue-300 bg-gradient-to-r from-black/90 via-slate-900/80 to-black/90 px-6 py-3 rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.6),0_4px_8px_rgba(59,130,246,0.2)] border border-blue-500/40 backdrop-blur-lg">
          <Filter className="h-5 w-5 mr-2 text-cyan-400" />
          <span className="font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Filter by Category</span>
        </div>
      </div>
      
      {/* Category Buttons */}
      <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
        {categories.map((category) => {
          const { total, featured } = getCategoryCount(category);
          const isActive = selectedCategory === category;
          const gradient = getCategoryGradient(category, isActive);
          
          return (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`
                group relative inline-flex items-center px-6 py-4 rounded-2xl text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 backdrop-blur-xl
                ${isActive
                  ? `bg-gradient-to-r ${gradient} text-white shadow-[0_16px_32px_rgba(0,0,0,0.6),0_8px_16px_rgba(59,130,246,0.4),0_4px_8px_rgba(6,182,212,0.3)] border-2 border-white/20`
                  : 'bg-gradient-to-br from-slate-900/80 via-blue-950/60 to-slate-800/80 text-blue-200 border-2 border-blue-500/30 hover:border-blue-400/50 hover:text-white shadow-[0_8px_16px_rgba(0,0,0,0.6),0_4px_8px_rgba(30,58,138,0.2)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.7),0_6px_12px_rgba(59,130,246,0.3)]'
                }
              `}
              aria-pressed={isActive}
              aria-label={`Filter projects by ${category}. ${total} projects available${featured > 0 ? `, ${featured} featured` : ''}`}
            >
              {/* Category Icon */}
              <span className="text-xl mr-3" role="img" aria-hidden="true">
                {getCategoryIcon(category)}
              </span>
              
              {/* Category Name */}
              <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-medium">{category}</span>
              
              {/* Count Badge */}
              <span className={`
                ml-4 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 backdrop-blur-sm shadow-[0_2px_4px_rgba(0,0,0,0.3)]
                ${isActive
                  ? 'bg-white/25 text-white border border-white/30'
                  : 'bg-slate-800/60 text-slate-200 border border-slate-600/40 group-hover:bg-blue-600/30 group-hover:text-blue-100 group-hover:border-blue-400/50'
                }
              `}>
                {total}
              </span>
              
              {/* Featured Indicator */}
              {featured > 0 && (
                <div className={`
                  ml-2 flex items-center px-2 py-1 rounded-lg backdrop-blur-sm
                  ${isActive 
                    ? 'text-yellow-200 bg-yellow-400/20 border border-yellow-300/30' 
                    : 'text-yellow-400 bg-yellow-500/10 border border-yellow-400/20'
                  }
                `}>
                  <Sparkles className="h-3 w-3" />
                  <span className="text-xs font-semibold ml-1">{featured}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Filter Summary */}
      {selectedCategory !== 'All' && (
        <div className="text-center mt-6">
          <p className="text-sm text-blue-200/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
            Showing <span className="font-semibold text-blue-300">{getCategoryCount(selectedCategory).total}</span> projects in{' '}
            <span className="font-semibold text-white">{selectedCategory}</span>
            {getCategoryCount(selectedCategory).featured > 0 && (
              <span className="text-yellow-400">
                {' '}• {getCategoryCount(selectedCategory).featured} featured
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectFilter;