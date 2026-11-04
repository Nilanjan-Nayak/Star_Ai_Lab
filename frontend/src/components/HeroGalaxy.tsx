import { useEffect, useRef } from 'react';

const WARP_SECONDS = 2.6; // intro hyperspace duration (0 = skip)

/* ========================================================================== */
/*  Galaxy canvas: warp intro + spiral galaxy + stars + neural constellation  */
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
                warps = Array.from({ length: 240 }, () => ({ a: Math.random() * Math.PI * 2, r: Math.random() * Math.max(w, h) * 0.6, s: 0.6 + Math.random() * 0.8 }));
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
            const e = wp * wp; // warp intensity (1 → 0)
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

export { GalaxyCanvas };