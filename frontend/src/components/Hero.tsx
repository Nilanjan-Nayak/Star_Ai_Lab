import { useEffect, useRef, useState } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { ArrowRight, Play, Code, Cpu, Zap, Brain } from 'lucide-react';
import { useCosmos } from './SectionKit';
import { GalaxyCanvas } from './HeroGalaxy';
import { HeroPlanet } from './HeroPlanet';

/* ========================================================================== */
/*  CONFIG                                                                    */
/* ========================================================================== */
const INTRO_DELAY = 1.1; // seconds before the text starts rising in (matches the warp intro)
const WORDS = ['AI Solutions', 'Machine Learning', 'Automation', 'Smart Apps'];

/* ========================================================================== */
/*  Hooks                                                                     */
/* ========================================================================== */
const useRotatingText = (words: string[]) => {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const full = words[index];
    let delay = deleting ? 35 : 80;
    if (!text && !deleting && index === 0) delay = (INTRO_DELAY + 0.5) * 1000;
    else if (!deleting && text === full) delay = 1800;
    else if (deleting && text === '') delay = 300;

    const id = setTimeout(() => {
      if (!deleting && text === full) setDeleting(true);
      else if (deleting && text === '') {
        setDeleting(false);
        setIndex((index + 1) % words.length);
      } else setText(deleting ? full.slice(0, text.length - 1) : full.slice(0, text.length + 1));
    }, delay);
    return () => clearTimeout(id);
  }, [text, deleting, index, words]);

  return text;
};

/* ========================================================================== */
/*  Terminal – compact & professional                                         */
/* ========================================================================== */
const codeSnippets = [
  "import { StarAI } from 'star-ai-labs';",
  '',
  'const engine = new StarAI({',
  "  model: 'neural-v4',",
  "  mode: 'autonomous',",
  '});',
  '',
  'const result = await engine.solve(data);',
];

const KEYWORDS = new Set(['import', 'from', 'const', 'new', 'await', 'async', 'return']);

const tokenize = (line: string) => {
  const re = /(\/\/.*$)|('[^']*'?)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)|(\s+)|(.)/g;
  const out: { text: string; cls: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    let cls = 'text-slate-300';
    if (m[1]) cls = 'text-slate-500 italic';
    else if (m[2]) cls = 'text-amber-300';
    else if (m[3]) cls = 'text-emerald-300';
    else if (m[4]) {
      const next = line[re.lastIndex];
      if (KEYWORDS.has(m[0])) cls = 'text-purple-400';
      else if (next === '(') cls = 'text-cyan-300';
      else if (/^[A-Z]/.test(m[0])) cls = 'text-yellow-300';
      else if (next === ':') cls = 'text-sky-300';
    } else if (m[6]) cls = 'text-slate-400';
    out.push({ text: m[0], cls });
  }
  return out;
};

