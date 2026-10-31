import { useEffect, useRef, useState } from 'react';
import type { HTMLAttributes, MouseEvent, ReactNode } from 'react';

/* ========================================================================== */
/*  Shared styles (injected once – no extra CSS import needed)                */
/* ========================================================================== */
const KIT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

.kit-display { font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif; letter-spacing: -0.03em; }
.kit-mono { font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace; }

@keyframes kitTwinkle { 0%, 100% { opacity: 0.35; } 50% { opacity: 1; } }
@keyframes kitDrift {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(40px, -30px) scale(1.1); }
}
@keyframes kitShift { to { background-position: 200% 50%; } }
@keyframes kitSpin { to { transform: rotate(360deg); } }
@keyframes kitPop { 0% { transform: scale(0.6); opacity: 0; } 70% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }

/* scroll reveal */
.kit-reveal { opacity: 0; transform: translateY(26px); filter: blur(4px); transition: opacity .9s cubic-bezier(.22,1,.36,1), transform .9s cubic-bezier(.22,1,.36,1), filter .9s cubic-bezier(.22,1,.36,1); }
.kit-reveal.kit-in { opacity: 1; transform: none; filter: none; }

/* section badge + gradient text */
.kit-badge { display: inline-flex; align-items: center; gap: .6rem; padding: .6rem 1.25rem; margin-bottom: 1.5rem; border-radius: 9999px; font-size: .875rem; font-weight: 500; color: #93c5fd; background: rgba(2,6,23,.55); border: 1px solid rgba(96,165,250,.3); backdrop-filter: blur(14px); box-shadow: 0 0 30px rgba(37,99,235,.15); }
.kit-gradient-text { display: block; padding-bottom: .15em; background: linear-gradient(90deg, #60a5fa, #67e8f9, #a78bfa, #60a5fa); background-size: 200% 100%; -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(0 0 22px rgba(56,189,248,.28)); animation: kitShift 7s linear infinite; }
.kit-gradient-inline { display: inline; }

/* cursor-spotlight glass card */
.kit-card { position: relative; border-radius: 1.25rem; background: linear-gradient(160deg, rgba(10,20,45,.72), rgba(3,8,22,.78)); border: 1px solid rgba(96,165,250,.14); backdrop-filter: blur(14px); transition: transform .4s cubic-bezier(.22,1,.36,1), border-color .3s, box-shadow .3s; }
.kit-card::before { content: ''; position: absolute; inset: 0; border-radius: inherit; background: radial-gradient(420px circle at var(--x, 50%) var(--y, 50%), rgba(34,211,238,.13), transparent 45%); opacity: 0; transition: opacity .3s; pointer-events: none; }
.kit-card::after { content: ''; position: absolute; inset: 0; border-radius: inherit; padding: 1px; background: radial-gradient(260px circle at var(--x, 50%) var(--y, 50%), rgba(103,232,249,.75), transparent 45%); -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude; opacity: 0; transition: opacity .3s; pointer-events: none; }
.kit-card:hover { transform: translateY(-4px); box-shadow: 0 20px 50px rgba(0,0,0,.45), 0 0 40px rgba(34,211,238,.07); }
.kit-card:hover::before, .kit-card:hover::after { opacity: 1; }

/* rotating light around a frame */
.kit-glow-border { position: relative; overflow: hidden; padding: 1px; background: rgba(59,130,246,.18); box-shadow: 0 25px 60px rgba(0,0,0,.5), 0 0 60px rgba(37,99,235,.12); }
.kit-glow-border::before { content: ''; position: absolute; inset: -60%; background: conic-gradient(from 0deg, transparent 0 58%, #22d3ee 76%, #a78bfa 90%, transparent 100%); animation: kitSpin 8s linear infinite; }
.kit-glow-border > * { position: relative; }

/* button shine */
.kit-btn { position: relative; overflow: hidden; }
.kit-btn::after { content: ''; position: absolute; top: 0; left: -60%; width: 40%; height: 100%; background: linear-gradient(100deg, transparent, rgba(255,255,255,.35), transparent); transform: skewX(-20deg); transition: left .7s ease; }
.kit-btn:hover::after { left: 130%; }

/* floating-label fields */
.kit-field { position: relative; }
.kit-field input, .kit-field textarea { width: 100%; padding: 1.5rem 1rem .6rem; font-size: .95rem; color: #fff; background: rgba(2,6,23,.6); border: 1px solid rgba(96,165,250,.22); border-radius: .9rem; outline: none; transition: border-color .25s, box-shadow .25s; }
.kit-field textarea { resize: none; }
.kit-field label { position: absolute; left: 1rem; top: 1rem; font-size: .95rem; color: rgba(147,197,253,.6); pointer-events: none; transform-origin: left top; transition: transform .2s ease, color .2s ease; }
.kit-field input:focus, .kit-field textarea:focus { border-color: rgba(34,211,238,.7); box-shadow: 0 0 0 3px rgba(34,211,238,.12), 0 0 28px rgba(34,211,238,.12); }
.kit-field input:focus + label, .kit-field textarea:focus + label,
.kit-field input:not(:placeholder-shown) + label, .kit-field textarea:not(:placeholder-shown) + label { transform: translateY(-.62rem) scale(.78); color: #67e8f9; }

@media (prefers-reduced-motion: reduce) {
  .kit-reveal { opacity: 1; transform: none; filter: none; transition: none; }
  .kit-gradient-text, .kit-glow-border::before { animation: none; }
}
`;

if (typeof document !== 'undefined' && !document.getElementById('star-kit-styles')) {
    const el = document.createElement('style');
    el.id = 'star-kit-styles';
    el.textContent = KIT_CSS;
    document.head.appendChild(el);
}

/* ========================================================================== */
/*  Cosmic backdrop – ONE fixed canvas behind the whole page, so every        */
/*  section sits in the same continuous universe (no seams between sections)  */
/* ========================================================================== */
const buildGalaxyLite = (): HTMLCanvasElement => {
    const S = 800;
    const c = document.createElement('canvas');
    c.width = c.height = S;
    const g = c.getContext('2d')!;
    const cx = S / 2;
    const R = S * 0.46;
    g.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 5200; i++) {
        const t = Math.pow(Math.random(), 1.45);
        const j = Math.random() + Math.random() + Math.random() - 1.5;
        const a = t * 5.2 + (i % 4) * (Math.PI / 2) + j * (0.3 + (1 - t) * 0.9);
        const r = t * R + (Math.random() - 0.5) * 10;
        const core = t < 0.18;
        g.fillStyle = `hsla(${core ? 38 : 200 + t * 90},90%,${core ? 82 : 68 + Math.random() * 18}%,${0.3 + Math.random() * 0.6})`;
        const sz = 0.6 + Math.random();
        g.fillRect(cx + Math.cos(a) * r, cx + Math.sin(a) * r, sz, sz);
    }
    const core = g.createRadialGradient(cx, cx, 0, cx, cx, R * 0.3);
    core.addColorStop(0, 'rgba(255,244,225,0.55)');
    core.addColorStop(0.4, 'rgba(140,185,255,0.18)');
    core.addColorStop(1, 'rgba(60,110,255,0)');
    g.fillStyle = core;
    g.fillRect(0, 0, S, S);
    return c;
};

const startCosmos = () => {
    const host = document.createElement('div');
    host.setAttribute('aria-hidden', 'true');
    // z-index -1: if some wrapper has its own opaque background the page simply stays plain dark (never hides content)
    host.style.cssText = 'position:fixed;inset:0;z-index:-1;pointer-events:none;background:#02040a';
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'width:100%;height:100%;display:block';
    host.appendChild(canvas);
    document.body.insertBefore(host, document.body.firstChild);
    const ctx = canvas.getContext('2d');
    if (!ctx) return () => host.remove();

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const galaxy = buildGalaxyLite();
    const COLORS = ['255,255,255', '190,215,255', '160,200,255', '255,232,205'];
    let w = 0, h = 0, dpr = 1, raf = 0, t = 0, sy = 0, nextShoot = 5;
    let last = performance.now();
    let stars: { x: number; y: number; z: number; r: number; a: number; tw: number; ph: number; c: string }[] = [];
    const shooter = { on: false, x: 0, y: 0, life: 0 };

    const resize = () => {
        dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        stars = Array.from({ length: Math.min(420, Math.floor((w * h) / 5000)) }, () => {
            const z = Math.random() < 0.55 ? 0.25 : Math.random() < 0.7 ? 0.6 : 1;
            return { x: Math.random() * w, y: Math.random() * h, z, r: 0.3 + z * (0.5 + Math.random() * 0.9), a: 0.3 + Math.random() * 0.7, tw: 0.6 + Math.random() * 2, ph: Math.random() * 6.28, c: COLORS[Math.floor(Math.random() * 4)] };
        });
    };
    const onScroll = () => { sy = window.scrollY; if (reduce) draw(performance.now()); };

    const draw = (now: number) => {
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        t += dt;
        const max = Math.max(1, document.documentElement.scrollHeight - h);
        const p = Math.min(1, Math.max(0, sy / max)); // 0 → 1 down the page

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#02040a';
        ctx.fillRect(0, 0, w, h);

        // nebula washes – hue drifts blue → violet → cyan as you scroll
        const washes: [number, number, number, number, number][] = [
            [0.2 + Math.sin(t * 0.07) * 0.05, 0.25, 0.55, 225 + p * 70, 0.16],
            [0.85, 0.75 + Math.cos(t * 0.06) * 0.05, 0.6, 270 - p * 70, 0.13],
            [0.5, 0.5, 0.45, 195 + p * 40, 0.07],
        ];
        for (const [nx, ny, nr, hue, al] of washes) {
            const cx = nx * w, cy = ny * h - ((sy * 0.05) % h), r = nr * Math.max(w, h);
            const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
            g.addColorStop(0, `hsla(${hue},85%,55%,${al})`);
            g.addColorStop(1, `hsla(${hue},85%,55%,0)`);
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, w, h);
        }

        // slowly rotating galaxy that glides across the page as you scroll
        const sc = (Math.max(w, 900) / 800) * 1.05;
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 0.3;
        ctx.translate(w * (0.82 - p * 0.64), h * 0.5 - sy * 0.04);
        ctx.rotate(-0.35);
        ctx.scale(sc, sc * 0.42);
        ctx.rotate(t * 0.025);
        ctx.drawImage(galaxy, -galaxy.width / 2, -galaxy.height / 2);
        ctx.restore();

        // parallax stars (deeper stars scroll slower)
        ctx.globalCompositeOperation = 'source-over';
        for (const st of stars) {
            const y = (((st.y - sy * 0.35 * st.z) % h) + h) % h;
            const a = st.a * (0.55 + 0.45 * Math.sin(t * st.tw + st.ph));
            ctx.fillStyle = `rgba(${st.c},${a})`;
            ctx.beginPath();
            ctx.arc(st.x, y, st.r, 0, 6.283);
            ctx.fill();
        }

        // an occasional shooting star
        if (!reduce) {
            nextShoot -= dt;
            if (nextShoot <= 0 && !shooter.on) { shooter.on = true; shooter.x = Math.random() * w * 0.7; shooter.y = Math.random() * h * 0.4; shooter.life = 0; nextShoot = 6 + Math.random() * 6; }
            if (shooter.on) {
                shooter.life += dt;
                shooter.x += 820 * dt; shooter.y += 330 * dt;
                const a = Math.sin(Math.min(1, shooter.life / 1.1) * Math.PI);
                const g = ctx.createLinearGradient(shooter.x - 130, shooter.y - 52, shooter.x, shooter.y);
                g.addColorStop(0, 'rgba(200,230,255,0)');
                g.addColorStop(1, `rgba(220,240,255,${a})`);
                ctx.strokeStyle = g;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(shooter.x - 130, shooter.y - 52);
                ctx.lineTo(shooter.x, shooter.y);
                ctx.stroke();
                if (shooter.life > 1.1) shooter.on = false;
            }
            raf = requestAnimationFrame(draw);
        }
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', onScroll, { passive: true });
    sy = window.scrollY;
    raf = requestAnimationFrame(draw);

    return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', resize);
        window.removeEventListener('scroll', onScroll);
        host.remove();
    };
};

let cosmosUsers = 0;
let cosmosStop: (() => void) | null = null;
export const useCosmos = () => {
    useEffect(() => {
        if (cosmosUsers++ === 0) cosmosStop = startCosmos();
        return () => {
            if (--cosmosUsers === 0) { cosmosStop?.(); cosmosStop = null; }
        };
    }, []);
};

/* ========================================================================== */
/*  Section shell – transparent, so the shared backdrop shows through         */
/* ========================================================================== */
type Tone = 'blue' | 'violet' | 'cyan';
const TONES: Record<Tone, [string, string]> = {
    blue: ['rgba(37,99,235,.14)', 'rgba(6,182,212,.09)'],
    violet: ['rgba(124,58,237,.13)', 'rgba(37,99,235,.09)'],
    cyan: ['rgba(6,182,212,.12)', 'rgba(37,99,235,.11)'],
};

export const SectionShell = ({
    id, children, tone = 'blue', bare = false, className = '', ...rest
}: { children: ReactNode; tone?: Tone; bare?: boolean } & HTMLAttributes<HTMLElement>) => {
    useCosmos();
    return (
        <section id={id} className={`relative overflow-hidden py-24 sm:py-28 scroll-mt-24 ${className}`} {...rest}>
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                {/* soft scrim for legibility – fades to nothing at both edges, so sections melt into each other */}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(2,4,10,0) 0%, rgba(2,4,10,.5) 20%, rgba(2,4,10,.5) 80%, rgba(2,4,10,0) 100%)' }} />
                <div className="absolute rounded-full blur-3xl" style={{ top: '12%', left: '2%', width: 460, height: 460, background: TONES[tone][0], animation: 'kitDrift 26s ease-in-out infinite' }} />
                <div className="absolute rounded-full blur-3xl" style={{ bottom: '10%', right: '2%', width: 520, height: 520, background: TONES[tone][1], animation: 'kitDrift 32s ease-in-out infinite reverse' }} />
            </div>
            {bare ? <div className="relative z-10">{children}</div> : <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>}
        </section>
    );
};

/* ========================================================================== */
/*  Reveal on scroll                                                          */
/* ========================================================================== */
export const useReveal = <T extends HTMLElement>() => {
    const ref = useRef<T>(null);
    const [shown, setShown] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
            setShown(true);
            return;
        }
        const io = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);
    return [ref, shown] as const;
};

export const Reveal = ({
    children, delay = 0, className = '', style, ...rest
}: { children: ReactNode; delay?: number } & HTMLAttributes<HTMLDivElement>) => {
    const [ref, shown] = useReveal<HTMLDivElement>();
    return (
        <div ref={ref} {...rest} className={`kit-reveal ${shown ? 'kit-in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms`, ...style }}>
            {children}
        </div>
    );
};

/* ========================================================================== */
/*  Spotlight card, header, count-up                                          */
/* ========================================================================== */
export const onSpot = (e: MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--x', `${e.clientX - r.left}px`);
    el.style.setProperty('--y', `${e.clientY - r.top}px`);
};

export const SpotlightCard = ({ children, className = '', ...rest }: { children: ReactNode } & HTMLAttributes<HTMLDivElement>) => (
    <div {...rest} onMouseMove={onSpot} className={`kit-card ${className}`}>
        {children}
    </div>
);

export const SectionHeader = ({
    icon, badge, title, highlight, subtitle, headingId,
}: { icon: ReactNode; badge: string; title: string; highlight: string; subtitle?: string; headingId?: string }) => (
    <Reveal className="text-center mb-14 sm:mb-16">
        <div className="kit-badge">
            <span className="text-cyan-400">{icon}</span>
            {badge}
        </div>
        <h2 id={headingId} className="kit-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.1] mb-5">
            {title}
            <span className="kit-gradient-text">{highlight}</span>
        </h2>
        {subtitle && <p className="text-lg md:text-xl text-blue-200/80 max-w-3xl mx-auto leading-relaxed">{subtitle}</p>}
    </Reveal>
);

/* "1+" → counts 0 → 1 and keeps the "+" */
export const CountUp = ({ value, className = '' }: { value: string | number; className?: string }) => {
    const m = /^(\d+(?:\.\d+)?)(.*)$/.exec(String(value).trim());
    const target = m ? parseFloat(m[1]) : 0;
    const decimals = m ? (m[1].split('.')[1] || '').length : 0;
    const [ref, shown] = useReveal<HTMLSpanElement>();
    const [n, setN] = useState(0);

    useEffect(() => {
        if (!shown || !m) return;
        let raf = 0;
        const start = performance.now();
        const tick = (now: number) => {
            const p = Math.min((now - start) / 1400, 1);
            setN(target * (1 - Math.pow(1 - p, 3)));
            if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shown, target]);

    if (!m) return <span className={className}>{value}</span>;
    return (
        <span ref={ref} className={className}>
            {(shown ? n : 0).toFixed(decimals)}
            {m[2]}
        </span>
    );
};