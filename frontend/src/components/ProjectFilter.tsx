import React from 'react';
import { Star } from 'lucide-react';

interface Project {
  category: string;
  featured: boolean;
}

interface ProjectFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  projects: Project[];
}

/* Per-category colour tokens */
const CATEGORY_TOKENS: Record<string, { text: string; activeBg: string; activeBorder: string; dot: string }> = {
  All:              { text: 'text-white',       activeBg: 'bg-white/15',           activeBorder: 'border-white/30',         dot: 'bg-white' },
  'AI/ML':          { text: 'text-violet-300',  activeBg: 'bg-violet-500/20',      activeBorder: 'border-violet-400/50',    dot: 'bg-violet-400' },
  'Web Development':{ text: 'text-cyan-300',    activeBg: 'bg-cyan-500/20',        activeBorder: 'border-cyan-400/50',      dot: 'bg-cyan-400' },
  'Mobile App':     { text: 'text-emerald-300', activeBg: 'bg-emerald-500/20',     activeBorder: 'border-emerald-400/50',   dot: 'bg-emerald-400' },
  'Data Science':   { text: 'text-pink-300',    activeBg: 'bg-pink-500/20',        activeBorder: 'border-pink-400/50',      dot: 'bg-pink-400' },
  IoT:              { text: 'text-orange-300',  activeBg: 'bg-orange-500/20',      activeBorder: 'border-orange-400/50',    dot: 'bg-orange-400' },
  Blockchain:       { text: 'text-yellow-300',  activeBg: 'bg-yellow-500/20',      activeBorder: 'border-yellow-400/50',    dot: 'bg-yellow-400' },
  storage:          { text: 'text-blue-300',    activeBg: 'bg-blue-500/20',        activeBorder: 'border-blue-400/50',      dot: 'bg-blue-400' },
};

const CATEGORY_EMOJI: Record<string, string> = {
  All: '✦', 'AI/ML': '🤖', 'Web Development': '🌐', 'Mobile App': '📱',
  'Data Science': '📊', IoT: '🔗', Blockchain: '⛓️', storage: '💾',
};

const ProjectFilter: React.FC<ProjectFilterProps> = ({ selectedCategory, onCategoryChange, projects }) => {
  if (projects.length === 0) return null;

  /* Count per category */
  const counts = projects.reduce((acc, p) => {
    acc['All'] = (acc['All'] || 0) + 1;
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const featuredCounts = projects.reduce((acc, p) => {
    if (p.featured) {
      acc['All'] = (acc['All'] || 0) + 1;
      acc[p.category] = (acc[p.category] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const categories = ['All', ...Object.keys(counts).filter((c) => c !== 'All').sort()];

  return (
    <div className="mb-10" role="region" aria-label="Project category filter">
      {/* Pill row */}
      <div className="flex flex-wrap justify-center gap-2.5">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          const tokens = CATEGORY_TOKENS[cat] ?? CATEGORY_TOKENS['All'];
          const total = counts[cat] ?? 0;
          const feat = featuredCounts[cat] ?? 0;

          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              aria-pressed={isActive}
              aria-label={`Filter by ${cat} — ${total} project${total !== 1 ? 's' : ''}`}
              className={[
                'relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold',
                'transition-all duration-250 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black',
                'backdrop-blur-sm border',
                isActive
                  ? `${tokens.activeBg} ${tokens.activeBorder} ${tokens.text} shadow-[0_2px_16px_rgba(0,0,0,0.3)]`
                  : 'bg-white/[0.04] border-white/[0.07] text-white/45 hover:bg-white/[0.08] hover:text-white/70 hover:border-white/15',
              ].join(' ')}
            >
              {/* Active dot */}
              {isActive && (
                <span className={`w-1.5 h-1.5 rounded-full ${tokens.dot} shadow-[0_0_6px_currentColor] flex-shrink-0`} />
              )}

              {/* Emoji */}
              <span className="text-base leading-none" aria-hidden="true">
                {CATEGORY_EMOJI[cat] ?? '💡'}
              </span>

              {/* Label */}
              <span>{cat}</span>

              {/* Count badge */}
              <span
                className={[
                  'ml-0.5 px-2 py-0.5 rounded-md text-[11px] font-bold tabular-nums',
                  isActive
                    ? 'bg-white/15 text-white/90'
                    : 'bg-white/[0.06] text-white/30',
                ].join(' ')}
              >
                {total}
              </span>

              {/* Featured star */}
              {feat > 0 && (
                <span className="flex items-center gap-0.5 text-amber-400 text-[11px] font-bold">
                  <Star className="h-3 w-3 fill-amber-400" />{feat}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Result summary */}
      {selectedCategory !== 'All' && (
        <p className="text-center text-[13px] text-white/35 mt-5">
          Showing{' '}
          <span className="text-white/60 font-semibold">{counts[selectedCategory] ?? 0}</span>{' '}
          project{(counts[selectedCategory] ?? 0) !== 1 ? 's' : ''} in{' '}
          <span className={`font-semibold ${CATEGORY_TOKENS[selectedCategory]?.text ?? 'text-white'}`}>
            {selectedCategory}
          </span>
          {(featuredCounts[selectedCategory] ?? 0) > 0 && (
            <span className="text-amber-400"> · {featuredCounts[selectedCategory]} featured</span>
          )}
        </p>
      )}
    </div>
  );
};

export default ProjectFilter;