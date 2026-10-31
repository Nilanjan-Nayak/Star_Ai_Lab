import { useEffect, useRef, useState } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { ArrowRight, Play, ChevronDown, Code, Cpu, Zap, Brain } from 'lucide-react';
import { useCosmos } from './SectionKit';

/* ========================================================================== */
/*  CONFIG                                                                    */
/* ========================================================================== */
const WARP_SECONDS = 2.6;
const INTRO_DELAY = 1.1;
const WORDS = ['AI Solutions', 'Machine Learning', 'Automation', 'Smart Apps'];

/* ========================================================================== */
/*  Galaxy canvas                                                             */
/* ========================================================================== */
type Star = { x: number; y: number; px: number; py: number; z: number; r: number; a: number; tw: number; ph: number; sp: number; c: string };
type Shooter = { x: number; y: number; ux: number; uy: number; speed: number; life: number; max: number; len: number; big: boolean };
type Spark = { x: number; y: number; vx: number; vy: number; life: number; max: number };
type Warp = { a: number; r: number; s: number };

const STAR_COLORS = ['255,255,255', '190,215,255', '160,200,255', '255,232,205'];

const buildGalaxy = (): HTMLCanvasElement => {
  const S = 1024;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const g = c.getContext('2d')!;
  const cx = S / 2;
  const R = S * 0.46;
  const arms = 4;
  const twist = 5.2;
  g.globalCompositeOperation = 'lighter';

  for (let i = 0; i < 280; i++) {
    const t = Math.pow(Math.random(), 0.8);
    const a = t * twist + (i % arms) * ((Math.PI * 2) / arms) + (Math.random() - 0.5) * 0.5;
    const x = cx + Math.cos(a) * t * R;
    const y = cx + Math.sin(a) * t * R;
    const rad = 30 + Math.random() * 80;
    const hue = 205 + t * 85;
    const grd = g.createRadialGradient(x, y, 0, x, y, rad);
    grd.addColorStop(0, `hsla(${hue},90%,60%,0.05)`);
    grd.addColorStop(1, `hsla(${hue},90%,60%,0)`);
    g.fillStyle = grd;
    g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }

  for (let i = 0; i < 8500; i++) {
    const t = Math.pow(Math.random(), 1.45);
    const j = Math.random() + Math.random() + Math.random() - 1.5;
    const a = t * twist + (i % arms) * ((Math.PI * 2) / arms) + j * (0.3 + (1 - t) * 0.9);
    const r = t * R + (Math.random() - 0.5) * 14;
    const core = t < 0.18;
    g.fillStyle = `hsla(${core ? 38 : 200 + t * 90},90%,${core ? 82 : 68 + Math.random() * 18}%,${0.3 + Math.random() * 0.6})`;
    const s = 0.6 + Math.random() * 1.1;
    g.fillRect(cx + Math.cos(a) * r, cx + Math.sin(a) * r, s, s);
  }

  const core = g.createRadialGradient(cx, cx, 0, cx, cx, R * 0.3);
  core.addColorStop(0, 'rgba(255,244,225,0.6)');
  core.addColorStop(0.35, 'rgba(140,185,255,0.2)');
  core.addColorStop(1, 'rgba(60,110,255,0)');
  g.fillStyle = core;
  g.fillRect(0, 0, S, S);
  return c;
};

