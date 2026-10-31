import React, { useEffect, useRef, useState } from 'react';
import { X, ExternalLink, Github, Share2, Check, ArrowUpRight } from 'lucide-react';
import { Project } from '../types/project';
import { ProjectCover, StatusBadge, categoryIcon, categoryLabel, isSoloProject } from './projectVisuals.tsx';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

type TabId = 'overview' | 'stack' | 'roadmap' | 'team';

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-3 px-4 py-3">
    <dt className="text-slate-400">{label}</dt>
    <dd className="text-right font-medium text-slate-100">{children}</dd>
  </div>
);

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  const [tab, setTab] = useState<TabId>('overview');
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose; // keeps the latest handler without re-running the effects below

  const projectId = project?._id;

  useEffect(() => {
    setTab('overview');
    setCopied(false);
  }, [projectId]);

  useEffect(() => {
    if (!projectId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeRef.current();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('project-modal-open');
    window.dispatchEvent(new CustomEvent('star-project-modal', { detail: { open: true } }));
    dialogRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      document.body.classList.remove('project-modal-open');
      window.dispatchEvent(new CustomEvent('star-project-modal', { detail: { open: false } }));
    };
  }, [projectId]);

  if (!project) return null;

  const CategoryIcon = categoryIcon(project.category);
  const solo = isSoloProject(project);
  const startDateStr = project.startDate
    ? new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : '—';

  const tools = project.toolsUsed?.length ? project.toolsUsed : project.technologies ?? [];
  const future = project.futureScope ?? [];
  const phases = project.timelinePhases ?? [];
  const team = project.teamMembers?.length
    ? project.teamMembers
    : [{ name: 'Nilanjan Nayak', role: 'Creator & Developer', contribution: '' }];

  const done = phases.filter((p) => p.completed).length;
  const firstPending = phases.findIndex((p) => !p.completed);
  const progress = phases.length ? Math.round((done / phases.length) * 100) : null;

  const tabs: { id: TabId; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    ...(tools.length ? [{ id: 'stack' as TabId, label: 'Tech stack' }] : []),
    ...(future.length ? [{ id: 'roadmap' as TabId, label: 'Roadmap' }] : []),
    { id: 'team', label: 'Team' },
  ];

  const handleShare = () => {
    const url = window.location.href.split('#')[0] + `#project-${project._id}`;
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const iconBtn =
    'inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-white/[0.09] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60';

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-dialog-title"
    >
      <div className="absolute inset-0 bg-[#03050d]/85 backdrop-blur-md" onClick={onClose} aria-hidden="true" />

      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a0f1c] shadow-2xl shadow-black/60 outline-none animate-in fade-in zoom-in-95 duration-200 motion-reduce:animate-none"
      >
        {/* ── Header ── */}
        <header className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-7">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <CategoryIcon className="h-3.5 w-3.5 text-cyan-300" aria-hidden="true" />
              {categoryLabel(project.category)}
            </p>
            <h2 id="project-dialog-title" className="truncate text-xl font-semibold tracking-tight text-white sm:text-2xl">
              {project.title}
            </h2>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button type="button" onClick={handleShare} className={iconBtn} title="Copy link to this project">
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
              <span className="hidden sm:inline">{copied ? 'Link copied' : 'Share'}</span>
            </button>
            <button type="button" onClick={onClose} className={iconBtn} aria-label="Close project details">
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="relative">
            <ProjectCover project={project} animated className="relative h-48 w-full sm:h-64" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0a0f1c] to-transparent" />
          </div>

          <div className="grid gap-8 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_17rem]">
            {/* Facts + links (first on mobile, right column on desktop) */}
            <aside className="order-1 space-y-5 lg:sticky lg:top-0 lg:order-2 lg:self-start">
              <dl className="divide-y divide-white/10 rounded-xl border border-white/10 bg-white/[0.03] text-sm">
                <Row label="Status"><StatusBadge status={project.status} /></Row>
                <Row label="Started">{startDateStr}</Row>
                <Row label="Format">{project.projectType || (solo ? 'Solo project' : 'Team project')}</Row>
                {tools.length > 0 && <Row label="Stack">{tools.length} tools</Row>}
              </dl>

              {progress !== null && (
                <div>
                  <div className="mb-1.5 flex items-center justify-between text-xs text-slate-400">
                    <span>Roadmap progress</span>
                    <span className="tabular-nums">{done} of {phases.length} phases</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-cyan-300 transition-all duration-700" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}

              {(project.liveUrl || project.githubUrl) && (
                <div className="flex flex-col gap-2">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0f1c]"
                    >
                      Live demo <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-white/[0.06] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60"
                    >
                      <Github className="h-4 w-4" aria-hidden="true" /> Source code
                    </a>
                  )}
                </div>
              )}
            </aside>

            {/* Tabs + content */}
            <section className="order-2 min-w-0 lg:order-1">
              <div role="tablist" aria-label="Project sections" className="flex gap-6 overflow-x-auto border-b border-white/10">
                {tabs.map((t) => {
                  const active = tab === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      role="tab"
                      id={`tab-${t.id}`}
                      aria-selected={active}
                      aria-controls="project-panel"
                      onClick={() => setTab(t.id)}
                      className={`-mb-px whitespace-nowrap border-b-2 pb-3 text-sm font-medium transition-colors focus:outline-none focus-visible:text-white ${active ? 'border-cyan-300 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>

              <div id="project-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="pt-6">
                {/* Overview */}
                {tab === 'overview' && (
                  <div className="space-y-8">
                    <div className="max-w-prose space-y-6">
                      <div>
                        <h3 className="mb-2 text-sm font-semibold text-white">About</h3>
                        <p className="text-sm leading-relaxed text-slate-300">{project.description || project.shortDescription}</p>
                      </div>
                      {project.howCompleted && (
                        <div>
                          <h3 className="mb-2 text-sm font-semibold text-white">How it was built</h3>
                          <p className="text-sm leading-relaxed text-slate-300">{project.howCompleted}</p>
                        </div>
                      )}
                    </div>

                    {phases.length > 0 && (
                      <div>
                        <h3 className="mb-4 text-sm font-semibold text-white">Timeline</h3>
                        <ol className="relative space-y-6 border-l border-white/10 pl-6">
                          {phases.map((p, i) => {
                            const state = p.completed ? 'done' : i === firstPending ? 'active' : 'planned';
                            return (
                              <li key={i} className="relative">
                                <span
                                  className={`absolute -left-[32px] top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full ${state === 'done'
                                      ? 'bg-cyan-300 text-slate-950'
                                      : state === 'active'
                                        ? 'border-2 border-cyan-300 bg-[#0a0f1c]'
                                        : 'border border-white/25 bg-[#0a0f1c]'
                                    }`}
                                  aria-hidden="true"
                                >
                                  {state === 'done' && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                                </span>
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <span className="text-xs text-slate-400">{p.phase}</span>
                                  <span className={`text-xs ${state === 'active' ? 'text-cyan-300' : 'text-slate-500'}`}>
                                    {state === 'done' ? 'Done' : state === 'active' ? 'In progress' : 'Planned'}
                                  </span>
                                </div>
                                <h4 className="mt-0.5 text-sm font-medium text-white">{p.title}</h4>
                                <p className="mt-1 text-sm leading-relaxed text-slate-400">{p.description}</p>
                              </li>
                            );
                          })}
                        </ol>
                      </div>
                    )}
                  </div>
                )}

                {/* Tech stack */}
                {tab === 'stack' && (
                  <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {tools.map((t) => (
                      <li key={t} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-slate-200">
                        {t}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Roadmap */}
                {tab === 'roadmap' && (
                  <div>
                    <p className="mb-4 text-sm text-slate-400">What is planned next for {project.title}.</p>
                    <ul className="space-y-3">
                      {future.map((item, i) => (
                        <li key={i} className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed text-slate-300">
                          <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Team */}
                {tab === 'team' && (
                  <div>
                    <p className="mb-4 text-sm text-slate-400">
                      {solo ? 'Built independently as a solo project.' : 'Built collaboratively as a team project.'}
                    </p>
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {team.map((m, i) => (
                        <li key={i} className="flex gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-cyan-300/30 bg-cyan-300/10 text-sm font-semibold text-cyan-200">
                            {m.name.charAt(0)}
                          </span>
                          <div className="min-w-0">
                            <p className="font-medium text-white">
                              {m.name}
                              {i === 0 && (
                                <span className="ml-2 rounded bg-white/10 px-1.5 py-0.5 text-xs font-normal text-slate-300">Creator</span>
                              )}
                            </p>
                            <p className="text-sm text-cyan-200/90">{m.role}</p>
                            {m.contribution && <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{m.contribution}</p>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;