const TerminalCard = () => {
  const full = codeSnippets.join('\n');
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [n, setN] = useState(reduce ? full.length : 0);

  useEffect(() => {
    if (reduce || n >= full.length) return;
    const delay = n === 0 ? (INTRO_DELAY + 1.2) * 1000 : full[n] === '\n' ? 90 : 22 + Math.random() * 25;
    const id = setTimeout(() => setN(n + 1), delay);
    return () => clearTimeout(id);
  }, [n, full, reduce]);

  const lines = full.slice(0, n).split('\n');
  const done = n >= full.length;

  return (
    <div className="relative overflow-hidden rounded-lg border border-slate-700/70 bg-slate-950/95 shadow-2xl shadow-black/60 backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-3 py-2">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="font-mono text-[11px] text-slate-500">star-ai-labs.tsx</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-emerald-400/90">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="font-medium tracking-wide">LIVE</span>
        </div>
      </div>

      <div className="p-4 font-mono text-[12px] leading-[1.65]" style={{ minHeight: `${codeSnippets.length * 20}px` }}>
        {lines.map((line, i) => (
          <div key={i} className="flex whitespace-pre">
            <span className="mr-3 w-5 select-none pt-0.5 text-right text-[10px] text-slate-700">{i + 1}</span>
            <span className="min-w-0 flex-1">
              {tokenize(line).map((tok, k) => (
                <span key={k} className={tok.cls}>{tok.text}</span>
              ))}
              {!done && i === lines.length - 1 && <span className="ml-0.5 inline-block h-[12px] w-[6px] animate-pulse bg-cyan-400 align-middle" />}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-slate-800 bg-slate-900/60 px-4 py-2 font-mono text-[10px]">
        <span className="text-slate-600">neural-v4</span>
        <span className="text-slate-500">{done ? 'ready' : 'typing…'}</span>
      </div>
    </div>
  );
};

/* ========================================================================== */
/*  Static data & styles                                                      */
/* ========================================================================== */
const features = [
  { icon: Brain, label: 'Neural Networks' },
  { icon: Cpu, label: 'Edge Computing' },
  { icon: Zap, label: 'Real-time Processing' },
  { icon: Code, label: 'Custom APIs' },
];

// Fine film grain – gives the dark background a premium, printed feel
const NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  .hero-display { font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif; letter-spacing: -0.03em; }
  .hero-mono { font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace; }

  @keyframes fadeInUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes nebulaDrift {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(30px, -20px) scale(1.08); }
    66% { transform: translate(-20px, 25px) scale(0.95); }
  }
  @keyframes gradientShift { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
  @keyframes caretBlink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
  @keyframes atmosphere { 0%, 100% { opacity: 0.7; } 50% { opacity: 1; } }
  @keyframes wheel { 0% { transform: translateY(0); opacity: 1; } 70% { transform: translateY(12px); opacity: 0; } 100% { transform: translateY(0); opacity: 0; } }
  @keyframes ctaPulse {
    0% { box-shadow: 0 0 0 0 rgba(34, 211, 238, 0.45); }
    70%, 100% { box-shadow: 0 0 0 14px rgba(34, 211, 238, 0); }
  }

  .hero-rise { animation: fadeInUp 1s cubic-bezier(0.22, 1, 0.36, 1) both; }
  .hero-title-caret { display: inline-block; width: 3px; height: 0.8em; margin-left: 6px; vertical-align: baseline; background: #22d3ee; animation: caretBlink 1s steps(1) infinite; }
  .hero-gradient-text {
    background: linear-gradient(90deg, #60a5fa, #67e8f9, #a78bfa, #60a5fa);
    background-size: 200% 100%;
    -webkit-background-clip: text; background-clip: text; color: transparent;
    filter: drop-shadow(0 0 22px rgba(56, 189, 248, 0.35));
    animation: gradientShift 6s linear infinite;
  }
  .hero-btn { position: relative; overflow: hidden; }
  .hero-btn::after {
    content: ''; position: absolute; top: 0; left: -60%; width: 40%; height: 100%;
    background: linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.35), transparent);
    transform: skewX(-20deg); transition: left 0.7s ease;
  }
  .hero-btn:hover::after { left: 130%; }
  .hero-wheel { animation: wheel 1.8s ease-in-out infinite; }
  .hero-cta { animation: ctaPulse 2.8s ease-out infinite; animation-delay: 3.5s; }

  @media (prefers-reduced-motion: reduce) {
    .hero-rise, .hero-gradient-text, .hero-title-caret, .hero-cta, .hero-wheel { animation: none !important; }
  }
`;

/* ========================================================================== */
/*  Hero                                                                      */
/* ========================================================================== */
const Hero = () => {
  useCosmos();
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const word = useRotatingText(WORDS);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  const rise = (delay: number) => ({ animationDelay: `${INTRO_DELAY + delay}s` });

  const onMove = (e: ReactMouseEvent<HTMLElement>) => {
    const el = sectionRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  // As you scroll away, the hero content drifts up and fades – a soft hand-off to the next section
  useEffect(() => {
    const el = contentRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const onScroll = () => {
      const p = Math.min(1, window.scrollY / (window.innerHeight * 0.75));
      el.style.opacity = String(1 - p * 0.85);
      if (leftRef.current) leftRef.current.style.transform = `translateY(${-p * 28}px)`;
      if (rightRef.current) rightRef.current.style.transform = `translateY(${-p * 80}px)`; // closer layer moves faster
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <section
        id="home"
        ref={sectionRef}
        onMouseMove={onMove}
        className="relative min-h-screen overflow-hidden"
        style={{ ['--mx' as string]: '50%', ['--my' as string]: '40%' }}
      >
        {/* ------------------------------ Background ------------------------------ */}
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, #000 0%, #000 82%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, #000 0%, #000 82%, transparent 100%)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-950 to-blue-950" />

          <div className="absolute rounded-full blur-3xl" style={{ top: '5%', left: '8%', width: 520, height: 520, background: 'rgba(37,99,235,0.16)', animation: 'nebulaDrift 24s ease-in-out infinite' }} />
          <div className="absolute rounded-full blur-3xl" style={{ bottom: '0%', right: '5%', width: 600, height: 600, background: 'rgba(124,58,237,0.14)', animation: 'nebulaDrift 30s ease-in-out infinite reverse' }} />
          <div className="absolute rounded-full blur-3xl" style={{ top: '45%', left: '35%', width: 420, height: 420, background: 'rgba(6,182,212,0.10)', animation: 'nebulaDrift 20s ease-in-out infinite' }} />

          <GalaxyCanvas />

          {/* volumetric light beam from the top-right */}
          <div
            className="absolute inset-0"
            style={{
              background: 'conic-gradient(from 195deg at 80% -14%, transparent 0deg, rgba(56,189,248,0.13) 13deg, transparent 28deg)',
              animation: 'atmosphere 9s ease-in-out infinite',
            }}
          />

          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: 'radial-gradient(rgba(148,197,255,0.18) 1px, transparent 1px)',
              backgroundSize: '34px 34px',
              WebkitMaskImage: 'radial-gradient(ellipse at 50% 45%, black 20%, transparent 70%)',
              maskImage: 'radial-gradient(ellipse at 50% 45%, black 20%, transparent 70%)',
            }}
          />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(520px circle at var(--mx) var(--my), rgba(56,189,248,0.09), transparent 60%)' }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.65) 100%)' }} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/10 to-transparent" />

          {/* film grain */}
          <div className="absolute inset-0 opacity-[0.1] mix-blend-overlay" style={{ backgroundImage: NOISE }} />
        </div>

        {/* 3D planet – fixed to the viewport, driven by scroll */}
        <HeroPlanet />

        {/* -------------------------------- Content -------------------------------- */}
        <div ref={contentRef} className="relative z-10 flex min-h-screen flex-col justify-center px-4 pb-16 pt-24 sm:px-6 lg:px-8">
          <div className="mx-auto my-auto w-full max-w-7xl">
            <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
              {/* ---------------------------- Left ---------------------------- */}
              <div ref={leftRef} className="space-y-5 lg:col-span-7">
                <div
                  className="hero-rise inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-slate-900/80 px-3.5 py-1.5 text-xs font-medium text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.15)] backdrop-blur-xl"
                  style={rise(0.1)}
                >
                  <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
                  <span className="font-semibold text-white">Nilanjan Nayak</span>
                  <span className="text-white/30">•</span>
                  <span className="text-cyan-300/90">Powering Enterprise Intelligence</span>
                </div>

                <div className="space-y-4">
                  <h1 className="hero-rise hero-display text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl xl:text-6xl" style={rise(0.25)}>
                    <span className="sr-only">Star AI Lab — AI Research & Development, AI Agents, Personal AI Assistant & Artificial Intelligence Projects. </span>
                    Next-Generation
                    <span className="hero-gradient-text block" style={{ minHeight: '1.2em' }}>
                      {word}
                      <span className="hero-title-caret" />
                    </span>
                  </h1>

                  <p className="hero-rise max-w-xl text-sm leading-relaxed text-blue-100/80 sm:text-base" style={rise(0.4)}>
                    Revolutionize your enterprise with our cutting-edge artificial intelligence platform. From neural networks to automated workflows, we deliver solutions that transform data into actionable insights and drive unprecedented growth.
                  </p>
                </div>

                <div className="hero-rise grid max-w-lg grid-cols-2 gap-2.5 py-1 sm:gap-3" style={rise(0.55)}>
                  {features.map(({ icon: Icon, label }) => (
                    <div key={label} className="group flex items-center space-x-2.5 rounded-xl border border-white/5 bg-white/[0.03] p-2 transition-all hover:border-cyan-400/30 hover:bg-white/[0.06]">
                      <div className="shrink-0 rounded-lg border border-blue-400/10 bg-blue-500/20 p-1.5 transition-colors duration-300 group-hover:border-cyan-300/40 group-hover:bg-cyan-400/20">
                        <Icon className="h-4 w-4 text-cyan-400" />
                      </div>
                      <span className="truncate text-xs font-medium text-blue-200 transition-colors duration-300 group-hover:text-white sm:text-sm">{label}</span>
                    </div>
                  ))}
                </div>

                <div className="hero-rise flex flex-wrap items-center gap-3 pt-2" style={rise(0.7)}>
                  <button
                    onClick={() => scrollTo('projects')}
                    className="hero-btn hero-cta inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-cyan-400 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                  >
                    Explore AI Solutions
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                  <button
                    onClick={() => scrollTo('contact')}
                    className="hero-btn inline-flex items-center justify-center rounded-xl border border-cyan-500/30 bg-slate-900/70 px-6 py-3 text-sm font-semibold text-cyan-200 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/50 hover:bg-cyan-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                  >
                    <Play className="mr-2 h-4 w-4 text-cyan-400" />
                    See Live Demo
                  </button>
                </div>
              </div>

              {/* ---------------------------- Right ---------------------------- */}
              <div ref={rightRef} className="lg:col-span-5">
                <div className="hero-rise mx-auto w-full max-w-md" style={rise(0.4)}>
                  <TerminalCard />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={() => scrollTo('about')}
          aria-label="Scroll to the About section"
          className="group absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
        >
          <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-blue-100/70 drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)] transition-colors group-hover:text-cyan-300">
            Scroll
          </span>
          <span className="flex h-9 w-[22px] items-start justify-center rounded-full border border-cyan-300/40 bg-black/30 p-1.5 backdrop-blur-md transition-colors group-hover:border-cyan-300/80">
            <span className="hero-wheel h-1.5 w-1 rounded-full bg-cyan-300" />
          </span>
        </button>
      </section>
    </>
  );
};

export default Hero;