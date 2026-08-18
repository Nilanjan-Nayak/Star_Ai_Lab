import React, { useState } from 'react';
import { ExternalLink, Github, ArrowUpRight, CheckCircle, Clock, Star, Layers } from 'lucide-react';

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

/* ─── Per-category design tokens ─────────────────────────────── */
const CAT: Record<string, {
  pill: string;         // badge classes
  bar: string;          // top bar gradient
  glowColor: string;    // raw rgba for JS shadows
  dot: string;          // footer dot color
  imgOverlay: string;   // image hover tint
}> = {
  'AI/ML':            { pill:'text-violet-300 bg-violet-500/10 border-violet-500/20', bar:'from-violet-500 via-purple-500 to-indigo-500', glowColor:'139,92,246',  dot:'bg-violet-400', imgOverlay:'rgba(139,92,246,0.18)' },
  'Web Development':  { pill:'text-cyan-300   bg-cyan-500/10   border-cyan-500/20',   bar:'from-cyan-400  via-blue-400   to-indigo-500', glowColor:'34,211,238',   dot:'bg-cyan-400',   imgOverlay:'rgba(34,211,238,0.15)' },
  'Mobile App':       { pill:'text-emerald-300 bg-emerald-500/10 border-emerald-500/20', bar:'from-emerald-400 via-green-400 to-teal-500', glowColor:'52,211,153',  dot:'bg-emerald-400', imgOverlay:'rgba(52,211,153,0.15)' },
  'Data Science':     { pill:'text-pink-300   bg-pink-500/10   border-pink-500/20',   bar:'from-pink-400  via-rose-400   to-purple-500', glowColor:'244,114,182', dot:'bg-pink-400',   imgOverlay:'rgba(244,114,182,0.15)' },
  'IoT':              { pill:'text-orange-300 bg-orange-500/10 border-orange-500/20', bar:'from-orange-400 via-amber-400  to-red-500',   glowColor:'251,146,60',  dot:'bg-orange-400', imgOverlay:'rgba(251,146,60,0.15)' },
  'Blockchain':       { pill:'text-yellow-300 bg-yellow-500/10 border-yellow-500/20', bar:'from-yellow-400 via-amber-400  to-orange-500',glowColor:'234,179,8',   dot:'bg-yellow-400', imgOverlay:'rgba(234,179,8,0.13)' },
  'default':          { pill:'text-blue-300   bg-blue-500/10   border-blue-500/20',   bar:'from-blue-400  via-cyan-400   to-indigo-500',glowColor:'59,130,246',   dot:'bg-blue-400',   imgOverlay:'rgba(59,130,246,0.15)' },
};

const STATUS: Record<string, { label: string; icon: React.ReactNode; cls: string; pulse: boolean }> = {
  'Completed':  { label:'Completed',   icon:<CheckCircle className="h-3 w-3"/>, cls:'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', pulse:false },
  'In Progress':{ label:'In Progress', icon:<Clock        className="h-3 w-3"/>, cls:'text-sky-400    bg-sky-500/10     border-sky-500/20',     pulse:true  },
  'On Hold':    { label:'On Hold',     icon:<Clock        className="h-3 w-3"/>, cls:'text-amber-400  bg-amber-500/10   border-amber-500/20',   pulse:false },
  'Planning':   { label:'Planning',    icon:<Clock        className="h-3 w-3"/>, cls:'text-purple-400 bg-purple-500/10  border-purple-500/20',  pulse:false },
};

const FALLBACK = 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=800&q=80';

