import React from 'react';
import { LayoutGrid } from 'lucide-react';
import { categoryIcon, categoryLabel } from './projectVisuals.tsx';

interface FilterProject {
  category: string;
  featured?: boolean;
}

interface ProjectFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  projects: FilterProject[];
}

const ProjectFilter: React.FC<ProjectFilterProps> = ({ selectedCategory, onCategoryChange, projects }) => {
  if (projects.length === 0) return null;

  const counts = projects.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categories = ['All', ...Object.keys(counts).sort()];

  return (
    <div role="group" aria-label="Filter projects by category" className="flex flex-wrap items-center gap-2">
      {categories.map((cat) => {
        const active = selectedCategory === cat;
        const Icon = cat === 'All' ? LayoutGrid : categoryIcon(cat);
        const total = cat === 'All' ? projects.length : counts[cat];

        return (
          <button
            key={cat}
            type="button"
            onClick={() => onCategoryChange(cat)}
            aria-pressed={active}
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60
                        ${active
                ? 'border-cyan-300/40 bg-cyan-300/10 text-cyan-200'
                : 'border-white/10 text-slate-400 hover:border-white/25 hover:text-white'}`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {cat === 'All' ? 'All' : categoryLabel(cat)}
            <span className={`text-xs tabular-nums ${active ? 'text-cyan-200/80' : 'text-slate-500'}`}>{total}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ProjectFilter;