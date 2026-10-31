import React, { useId, useMemo, useState } from 'react';
import { Brain, Globe, Smartphone, BarChart3, Cpu, Link2, Database, Layers } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Project } from '../types/project';

/* ─────────────────────────────────────────────────────────────
   One accent (cyan-300) for the whole Projects section.
   Categories are told apart by icon + label, never by colour.
   ───────────────────────────────────────────────────────────── */

const CATEGORY_ICON: Record<string, LucideIcon> = {
    'ai/ml': Brain,
    'web development': Globe,
    'mobile app': Smartphone,
    'data science': BarChart3,
    iot: Cpu,
    blockchain: Link2,
    storage: Database,
};

export const categoryIcon = (category: string): LucideIcon =>
    CATEGORY_ICON[(category || '').toLowerCase()] ?? Layers;

export const categoryLabel = (category: string) =>
    category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Other';

export const isSoloProject = (p: Project) =>
    !p.teamMembers || p.teamMembers.length <= 1 || !!p.projectType?.toLowerCase().includes('solo');

export const resolveImage = (url?: string): string | null => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return `http://localhost:5000${url}`;
    return null;
};

/* ── Status: a dot + plain text. Only two semantic colours. ── */
const statusDot = (status: string) =>
    status === 'Completed'
        ? 'bg-emerald-400'
        : status === 'In Progress'
            ? 'bg-cyan-300 animate-pulse motion-reduce:animate-none'
            : 'bg-slate-500';

export const StatusBadge = ({ status }: { status: string }) => (
    <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-300">
        <span className={`h-1.5 w-1.5 rounded-full ${statusDot(status)}`} aria-hidden="true" />
        {status}
    </span>
);

/* ── Seeded random so every project gets its own, stable cover ── */
const hash = (s: string) => {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
};

const rng = (seed: number) => () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/* Generated "architecture diagram" cover: nodes + connections, unique per project */
const BlueprintArt = ({ seed, count, Icon, animated }: { seed: string; count: number; Icon: LucideIcon; animated: boolean }) => {
    const uid = useId().replace(/:/g, '');

    const { nodes, edges, glow } = useMemo(() => {
        const rand = rng(hash(seed));
        const cols = 6;
        const rows = 3;
        const cells = Array.from({ length: cols * rows }, (_, i) => i);
        for (let i = cells.length - 1; i > 0; i--) {
            const j = Math.floor(rand() * (i + 1));
            [cells[i], cells[j]] = [cells[j], cells[i]];
        }
        const n = Math.min(Math.max(count + 4, 8), 13);
        const nodes = cells.slice(0, n).map((c) => ({
            x: ((c % cols) + 0.2 + rand() * 0.6) * (400 / cols),
            y: (Math.floor(c / cols) + 0.2 + rand() * 0.6) * (220 / rows),
            r: 2 + rand() * 2.5,
            hot: rand() > 0.72,
        }));
        const edges: [number, number][] = [];
        nodes.forEach((a, i) => {
            nodes
                .map((b, j) => ({ j, d: (a.x - b.x) ** 2 + (a.y - b.y) ** 2 }))
                .filter((o) => o.j !== i)
                .sort((p, q) => p.d - q.d)
                .slice(0, 2)
                .forEach(({ j }) => {
                    if (!edges.some(([p, q]) => (p === i && q === j) || (p === j && q === i))) edges.push([i, j]);
                });
        });
        return { nodes, edges, glow: { x: 60 + rand() * 280, y: 40 + rand() * 140 } };
    }, [seed, count]);

    return (
        <svg
            viewBox="0 0 400 220"
            preserveAspectRatio="xMidYMid slice"
            className={`absolute inset-0 h-full w-full ${animated ? `flow-${uid}` : ''}`}
            aria-hidden="true"
        >
            <defs>
                <pattern id={`grid-${uid}`} width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M20 0H0V20" fill="none" stroke="#67e8f9" strokeOpacity="0.07" />
                </pattern>
                <radialGradient id={`glow-${uid}`} cx={glow.x} cy={glow.y} r="170" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#22d3ee" stopOpacity="0.22" />
                    <stop offset="1" stopColor="#22d3ee" stopOpacity="0" />
                </radialGradient>
            </defs>
            <style>{`
        @keyframes flow-${uid}{to{stroke-dashoffset:-16}}
        @keyframes halo-${uid}{0%,100%{opacity:.3}50%{opacity:1}}
        .group:hover .edge-${uid},.flow-${uid} .edge-${uid}{animation:flow-${uid} 1s linear infinite}
        .halo-${uid}{animation:halo-${uid} 3s ease-in-out infinite}
        @media (prefers-reduced-motion:reduce){.group:hover .edge-${uid},.flow-${uid} .edge-${uid},.halo-${uid}{animation:none}}
      `}</style>
            <rect width="400" height="220" fill="#0a0f1c" />
            <rect width="400" height="220" fill={`url(#glow-${uid})`} />
            <rect width="400" height="220" fill={`url(#grid-${uid})`} />
            {edges.map(([a, b], i) => (
                <line
                    key={i}
                    x1={nodes[a].x}
                    y1={nodes[a].y}
                    x2={nodes[b].x}
                    y2={nodes[b].y}
                    stroke="#67e8f9"
                    strokeOpacity="0.35"
                    strokeDasharray="4 4"
                    className={`edge-${uid}`}
                />
            ))}
            {nodes.map((n, i) =>
                n.hot ? (
                    <g key={i}>
                        <circle cx={n.x} cy={n.y} r={n.r + 6} fill="#22d3ee" fillOpacity="0.22" className={`halo-${uid}`} />
                        <circle cx={n.x} cy={n.y} r={n.r} fill="#67e8f9" />
                    </g>
                ) : (
                    <circle key={i} cx={n.x} cy={n.y} r={n.r} fill="#0a0f1c" stroke="#67e8f9" strokeOpacity="0.55" />
                )
            )}
            <Icon x={292} y={116} width={88} height={88} strokeWidth={1} stroke="#67e8f9" strokeOpacity={0.14} />
        </svg>
    );
};

/* Real image if the project has one, generated cover otherwise.
   The caller must give `className` a position (e.g. "absolute inset-0" or "relative h-56"). */
export const ProjectCover: React.FC<{ project: Project; className?: string; imgClassName?: string; animated?: boolean }> = ({
    project,
    className = '',
    imgClassName = '',
    animated = false,
}) => {
    const [failed, setFailed] = useState(false);
    const src = resolveImage(project.imageUrl);

    return (
        <div className={`overflow-hidden ${className}`}>
            {src && !failed ? (
                <>
                    <img
                        src={src}
                        alt=""
                        loading="lazy"
                        onError={() => setFailed(true)}
                        className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c]/80 via-transparent to-transparent" />
                </>
            ) : (
                <BlueprintArt
                    seed={project._id || project.title}
                    count={project.technologies?.length ?? 0}
                    Icon={categoryIcon(project.category)}
                    animated={animated}
                />
            )}
        </div>
    );
};