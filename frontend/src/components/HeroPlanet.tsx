import { useEffect, useRef, useState } from 'react';

/* ========================================================================== */
/*  3D planet + moon (raw WebGL, no libraries)                                */
/*  - domain-warped continents with relief shading, shallow seas, ice caps    */
/*  - drifting clouds, sunset terminator, cyan city lights on the night side  */
/*  - layered atmosphere; sun glint follows the cursor                        */
/*  - a small moon that gives the scene real depth                            */
/*  - SCROLL: planet spins, swells and sinks; the moon drifts across          */
/*  - adaptive resolution: drops quality automatically on slow GPUs           */
/* ========================================================================== */

const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
#extension GL_OES_standard_derivatives : enable
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uRot;
uniform float uCrest;
uniform float uRadius;
uniform float uFade;
uniform vec2 uMouse;
uniform vec3 uMoon; // centre x, centre y, radius (device px)

float hash(vec3 p) {
  p = fract(p * 0.3183099 + vec3(0.1));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}
float noise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash(i), hash(i + vec3(1.0, 0.0, 0.0)), f.x),
        mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
    mix(mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), f.x),
        mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), f.x), f.y),
    f.z);
}
float fbm5(vec3 p) {
  float a = 0.5; float s = 0.0;
  for (int i = 0; i < 5; i++) { s += a * noise(p); p *= 2.02; a *= 0.5; }
  return s;
}
float fbm4(vec3 p) {
  float a = 0.5; float s = 0.0;
  for (int i = 0; i < 4; i++) { s += a * noise(p); p *= 2.02; a *= 0.5; }
  return s;
}

// the moon: returns colour (rgb) and coverage (a)
vec4 moonLayer(vec2 frag, vec3 L) {
  vec2 d = (frag - uMoon.xy) / uMoon.z;
  float r = length(d);
  if (r >= 1.0) return vec4(0.0);
  float z = sqrt(1.0 - r * r);
  vec3 n = vec3(d, z);
  float ca = cos(uRot * 0.6), sa = sin(uRot * 0.6);
  vec3 q = vec3(n.x * ca + n.z * sa, n.y, -n.x * sa + n.z * ca);
  float tone = fbm4(q * 4.0 + 9.0);
  float crater = smoothstep(0.52, 0.66, fbm4(q * 9.0));
  vec3 base = mix(vec3(0.40, 0.45, 0.55), vec3(0.74, 0.78, 0.86), tone) * (1.0 - 0.35 * crater);
  float diff = clamp(dot(n, L), 0.0, 1.0);
  vec3 col = base * (0.05 + 1.15 * diff) + pow(1.0 - z, 3.0) * vec3(0.3, 0.5, 0.9) * 0.15;
  return vec4(col, 1.0 - smoothstep(1.0 - 1.5 / uMoon.z, 1.0, r));
}