/* ─── Card ─────────────────────────────────────────────────────── */
const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { title, shortDescription, technologies, category, status,
          imageUrl, githubUrl, liveUrl, featured, startDate } = project;

  const [imgErr, setImgErr] = useState(false);
  const [hovered, setHovered] = useState(false);

  const c   = CAT[category]  ?? CAT['default'];
  const s   = STATUS[status] ?? { label: status, icon: <Clock className="h-3 w-3"/>, cls: 'text-slate-400 bg-slate-500/10 border-slate-500/20', pulse: false };

  const src = imgErr || !imageUrl
    ? FALLBACK
    : imageUrl.startsWith('http')  ? imageUrl
    : imageUrl.startsWith('/')     ? `http://localhost:5000${imageUrl}`
    : FALLBACK;

  const dateStr = new Date(startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  return (
    <article
      className="group relative flex flex-col h-full rounded-3xl overflow-hidden cursor-pointer select-none
                 transition-all duration-500 ease-out
                 hover:-translate-y-1.5 focus-within:outline-none"
      style={{
        background: 'linear-gradient(160deg, rgba(13,19,38,0.98) 0%, rgba(6,10,22,1) 100%)',
        boxShadow: hovered
          ? `0 0 0 1px rgba(${c.glowColor},0.35), 0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(${c.glowColor},0.12)`
          : '0 0 0 1px rgba(255,255,255,0.07), 0 4px 24px rgba(0,0,0,0.4)',
        transition: 'box-shadow 0.45s ease, transform 0.45s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      tabIndex={0}
      aria-labelledby={`title-${project._id}`}
    >

      {/* ── Animated top accent bar ── */}
      <div
        className={`absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r ${c.bar} z-30 rounded-t-3xl
                    origin-left transition-transform duration-500 ease-out
                    ${hovered ? 'scale-x-100' : 'scale-x-0'}`}
      />

      {/* ── Hero image ── */}
      <div className="relative h-52 overflow-hidden flex-shrink-0">

        {/* Image */}
        <img
          src={src}
          alt={title}
          onError={() => setImgErr(true)}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover
                     transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Always-on scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060a16] via-[#060a1680] to-transparent" />

        {/* Category-colour wash on hover */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{ background: c.imgOverlay, opacity: hovered ? 1 : 0 }}
        />

        {/* ── Featured badge ── */}
        {featured && (
          <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-1.5
                          px-2.5 py-1 rounded-full
                          bg-amber-500/20 border border-amber-400/30 backdrop-blur-xl">
            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
            <span className="text-[10px] font-black text-amber-300 uppercase tracking-widest">Featured</span>
          </div>
        )}

        {/* ── Status badge ── */}
        <div className={`absolute ${featured ? 'top-3.5 right-3.5' : 'top-3.5 right-3.5'} z-10
                         flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl
                         border text-[10px] font-bold uppercase tracking-wider
                         backdrop-blur-xl ${s.cls}`}>
          <span className={s.pulse ? 'animate-pulse' : ''}>{s.icon}</span>
          {s.label}
        </div>

        {/* ── CTA hover overlay ── */}
        <div
          className={`absolute inset-0 z-10 flex items-end pb-5 justify-center gap-3
                       transition-opacity duration-350 ${hovered ? 'opacity-100' : 'opacity-0'}`}
          style={{ backdropFilter: hovered ? 'blur(3px)' : 'none', background: hovered ? 'rgba(0,0,0,0.45)' : 'transparent' }}
        >
          {liveUrl && (
            <a href={liveUrl} target="_blank" rel="noopener noreferrer"
               onClick={e => e.stopPropagation()}
               className={`flex items-center gap-2 px-5 py-2.5 rounded-full
                           bg-gradient-to-r ${c.bar} text-white text-[12px] font-bold
                           shadow-xl hover:scale-105 hover:brightness-110
                           transition-all duration-200`}>
              <ExternalLink className="h-3.5 w-3.5" /> Live Demo
            </a>
          )}
          {githubUrl && (
            <a href={githubUrl} target="_blank" rel="noopener noreferrer"
               onClick={e => e.stopPropagation()}
               className="flex items-center gap-2 px-5 py-2.5 rounded-full
                          bg-white/10 border border-white/25 text-white text-[12px] font-semibold
                          hover:bg-white/20 hover:scale-105 backdrop-blur-sm
                          transition-all duration-200">
              <Github className="h-3.5 w-3.5" /> Source
            </a>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 px-6 pt-5 pb-6 gap-3.5">

        {/* Category + date */}
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg
                            border text-[10px] font-black uppercase tracking-widest ${c.pill}`}>
            <Layers className="h-3 w-3" />
            {category}
          </span>
          <time className="text-[11px] text-white/50 font-medium tabular-nums">{dateStr}</time>
        </div>

        {/* Title */}
        <h3
          id={`title-${project._id}`}
          className="text-[1.15rem] font-extrabold text-white leading-snug tracking-tight
                     line-clamp-2 group-hover:text-white transition-colors duration-300"
        >
          {title}
        </h3>

        {/* Description */}
        <p className="text-[0.85rem] text-blue-100/70 leading-relaxed line-clamp-2
                      group-hover:text-blue-100/90 transition-colors duration-300">
          {shortDescription}
        </p>

        {/* Tech stack */}
        {technologies?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {technologies.slice(0, 5).map((t, i) => (
              <span key={i}
                className="px-2.5 py-1 text-[11px] font-semibold rounded-md
                           text-blue-200/80 border border-blue-400/15 bg-blue-400/[0.06]
                           hover:text-white hover:border-blue-400/30 hover:bg-blue-400/[0.12]
                           transition-all duration-200 cursor-default">
                {t}
              </span>
            ))}
            {technologies.length > 5 && (
              <span className="px-2 py-1 text-[11px] text-blue-300/50 font-medium">
                +{technologies.length - 5}
              </span>
            )}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1 min-h-[8px]" />

        {/* Footer */}
        <div className="flex items-center justify-between pt-4"
             style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>

          {/* Left — glowing dot + label */}
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full flex-shrink-0 ${c.dot}`}
              style={{ boxShadow: `0 0 8px rgba(${c.glowColor},0.8)` }}
            />
            {featured
              ? <span className="text-[11px] text-amber-400 font-bold flex items-center gap-1">
                  <Star className="h-3 w-3 fill-amber-400" /> Featured
                </span>
              : <span className="text-[11px] text-white/50 uppercase tracking-wider font-semibold">{category}</span>
            }
          </div>

          {/* Right — action links */}
          <div className="flex items-center gap-1">
            {githubUrl && (
              <a href={githubUrl} target="_blank" rel="noopener noreferrer"
                 className="p-2 rounded-xl text-blue-300/60 hover:text-cyan-400 hover:bg-cyan-400/10
                            transition-all duration-200"
                 aria-label={`GitHub – ${title}`}>
                <Github className="h-4 w-4" />
              </a>
            )}

            {/* Primary CTA */}
            {liveUrl ? (
              <a href={liveUrl} target="_blank" rel="noopener noreferrer"
                 className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl
                             bg-gradient-to-r ${c.bar} text-white text-[12px] font-bold
                             hover:opacity-90 hover:scale-105 transition-all duration-200`}
                 style={{ boxShadow: `0 4px 16px rgba(${c.glowColor},0.35)` }}
                 aria-label={`Visit ${title}`}>
                View <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            ) : githubUrl ? (
              <a href={githubUrl} target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl
                            text-blue-200/80 text-[12px] font-semibold
                            border border-blue-400/20 bg-blue-400/[0.06]
                            hover:text-white hover:bg-blue-400/15
                            transition-all duration-200"
                 aria-label={`Code – ${title}`}>
                Code <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;