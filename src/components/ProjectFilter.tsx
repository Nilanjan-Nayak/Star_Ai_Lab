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
        <div className="flex items-center text-gray-700 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
          <Filter className="h-5 w-5 mr-2 text-blue-600" />
          <span className="font-semibold">Filter by Category</span>
        </div>
      </div>
      
      {/* Category Buttons */}
      <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
        {categories.map((category) => {
          const { total, featured } = getCategoryCount(category);
          const isActive = selectedCategory === category;
          const gradient = getCategoryGradient(category, isActive);
          
          return (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`
                group relative inline-flex items-center px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                ${isActive
                  ? `bg-gradient-to-r ${gradient} text-white shadow-lg shadow-blue-500/25`
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 shadow-sm hover:shadow-md'
                }
              `}
              aria-pressed={isActive}
              aria-label={`Filter projects by ${category}. ${total} projects available${featured > 0 ? `, ${featured} featured` : ''}`}
            >
              {/* Category Icon */}
              <span className="text-lg mr-2" role="img" aria-hidden="true">
                {getCategoryIcon(category)}
              </span>
              
              {/* Category Name */}
              <span>{category}</span>
              
              {/* Count Badge */}
              <span className={`
                ml-3 px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-300
                ${isActive
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-700'
                }
              `}>
                {total}
              </span>
              
              {/* Featured Indicator */}
              {featured > 0 && (
                <div className={`
                  ml-1 flex items-center
                  ${isActive ? 'text-yellow-200' : 'text-yellow-500'}
                `}>
                  <Sparkles className="h-3 w-3" />
                  <span className="text-xs font-medium ml-0.5">{featured}</span>
                </div>
              )}
              
              {/* Hover Glow Effect */}
              {!isActive && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/0 to-purple-400/0 group-hover:from-blue-400/10 group-hover:to-purple-400/10 transition-all duration-300 pointer-events-none"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Filter Summary */}
      {selectedCategory !== 'All' && (
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-blue-600">{getCategoryCount(selectedCategory).total}</span> projects in{' '}
            <span className="font-semibold">{selectedCategory}</span>
            {getCategoryCount(selectedCategory).featured > 0 && (
              <span className="text-yellow-600">
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