void main() {
  vec2 c = vec2(uRes.x * 0.5, uCrest - uRadius);        // planet centre (below the bottom edge)
  vec2 d = (gl_FragCoord.xy - c) / uRadius;
  float r = length(d);

  vec3 L = normalize(vec3(0.55 + uMouse.x * 0.25, 0.5 - uMouse.y * 0.15, 0.65)); // sun direction
  float lit = clamp(dot(normalize(vec3(d, 0.35)), L) * 0.5 + 0.55, 0.0, 1.0);
  vec3 atm = mix(vec3(0.10, 0.35, 0.95), vec3(0.35, 0.85, 1.0), lit);

  // layered atmosphere outside the limb: tight bright shell + wide soft haze
  float out_ = max(r - 1.0, 0.0);
  float shell = exp(-out_ * 38.0) * 0.9 + exp(-out_ * 9.0) * 0.32;
  vec3 haze = atm * shell * (0.35 + 0.65 * lit);

  vec3 outc = vec3(0.0);
  float cov = 0.0;

  if (r < 1.0) {
    float z = sqrt(1.0 - r * r);
    vec3 n = vec3(d, z);

    // spin (time + scroll) with a slight axial tilt
    float ca = cos(uRot), sa = sin(uRot);
    vec3 q = vec3(n.x * ca + n.z * sa, n.y, -n.x * sa + n.z * ca);
    float tc = cos(0.45), ts = sin(0.45);
    q = vec3(q.x, q.y * tc - q.z * ts, q.y * ts + q.z * tc);

    // domain-warped continents
    float warp = fbm4(q * 1.3 + 7.0);
    float h = fbm5(q * 2.1 + warp * 1.7 + 3.7);
    float land = smoothstep(0.52, 0.58, h);
    float shallow = smoothstep(0.40, 0.52, h) * (1.0 - land);
    float dtl = fbm4(q * 7.0);

    vec3 ocean = mix(vec3(0.004, 0.02, 0.09), vec3(0.02, 0.12, 0.30), dtl);
    ocean = mix(ocean, vec3(0.03, 0.30, 0.52), shallow * 0.9);
    vec3 ground = mix(vec3(0.03, 0.09, 0.20), vec3(0.14, 0.34, 0.52), dtl);
    ground = mix(ground, vec3(0.22, 0.42, 0.60), smoothstep(0.62, 0.80, h));
    vec3 surf = mix(ocean, ground, land);
    float ice = smoothstep(0.74, 0.92, abs(q.y) + (h - 0.5) * 0.35);
    surf = mix(surf, vec3(0.82, 0.92, 1.0), ice);

    // relief: light the slopes using screen-space derivatives of the height
    float bump = 1.0;
#ifdef GL_OES_standard_derivatives
    vec2 g = vec2(dFdx(h), dFdy(h)) * uRadius * 0.08;
    bump = 1.0 + clamp(dot(g, L.xy) * 4.0, -0.45, 0.45) * land;
#endif

    float cl = smoothstep(0.50, 0.78, fbm4(q * 3.4 + vec3(uTime * 0.012, 0.0, 0.0)));

    float ndl = dot(n, L);
    float diff = clamp(ndl * 1.1 + 0.05, 0.0, 1.0);
    vec3 col = surf * bump * (0.10 + 1.7 * diff);
    col += cl * vec3(0.8, 0.92, 1.0) * (0.04 + 0.85 * diff);

    // soft sunset glow along the terminator
    float band = exp(-pow((ndl - 0.05) * 5.0, 2.0));
    col += band * vec3(0.90, 0.45, 0.65) * (0.05 + cl * 0.22);

    // cyan city lights on the night side, hugging the coasts
    float night = 1.0 - smoothstep(-0.05, 0.22, ndl);
    float city = smoothstep(0.60, 0.85, dtl) * land * (1.0 - smoothstep(0.66, 0.80, h)) * night * (1.0 - cl * 0.7);
    col += city * vec3(0.45, 0.85, 1.0) * 0.95;

    // sun glint on open water
    vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
    col += pow(max(dot(n, H), 0.0), 70.0) * (1.0 - land) * (1.0 - cl) * 0.5;

    // atmospheric rim
    col += pow(1.0 - z, 3.0) * atm * (0.25 + 1.1 * clamp(ndl + 0.3, 0.0, 1.0));

    outc = col;
    cov = 1.0 - smoothstep(1.0 - 1.6 / uRadius, 1.0, r);
  }

  vec3 rgb = outc * cov + haze * (1.0 - cov);
  float a = cov;

  vec4 m = moonLayer(gl_FragCoord.xy, L);
  rgb = rgb * (1.0 - m.a) + m.rgb * m.a;
  a = a + m.a * (1.0 - a);

  gl_FragColor = vec4(rgb * uFade, a * uFade);
}
`;

const smooth = (a: number, b: number, x: number) => {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
};

export const HeroPlanet = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fallbackRef = useRef<HTMLDivElement>(null);
    const [fallback, setFallback] = useState(false);

    /* ----------------------------- WebGL planet ----------------------------- */
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false }) as WebGLRenderingContext | null;
        if (!gl) { setFallback(true); return; }
        gl.getExtension('OES_standard_derivatives'); // relief shading (optional)

        const compile = (type: number, src: string) => {
            const s = gl.createShader(type)!;
            gl.shaderSource(s, src);
            gl.compileShader(s);
            if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; }
            return s;
        };
        const vs = compile(gl.VERTEX_SHADER, VERT);
        const fs = compile(gl.FRAGMENT_SHADER, FRAG);
        if (!vs || !fs) { setFallback(true); return; }

        const prog = gl.createProgram()!;
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { setFallback(true); return; }
        gl.useProgram(prog);

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(prog, 'p');
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

        const U = (n: string) => gl.getUniformLocation(prog, n);
        const uRes = U('uRes'), uTime = U('uTime'), uRot = U('uRot'), uCrest = U('uCrest'), uRadius = U('uRadius'), uFade = U('uFade'), uMouse = U('uMouse'), uMoon = U('uMoon');

        let dprCap = Math.min(window.devicePixelRatio || 1, 1.25);
        let dpr = dprCap, cw = 0, ch = 0, raf = 0, t = 0, acc = 0, frames = 0;
        let last = performance.now();
        const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

        const resize = () => {
            dpr = dprCap;
            cw = window.innerWidth;
            ch = canvas.clientHeight;
            canvas.width = Math.floor(cw * dpr);
            canvas.height = Math.floor(ch * dpr);
            gl.viewport(0, 0, canvas.width, canvas.height);
        };
        const onMove = (e: MouseEvent) => {
            mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
            mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
        };

        const draw = (now: number) => {
            const dt = Math.min((now - last) / 1000, 0.05);
            last = now;
            if (!reduce) t += dt;
            mouse.x += (mouse.tx - mouse.x) * 0.05;
            mouse.y += (mouse.ty - mouse.y) * 0.05;

            const sy = window.scrollY;
            const p = Math.min(1, sy / (window.innerHeight * 0.9)); // 0 at top → 1 once the hero has scrolled away
            const fade = 1 - smooth(0.65, 1, p);
            canvas.style.visibility = fade <= 0.001 ? 'hidden' : 'visible';
            if (fade <= 0.001) return;

            // adaptive quality: if the GPU struggles, quietly render at a lower resolution
            if (!reduce) {
                acc += dt; frames++;
                if (frames === 90) {
                    if (acc / frames > 0.028 && dprCap > 0.6) { dprCap = Math.max(0.6, dprCap - 0.2); resize(); }
                    acc = 0; frames = 0;
                }
            }

            const R = Math.max(cw * 0.62, 520) * (1 + 0.2 * p);        // planet swells as you scroll
            const crest = ch * 0.4 * (1 - p) - p * 0.12 * ch;          // …and sinks below the horizon

            const mr = Math.max(32, Math.min(54, cw * 0.028));          // moon (css px)
            const mx = Math.min(cw - mr - 14, cw * (0.9 - 0.22 * p));
            const my = ch * 0.22 - p * ch * 0.1;

            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.uniform2f(uRes, canvas.width, canvas.height);
            gl.uniform1f(uTime, t);
            gl.uniform1f(uRot, t * 0.04 + sy * 0.0035);                 // scrolling spins the planet
            gl.uniform1f(uCrest, crest * dpr);
            gl.uniform1f(uRadius, R * dpr);
            gl.uniform1f(uFade, fade);
            gl.uniform2f(uMouse, mouse.x, mouse.y);
            gl.uniform3f(uMoon, mx * dpr, my * dpr, mr * dpr);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        };

        const loop = (now: number) => { draw(now); raf = requestAnimationFrame(loop); };
        const onScroll = () => draw(performance.now());

        resize();
        window.addEventListener('resize', resize);
        if (reduce) {
            window.addEventListener('scroll', onScroll, { passive: true });
            draw(performance.now());
        } else {
            window.addEventListener('mousemove', onMove, { passive: true });
            raf = requestAnimationFrame(loop);
        }

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('mousemove', onMove);
            gl.getExtension('WEBGL_lose_context')?.loseContext();
        };
    }, []);

    /* ------------------- CSS fallback (no WebGL available) ------------------- */
    useEffect(() => {
        if (!fallback) return;
        const el = fallbackRef.current;
        if (!el) return;
        const onScroll = () => {
            const p = Math.min(1, window.scrollY / (window.innerHeight * 0.9));
            el.style.transform = `translate(-50%, ${p * 45}vh)`;
            el.style.opacity = String(1 - smooth(0.65, 1, p));
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, [fallback]);

    if (fallback) {
        return (
            <div
                ref={fallbackRef}
                aria-hidden="true"
                className="pointer-events-none fixed left-1/2 z-[1] rounded-full"
                style={{
                    top: '69vh', width: '170vw', height: '170vw', transform: 'translateX(-50%)',
                    background: 'radial-gradient(circle at 50% 0%, #0a1733 0%, #030816 35%, #000 65%)',
                    boxShadow: '0 -1px 0 rgba(186,230,253,0.8), 0 -10px 50px rgba(56,189,248,0.45), 0 -40px 140px rgba(37,99,235,0.35), inset 0 24px 70px rgba(56,189,248,0.22)',
                }}
            />
        );
    }

    return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed bottom-0 left-0 z-[1] w-full" style={{ height: '78vh' }} />;
};