const GalaxyCanvas = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const warpDur = reduce ? 0 : WARP_SECONDS;
    const galaxy = buildGalaxy();
    const shooters: Shooter[] = [];
    const sparks: Spark[] = [];
    const mouse = { x: 0, y: 0, tx: 0, ty: 0, px: -999, py: -999 };
    let warps: Warp[] = [];
    let stars: Star[] = [];
    let w = 0, h = 0, dpr = 1, raf = 0, t = 0, nextShooter = warpDur + 1.5;
    let last = performance.now();

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      stars = Array.from({ length: Math.min(520, Math.floor((w * h) / 4200)) }, () => {
        const z = Math.random() < 0.6 ? 0.25 : Math.random() < 0.7 ? 0.6 : 1;
        const x = Math.random() * w;
        const y = Math.random() * h;
        return {
          x, y, px: x, py: y, z,
          r: 0.3 + z * (0.5 + Math.random() * 0.9),
          a: 0.35 + Math.random() * 0.65,
          tw: 0.6 + Math.random() * 2.2,
          ph: Math.random() * Math.PI * 2,
          sp: 1.5 + z * 5,
          c: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        };
      });
      if (!warps.length) {
        warps = Array.from({ length: 240 }, () => ({
          a: Math.random() * Math.PI * 2,
          r: Math.random() * Math.max(w, h) * 0.6,
          s: 0.6 + Math.random() * 0.8,
        }));
      }
    };

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
      mouse.px = e.clientX - r.left;
      mouse.py = e.clientY - r.top;
    };
    const onLeave = () => { mouse.px = mouse.py = -999; };
    const onDown = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (reduce || x < 0 || y < 0 || x > w || y > h) return;
      for (let i = 0; i < 18; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = 60 + Math.random() * 190;
        sparks.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0, max: 0.6 + Math.random() * 0.6 });
      }
    };

    const spawnShooter = () => {
      const a = 0.3 + Math.random() * 0.35;
      const big = Math.random() < 0.22;
      shooters.push({
        x: Math.random() * w * 0.75, y: Math.random() * h * 0.4,
        ux: Math.cos(a), uy: Math.sin(a),
        speed: (big ? 520 : 700) + Math.random() * 500,
        life: 0, max: big ? 1.6 : 0.9 + Math.random() * 0.6,
        len: (big ? 200 : 90) + Math.random() * 120, big,
      });
    };

    const draw = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t += dt;
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;

      const wp = warpDur ? Math.max(0, 1 - t / warpDur) : 0;
      const e = wp * wp;
      const reveal = 1 - e;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      /* 1) Hyperspace intro */
      if (e > 0.01) {
        const cx = w * 0.5, cy = h * 0.5, diag = Math.hypot(w, h) / 2;
        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, diag * 0.55);
        glow.addColorStop(0, `rgba(125,211,252,${e * 0.35})`);
        glow.addColorStop(1, 'rgba(125,211,252,0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, w, h);
        ctx.lineCap = 'round';
        for (const p of warps) {
          p.r += (80 + p.r * 2.2) * dt * (0.4 + 6 * e) * p.s;
          if (p.r > diag * 1.1) p.r = 4 + Math.random() * 30;
          const len = Math.min(p.r * 0.9, (8 + p.r * 0.2) * e * 6 * p.s);
          const x1 = cx + Math.cos(p.a) * p.r, y1 = cy + Math.sin(p.a) * p.r;
          const x0 = cx + Math.cos(p.a) * (p.r - len), y0 = cy + Math.sin(p.a) * (p.r - len);
          ctx.strokeStyle = `rgba(190,225,255,${Math.min(1, e * 1.4) * Math.min(1, p.r / 120)})`;
          ctx.lineWidth = 0.6 + (p.r / diag) * 1.6;
          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(x1, y1);
          ctx.stroke();
        }
      }

      /* 2) Spiral galaxy */
      const s = (Math.max(w, 900) / 1024) * 1.15;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.62 * reveal;
      ctx.translate(w * 0.62 - mouse.x * 18, h * 0.48 - mouse.y * 12);
      ctx.rotate(-0.35);
      ctx.scale(s, s * 0.42);
      ctx.rotate(t * 0.03);
      ctx.drawImage(galaxy, -galaxy.width / 2, -galaxy.height / 2);
      ctx.restore();

      /* 3) Parallax stars */
      ctx.globalAlpha = reveal;
      for (const st of stars) {
        if (!reduce) {
          st.x += st.sp * dt;
          if (st.x > w + 10) st.x = -10;
        }
        st.px = st.x - mouse.x * st.z * 24;
        st.py = st.y - mouse.y * st.z * 16;
        const alpha = st.a * (0.55 + 0.45 * Math.sin(t * st.tw + st.ph));
        ctx.fillStyle = `rgba(${st.c},${alpha})`;
        ctx.beginPath();
        ctx.arc(st.px, st.py, st.r, 0, Math.PI * 2);
        ctx.fill();
        if (st.r > 1.5) {
          ctx.strokeStyle = `rgba(${st.c},${alpha * 0.45})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(st.px - st.r * 5, st.py);
          ctx.lineTo(st.px + st.r * 5, st.py);
          ctx.moveTo(st.px, st.py - st.r * 5);
          ctx.lineTo(st.px, st.py + st.r * 5);
          ctx.stroke();
        }
      }

      /* 4) Neural constellation around the cursor */
      if (!reduce && mouse.px > -900) {
        const near: Star[] = [];
        for (const st of stars) {
          if (st.z < 0.6) continue;
          const dx = st.px - mouse.px, dy = st.py - mouse.py;
          if (dx * dx + dy * dy < 190 * 190) near.push(st);
          if (near.length >= 40) break;
        }
        ctx.lineWidth = 0.7;
        for (let i = 0; i < near.length; i++) {
          const a = near[i];
          const dm = Math.hypot(a.px - mouse.px, a.py - mouse.py);
          ctx.strokeStyle = `rgba(103,232,249,${(1 - dm / 190) * 0.55})`;
          ctx.beginPath();
          ctx.moveTo(mouse.px, mouse.py);
          ctx.lineTo(a.px, a.py);
          ctx.stroke();
          for (let j = i + 1; j < near.length; j++) {
            const b = near[j];
            const d = Math.hypot(a.px - b.px, a.py - b.py);
            if (d < 95) {
              ctx.strokeStyle = `rgba(147,197,253,${(1 - d / 95) * 0.45})`;
              ctx.beginPath();
              ctx.moveTo(a.px, a.py);
              ctx.lineTo(b.px, b.py);
              ctx.stroke();
            }
          }
          ctx.fillStyle = `rgba(165,243,252,${1 - dm / 190})`;
          ctx.beginPath();
          ctx.arc(a.px, a.py, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      /* 5) Shooting stars & comets */
      if (!reduce) {
        nextShooter -= dt;
        if (nextShooter <= 0 && e < 0.05) {
          spawnShooter();
          nextShooter = 2 + Math.random() * 4;
        }
        for (let i = shooters.length - 1; i >= 0; i--) {
          const sh = shooters[i];
          sh.life += dt;
          sh.x += sh.ux * sh.speed * dt;
          sh.y += sh.uy * sh.speed * dt;
          if (sh.life > sh.max) { shooters.splice(i, 1); continue; }
          const a = Math.sin((Math.PI * sh.life) / sh.max);
          const tx = sh.x - sh.ux * sh.len, ty = sh.y - sh.uy * sh.len;
          const rgb = sh.big ? '103,232,249' : '220,240,255';
          const grd = ctx.createLinearGradient(tx, ty, sh.x, sh.y);
          grd.addColorStop(0, `rgba(${rgb},0)`);
          grd.addColorStop(1, `rgba(${rgb},${a})`);
          ctx.strokeStyle = grd;
          ctx.lineWidth = sh.big ? 2.6 : 1.6;
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(sh.x, sh.y);
          ctx.stroke();
          if (sh.big) {
            const hg = ctx.createRadialGradient(sh.x, sh.y, 0, sh.x, sh.y, 12);
            hg.addColorStop(0, `rgba(255,255,255,${a})`);
            hg.addColorStop(1, 'rgba(103,232,249,0)');
            ctx.fillStyle = hg;
            ctx.fillRect(sh.x - 12, sh.y - 12, 24, 24);
          } else {
            ctx.fillStyle = `rgba(255,255,255,${a})`;
            ctx.beginPath();
            ctx.arc(sh.x, sh.y, 1.6, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        /* 6) Click sparks */
        const drag = Math.pow(0.04, dt);
        for (let i = sparks.length - 1; i >= 0; i--) {
          const p = sparks[i];
          p.life += dt;
          if (p.life > p.max) { sparks.splice(i, 1); continue; }
          p.vx *= drag; p.vy *= drag;
          p.x += p.vx * dt; p.y += p.vy * dt;
          ctx.fillStyle = `rgba(165,243,252,${1 - p.life / p.max})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      if (!reduce) raf = requestAnimationFrame(draw);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    document.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('pointerdown', onDown);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 w-full h-full" aria-hidden="true" />;
};

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
/*  Terminal — compact & professional                                         */
/* ========================================================================== */
const codeSnippets = [
  "import { StarAI } from 'star-ai-labs';",
  "",
  "const engine = new StarAI({",
  "  model: 'neural-v4',",
  "  mode: 'autonomous',",
  "});",
  "",
  "const result = await engine.solve(data);",
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
    if (reduce) return;
    if (n >= full.length) return;
    const delay = n === 0 ? (INTRO_DELAY + 0.8) * 1000 : full[n] === '\n' ? 90 : 22 + Math.random() * 25;
    const id = setTimeout(() => setN(n + 1), delay);
    return () => clearTimeout(id);
  }, [n, full, reduce]);

  const lines = full.slice(0, n).split('\n');
  const done = n >= full.length;

  return (
    <div className="relative rounded-lg overflow-hidden bg-slate-950/95 border border-slate-800 shadow-xl shadow-black/40 backdrop-blur-xl">
      {/* Window header */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/80 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-slate-500 text-[11px] font-mono">star-ai-labs.tsx</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-emerald-400/90">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="font-medium tracking-wide">LIVE</span>
        </div>
      </div>

      {/* Code viewport */}
      <div
        className="p-4 font-mono text-[12px] leading-[1.65]"
        style={{ minHeight: `${codeSnippets.length * 20}px` }}
      >
        {lines.map((line, i) => (
          <div key={i} className="flex whitespace-pre">
            <span className="text-slate-700 text-[10px] w-5 mr-3 text-right select-none pt-0.5">{i + 1}</span>
            <span className="flex-1 min-w-0">
              {tokenize(line).map((tok, k) => (
                <span key={k} className={tok.cls}>{tok.text}</span>
              ))}
              {!done && i === lines.length - 1 && (
                <span className="inline-block w-[6px] h-[12px] bg-cyan-400 ml-0.5 align-middle animate-pulse" />
              )}
            </span>
          </div>
        ))}
      </div>

      {/* Status footer */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/60 border-t border-slate-800 text-[10px] font-mono">
        <span className="text-slate-600">neural-v4</span>
        <span className="text-slate-500">ready</span>
      </div>
    </div>
  );
};

/* ========================================================================== */
/*  Features                                                                  */
/* ========================================================================== */
const features = [
  { icon: Brain, label: 'Neural Networks' },
  { icon: Cpu, label: 'Edge Computing' },
  { icon: Zap, label: 'Real-time Processing' },
  { icon: Code, label: 'Custom APIs' },
];

/* ========================================================================== */
/*  Styles                                                                    */
/* ========================================================================== */
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

  .hero-rise { animation: fadeInUp 1s cubic-bezier(0.22, 1, 0.36, 1) both; }
  .hero-title-caret {
    display: inline-block; width: 3px; height: 0.8em; margin-left: 6px;
    vertical-align: baseline; background: #22d3ee;
    animation: caretBlink 1s steps(1) infinite;
  }
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

  @media (prefers-reduced-motion: reduce) {
    .hero-rise, .hero-gradient-text, .hero-title-caret { animation: none !important; }
  }
`;

/* ========================================================================== */
/*  Hero                                                                      */
/* ========================================================================== */
const Hero = () => {
  useCosmos();
  const sectionRef = useRef<HTMLElement>(null);
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

          {/* Planet horizon */}
          <div
            className="absolute rounded-full"
            style={{
              left: '50%', top: '78%', width: '170vw', height: '170vw', transform: 'translateX(-50%)',
              background: 'radial-gradient(circle at 50% 0%, #0a1733 0%, #030816 35%, #000 65%)',
              boxShadow: '0 -1px 0 rgba(186,230,253,0.8), 0 -10px 50px rgba(56,189,248,0.45), 0 -40px 140px rgba(37,99,235,0.35), inset 0 24px 70px rgba(56,189,248,0.22)',
            }}
          />
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{ height: '28%', background: 'radial-gradient(ellipse 70% 100% at 50% 100%, rgba(56,189,248,0.28), transparent 70%)', animation: 'atmosphere 6s ease-in-out infinite' }}
          />
        </div>

        {/* -------------------------------- Content -------------------------------- */}
        <div className="relative z-10 flex flex-col justify-center min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto w-full my-auto">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">

              {/* ---------------------------- Left Column ---------------------------- */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-5">
                {/* Badge */}
                <div
                  className="hero-rise inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 text-cyan-300 text-xs font-medium backdrop-blur-xl shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                  style={rise(0.1)}
                >
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-white font-semibold">Nilanjan Nayak</span>
                  <span className="text-white/30">•</span>
                  <span className="text-cyan-300/90">Powering Enterprise Intelligence</span>
                </div>

                {/* Title & Description */}
                <div className="space-y-3">
                  <h1
                    className="hero-rise hero-display text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-bold text-white leading-[1.12] tracking-tight"
                    style={rise(0.25)}
                  >
                    Next-Generation
                    <span className="block hero-gradient-text" style={{ minHeight: '1.2em' }}>
                      {word}
                      <span className="hero-title-caret" />
                    </span>
                  </h1>

                  <p className="hero-rise text-sm sm:text-base text-blue-100/80 leading-relaxed max-w-xl" style={rise(0.4)}>
                    Revolutionize your enterprise with our cutting-edge artificial intelligence platform. From neural networks to automated workflows, we deliver solutions that transform data into actionable insights and drive unprecedented growth.
                  </p>
                </div>

                {/* Features 2x2 grid */}
                <div className="hero-rise grid grid-cols-2 gap-2.5 sm:gap-3 max-w-lg py-1" style={rise(0.55)}>
                  {features.map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="group flex items-center space-x-2.5 p-2 rounded-xl bg-white/[0.03] border border-white/5 hover:border-cyan-400/30 hover:bg-white/[0.06] transition-all"
                    >
                      <div className="p-1.5 bg-blue-500/20 rounded-lg border border-blue-400/10 transition-colors duration-300 group-hover:bg-cyan-400/20 group-hover:border-cyan-300/40 shrink-0">
                        <Icon className="h-4 w-4 text-cyan-400" />
                      </div>
                      <span className="text-blue-200 text-xs sm:text-sm font-medium transition-colors duration-300 group-hover:text-white truncate">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="hero-rise flex flex-wrap items-center gap-3 pt-2" style={rise(0.7)}>
                  <button
                    onClick={() => scrollTo('projects')}
                    className="hero-btn inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 via-cyan-500 to-cyan-400 text-white text-sm font-semibold rounded-xl hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:scale-[1.02] transition-all duration-300"
                  >
                    Explore AI Solutions
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                  <button
                    onClick={() => scrollTo('contact')}
                    className="hero-btn inline-flex items-center justify-center px-6 py-3 bg-slate-900/70 border border-cyan-500/30 text-cyan-200 text-sm font-semibold rounded-xl hover:bg-cyan-500/10 hover:border-cyan-400/50 transition-all duration-300 backdrop-blur-xl"
                  >
                    <Play className="mr-2 h-4 w-4 text-cyan-400" />
                    See Live Demo
                  </button>
                </div>
              </div>

              {/* ---------------------------- Right Column ---------------------------- */}
              <div className="lg:col-span-5 hero-rise flex items-center justify-center mt-6 lg:mt-0" style={rise(0.4)}>
                <div className="w-full max-w-sm mx-auto">
                  <TerminalCard />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-10 hidden sm:block">
          <button
            onClick={() => scrollTo('projects')}
            className="flex flex-col items-center space-y-1 text-blue-200/80 hover:text-cyan-300 transition-colors duration-200 group"
          >
            <span className="text-xs sm:text-sm font-medium tracking-wide">Discover More</span>
            <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 animate-bounce group-hover:text-cyan-400 transition-colors duration-200" />
          </button>
        </div>

        {/* Corner logo */}
        <div
          className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-black/95 backdrop-blur-xl rounded-full px-5 py-2 pl-2 border-2 border-blue-500/30 shadow-2xl shadow-blue-500/20 transition-all duration-300 cursor-pointer hover:shadow-blue-400/30 hover:border-blue-400/50 group"
          title="Made by Star AI Lab"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-yellow-400/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <img
            src="/src/img/_Pngtree_n_circle_letter_initial_logo_4835121-removebg-preview.png"
            alt="Star AI Lab Logo"
            className="relative w-10 h-10 rounded-full border-2 border-blue-500/40 object-cover bg-white/10"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
              if (nextElement) nextElement.style.display = 'flex';
            }}
          />
          <span className="relative text-cyan-300 text-sm font-semibold transition-colors duration-300 group-hover:text-cyan-200">
            Made by Star AI Lab
          </span>
        </div>
      </section>
    </>
  );
};

export default Hero;