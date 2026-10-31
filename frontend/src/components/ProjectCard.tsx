import React from 'react';
import { ExternalLink, Github, ArrowUpRight, Star } from 'lucide-react';
import { Project } from '../types/project';
import { ProjectCover, StatusBadge, categoryIcon, categoryLabel } from './projectVisuals.tsx';

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
  variant?: 'stacked' | 'horizontal';
}

/* Text shown in the fake address bar, built from the project's real links */
const displayUrl = (live?: string, repo?: string) => {
  try {
    if (live) return new URL(live).host.replace(/^www\./, '');
    if (repo) {
      const u = new URL(repo);
      return u.host + u.pathname.replace(/\.git$/, '');
    }
  } catch {
    /* fall through */
  }
  return 'in development';
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, variant = 'stacked' }) => {
  const {
    title, shortDescription, description, technologies = [], category,
    status, githubUrl, liveUrl, featured, startDate,
  } = project;

  const horizontal = variant === 'horizontal';
  const CategoryIcon = categoryIcon(category);
  const maxTech = horizontal ? 5 : 3;

  const phases = project.timelinePhases ?? [];
  const done = phases.filter((p) => p.completed).length;

  const dateStr = startDate
    ? new Date(startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : '';

  /* Cursor-follow glow: only sets two CSS variables, no re-render */
  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  const chips = (
    <>
      <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#070b16]/80 px-2.5 py-1 text-[11px] font-medium text-slate-200 backdrop-blur-md">
        <CategoryIcon className="h-3 w-3 text-cyan-300" aria-hidden="true" />
        {categoryLabel(category)}
      </span>
      {featured && (
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-cyan-400 to-blue-500 px-2 py-0.5 text-[10px] font-bold text-slate-950 shadow-sm">
          <Star className="h-2.5 w-2.5 fill-current" aria-hidden="true" />
          Featured
        </span>
      )}
    </>
  );

  return (
    <article
      onMouseMove={onMove}
      className={`group relative flex h-full overflow-hidden rounded-2xl border
                  ${featured ? 'border-cyan-500/30' : 'border-white/10'}
                  bg-gradient-to-b from-white/[0.05] via-white/[0.02] to-white/[0.01]
                  transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40
                  hover:shadow-[0_16px_36px_-12px_rgba(6,182,212,0.22)] motion-reduce:transform-none
                  focus-within:border-cyan-300/60 focus-within:ring-2 focus-within:ring-cyan-300/30
                  ${horizontal ? 'flex-col md:flex-row' : 'flex-col'}`}
    >
      {horizontal && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_90%_at_0%_50%,rgba(34,211,238,0.06),transparent)]"
        />
      )}

      {/* ── Visual ── */}
      {horizontal ? (
        <div className="relative flex shrink-0 p-3.5 md:w-[42%] md:p-4">
          <div className="flex w-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[#070b16] shadow-xl shadow-black/40">
            <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-1.5">
              <span className="flex gap-1" aria-hidden="true">
                <i className="h-1.5 w-1.5 rounded-full bg-white/20" />
                <i className="h-1.5 w-1.5 rounded-full bg-white/20" />
                <i className="h-1.5 w-1.5 rounded-full bg-white/20" />
              </span>
              <span className="ml-2 min-w-0 flex-1 truncate rounded bg-white/[0.05] px-2 py-0.5 text-[10px] text-slate-400">
                {displayUrl(liveUrl, githubUrl)}
              </span>
            </div>
            <div className="relative min-h-[9.5rem] flex-1">
              <ProjectCover project={project} className="absolute inset-0" imgClassName="transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none" />
              {chips}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative h-40 shrink-0 overflow-hidden">
          <ProjectCover project={project} className="absolute inset-0" imgClassName="transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none" />
          {chips}
        </div>
      )}

      {/* ── Body ── */}
      <div className={`relative flex flex-1 flex-col gap-3 p-4 sm:p-5 ${horizontal ? 'md:justify-center md:py-5 md:pl-2 md:pr-6' : ''}`}>
        <div className="flex items-center justify-between gap-2">
          <StatusBadge status={status} />
          {dateStr && (
            <time dateTime={startDate} className="text-[11px] tabular-nums text-slate-400">
              {dateStr}
            </time>
          )}
        </div>

        <div className="space-y-1">
          <h3 className={`font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors line-clamp-1 ${horizontal ? 'text-lg md:text-xl' : 'text-base'}`}>
            {/* Stretched button: the whole card is the click target; links below sit above it */}
            <button
              type="button"
              onClick={onClick}
              className="text-left after:absolute after:inset-0 after:z-[1] after:content-[''] focus:outline-none"
            >
              {title}
            </button>
          </h3>
          <p className="text-xs leading-relaxed text-slate-400 line-clamp-2 min-h-[2.25rem]">
            {shortDescription || description}
          </p>
        </div>

        {phases.length > 0 && (
          <div className="pt-0.5">
            <div className="mb-1 flex items-center justify-between text-[11px] text-slate-400">
              <span className="text-[10px]">Roadmap progress</span>
              <span className="tabular-nums font-mono text-[10px] text-cyan-300">{done}/{phases.length} phases</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-blue-500 transition-all duration-500"
                style={{ width: `${(done / phases.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {technologies.length > 0 && (
          <ul className="flex flex-wrap gap-1 pt-0.5" aria-label="Technologies">
            {technologies.slice(0, maxTech).map((t) => (
              <li key={t} className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[11px] text-slate-300">
                <span className="h-1 w-1 rounded-full bg-cyan-300/80" aria-hidden="true" />
                {t}
              </li>
            ))}
            {technologies.length > maxTech && (
              <li className="px-1.5 py-0.5 text-[10px] text-slate-500">+{technologies.length - maxTech}</li>
            )}
          </ul>
        )}

        {/* ── Footer ── */}
        <div className="mt-auto flex items-center justify-between border-t border-white/[0.08] pt-3 text-xs">
          <div className="flex items-center gap-3">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Source code for ${title}`}
                className="relative z-10 inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
              >
                <Github className="h-3.5 w-3.5" aria-hidden="true" /> Code
              </a>
            )}
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Live demo of ${title}`}
                className="relative z-10 inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /> Live
              </a>
            )}
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-300 transition-all group-hover:gap-1.5">
            View details <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </div>
      </div>

      {/* Cursor-follow glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: 'radial-gradient(350px circle at var(--mx, 50%) var(--my, 50%), rgba(103,232,249,0.08), transparent 60%)' }}
      />
    </article>
  );
};

export default ProjectCard;
