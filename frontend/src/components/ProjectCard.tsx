import React from 'react';
import { ExternalLink, Github, ArrowUpRight, Star, User, Users, CheckCircle2 } from 'lucide-react';
import { Project } from '../types/project';
import { ProjectCover, categoryIcon, categoryLabel, isSoloProject } from './projectVisuals';

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
  /** 'horizontal' = spotlight / odd last card (full width, browser-window frame). */
  variant?: 'stacked' | 'horizontal';
}

/* Text shown in the fake address bar, built from the project's real links */
const displayUrl = (live?: string, repo?: string, title?: string) => {
  try {
    if (live) return new URL(live).host.replace(/^www\./, '');
    if (repo) {
      const u = new URL(repo);
      return u.host + u.pathname.replace(/\.git$/, '');
    }
  } catch {
    /* fall through */
  }
  return title ? `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.app` : 'star-ai-lab.dev';
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, variant = 'stacked' }) => {
  const {
    title, shortDescription, description, technologies = [], category,
    status, githubUrl, liveUrl, featured, startDate, teamMembers = []
  } = project;

  const horizontal = variant === 'horizontal';
  const CategoryIcon = categoryIcon(category);
  const maxTech = horizontal ? 7 : 4;

  const phases = project.timelinePhases ?? [];
  const completedPhases = phases.filter((p) => p.completed).length;
  const progressPercent = phases.length > 0 ? Math.round((completedPhases / phases.length) * 100) : 0;

  const dateStr = startDate
    ? new Date(startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : '';

  const solo = isSoloProject(project);

  /* Cursor-follow glow: only sets two CSS variables, no re-render */
  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <article
      onMouseMove={onMove}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={`group relative flex h-full cursor-pointer overflow-hidden rounded-2xl
                  border border-white/10 bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950/90
                  shadow-[0_4px_20px_rgba(0,0,0,0.35)] backdrop-blur-md
                  transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-400/40
                  hover:shadow-[0_20px_45px_-12px_rgba(6,182,212,0.28)] motion-reduce:transform-none
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60
                  ${horizontal ? 'flex-col lg:flex-row' : 'flex-col'}`}
    >
      {/* Top Hairline Shimmer on Hover */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-20 pointer-events-none" />

      {/* ── Visual Frame ── */}
      {horizontal ? (
        <div className="relative flex shrink-0 p-4 sm:p-5 lg:w-[48%] lg:p-6 z-10">
          <div className="flex w-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[#070b16] shadow-2xl shadow-black/60">
            {/* Window bar */}
            <div className="flex items-center justify-between border-b border-white/10 bg-slate-950/70 px-3.5 py-2.5 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="flex gap-1.5" aria-hidden="true">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/70 inline-block" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70 inline-block" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70 inline-block" />
                </span>
                <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-slate-400 bg-white/[0.04] px-2.5 py-0.5 rounded border border-white/5">
                  {displayUrl(liveUrl, githubUrl, title)}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                Featured Spotlight
              </span>
            </div>

            {/* Cover Art */}
            <div className="relative min-h-[13rem] sm:min-h-[16rem] flex-1 overflow-hidden">
              <ProjectCover
                project={project}
                className="absolute inset-0"
                imgClassName="transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />

              {/* Badges Overlay */}
              <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-10">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-slate-950/80 px-2.5 py-1 text-xs font-medium text-slate-200 backdrop-blur-md shadow-lg">
                  <CategoryIcon className="h-3.5 w-3.5 text-cyan-300" aria-hidden="true" />
                  {categoryLabel(category)}
                </span>

                {featured && (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-500 px-2.5 py-1 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20">
                    <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                    Featured
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative h-48 sm:h-52 shrink-0 overflow-hidden border-b border-white/[0.06] z-10">
          {/* Subtle window header strip */}
          <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-3.5 py-2 bg-gradient-to-b from-slate-950/80 to-transparent">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="h-2 w-2 rounded-full bg-red-400/60 inline-block" />
              <span className="h-2 w-2 rounded-full bg-amber-400/60 inline-block" />
              <span className="h-2 w-2 rounded-full bg-emerald-400/60 inline-block" />
            </span>
            <span className="text-[10px] font-mono text-white/40 tracking-wider truncate max-w-[150px]">
              {displayUrl(liveUrl, githubUrl, title)}
            </span>
          </div>

          <ProjectCover
            project={project}
            className="absolute inset-0"
            imgClassName="transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none" />

          {/* Badges */}
          <div className="absolute bottom-3 inset-x-3.5 flex items-center justify-between pointer-events-none z-10">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-slate-950/85 px-2.5 py-1 text-xs font-medium text-slate-200 backdrop-blur-md shadow-md">
              <CategoryIcon className="h-3.5 w-3.5 text-cyan-300" aria-hidden="true" />
              {categoryLabel(category)}
            </span>

            {featured && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-amber-400/90 border border-amber-300/40 px-2 py-0.5 text-[11px] font-bold text-slate-950 shadow-md">
                <Star className="h-3 w-3 fill-current" aria-hidden="true" />
                Featured
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── Content Body ── */}
      <div className={`relative flex flex-1 flex-col justify-between p-5 sm:p-6 z-10 ${horizontal ? 'lg:py-8 lg:pr-8' : ''}`}>
        <div className="space-y-4">
          {/* Top Status & Team Meta Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            {/* Status Pill */}
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-medium text-[11px] border ${
              status === 'Completed'
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25'
                : status === 'In Progress'
                  ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/25'
                  : 'bg-slate-500/10 text-slate-300 border-slate-500/25'
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${
                status === 'Completed' ? 'bg-emerald-400' :
                status === 'In Progress' ? 'bg-cyan-400 animate-pulse' : 'bg-slate-400'
              }`} />
              {status}
            </span>

            {/* Team / Solo & Date Pill */}
            <div className="flex items-center gap-2 text-slate-400">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/5 text-[11px] text-slate-300">
                {solo ? (
                  <>
                    <User className="h-3 w-3 text-cyan-400" />
                    Solo
                  </>
                ) : (
                  <>
                    <Users className="h-3 w-3 text-purple-400" />
                    {teamMembers.length > 0 ? `${teamMembers.length} Devs` : 'Team'}
                  </>
                )}
              </span>

              {dateStr && (
                <time dateTime={startDate} className="text-[11px] tabular-nums text-slate-500 font-mono">
                  {dateStr}
                </time>
              )}
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-2">
            <h3 className={`font-bold tracking-tight text-white transition-colors duration-200 group-hover:text-cyan-300 flex items-center justify-between gap-2 ${
              horizontal ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'
            }`}>
              <span className="line-clamp-1">{title}</span>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-white/30 transition-all duration-300 group-hover:text-cyan-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </h3>

            <p className={`text-sm leading-relaxed text-slate-300/90 font-normal ${
              horizontal ? 'line-clamp-3 sm:line-clamp-4 text-slate-300' : 'line-clamp-2 sm:line-clamp-3'
            }`}>
              {shortDescription || description}
            </p>
          </div>

          {/* Roadmap Milestones Progress */}
          {phases.length > 0 && (
            <div className="rounded-xl bg-white/[0.02] border border-white/5 p-2.5">
              <div className="mb-1.5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-cyan-400" />
                  Milestones
                </span>
                <span className="text-cyan-300 font-semibold">{completedPhases}/{phases.length} ({progressPercent}%)</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 transition-all duration-500"
                  style={{ width: `${Math.max(5, progressPercent)}%` }}
                />
              </div>
            </div>
          )}

          {/* Tech Stack Chips */}
          {technologies.length > 0 && (
            <ul className="flex flex-wrap gap-1.5 pt-1" aria-label="Technologies">
              {technologies.slice(0, maxTech).map((t) => (
                <li
                  key={t}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-slate-300 transition-colors group-hover:border-cyan-500/20 group-hover:bg-cyan-500/[0.05]"
                >
                  <span className="h-1 w-1 rounded-full bg-cyan-400" aria-hidden="true" />
                  {t}
                </li>
              ))}
              {technologies.length > maxTech && (
                <li className="inline-flex items-center rounded-lg border border-white/5 bg-white/[0.02] px-2 py-1 text-xs text-slate-500 font-mono">
                  +{technologies.length - maxTech} more
                </li>
              )}
            </ul>
          )}
        </div>

        {/* ── Card Footer ── */}
        <div className="mt-5 flex items-center justify-between border-t border-white/[0.08] pt-4">
          <div className="flex items-center gap-2">
            {githubUrl ? (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLinkClick}
                aria-label={`Source code for ${title}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:bg-white/10 hover:text-white hover:border-white/20"
              >
                <Github className="h-3.5 w-3.5 text-slate-400" /> Code
              </a>
            ) : null}

            {liveUrl ? (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLinkClick}
                aria-label={`Live demo of ${title}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 transition-all hover:bg-cyan-500/20 hover:text-cyan-200 hover:border-cyan-500/50"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Demo
              </a>
            ) : null}
          </div>

          <span className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-300 transition-all group-hover:gap-1.5 group-hover:text-cyan-200">
            View Details
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>

      {/* Subtle Radial Cursor Glow on Hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-0"
        style={{
          background: 'radial-gradient(500px circle at var(--mx, 50%) var(--my, 50%), rgba(34,211,238,0.12), transparent 60%)'
        }}
      />
    </article>
  );
};

export default ProjectCard;
