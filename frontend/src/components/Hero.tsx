import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, Play, ChevronDown, Code, Cpu, Zap, Brain, Clock, Calendar } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const Hero = () => {
  const { getContent } = useContent();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit', second: '2-digit' });
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  // CSS animations for non-star elements only
  const starAnimationStyles = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes nebula {
      0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.06; }
      33% { transform: scale(1.08) rotate(120deg); opacity: 0.10; }
      66% { transform: scale(0.95) rotate(240deg); opacity: 0.04; }
    }
    @keyframes backgroundShift {
      0%, 100% { transform: translate(0, 0) scale(1); }
      25% { transform: translate(12px, -14px) scale(1.06); }
      50% { transform: translate(-8px, 18px) scale(0.94); }
      75% { transform: translate(18px, 6px) scale(1.03); }
    }
    @keyframes orbPulse {
      0%, 100% { transform: scale(1); opacity: 0.7; }
      50% { transform: scale(1.15); opacity: 1; }
    }
    @keyframes clockGlow {
      0%, 100% { box-shadow: 0 0 20px rgba(34,211,238,0.15), 0 0 40px rgba(34,211,238,0.05), inset 0 1px 0 rgba(255,255,255,0.08); }
      50% { box-shadow: 0 0 30px rgba(34,211,238,0.25), 0 0 60px rgba(34,211,238,0.10), inset 0 1px 0 rgba(255,255,255,0.12); }
    }
    @keyframes livePulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }
    @keyframes scanLine {
      0% { transform: translateY(-100%); opacity: 0; }
      10% { opacity: 0.4; }
      90% { opacity: 0.4; }
      100% { transform: translateY(100%); opacity: 0; }
    }
    @keyframes hudSlideIn {
      from { opacity: 0; transform: translateY(-16px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;

  // === CINEMATIC CANVAS ANIMATION ===
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const seededRandom = useCallback((seed: number) => {
    const x = Math.sin(seed * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.parentElement?.getBoundingClientRect();
      w = rect?.width || window.innerWidth;
      h = rect?.height || window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // ─── TYPES ───────────────────────────────────────────────
    interface Star {
      x: number; y: number; z: number; // z = depth layer 0-1
      size: number; baseAlpha: number;
      color: [number,number,number];
      f1: number; p1: number; f2: number; p2: number; f3: number; p3: number;
    }
    interface NebulaCloud {
      x: number; y: number; rx: number; ry: number;
      hue: number; alpha: number;
      driftX: number; driftY: number;
      rotSpeed: number; rot: number;
    }
    interface AuroraRibbon {
      baseY: number;      // anchor Y position (fraction of h)
      amplitude: number;  // wave height
      freq: number;       // horizontal wave frequency
      phase: number;      // time phase offset
      speed: number;      // animation speed
      hue: number;        // colour hue
      alpha: number;      // peak opacity
      width: number;      // ribbon thickness
    }
    interface Meteor {
      x: number; y: number; vx: number; vy: number;
      life: number; maxLife: number; size: number;
      trail: Array<{x:number;y:number;a:number}>;
      active: boolean; cooldown: number;
      hue: number;
    }

    // ─── STARS (3 depth layers) ───────────────────────────────
    const starPalette: [number,number,number][] = [
      [255,255,255],[255,255,255],[255,255,255],
      [200,220,255],[255,240,210],[180,210,255],[255,230,180],
    ];
    const stars: Star[] = [];
    const starLayers = [
      { count:320, sMin:0.15, sMax:0.4, aMin:0.04, aMax:0.18, z:0.2 },
      { count:130, sMin:0.35, sMax:0.75, aMin:0.10, aMax:0.38, z:0.5 },
      { count:50, sMin:0.7, sMax:1.4, aMin:0.28, aMax:0.70, z:0.8 },
      { count:12, sMin:1.3, sMax:2.0, aMin:0.55, aMax:0.95, z:1.0 },
    ];
    let seed = 1;
    starLayers.forEach(l => {
      for (let i = 0; i < l.count; i++) {
        seed++;
        stars.push({
          x: seededRandom(seed*1)*w, y: seededRandom(seed*2)*h,
          z: l.z,
          size: l.sMin + seededRandom(seed*3)*(l.sMax-l.sMin),
          baseAlpha: l.aMin + seededRandom(seed*4)*(l.aMax-l.aMin),
          color: starPalette[Math.floor(seededRandom(seed*5)*starPalette.length)],
          f1: 0.2+seededRandom(seed*6)*1.2, p1: seededRandom(seed*7)*Math.PI*2,
          f2: 0.5+seededRandom(seed*8)*2.0, p2: seededRandom(seed*9)*Math.PI*2,
          f3: 1.0+seededRandom(seed*10)*3.5, p3: seededRandom(seed*11)*Math.PI*2,
        });
      }
    });

    // ─── NEBULA GAS CLOUDS ────────────────────────────────────
    const nebulae: NebulaCloud[] = [
      { x:w*0.15, y:h*0.25, rx:340, ry:220, hue:220, alpha:0.06, driftX:0.06, driftY:0.03, rotSpeed:0.00015, rot:0 },
      { x:w*0.78, y:h*0.55, rx:280, ry:190, hue:200, alpha:0.05, driftX:-0.05, driftY:0.04, rotSpeed:-0.0002, rot:1 },
      { x:w*0.50, y:h*0.75, rx:380, ry:180, hue:260, alpha:0.04, driftX:0.04, driftY:-0.03, rotSpeed:0.0001, rot:2 },
      { x:w*0.88, y:h*0.18, rx:200, ry:160, hue:190, alpha:0.045, driftX:-0.06, driftY:0.05, rotSpeed:0.00018, rot:3 },
      { x:w*0.30, y:h*0.70, rx:250, ry:200, hue:240, alpha:0.035, driftX:0.05, driftY:-0.04, rotSpeed:-0.00012, rot:4 },
    ];

    // ─── AURORA RIBBONS ───────────────────────────────────────
    const auroras: AuroraRibbon[] = [
      { baseY:0.22, amplitude:0.08, freq:1.4, phase:0,    speed:0.18, hue:185, alpha:0.07, width:180 },
      { baseY:0.30, amplitude:0.06, freq:1.8, phase:2.1,  speed:0.14, hue:210, alpha:0.055, width:140 },
      { baseY:0.18, amplitude:0.10, freq:1.1, phase:4.2,  speed:0.22, hue:170, alpha:0.045, width:160 },
      { baseY:0.38, amplitude:0.05, freq:2.2, phase:1.0,  speed:0.12, hue:240, alpha:0.04, width:120 },
    ];

    // ─── FLOWING PARTICLES (neural-net nodes) ─────────────────
    interface FlowParticle {
      x: number; y: number; vx: number; vy: number;
      life: number; maxLife: number; hue: number; size: number;
    }
    const flowParticles: FlowParticle[] = Array.from({length: 55}, () => ({
      x: Math.random()*w, y: Math.random()*h,
      vx: (Math.random()-0.5)*0.32, vy: (Math.random()-0.5)*0.32,
      life: Math.random()*300, maxLife: 300+Math.random()*200,
      hue: 190+Math.random()*75, size: 0.9+Math.random()*1.4,
    }));
    const LINK_DIST = 125;

    // ─── SHOOTING STARS ───────────────────────────────────────
    const meteors: Meteor[] = Array.from({length:3}, () => ({
      x:0,y:0,vx:0,vy:0,life:0,maxLife:0,size:0,
      trail:[],active:false,cooldown:600+Math.random()*2400,hue:200,
    }));
    const spawnMeteor = (m: Meteor) => {
      m.x = w*0.05 + Math.random()*w*0.6;
      m.y = -10 + Math.random()*h*0.25;
      const angle = 18+Math.random()*24;
      const speed = 6+Math.random()*9;
      const rad = angle*Math.PI/180;
      m.vx = Math.cos(rad)*speed; m.vy = Math.sin(rad)*speed;
      m.maxLife = 50+Math.random()*40; m.life = m.maxLife;
      m.size = 0.8+Math.random()*0.8; m.trail = []; m.active = true;
      m.hue = 190+Math.random()*40;
    };

    let time = 0;

    const drawAurora = (a: AuroraRibbon) => {
      const steps = 80;
      const yMid = a.baseY * h;
      // draw top half and bottom half of ribbon
      for (let pass = 0; pass < 2; pass++) {
        const sign = pass === 0 ? -1 : 1;
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
          const xf = i/steps;
          const xp = xf * w;
          const wave = Math.sin(xf*Math.PI*a.freq*2 + time*a.speed + a.phase)
                      + 0.35*Math.sin(xf*Math.PI*a.freq*3.7 + time*a.speed*1.4 + a.phase+1)
                      + 0.15*Math.sin(xf*Math.PI*a.freq*7 + time*a.speed*2.1 + a.phase+2);
          const yOff = wave * a.amplitude * h;
          const edgeFade = Math.sin(xf*Math.PI); // fade at edges
          const yp = yMid + yOff + sign*(a.width*0.5)*edgeFade;
          if (i === 0) ctx.moveTo(xp, yp); else ctx.lineTo(xp, yp);
        }
        // close back to center
        for (let i = steps; i >= 0; i--) {
          const xf = i/steps;
          const xp = xf * w;
          const wave = Math.sin(xf*Math.PI*a.freq*2 + time*a.speed + a.phase)
                      + 0.35*Math.sin(xf*Math.PI*a.freq*3.7 + time*a.speed*1.4 + a.phase+1);
          const yOff = wave * a.amplitude * h;
          ctx.lineTo(xp, yMid + yOff);
        }
        ctx.closePath();
        const grad = ctx.createLinearGradient(0, yMid - a.width, 0, yMid + a.width);
        grad.addColorStop(0, `hsla(${a.hue},90%,65%,0)`);
        grad.addColorStop(0.4, `hsla(${a.hue},90%,65%,${a.alpha})`);
        grad.addColorStop(0.6, `hsla(${a.hue+15},85%,70%,${a.alpha*0.7})`);
        grad.addColorStop(1, `hsla(${a.hue},90%,65%,0)`);
        ctx.fillStyle = grad;
        ctx.fill();
      }
    };

    const drawNebulaCloud = (n: NebulaCloud) => {
      ctx.save();
      ctx.translate(n.x, n.y);
      ctx.rotate(n.rot);
      // multi-stop radial gradient for a wispy cloud look
      const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(n.rx,n.ry));
      grd.addColorStop(0,   `hsla(${n.hue},80%,70%,${n.alpha})`);
      grd.addColorStop(0.3, `hsla(${n.hue+20},75%,60%,${n.alpha*0.6})`);
      grd.addColorStop(0.6, `hsla(${n.hue-10},70%,55%,${n.alpha*0.25})`);
      grd.addColorStop(1,   `hsla(${n.hue},70%,50%,0)`);
      ctx.scale(1, n.ry/n.rx);
      ctx.beginPath();
      ctx.arc(0, 0, n.rx, 0, Math.PI*2);
      ctx.fillStyle = grd;
      ctx.fill();
      ctx.restore();
    };

    const drawStar = (s: Star, t: number) => {
      const s1 = Math.sin(t*s.f1+s.p1);
      const s2 = Math.sin(t*s.f2+s.p2)*0.45;
      const s3 = Math.sin(t*s.f3+s.p3)*0.18;
      const flicker = (s1+s2+s3)/1.63;
      const alpha = s.baseAlpha*(0.30+0.70*(0.5+0.5*flicker));
      if (alpha < 0.005) return;
      const [r,g,b] = s.color;

      // soft halo for mid+ stars
      if (s.size > 0.55) {
        const haloR = s.size * 5;
        const halo = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, haloR);
        halo.addColorStop(0, `rgba(${r},${g},${b},${alpha*0.22})`);
        halo.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = halo;
        ctx.beginPath(); ctx.arc(s.x, s.y, haloR, 0, Math.PI*2); ctx.fill();
      }

      // star dot
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI*2); ctx.fill();

      // diffraction cross on bright stars (size > 1.2)
      if (s.size > 1.2 && alpha > 0.5) {
        const spikeLen = s.size * 7 * alpha;
        const spikeAlpha = alpha * 0.35;
        ctx.strokeStyle = `rgba(${r},${g},${b},${spikeAlpha})`;
        ctx.lineWidth = 0.5;
        // horizontal spike
        const hGrad = ctx.createLinearGradient(s.x-spikeLen,s.y, s.x+spikeLen,s.y);
        hGrad.addColorStop(0,'rgba(255,255,255,0)');
        hGrad.addColorStop(0.5,`rgba(${r},${g},${b},${spikeAlpha})`);
        hGrad.addColorStop(1,'rgba(255,255,255,0)');
        ctx.strokeStyle = hGrad as unknown as string;
        ctx.beginPath(); ctx.moveTo(s.x-spikeLen,s.y); ctx.lineTo(s.x+spikeLen,s.y); ctx.stroke();
        // vertical spike
        const vGrad = ctx.createLinearGradient(s.x,s.y-spikeLen, s.x,s.y+spikeLen);
        vGrad.addColorStop(0,'rgba(255,255,255,0)');
        vGrad.addColorStop(0.5,`rgba(${r},${g},${b},${spikeAlpha})`);
        vGrad.addColorStop(1,'rgba(255,255,255,0)');
        ctx.strokeStyle = vGrad as unknown as string;
        ctx.beginPath(); ctx.moveTo(s.x,s.y-spikeLen); ctx.lineTo(s.x,s.y+spikeLen); ctx.stroke();
      }
    };

    const animate = () => {
      time += 0.012;
      ctx.clearRect(0, 0, w, h);

      // ── 1. NEBULA CLOUDS (bottom layer) ──
      ctx.globalCompositeOperation = 'screen';
      for (const n of nebulae) {
        n.x += n.driftX; n.y += n.driftY; n.rot += n.rotSpeed;
        if (n.x > w+n.rx) n.x = -n.rx;
        if (n.x < -n.rx) n.x = w+n.rx;
        if (n.y > h+n.ry) n.y = -n.ry;
        if (n.y < -n.ry) n.y = h+n.ry;
        drawNebulaCloud(n);
      }
      ctx.globalCompositeOperation = 'source-over';

      // ── 2. AURORA RIBBONS ──
      ctx.globalCompositeOperation = 'screen';
      for (const a of auroras) drawAurora(a);
      ctx.globalCompositeOperation = 'source-over';

      // ── 3. FLOWING PARTICLE NETWORK ──
      for (const p of flowParticles) {
        p.x += p.vx; p.y += p.vy; p.life++;
        if (p.life > p.maxLife) {
          p.x = Math.random()*w; p.y = Math.random()*h;
          p.vx = (Math.random()-0.5)*0.32; p.vy = (Math.random()-0.5)*0.32;
          p.life = 0; p.maxLife = 300+Math.random()*200;
        }
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        const lifeFade = Math.sin((p.life/p.maxLife)*Math.PI);
        ctx.fillStyle = `hsla(${p.hue},85%,75%,${0.5*lifeFade})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
      }
      // connecting lines between nearby nodes
      for (let i = 0; i < flowParticles.length; i++) {
        for (let j = i+1; j < flowParticles.length; j++) {
          const a = flowParticles[i], b = flowParticles[j];
          const dx = a.x-b.x, dy = a.y-b.y;
          const dist = Math.sqrt(dx*dx+dy*dy);
          if (dist < LINK_DIST) {
            const lineA = (1-(dist/LINK_DIST)) * 0.10;
            ctx.strokeStyle = `hsla(${(a.hue+b.hue)/2},80%,70%,${lineA})`;
            ctx.lineWidth = 0.55;
            ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
          }
        }
      }

      // ── 4. STARS with parallax drift (deep → front) ──
      const parallaxScale = 0.0006;
      for (const star of stars) {
        // subtle slow drift based on depth
        star.x += Math.sin(time*0.07 + star.p1) * star.z * parallaxScale * w;
        star.y += Math.cos(time*0.05 + star.p2) * star.z * parallaxScale * h;
        if (star.x < 0) star.x = w; if (star.x > w) star.x = 0;
        if (star.y < 0) star.y = h; if (star.y > h) star.y = 0;
        drawStar(star, time);
      }

      // ── 4. SHOOTING STARS with motion-blur trails ──
      for (const m of meteors) {
        if (!m.active) { m.cooldown--; if (m.cooldown <= 0) spawnMeteor(m); continue; }
        // record trail point with current alpha
        const progress = 1 - m.life/m.maxLife;
        const fade = progress < 0.10 ? progress/0.10 : progress > 0.60 ? Math.max(0,(1-progress)/0.40) : 1;
        m.trail.push({ x:m.x, y:m.y, a:fade });
        if (m.trail.length > 35) m.trail.shift();
        m.x += m.vx; m.y += m.vy; m.life--;

        // draw trail as a single gradient line (motion blur feel)
        if (m.trail.length > 2) {
          for (let t = 1; t < m.trail.length; t++) {
            const p0 = m.trail[t-1], p1 = m.trail[t];
            const tp = t/m.trail.length;
            const lineAlpha = tp*tp*tp * p1.a * 0.65;
            const lw = m.size * tp * 1.1;
            if (lineAlpha < 0.005) continue;
            const lg = ctx.createLinearGradient(p0.x,p0.y,p1.x,p1.y);
            lg.addColorStop(0, `hsla(${m.hue},80%,85%,0)`);
            lg.addColorStop(1, `hsla(${m.hue},90%,95%,${lineAlpha})`);
            ctx.strokeStyle = lg as unknown as string;
            ctx.lineWidth = lw; ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(p0.x,p0.y); ctx.lineTo(p1.x,p1.y); ctx.stroke();
          }
        }
        // ionised head glow
        if (fade > 0.01) {
          const hg = ctx.createRadialGradient(m.x,m.y,0, m.x,m.y, m.size*5);
          hg.addColorStop(0,  `rgba(255,255,255,${fade*0.95})`);
          hg.addColorStop(0.3,`hsla(${m.hue},100%,90%,${fade*0.5})`);
          hg.addColorStop(0.7,`hsla(${m.hue},80%,70%,${fade*0.15})`);
          hg.addColorStop(1,  'rgba(0,0,0,0)');
          ctx.fillStyle = hg;
          ctx.beginPath(); ctx.arc(m.x,m.y,m.size*5,0,Math.PI*2); ctx.fill();
        }
        if (m.life <= 0 || m.x > w+80 || m.y > h+80) {
          m.active = false; m.cooldown = 800+Math.random()*2500; m.trail = [];
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(animFrameRef.current); window.removeEventListener('resize', resize); };
  }, [seededRandom]);




  const scrollToProjects = () => {
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Code snippets for animation
  const codeSnippets = [
    "import { AI } from 'star-ai-labs';",
    "const model = new NeuralNetwork({",
    "  layers: [128, 64, 32],",
    "  activation: 'relu',",
    "  optimizer: 'adam'",
    "});",
    "",
    "model.train(dataset).then(() => {",
    "  console.log('Model trained!');",
    "  predict(newData);",
    "});",
    "",
    "// Real-time predictions",
    "const results = await model.predict({",
    "  accuracy: I will try my best,",
    "  confidence: 100.95",
    "});"
  ];

  return (
    <>
      {/* Inject CSS animations */}
      <style dangerouslySetInnerHTML={{ __html: starAnimationStyles }} />

      <section id="home" className="relative min-h-screen overflow-hidden" style={{ background: 'linear-gradient(135deg, #000000 0%, #020617 15%, #0a0e27 30%, #0c1445 50%, #06102e 70%, #020617 85%, #000000 100%)' }}>
        {/* === PREMIUM MULTI-LAYERED BACKGROUND SYSTEM === */}
        <div className="absolute inset-0">

          {/* Layer 1: Deep cinematic gradient overlays */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 30%, transparent 60%, rgba(0,0,0,0.7) 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.6) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.3) 100%)' }} />

          {/* Layer 2: Premium radial spotlight effects */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(15, 23, 62, 0.6) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 70% 60%, rgba(30, 64, 175, 0.15) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 20% 30%, rgba(6, 182, 212, 0.08) 0%, transparent 50%)',
            }}
          />

          {/* Layer 3: Aurora borealis ribbons */}
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              background: 'linear-gradient(125deg, transparent 20%, rgba(59, 130, 246, 0.04) 30%, rgba(6, 182, 212, 0.06) 40%, transparent 50%, rgba(99, 102, 241, 0.04) 60%, transparent 70%)',
              animation: 'nebula 25s ease-in-out infinite',
              filter: 'blur(40px)',
            }}
          />
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              background: 'linear-gradient(-45deg, transparent 30%, rgba(14, 165, 233, 0.05) 40%, rgba(139, 92, 246, 0.03) 50%, transparent 60%)',
              animation: 'nebula 30s ease-in-out infinite reverse',
              filter: 'blur(60px)',
            }}
          />

          {/* Layer 4: Subtle perspective grid (tech feel) */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
              maskImage: 'radial-gradient(ellipse 70% 50% at 50% 50%, black 20%, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(ellipse 70% 50% at 50% 50%, black 20%, transparent 70%)',
            }}
          />

          {/* Layer 5: Premium animated nebula blobs */}
          <div
            className="absolute w-[700px] h-[700px] rounded-full blur-[120px]"
            style={{
              top: '-10%',
              left: '-5%',
              background: 'radial-gradient(circle, rgba(30, 64, 175, 0.12) 0%, rgba(59, 130, 246, 0.06) 40%, transparent 70%)',
              animation: 'backgroundShift 20s ease-in-out infinite',
            }}
          />
          <div
            className="absolute w-[600px] h-[600px] rounded-full blur-[100px]"
            style={{
              top: '20%',
              right: '-10%',
              background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, rgba(14, 165, 233, 0.05) 40%, transparent 70%)',
              animation: 'backgroundShift 24s ease-in-out infinite reverse',
            }}
          />
          <div
            className="absolute w-[500px] h-[500px] rounded-full blur-[80px]"
            style={{
              bottom: '5%',
              left: '15%',
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.04) 40%, transparent 70%)',
              animation: 'backgroundShift 18s ease-in-out infinite',
            }}
          />
          <div
            className="absolute w-[400px] h-[400px] rounded-full blur-[90px]"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, rgba(30, 64, 175, 0.04) 50%, transparent 70%)',
              animation: 'backgroundShift 28s ease-in-out infinite reverse',
            }}
          />
          <div
            className="absolute w-[350px] h-[350px] rounded-full blur-[70px]"
            style={{
              top: '10%',
              right: '30%',
              background: 'radial-gradient(circle, rgba(14, 165, 233, 0.07) 0%, transparent 60%)',
              animation: 'backgroundShift 15s ease-in-out infinite',
            }}
          />
          <div
            className="absolute w-[300px] h-[300px] rounded-full blur-[60px]"
            style={{
              bottom: '20%',
              right: '10%',
              background: 'radial-gradient(circle, rgba(6, 182, 212, 0.06) 0%, transparent 60%)',
              animation: 'backgroundShift 22s ease-in-out infinite reverse',
            }}
          />

          {/* Layer 6: Noise texture overlay for depth */}
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
              backgroundSize: '128px 128px',
            }}
          />

          {/* Layer 7: Vignette for cinematic depth */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(0,0,0,0.5) 100%)',
            }}
          />
        </div>

        {/* === REAL CANVAS STAR FIELD === */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          style={{ pointerEvents: 'none', zIndex: 5 }}
        />


        {/* Main Content Container */}
        <div className="relative z-10 flex items-center min-h-screen pt-28 sm:pt-32 md:pt-36 lg:pt-32 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid lg:grid-cols-2 gap-12 md:gap-16 lg:gap-12 items-center">

              {/* Left Column - Enhanced Content */}
              <div className="space-y-5">
                

                {/* ── Live time / date status bar ── */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-cyan-500/35 bg-cyan-500/10 backdrop-blur-sm shadow-[0_0_14px_rgba(34,211,238,0.07)]">
                    <span
                      className="w-2 h-2 rounded-full bg-cyan-400 shrink-0"
                      style={{ animation: 'livePulse 1.6s ease-in-out infinite', boxShadow: '0 0 6px rgba(34,211,238,0.9)' }}
                    />
                    <span className="text-sm font-semibold text-cyan-300 tracking-wide select-none">Nilanjan Nayak</span>
                  </div>

                  <div className="w-px h-4 bg-white/15" />

                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono text-sm font-semibold text-white/90 tabular-nums tracking-tight">
                      {formatTime(currentTime)}
                    </span>
                  </div>

                  <div className="w-px h-4 bg-white/15" />

                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono text-xs text-slate-400 tracking-wide">
                      {formatDate(currentTime)}
                    </span>
                  </div>
                </div>

                {/* Main Headline */}
                <div className="space-y-6">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                    <span className="block">{getContent('hero', 'title', 'Next-Generation')}</span>
                    <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent pb-3 pt-1 leading-snug">
                      {getContent('hero', 'subtitle', 'AI Solutions')}
                    </span>
                  </h1>

                  <p className="text-xl text-blue-100/90 leading-relaxed max-w-2xl">
                    {getContent('hero', 'description', 'Revolutionize your enterprise with our cutting-edge artificial intelligence platform. From machine learning to neural networks, we deliver solutions that transform data into actionable insights and drive unprecedented business growth.')}
                  </p>
                </div>

                {/* Feature Highlights */}
                <div className="grid grid-cols-2 gap-4 py-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Brain className="h-5 w-5 text-cyan-400" />
                    </div>
                    <span className="text-blue-200 font-medium">Neural Networks</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Cpu className="h-5 w-5 text-cyan-400" />
                    </div>
                    <span className="text-blue-200 font-medium">Edge Computing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Zap className="h-5 w-5 text-cyan-400" />
                    </div>
                    <span className="text-blue-200 font-medium">Real-time Processing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Code className="h-5 w-5 text-cyan-400" />
                    </div>
                    <span className="text-blue-200 font-medium">Custom APIs</span>
                  </div>
                </div>

                {/* Premium CTAs */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={scrollToProjects}
                    className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-semibold rounded-lg hover:from-cyan-400 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-400/30 transform hover:scale-105"
                  >
                    Explore AI Solutions
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>

                  <button
                    onClick={scrollToContact}
                    className="inline-flex items-center justify-center px-8 py-4 bg-black/30 border-2 border-blue-400/50 text-blue-200 font-semibold rounded-lg hover:bg-blue-400/10 hover:text-white hover:border-blue-300 transition-all duration-300 backdrop-blur-xl"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    See Live Demo
                  </button>
                </div>

              </div>

              {/* Right Column - Premium Code Visualization */}
              <div className="relative lg:h-[600px] flex items-center justify-center mt-4 sm:mt-6 md:mt-8 lg:mt-0 mb-24 sm:mb-20 md:mb-16 lg:mb-0">
                <div className="relative w-full max-w-lg mx-auto">
                  {/* Glowing Background Blob for Terminal */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500 rounded-2xl blur opacity-20"></div>
                  
                  {/* Main Code Terminal */}
                  <div className="relative bg-gradient-to-br from-[#0a0f1c]/95 to-[#02040a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl shadow-cyan-500/10">
                    {/* Terminal Header */}
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1.5 hover:opacity-80 transition-opacity cursor-pointer">
                          <div className="w-3 h-3 bg-[#ff5f56] rounded-full shadow-[0_0_5px_rgba(255,95,86,0.5)]"></div>
                          <div className="w-3 h-3 bg-[#ffbd2e] rounded-full shadow-[0_0_5px_rgba(255,189,46,0.5)]"></div>
                          <div className="w-3 h-3 bg-[#27c93f] rounded-full shadow-[0_0_5px_rgba(39,201,63,0.5)]"></div>
                        </div>
                        <span className="text-gray-400 text-xs font-mono ml-4 tracking-wider">star-ai-labs.tsx</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full shadow-[0_0_5px_rgba(74,222,128,0.8)]"></div>
                        <span className="text-green-400 text-[10px] font-bold uppercase tracking-widest">Live</span>
                      </div>
                    </div>

                    {/* Code Content */}
                    <div className="space-y-1 font-mono text-sm tracking-tight">
                      {codeSnippets.map((line, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 hover:bg-white/5 transition-colors duration-200 px-2 -mx-2 rounded-md group cursor-text"
                        >
                          <span className="text-slate-600 text-xs w-6 text-right select-none group-hover:text-slate-400 transition-colors">
                            {line ? index + 1 : ''}
                          </span>
                          <span className={`${line.includes('import') || line.includes('const') || line.includes('await')
                            ? 'text-purple-300'
                            : line.includes('//')
                              ? 'text-emerald-400/80 italic'
                              : line.includes('train') || line.includes('predict')
                                ? 'text-cyan-300 font-semibold'
                                : line.includes('{') || line.includes('}')
                                  ? 'text-amber-300'
                                  : line.includes('99.7') || line.includes('0.95')
                                    ? 'text-green-400 font-bold shadow-[0_0_10px_rgba(74,222,128,0.2)]'
                                    : 'text-blue-100'
                            }`}>
                            {line}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Terminal Cursor */}
                    <div className="flex items-center mt-4 px-2 -mx-2">
                      <span className="text-emerald-400 text-sm mr-3">➜</span>
                      <span className="text-cyan-300 text-sm font-mono mr-2">~</span>
                      <div className="w-2.5 h-4 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
                    </div>
                  </div>

                  {/* Floating AI Metrics - Premium Glassmorphism */}
                  <div className="absolute -top-8 right-0 sm:-right-5 bg-black/50 backdrop-blur-xl border border-green-500/30 text-green-300 p-2 sm:p-3 rounded-xl shadow-lg shadow-green-500/20">
                    <div className="flex items-center space-x-3">
                      <div className="p-1.5 bg-green-500/20 rounded-lg">
                        <Brain className="w-4 h-4 text-green-400" />
                      </div>
                      <div>
                        <div className="text-sm font-bold tracking-wider">19.7%</div>
                        <div className="text-[10px] uppercase tracking-wider opacity-80">Learning mode</div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -bottom-6 left-0 sm:-left-8 bg-black/50 backdrop-blur-xl border border-blue-500/30 text-blue-300 p-2 sm:p-3 rounded-xl shadow-lg shadow-blue-500/20">
                    <div className="flex items-center space-x-3">
                      <div className="p-1.5 bg-blue-500/20 rounded-lg">
                        <Zap className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div>
                        <div className="text-sm font-bold tracking-wider">2.4ms</div>
                        <div className="text-[10px] uppercase tracking-wider opacity-80">Response</div>
                      </div>
                    </div>
                  </div>

                  {/* Clock moved to floating HUD above */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <button
            onClick={scrollToProjects}
            className="flex flex-col items-center space-y-2 text-blue-200/70 hover:text-cyan-300 transition-colors duration-200 group"
          >
            <span className="text-sm font-medium">Discover More</span>
            <ChevronDown className="h-5 w-5 group-hover:text-cyan-400 transition-colors duration-200" />
          </button>
        </div>

        {/* Premium Background Decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />

        {/* Corner Logo */}
        <a
          href="https://nilanjan-nayak.my-board.org/?i=2"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-black/95 backdrop-blur-xl rounded-full px-5 py-2 pl-2 border-2 border-blue-500/30 shadow-2xl shadow-blue-500/20 transition-all duration-300 cursor-pointer hover:shadow-blue-400/30 hover:border-blue-400/50 group no-underline"
          title="Made by Star AI Lab"
        >
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-yellow-400/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Logo SVG - Paste your SVG code here */}
          <div className="relative w-10 h-10 flex items-center justify-center rounded-full border-2 border-blue-500/40 bg-white/10 overflow-hidden" >
            <svg xmlns="http://www.w3.org/2000/svg"
              width="379"
              height="379"
              viewBox="0 0 379 379" shapeRendering="crispEdges">
              <title>Generated SVG</title>
              <desc>Created by PixelForge Ultimate - Pixel-perfect vectorization</desc>
              <path fill="rgba(0,0,0,0.0039)" d="M180 89h1v1h-1zM199 89h1v1h-1zM206 90h1v1h-1zM163 92h1v1h-1zM216 92h1v1h-1zM219 93h1v1h-1zM225 95h1v1h-1zM151 96h1v1h-1zM230 97h1v1h-1zM144 99h1v1h-1zM240 102h1v1h-1zM137 103h1v1h-1zM179 106h1v1h-1zM199 106h1v1h-1zM131 107h1v1h-1zM173 107h1v1h-1zM210 108h1v1h-1zM165 109h1v1h-1zM127 110h1v1h-1zM162 110h1v1h-1zM253 111h1v1h-1zM224 113h1v1h-1zM226 114h1v1h-1zM228 115h1v1h-1zM120 116h1v1h-1zM230 116h1v1h-1zM119 117h1v1h-1zM147 117h1v1h-1zM117 119h1v1h-1zM235 119h1v1h-1zM116 120h1v1h-1zM239 122h1v1h-1zM243 125h1v1h-1zM268 126h1v1h-1zM110 127h1v1h-1zM271 130h1v1h-1zM107 131h1v1h-1zM246 131h1v1h-1zM181 133h1v1h-1zM151 134h1v1h-1zM103 137h1v1h-1zM243 138h1v1h-1zM184 139h1v1h-1zM121 141h1v1h-1zM276 141h1v1h-1zM275 143h1v1h-1zM119 144h1v1h-1zM97 149h1v1h-1zM116 149h1v1h-1zM144 149h1v1h-1zM96 151h1v1h-1zM115 151h1v1h-1zM114 153h1v1h-1zM282 154h1v1h-1zM113 155h1v1h-1zM235 155h1v1h-1zM269 156h1v1h-1zM281 156h1v1h-1zM234 157h1v1h-1zM93 160h1v1h-1zM111 160h1v1h-1zM194 161h1v1h-1zM138 162h1v1h-1zM137 164h1v1h-1zM109 166h1v1h-1zM276 167h1v1h-1zM263 169h1v1h-1zM275 169h1v1h-1zM288 169h1v1h-1zM198 170h1v1h-1zM134 171h1v1h-1zM262 171h1v1h-1zM274 171h1v1h-1zM227 172h1v1h-1zM133 173h1v1h-1zM261 173h1v1h-1zM107 174h1v1h-1zM226 174h1v1h-1zM132 175h1v1h-1zM272 176h1v1h-1zM202 179h1v1h-1zM106 181h1v1h-1zM164 181h1v1h-1zM89 182h1v1h-1zM129 182h1v1h-1zM163 183h1v1h-1zM170 184h1v1h-1zM273 185h1v1h-1zM127 186h1v1h-1zM273 186h1v1h-1zM273 187h1v1h-1zM254 188h1v1h-1zM273 188h1v1h-1zM219 189h1v1h-1zM273 190h1v1h-1zM173 191h1v1h-1zM218 191h1v1h-1zM273 191h1v1h-1zM273 192h1v1h-1zM174 193h1v1h-1zM217 193h1v1h-1zM273 193h1v1h-1zM273 194h1v1h-1zM290 195h1v1h-1zM89 196h1v1h-1zM210 197h1v1h-1zM106 198h1v1h-1zM177 200h1v1h-1zM120 201h1v1h-1zM178 202h1v1h-1zM272 203h1v1h-1zM90 205h1v1h-1zM106 205h1v1h-1zM105 207h1v1h-1zM271 208h1v1h-1zM104 209h1v1h-1zM182 211h1v1h-1zM270 212h1v1h-1zM242 214h1v1h-1zM269 215h1v1h-1zM113 216h1v1h-1zM112 218h1v1h-1zM268 218h1v1h-1zM93 219h1v1h-1zM146 219h1v1h-1zM111 220h1v1h-1zM186 220h1v1h-1zM285 221h1v1h-1zM98 222h1v1h-1zM187 222h1v1h-1zM266 223h1v1h-1zM236 227h1v1h-1zM283 227h1v1h-1zM263 229h1v1h-1zM191 231h1v1h-1zM192 233h1v1h-1zM260 234h1v1h-1zM104 235h1v1h-1zM103 237h1v1h-1zM137 238h1v1h-1zM230 240h1v1h-1zM276 241h1v1h-1zM106 246h1v1h-1zM250 247h1v1h-1zM132 249h1v1h-1zM132 250h1v1h-1zM247 250h1v1h-1zM133 251h1v1h-1zM134 252h1v1h-1zM139 256h1v1h-1zM265 256h1v1h-1zM237 258h1v1h-1zM234 260h1v1h-1zM148 262h1v1h-1zM229 263h1v1h-1zM256 265h1v1h-1zM124 266h1v1h-1zM156 266h1v1h-1zM215 269h1v1h-1zM129 270h1v1h-1zM167 270h1v1h-1zM212 270h1v1h-1zM171 271h1v1h-1zM208 271h1v1h-1zM176 272h1v1h-1zM203 272h1v1h-1zM247 272h1v1h-1zM187 273h2v1h-2zM192 273h1v1h-1zM241 276h1v1h-1zM229 282h1v1h-1zM152 283h1v1h-1zM155 284h1v1h-1zM224 284h1v1h-1zM158 285h1v1h-1zM161 286h1v1h-1zM214 287h1v1h-1zM170 288h1v1h-1zM209 288h1v1h-1zM203 289h1v1h-1z" />
              <path fill="rgba(0,0,0,0.0196)" d="M181 89h1v1h-1zM215 92h1v1h-1zM243 104h1v1h-1zM130 108h1v1h-1zM254 112h1v1h-1zM131 129h1v1h-1zM148 141h1v1h-1zM273 147h1v1h-1zM238 149h1v1h-1zM266 162h1v1h-1zM92 164h1v1h-1zM287 165h1v1h-1zM230 166h1v1h-1zM160 189h1v1h-1zM159 191h1v1h-1zM208 193h1v1h-1zM290 194h1v1h-1zM123 195h1v1h-1zM176 197h1v1h-1zM91 210h1v1h-1zM92 215h1v1h-1zM143 225h1v1h-1zM108 227h1v1h-1zM142 227h1v1h-1zM281 231h1v1h-1zM252 245h1v1h-1zM140 257h1v1h-1zM236 259h1v1h-1zM146 261h1v1h-1zM221 267h1v1h-1zM128 269h1v1h-1zM195 273h1v1h-1zM148 281h1v1h-1zM213 287h1v1h-1zM208 288h1v1h-1z" />
              <path fill="rgba(0,0,0,0.0314)" d="M182 89h1v1h-1zM164 92h1v1h-1zM147 98h1v1h-1zM241 123h1v1h-1zM133 127h1v1h-1zM127 133h1v1h-1zM186 144h1v1h-1zM285 158h1v1h-1zM200 175h1v1h-1zM131 178h1v1h-1zM258 179h1v1h-1zM290 185h1v1h-1zM158 193h1v1h-1zM117 208h1v1h-1zM95 224h1v1h-1zM141 229h1v1h-1zM232 235h1v1h-1zM257 239h1v1h-1zM103 241h1v1h-1zM110 251h1v1h-1zM163 269h1v1h-1zM248 271h1v1h-1zM182 273h1v1h-1zM197 273h1v1h-1zM142 278h1v1h-1zM220 285h1v1h-1z" />
              <path fill="rgba(0,0,0,0.0392)" d="M183 89h2v1h-2zM177 106h1v1h-1zM255 113h1v1h-1zM150 115h1v1h-1zM237 120h1v1h-1zM139 122h1v1h-1zM266 124h1v1h-1zM246 132h1v1h-1zM176 133h1v1h-1zM276 138h1v1h-1zM191 155h1v1h-1zM106 178h1v1h-1zM165 178h1v1h-1zM223 181h1v1h-1zM216 196h1v1h-1zM177 199h1v1h-1zM90 204h1v1h-1zM150 210h1v1h-1zM243 211h1v1h-1zM270 213h1v1h-1zM269 216h1v1h-1zM109 225h1v1h-1zM280 233h1v1h-1zM105 244h1v1h-1zM120 262h1v1h-1zM153 265h1v1h-1zM144 279h1v1h-1zM171 288h1v1h-1z" />
              <path fill="rgba(0,0,0,0.0510)" d="M185 89h1v1h-1zM204 90h1v1h-1zM152 96h1v1h-1zM112 125h1v1h-1zM247 130h1v1h-1zM160 133h4v1h-4zM150 137h1v1h-1zM122 139h1v1h-1zM240 145h1v1h-1zM93 161h1v1h-1zM195 164h1v1h-1zM264 166h1v1h-1zM91 169h1v1h-1zM257 181h1v1h-1zM290 187h1v1h-1zM290 192h1v1h-1zM250 196h1v1h-1zM273 197h1v1h-1zM211 200h1v1h-1zM182 210h1v1h-1zM149 212h1v1h-1zM237 224h1v1h-1zM268 252h1v1h-1z" />
              <path fill="rgba(0,0,0,0.0824)" d="M186 89h1v1h-1zM191 105h1v1h-1zM240 122h1v1h-1zM113 124h1v1h-1zM242 141h1v1h-1zM275 142h1v1h-1zM198 171h1v1h-1zM218 192h1v1h-1zM285 220h1v1h-1zM137 255h1v1h-1zM228 264h1v1h-1zM219 268h1v1h-1zM134 273h1v1h-1zM201 289h1v1h-1z" />
              <path fill="rgba(0,0,0,0.1333)" d="M187 89h1v1h-1zM123 114h1v1h-1zM146 117h1v1h-1zM188 223h1v1h-1z" />
              <path fill="rgba(0,0,0,0.2078)" d="M188 89h1v1h-1zM245 135h1v1h-1zM285 159h1v1h-1zM196 167h1v1h-1zM159 190h1v1h-1zM287 212h1v1h-1zM277 238h1v1h-1zM179 273h1v1h-1zM236 278h1v1h-1z" />
              <path fill="rgba(0,0,0,0.2549)" d="M189 89h1v1h-1zM271 211h1v1h-1zM143 224h1v1h-1zM232 234h1v1h-1z" />
              <path fill="rgba(0,0,0,0.2510)" d="M190 89h1v1h-1zM128 110h1v1h-1zM122 115h1v1h-1zM243 124h1v1h-1zM279 162h1v1h-1z" />
              <path fill="rgba(0,0,0,0.1922)" d="M191 89h1v1h-1zM110 161h1v1h-1zM136 168h1v1h-1zM130 181h1v1h-1zM172 187h1v1h-1zM281 230h1v1h-1zM224 245h1v1h-1zM243 274h1v1h-1z" />
              <path fill="rgba(0,0,0,0.1255)" d="M192 89h1v1h-1zM218 110h1v1h-1zM119 143h1v1h-1zM274 144h1v1h-1zM116 148h1v1h-1zM193 160h1v1h-1zM288 171h1v1h-1zM90 202h1v1h-1zM276 240h1v1h-1zM210 271h1v1h-1zM179 289h1v1h-1z" />
              <path fill="rgba(0,0,0,0.0706)" d="M193 89h1v1h-1zM169 91h1v1h-1zM229 97h1v1h-1zM188 105h1v1h-1zM161 110h1v1h-1zM256 114h1v1h-1zM148 116h1v1h-1zM151 135h1v1h-1zM144 150h1v1h-1zM190 153h1v1h-1zM273 181h1v1h-1zM89 191h1v1h-1zM156 197h1v1h-1zM273 198h1v1h-1zM242 213h1v1h-1zM287 213h1v1h-1zM264 228h1v1h-1zM191 230h1v1h-1zM104 236h1v1h-1zM132 248h1v1h-1zM149 263h1v1h-1zM226 265h1v1h-1zM127 268h1v1h-1zM205 272h1v1h-1z" />
              <path fill="rgba(0,0,0,0.0471)" d="M194 89h1v1h-1zM136 104h1v1h-1zM164 133h5v1h-5zM178 133h2v1h-2zM126 134h1v1h-1zM271 151h1v1h-1zM143 152h1v1h-1zM224 179h1v1h-1zM164 180h1v1h-1zM203 182h1v1h-1zM125 191h1v1h-1zM89 194h1v1h-1zM272 205h1v1h-1zM286 217h1v1h-1zM93 218h1v1h-1zM283 226h1v1h-1zM190 228h1v1h-1zM140 231h1v1h-1zM279 235h1v1h-1zM254 243h1v1h-1zM133 246h1v1h-1zM271 248h1v1h-1zM239 257h1v1h-1zM151 264h1v1h-1zM160 268h1v1h-1z" />
              <path fill="rgba(0,0,0,0.0353)" d="M195 89h1v1h-1zM174 90h1v1h-1zM220 111h1v1h-1zM154 113h1v1h-1zM134 126h1v1h-1zM270 129h1v1h-1zM104 136h1v1h-1zM149 139h1v1h-1zM118 145h1v1h-1zM96 152h1v1h-1zM284 155h1v1h-1zM110 162h1v1h-1zM232 162h1v1h-1zM265 164h1v1h-1zM109 165h1v1h-1zM169 181h1v1h-1zM273 182h1v1h-1zM100 217h1v1h-1zM238 222h1v1h-1zM198 245h1v1h-1zM117 259h1v1h-1zM233 261h1v1h-1zM252 268h1v1h-1zM166 270h1v1h-1zM242 275h1v1h-1zM153 283h1v1h-1zM223 284h1v1h-1zM162 286h1v1h-1zM166 287h1v1h-1z" />
              <path fill="rgba(0,0,0,0.0275)" d="M196 89h1v1h-1zM205 90h1v1h-1zM227 96h1v1h-1zM234 99h1v1h-1zM141 101h1v1h-1zM207 107h1v1h-1zM211 108h1v1h-1zM152 114h1v1h-1zM128 132h1v1h-1zM99 145h1v1h-1zM239 147h1v1h-1zM272 149h1v1h-1zM142 154h1v1h-1zM289 175h1v1h-1zM204 184h1v1h-1zM124 193h1v1h-1zM251 194h1v1h-1zM89 195h1v1h-1zM106 200h1v1h-1zM151 208h1v1h-1zM181 208h1v1h-1zM244 209h1v1h-1zM288 209h1v1h-1zM189 226h1v1h-1zM194 237h1v1h-1zM278 237h1v1h-1zM253 244h1v1h-1zM244 253h1v1h-1zM209 271h1v1h-1zM196 273h1v1h-1zM146 280h1v1h-1zM177 289h1v1h-1zM202 289h1v1h-1z" />
              <path fill="rgba(0,0,0,0.0235)" d="M197 89h1v1h-1zM157 94h1v1h-1zM236 100h1v1h-1zM201 106h1v1h-1zM246 106h1v1h-1zM132 128h1v1h-1zM182 135h1v1h-1zM120 142h1v1h-1zM100 143h1v1h-1zM187 146h1v1h-1zM279 161h1v1h-1zM231 164h1v1h-1zM196 166h1v1h-1zM136 167h1v1h-1zM168 179h1v1h-1zM222 183h1v1h-1zM172 188h1v1h-1zM215 198h1v1h-1zM212 202h1v1h-1zM272 204h1v1h-1zM116 210h1v1h-1zM185 217h1v1h-1zM239 220h1v1h-1zM233 233h1v1h-1zM261 233h1v1h-1zM107 247h1v1h-1zM245 252h1v1h-1zM136 254h1v1h-1zM116 258h1v1h-1zM121 263h1v1h-1zM235 279h1v1h-1zM217 286h1v1h-1z" />
              <path fill="rgba(0,0,0,0.0118)" d="M198 89h1v1h-1zM211 91h1v1h-1zM160 93h1v1h-1zM222 94h1v1h-1zM154 95h1v1h-1zM238 101h1v1h-1zM139 102h1v1h-1zM200 106h1v1h-1zM172 107h1v1h-1zM214 109h1v1h-1zM222 112h1v1h-1zM232 117h1v1h-1zM138 123h1v1h-1zM273 133h1v1h-1zM275 136h1v1h-1zM183 137h1v1h-1zM123 138h1v1h-1zM117 147h1v1h-1zM188 148h1v1h-1zM237 151h1v1h-1zM94 157h1v1h-1zM140 158h1v1h-1zM268 158h1v1h-1zM197 168h1v1h-1zM229 168h1v1h-1zM107 173h1v1h-1zM90 174h1v1h-1zM167 177h1v1h-1zM273 183h1v1h-1zM221 185h1v1h-1zM161 187h1v1h-1zM209 195h1v1h-1zM122 197h1v1h-1zM106 199h1v1h-1zM214 200h1v1h-1zM213 202h1v1h-1zM246 205h1v1h-1zM152 206h1v1h-1zM180 206h1v1h-1zM271 209h1v1h-1zM102 213h1v1h-1zM101 215h1v1h-1zM184 215h1v1h-1zM188 224h1v1h-1zM107 229h1v1h-1zM193 235h1v1h-1zM259 236h1v1h-1zM228 244h1v1h-1zM272 247h1v1h-1zM109 250h1v1h-1zM246 251h1v1h-1zM269 251h1v1h-1zM114 256h1v1h-1zM240 256h1v1h-1zM263 258h1v1h-1zM262 259h1v1h-1zM231 262h1v1h-1zM259 262h1v1h-1zM258 263h1v1h-1zM158 267h1v1h-1zM175 272h1v1h-1zM184 273h2v1h-2z" />
              <path fill="rgba(0,0,0,0.0078)" d="M173 90h1v1h-1zM149 97h1v1h-1zM134 105h1v1h-1zM206 107h1v1h-1zM168 108h1v1h-1zM249 108h1v1h-1zM238 121h1v1h-1zM242 124h1v1h-1zM247 129h1v1h-1zM130 130h1v1h-1zM152 133h1v1h-1zM105 134h1v1h-1zM244 136h1v1h-1zM102 139h1v1h-1zM147 143h1v1h-1zM146 145h1v1h-1zM145 147h1v1h-1zM189 150h1v1h-1zM236 153h1v1h-1zM95 154h1v1h-1zM193 159h1v1h-1zM139 160h1v1h-1zM277 165h1v1h-1zM91 168h1v1h-1zM108 169h1v1h-1zM135 169h1v1h-1zM228 170h1v1h-1zM260 175h1v1h-1zM106 180h1v1h-1zM130 180h1v1h-1zM128 184h1v1h-1zM273 184h1v1h-1zM290 184h1v1h-1zM162 185h1v1h-1zM171 186h1v1h-1zM220 187h1v1h-1zM206 188h1v1h-1zM253 190h1v1h-1zM175 195h1v1h-1zM273 195h1v1h-1zM121 199h1v1h-1zM155 200h1v1h-1zM154 202h1v1h-1zM247 203h1v1h-1zM153 204h1v1h-1zM179 204h1v1h-1zM289 204h1v1h-1zM91 211h1v1h-1zM103 211h1v1h-1zM183 213h1v1h-1zM114 214h1v1h-1zM287 214h1v1h-1zM241 216h1v1h-1zM286 218h1v1h-1zM145 221h1v1h-1zM94 222h1v1h-1zM97 224h1v1h-1zM284 224h1v1h-1zM235 229h1v1h-1zM282 229h1v1h-1zM106 231h1v1h-1zM262 231h1v1h-1zM105 233h1v1h-1zM136 240h1v1h-1zM256 240h1v1h-1zM135 242h1v1h-1zM196 242h1v1h-1zM229 242h1v1h-1zM104 243h1v1h-1zM197 244h1v1h-1zM251 246h1v1h-1zM135 253h1v1h-1zM113 255h1v1h-1zM264 257h1v1h-1zM143 259h1v1h-1zM257 264h1v1h-1zM123 265h1v1h-1zM223 266h1v1h-1zM218 268h1v1h-1zM251 269h1v1h-1zM186 273h1v1h-1zM193 273h1v1h-1zM244 274h1v1h-1zM138 276h1v1h-1zM239 277h1v1h-1zM231 281h1v1h-1zM150 282h1v1h-1zM165 287h1v1h-1z" />
              <path fill="rgba(0,0,0,0.0745)" d="M175 90h1v1h-1zM224 95h1v1h-1zM187 105h1v1h-1zM189 105h1v1h-1zM225 113h1v1h-1zM272 132h1v1h-1zM281 157h1v1h-1zM138 163h1v1h-1zM90 175h1v1h-1zM289 176h1v1h-1zM89 187h1v1h-1zM89 190h1v1h-1zM141 258h1v1h-1z" />
              <path fill="rgba(45,112,116,0.2667)" d="M176 90h1v1h-1z" />
              <path fill="rgba(86,193,206,0.4667)" d="M177 90h1v1h-1z" />
              <path fill="rgba(84,196,207,0.5569)" d="M178 90h1v1h-1z" />
              <path fill="rgba(86,195,207,0.6706)" d="M179 90h1v1h-1zM149 141h1v1h-1zM191 157h1v1h-1z" />
              <path fill="rgba(87,195,207,0.8510)" d="M180 90h1v1h-1z" />
              <path fill="rgba(86,195,208,0.9176)" d="M181 90h1v1h-1zM239 103h1v1h-1z" />
              <path fill="rgba(85,196,207,0.9333)" d="M182 90h1v1h-1zM210 92h1v1h-1zM98 150h1v1h-1zM96 155h1v1h-1zM167 174h1v1h-1zM185 214h1v1h-1zM114 254h1v1h-1zM210 272h1v1h-1z" />
              <path fill="rgba(85,196,206,0.9451)" d="M183 90h1v1h-1zM281 228h1v1h-1zM199 274h1v1h-1z" />
              <path fill="rgba(85,196,207,0.9451)" d="M184 90h1v1h-1zM194 90h1v1h-1zM191 158h1v1h-1zM230 169h1v1h-1zM252 189h1v1h-1zM151 281h1v1h-1z" />
              <path fill="rgba(84,196,208,0.9490)" d="M185 90h1v1h-1zM232 232h1v1h-1z" />
              <path fill="rgba(85,196,207,0.9569)" d="M186 90h1v1h-1zM175 91h1v1h-1zM177 134h3v1h-3zM129 185h1v1h-1zM90 188h1v1h-1zM90 190h1v1h-1zM239 217h1v1h-1zM116 256h1v1h-1zM159 269h1v1h-1z" />
              <path fill="rgba(85,196,208,0.9686)" d="M187 90h1v1h-1zM161 94h1v1h-1zM153 112h1v1h-1zM154 134h1v1h-1zM173 134h2v1h-2zM280 162h1v1h-1zM92 170h1v1h-1zM274 178h1v1h-1zM130 183h1v1h-1zM157 192h1v1h-1zM212 205h1v1h-1zM149 209h1v1h-1zM238 219h1v1h-1zM191 227h1v1h-1zM200 274h1v1h-1zM232 279h1v1h-1zM167 286h1v1h-1z" />
              <path fill="rgba(86,196,207,0.9804)" d="M188 90h1v1h-1zM235 117h1v1h-1zM269 130h1v1h-1zM189 154h1v1h-1zM268 154h1v1h-1zM262 167h1v1h-1zM137 168h1v1h-1zM104 192h1v1h-1zM104 194h1v1h-1zM180 288h1v1h-1z" />
              <path fill="rgba(85,196,207,0.9843)" d="M189 90h2v1h-2zM226 97h1v1h-1zM148 99h1v1h-1zM175 105h1v1h-1zM204 105h1v1h-1zM216 108h1v1h-1zM131 109h1v1h-1zM226 112h1v1h-1zM228 113h1v1h-1zM254 114h1v1h-1zM138 121h1v1h-1zM105 137h1v1h-1zM113 151h1v1h-1zM112 153h1v1h-1zM234 161h1v1h-1zM94 162h1v1h-1zM285 163h1v1h-1zM138 166h1v1h-1zM106 170h1v1h-1zM287 172h1v1h-1zM275 173h1v1h-1zM226 178h1v1h-1zM132 179h1v1h-1zM104 182h1v1h-1zM218 195h1v1h-1zM249 195h1v1h-1zM104 196h1v1h-1zM210 201h1v1h-1zM120 205h1v1h-1zM98 218h1v1h-1zM188 220h1v1h-1zM265 229h1v1h-1zM105 237h1v1h-1zM253 246h1v1h-1zM267 251h1v1h-1zM246 253h1v1h-1zM135 255h1v1h-1zM143 261h1v1h-1zM148 264h1v1h-1zM227 266h1v1h-1zM156 268h1v1h-1zM247 270h1v1h-1zM177 274h1v1h-1zM241 274h1v1h-1zM145 278h1v1h-1zM154 282h1v1h-1zM173 287h1v1h-1zM198 288h1v1h-1z" />
              <path fill="rgba(85,195,206,0.9804)" d="M191 90h1v1h-1zM178 274h1v1h-1z" />
              <path fill="rgba(85,197,207,0.9647)" d="M192 90h1v1h-1zM173 187h1v1h-1zM122 262h1v1h-1z" />
              <path fill="rgba(85,196,208,0.9529)" d="M193 90h1v1h-1zM95 158h1v1h-1zM90 192h1v1h-1zM271 246h1v1h-1z" />
              <path fill="rgba(85,196,207,0.9373)" d="M195 90h1v1h-1zM182 138h1v1h-1zM275 139h1v1h-1zM237 154h1v1h-1zM214 203h1v1h-1z" />
              <path fill="rgba(86,196,207,0.9333)" d="M196 90h1v1h-1zM111 128h1v1h-1zM116 213h1v1h-1z" />
              <path fill="rgba(85,195,207,0.9216)" d="M197 90h1v1h-1zM287 170h1v1h-1zM289 188h1v1h-1z" />
              <path fill="rgba(85,196,207,0.8941)" d="M198 90h1v1h-1zM244 106h1v1h-1zM136 123h1v1h-1zM261 170h1v1h-1zM274 181h1v1h-1zM175 192h1v1h-1zM274 198h1v1h-1z" />
              <path fill="rgba(87,196,208,0.7843)" d="M199 90h1v1h-1zM270 216h1v1h-1z" />
              <path fill="rgba(86,195,206,0.6157)" d="M200 90h1v1h-1zM188 274h1v1h-1z" />
              <path fill="rgba(85,196,208,0.5294)" d="M201 90h1v1h-1z" />
              <path fill="rgba(79,178,191,0.4039)" d="M202 90h1v1h-1z" />
              <path fill="rgba(34,79,85,0.1765)" d="M203 90h1v1h-1z" />
              <path fill="rgba(0,0,0,0.0157)" d="M168 91h1v1h-1zM232 98h1v1h-1zM178 106h1v1h-1zM217 110h1v1h-1zM126 111h1v1h-1zM159 111h1v1h-1zM145 118h1v1h-1zM142 120h1v1h-1zM267 125h1v1h-1zM111 126h1v1h-1zM108 130h1v1h-1zM129 131h1v1h-1zM245 134h1v1h-1zM101 141h1v1h-1zM274 145h1v1h-1zM98 147h1v1h-1zM141 156h1v1h-1zM112 157h1v1h-1zM192 157h1v1h-1zM267 160h1v1h-1zM286 161h1v1h-1zM278 163h1v1h-1zM201 177h1v1h-1zM259 177h1v1h-1zM106 179h1v1h-1zM89 183h1v1h-1zM205 186h1v1h-1zM252 192h1v1h-1zM273 196h1v1h-1zM245 207h1v1h-1zM115 212h1v1h-1zM240 218h1v1h-1zM267 221h1v1h-1zM144 223h1v1h-1zM234 231h1v1h-1zM277 239h1v1h-1zM134 244h1v1h-1zM274 244h1v1h-1zM115 257h1v1h-1zM261 260h1v1h-1zM260 261h1v1h-1zM122 264h1v1h-1zM170 271h1v1h-1zM132 272h1v1h-1zM204 272h1v1h-1zM183 273h1v1h-1zM194 273h1v1h-1zM135 274h1v1h-1zM140 277h1v1h-1zM237 278h1v1h-1zM233 280h1v1h-1zM226 283h1v1h-1z" />
              <path fill="rgba(47,104,109,0.1922)" d="M170 91h1v1h-1z" />
              <path fill="rgba(84,197,210,0.4627)" d="M171 91h1v1h-1z" />
              <path fill="rgba(87,196,207,0.6314)" d="M172 91h1v1h-1z" />
              <path fill="rgba(85,195,207,0.8549)" d="M173 91h1v1h-1z" />
              <path fill="rgba(85,196,208,0.9294)" d="M174 91h1v1h-1z" />
              <path fill="rgba(85,195,206,0.9843)" d="M176 91h1v1h-1zM206 287h1v1h-1z" />
              <path fill="rgba(85,196,207,0.9922)" d="M177 91h2v1h-2zM200 91h3v1h-3zM171 92h1v1h-1zM207 92h1v1h-1zM166 93h1v1h-1zM213 93h1v1h-1zM162 94h1v1h-1zM156 96h1v1h-1zM223 96h1v1h-1zM153 97h1v1h-1zM228 98h1v1h-1zM146 100h1v1h-1zM144 101h1v1h-1zM197 104h1v1h-1zM240 104h1v1h-1zM137 105h1v1h-1zM205 105h1v1h-1zM134 107h1v1h-1zM213 107h1v1h-1zM246 108h1v1h-1zM157 110h1v1h-1zM250 111h1v1h-1zM125 114h1v1h-1zM256 116h1v1h-1zM257 117h1v1h-1zM142 118h1v1h-1zM139 120h1v1h-1zM241 121h1v1h-1zM115 124h1v1h-1zM114 125h1v1h-1zM129 129h1v1h-1zM268 129h1v1h-1zM271 133h1v1h-1zM104 139h1v1h-1zM182 139h1v1h-1zM118 142h1v1h-1zM243 142h1v1h-1zM149 143h1v1h-1zM148 145h1v1h-1zM272 145h1v1h-1zM146 149h1v1h-1zM187 150h1v1h-1zM98 151h1v1h-1zM238 153h1v1h-1zM237 155h1v1h-1zM96 156h1v1h-1zM267 156h1v1h-1zM236 157h1v1h-1zM283 157h1v1h-1zM142 158h1v1h-1zM266 158h1v1h-1zM191 159h1v1h-1zM265 160h1v1h-1zM192 161h1v1h-1zM279 165h1v1h-1zM107 166h1v1h-1zM278 167h1v1h-1zM286 168h1v1h-1zM277 169h1v1h-1zM276 171h1v1h-1zM197 172h1v1h-1zM259 173h1v1h-1zM287 173h1v1h-1zM105 174h1v1h-1zM198 174h1v1h-1zM228 174h1v1h-1zM274 176h1v1h-1zM169 177h1v1h-1zM91 178h1v1h-1zM91 179h1v1h-1zM104 181h1v1h-1zM162 181h1v1h-1zM201 181h1v1h-1zM171 182h1v1h-1zM161 183h1v1h-1zM128 188h1v1h-1zM252 188h1v1h-1zM251 190h1v1h-1zM175 191h1v1h-1zM220 191h1v1h-1zM176 193h1v1h-1zM219 193h1v1h-1zM104 197h1v1h-1zM208 197h1v1h-1zM91 199h1v1h-1zM123 199h1v1h-1zM209 199h1v1h-1zM247 199h1v1h-1zM91 200h1v1h-1zM153 200h1v1h-1zM122 201h1v1h-1zM246 201h1v1h-1zM152 202h1v1h-1zM180 202h1v1h-1zM245 203h1v1h-1zM274 203h1v1h-1zM151 204h1v1h-1zM287 205h1v1h-1zM287 206h1v1h-1zM103 207h1v1h-1zM273 208h1v1h-1zM102 209h1v1h-1zM242 210h1v1h-1zM184 211h1v1h-1zM93 212h1v1h-1zM117 212h1v1h-1zM241 212h1v1h-1zM100 213h1v1h-1zM185 213h1v1h-1zM116 214h1v1h-1zM240 214h1v1h-1zM285 215h1v1h-1zM270 218h1v1h-1zM143 221h1v1h-1zM142 223h1v1h-1zM234 227h1v1h-1zM281 227h1v1h-1zM109 229h1v1h-1zM233 229h1v1h-1zM108 231h1v1h-1zM107 233h1v1h-1zM194 233h1v1h-1zM263 233h1v1h-1zM136 236h1v1h-1zM135 238h1v1h-1zM105 241h1v1h-1zM274 241h1v1h-1zM198 242h1v1h-1zM227 242h1v1h-1zM272 244h1v1h-1zM109 247h1v1h-1zM131 247h1v1h-1zM112 251h1v1h-1zM266 252h1v1h-1zM136 256h1v1h-1zM140 259h1v1h-1zM236 261h1v1h-1zM146 263h1v1h-1zM231 264h1v1h-1zM127 266h1v1h-1zM223 268h1v1h-1zM158 269h1v1h-1zM161 270h1v1h-1zM135 272h1v1h-1zM167 272h1v1h-1zM244 272h1v1h-1zM171 273h1v1h-1zM208 273h1v1h-1zM176 274h1v1h-1zM202 274h1v1h-1zM189 275h2v1h-2zM239 275h1v1h-1zM227 281h1v1h-1zM164 285h1v1h-1zM215 285h1v1h-1zM169 286h1v1h-1zM210 286h1v1h-1zM174 287h1v1h-1zM205 287h1v1h-1z" />
              <path fill="rgba(85,196,207,0.9961)" d="M179 91h21v1h-21zM172 92h35v1h-35zM167 93h46v1h-46zM163 94h54v1h-54zM159 95h61v1h-61zM157 96h66v1h-66zM154 97h72v1h-72zM151 98h77v1h-77zM149 99h82v1h-82zM147 100h86v1h-86zM145 101h90v1h-90zM143 102h94v1h-94zM141 103h98v1h-98zM139 104h42v1h-42zM199 104h41v1h-41zM138 105h36v1h-36zM206 105h36v1h-36zM136 106h34v1h-34zM210 106h34v1h-34zM135 107h31v1h-31zM214 107h31v1h-31zM133 108h30v1h-30zM217 108h29v1h-29zM132 109h28v1h-28zM220 109h28v1h-28zM130 110h3v1h-3zM134 110h23v1h-23zM222 110h27v1h-27zM129 111h26v1h-26zM225 111h25v1h-25zM128 112h25v1h-25zM227 112h25v1h-25zM127 113h24v1h-24zM229 113h24v1h-24zM126 114h23v1h-23zM231 114h23v1h-23zM124 115h23v1h-23zM233 115h22v1h-22zM123 116h22v1h-22zM234 116h22v1h-22zM122 117h2v1h-2zM125 117h19v1h-19zM236 117h21v1h-21zM121 118h21v1h-21zM237 118h22v1h-22zM120 119h2v1h-2zM123 119h18v1h-18zM239 119h21v1h-21zM119 120h20v1h-20zM240 120h21v1h-21zM118 121h20v1h-20zM242 121h20v1h-20zM117 122h20v1h-20zM243 122h20v1h-20zM116 123h20v1h-20zM244 123h19v1h-19zM116 124h1v1h-1zM118 124h16v1h-16zM245 124h19v1h-19zM115 125h18v1h-18zM246 125h19v1h-19zM114 126h18v1h-18zM248 126h18v1h-18zM113 127h18v1h-18zM249 127h18v1h-18zM112 128h18v1h-18zM249 128h19v1h-19zM111 129h18v1h-18zM250 129h18v1h-18zM110 130h18v1h-18zM249 130h20v1h-20zM110 131h17v1h-17zM249 131h21v1h-21zM109 132h17v1h-17zM248 132h23v1h-23zM108 133h17v1h-17zM248 133h1v1h-1zM250 133h21v1h-21zM108 134h16v1h-16zM247 134h25v1h-25zM107 135h17v1h-17zM153 135h28v1h-28zM247 135h1v1h-1zM249 135h24v1h-24zM106 136h17v1h-17zM153 136h14v1h-14zM170 136h11v1h-11zM246 136h27v1h-27zM106 137h16v1h-16zM152 137h8v1h-8zM161 137h1v1h-1zM170 137h1v1h-1zM172 137h1v1h-1zM174 137h8v1h-8zM246 137h1v1h-1zM249 137h25v1h-25zM105 138h16v1h-16zM152 138h30v1h-30zM245 138h30v1h-30zM105 139h16v1h-16zM151 139h31v1h-31zM245 139h1v1h-1zM248 139h27v1h-27zM104 140h16v1h-16zM151 140h2v1h-2zM154 140h29v1h-29zM244 140h2v1h-2zM248 140h27v1h-27zM103 141h16v1h-16zM150 141h33v1h-33zM244 141h1v1h-1zM247 141h27v1h-27zM103 142h15v1h-15zM150 142h34v1h-34zM244 142h1v1h-1zM246 142h28v1h-28zM102 143h16v1h-16zM150 143h34v1h-34zM243 143h30v1h-30zM102 144h15v1h-15zM149 144h2v1h-2zM152 144h33v1h-33zM243 144h1v1h-1zM246 144h27v1h-27zM101 145h15v1h-15zM149 145h36v1h-36zM242 145h1v1h-1zM245 145h27v1h-27zM101 146h15v1h-15zM148 146h1v1h-1zM151 146h35v1h-35zM242 146h1v1h-1zM244 146h28v1h-28zM100 147h15v1h-15zM147 147h2v1h-2zM150 147h36v1h-36zM241 147h31v1h-31zM100 148h15v1h-15zM147 148h1v1h-1zM149 148h38v1h-38zM241 148h1v1h-1zM244 148h27v1h-27zM99 149h15v1h-15zM147 149h1v1h-1zM149 149h38v1h-38zM240 149h1v1h-1zM243 149h28v1h-28zM99 150h15v1h-15zM146 150h41v1h-41zM240 150h1v1h-1zM242 150h28v1h-28zM99 151h14v1h-14zM146 151h42v1h-42zM239 151h1v1h-1zM242 151h28v1h-28zM98 152h15v1h-15zM145 152h1v1h-1zM147 152h41v1h-41zM239 152h1v1h-1zM242 152h27v1h-27zM98 153h14v1h-14zM145 153h1v1h-1zM148 153h41v1h-41zM239 153h1v1h-1zM242 153h27v1h-27zM97 154h15v1h-15zM144 154h45v1h-45zM238 154h1v1h-1zM240 154h28v1h-28zM97 155h14v1h-14zM144 155h2v1h-2zM147 155h43v1h-43zM238 155h1v1h-1zM240 155h28v1h-28zM97 156h14v1h-14zM143 156h47v1h-47zM237 156h2v1h-2zM240 156h27v1h-27zM96 157h15v1h-15zM143 157h1v1h-1zM145 157h46v1h-46zM237 157h1v1h-1zM240 157h27v1h-27zM96 158h14v1h-14zM143 158h1v1h-1zM145 158h46v1h-46zM236 158h1v1h-1zM239 158h27v1h-27zM283 158h1v1h-1zM96 159h14v1h-14zM142 159h2v1h-2zM145 159h46v1h-46zM236 159h1v1h-1zM239 159h27v1h-27zM282 159h2v1h-2zM95 160h14v1h-14zM141 160h51v1h-51zM235 160h1v1h-1zM238 160h27v1h-27zM282 160h2v1h-2zM95 161h14v1h-14zM141 161h51v1h-51zM235 161h30v1h-30zM281 161h4v1h-4zM95 162h14v1h-14zM140 162h2v1h-2zM143 162h50v1h-50zM234 162h2v1h-2zM237 162h28v1h-28zM281 162h4v1h-4zM94 163h14v1h-14zM140 163h53v1h-53zM234 163h30v1h-30zM280 163h5v1h-5zM94 164h14v1h-14zM140 164h2v1h-2zM143 164h51v1h-51zM233 164h31v1h-31zM280 164h6v1h-6zM94 165h14v1h-14zM139 165h55v1h-55zM233 165h30v1h-30zM280 165h6v1h-6zM94 166h13v1h-13zM139 166h1v1h-1zM141 166h54v1h-54zM232 166h1v1h-1zM235 166h28v1h-28zM279 166h7v1h-7zM93 167h14v1h-14zM138 167h2v1h-2zM141 167h54v1h-54zM232 167h1v1h-1zM234 167h28v1h-28zM279 167h7v1h-7zM93 168h14v1h-14zM138 168h1v1h-1zM141 168h55v1h-55zM231 168h2v1h-2zM234 168h28v1h-28zM278 168h8v1h-8zM93 169h14v1h-14zM137 169h2v1h-2zM140 169h56v1h-56zM231 169h1v1h-1zM234 169h27v1h-27zM278 169h9v1h-9zM93 170h13v1h-13zM137 170h60v1h-60zM230 170h31v1h-31zM277 170h10v1h-10zM93 171h13v1h-13zM136 171h2v1h-2zM139 171h58v1h-58zM230 171h2v1h-2zM233 171h27v1h-27zM277 171h10v1h-10zM92 172h14v1h-14zM136 172h61v1h-61zM229 172h31v1h-31zM276 172h11v1h-11zM92 173h14v1h-14zM135 173h2v1h-2zM139 173h27v1h-27zM167 173h31v1h-31zM229 173h1v1h-1zM231 173h28v1h-28zM276 173h11v1h-11zM92 174h13v1h-13zM135 174h2v1h-2zM138 174h27v1h-27zM168 174h30v1h-30zM229 174h30v1h-30zM275 174h13v1h-13zM92 175h13v1h-13zM134 175h31v1h-31zM169 175h30v1h-30zM228 175h1v1h-1zM231 175h28v1h-28zM275 175h13v1h-13zM92 176h13v1h-13zM134 176h31v1h-31zM169 176h30v1h-30zM228 176h1v1h-1zM231 176h27v1h-27zM275 176h13v1h-13zM92 177h13v1h-13zM134 177h30v1h-30zM170 177h30v1h-30zM227 177h31v1h-31zM275 177h13v1h-13zM92 178h13v1h-13zM133 178h2v1h-2zM136 178h28v1h-28zM170 178h30v1h-30zM227 178h1v1h-1zM229 178h28v1h-28zM275 178h13v1h-13zM92 179h13v1h-13zM133 179h30v1h-30zM170 179h31v1h-31zM226 179h31v1h-31zM275 179h13v1h-13zM91 180h14v1h-14zM132 180h31v1h-31zM171 180h30v1h-30zM226 180h1v1h-1zM228 180h28v1h-28zM275 180h13v1h-13zM91 181h13v1h-13zM132 181h30v1h-30zM171 181h30v1h-30zM225 181h31v1h-31zM275 181h14v1h-14zM91 182h13v1h-13zM131 182h2v1h-2zM134 182h28v1h-28zM172 182h30v1h-30zM225 182h30v1h-30zM275 182h14v1h-14zM91 183h13v1h-13zM131 183h30v1h-30zM172 183h30v1h-30zM224 183h31v1h-31zM275 183h14v1h-14zM91 184h13v1h-13zM130 184h31v1h-31zM173 184h30v1h-30zM224 184h1v1h-1zM226 184h28v1h-28zM275 184h14v1h-14zM91 185h13v1h-13zM130 185h31v1h-31zM173 185h30v1h-30zM223 185h2v1h-2zM226 185h28v1h-28zM275 185h14v1h-14zM91 186h13v1h-13zM129 186h31v1h-31zM173 186h31v1h-31zM223 186h30v1h-30zM275 186h14v1h-14zM91 187h13v1h-13zM129 187h31v1h-31zM174 187h30v1h-30zM222 187h31v1h-31zM275 187h14v1h-14zM91 188h13v1h-13zM129 188h30v1h-30zM174 188h31v1h-31zM222 188h30v1h-30zM275 188h14v1h-14zM91 189h13v1h-13zM128 189h31v1h-31zM175 189h30v1h-30zM222 189h30v1h-30zM275 189h14v1h-14zM91 190h13v1h-13zM128 190h30v1h-30zM175 190h30v1h-30zM221 190h30v1h-30zM275 190h14v1h-14zM91 191h13v1h-13zM127 191h31v1h-31zM176 191h30v1h-30zM221 191h30v1h-30zM275 191h14v1h-14zM91 192h13v1h-13zM127 192h30v1h-30zM176 192h30v1h-30zM220 192h31v1h-31zM275 192h14v1h-14zM91 193h13v1h-13zM126 193h31v1h-31zM177 193h30v1h-30zM220 193h30v1h-30zM275 193h14v1h-14zM91 194h13v1h-13zM126 194h30v1h-30zM177 194h30v1h-30zM219 194h31v1h-31zM275 194h14v1h-14zM91 195h13v1h-13zM125 195h31v1h-31zM177 195h31v1h-31zM219 195h30v1h-30zM275 195h14v1h-14zM91 196h13v1h-13zM125 196h1v1h-1zM127 196h28v1h-28zM178 196h30v1h-30zM218 196h31v1h-31zM275 196h14v1h-14zM91 197h13v1h-13zM124 197h31v1h-31zM178 197h30v1h-30zM218 197h30v1h-30zM275 197h14v1h-14zM91 198h14v1h-14zM124 198h30v1h-30zM179 198h30v1h-30zM217 198h31v1h-31zM275 198h14v1h-14zM92 199h13v1h-13zM124 199h30v1h-30zM179 199h30v1h-30zM217 199h30v1h-30zM275 199h13v1h-13zM92 200h13v1h-13zM123 200h30v1h-30zM180 200h30v1h-30zM216 200h31v1h-31zM275 200h13v1h-13zM92 201h13v1h-13zM123 201h30v1h-30zM180 201h30v1h-30zM216 201h30v1h-30zM275 201h13v1h-13zM92 202h13v1h-13zM122 202h30v1h-30zM181 202h1v1h-1zM183 202h28v1h-28zM215 202h31v1h-31zM275 202h13v1h-13zM92 203h13v1h-13zM122 203h30v1h-30zM181 203h30v1h-30zM215 203h30v1h-30zM275 203h13v1h-13zM92 204h13v1h-13zM121 204h30v1h-30zM182 204h27v1h-27zM210 204h2v1h-2zM214 204h31v1h-31zM274 204h14v1h-14zM92 205h12v1h-12zM121 205h30v1h-30zM182 205h2v1h-2zM185 205h24v1h-24zM210 205h2v1h-2zM214 205h31v1h-31zM274 205h13v1h-13zM92 206h12v1h-12zM120 206h31v1h-31zM182 206h62v1h-62zM274 206h13v1h-13zM93 207h10v1h-10zM120 207h30v1h-30zM183 207h2v1h-2zM186 207h58v1h-58zM274 207h13v1h-13zM93 208h10v1h-10zM119 208h31v1h-31zM183 208h60v1h-60zM274 208h13v1h-13zM93 209h9v1h-9zM119 209h30v1h-30zM184 209h59v1h-59zM273 209h14v1h-14zM93 210h9v1h-9zM118 210h31v1h-31zM184 210h58v1h-58zM273 210h14v1h-14zM93 211h9v1h-9zM118 211h30v1h-30zM185 211h57v1h-57zM273 211h13v1h-13zM94 212h7v1h-7zM118 212h30v1h-30zM185 212h56v1h-56zM273 212h13v1h-13zM94 213h6v1h-6zM117 213h30v1h-30zM186 213h55v1h-55zM272 213h14v1h-14zM94 214h6v1h-6zM117 214h30v1h-30zM186 214h54v1h-54zM272 214h14v1h-14zM94 215h6v1h-6zM116 215h30v1h-30zM186 215h54v1h-54zM272 215h13v1h-13zM95 216h4v1h-4zM116 216h30v1h-30zM187 216h53v1h-53zM271 216h14v1h-14zM95 217h4v1h-4zM115 217h30v1h-30zM187 217h52v1h-52zM271 217h14v1h-14zM95 218h3v1h-3zM115 218h30v1h-30zM188 218h51v1h-51zM271 218h14v1h-14zM95 219h3v1h-3zM114 219h30v1h-30zM188 219h50v1h-50zM270 219h14v1h-14zM96 220h1v1h-1zM114 220h30v1h-30zM189 220h49v1h-49zM270 220h14v1h-14zM96 221h1v1h-1zM113 221h30v1h-30zM189 221h48v1h-48zM269 221h15v1h-15zM113 222h30v1h-30zM190 222h47v1h-47zM269 222h14v1h-14zM112 223h30v1h-30zM190 223h46v1h-46zM269 223h14v1h-14zM112 224h30v1h-30zM191 224h45v1h-45zM268 224h15v1h-15zM111 225h31v1h-31zM191 225h44v1h-44zM268 225h14v1h-14zM111 226h30v1h-30zM191 226h44v1h-44zM267 226h15v1h-15zM110 227h31v1h-31zM192 227h42v1h-42zM267 227h14v1h-14zM110 228h30v1h-30zM192 228h42v1h-42zM266 228h15v1h-15zM110 229h30v1h-30zM193 229h40v1h-40zM266 229h15v1h-15zM109 230h30v1h-30zM193 230h40v1h-40zM265 230h15v1h-15zM109 231h30v1h-30zM194 231h39v1h-39zM265 231h15v1h-15zM108 232h30v1h-30zM194 232h38v1h-38zM264 232h15v1h-15zM108 233h30v1h-30zM195 233h37v1h-37zM264 233h15v1h-15zM107 234h30v1h-30zM195 234h36v1h-36zM263 234h15v1h-15zM107 235h30v1h-30zM195 235h36v1h-36zM262 235h16v1h-16zM106 236h30v1h-30zM196 236h34v1h-34zM262 236h1v1h-1zM264 236h13v1h-13zM106 237h30v1h-30zM196 237h34v1h-34zM261 237h16v1h-16zM105 238h30v1h-30zM197 238h32v1h-32zM260 238h16v1h-16zM105 239h30v1h-30zM197 239h32v1h-32zM260 239h1v1h-1zM262 239h14v1h-14zM105 240h30v1h-30zM198 240h30v1h-30zM259 240h16v1h-16zM106 241h28v1h-28zM198 241h30v1h-30zM258 241h16v1h-16zM106 242h28v1h-28zM199 242h28v1h-28zM257 242h17v1h-17zM107 243h26v1h-26zM199 243h28v1h-28zM256 243h17v1h-17zM107 244h26v1h-26zM200 244h26v1h-26zM255 244h17v1h-17zM108 245h24v1h-24zM255 245h2v1h-2zM258 245h14v1h-14zM109 246h23v1h-23zM254 246h17v1h-17zM110 247h21v1h-21zM253 247h17v1h-17zM110 248h21v1h-21zM252 248h18v1h-18zM111 249h20v1h-20zM251 249h18v1h-18zM112 250h18v1h-18zM250 250h18v1h-18zM113 251h18v1h-18zM249 251h18v1h-18zM113 252h19v1h-19zM248 252h18v1h-18zM114 253h19v1h-19zM247 253h19v1h-19zM115 254h19v1h-19zM246 254h19v1h-19zM116 255h19v1h-19zM244 255h20v1h-20zM117 256h19v1h-19zM243 256h20v1h-20zM118 257h20v1h-20zM242 257h20v1h-20zM119 258h20v1h-20zM241 258h20v1h-20zM120 259h20v1h-20zM239 259h21v1h-21zM121 260h21v1h-21zM238 260h21v1h-21zM122 261h21v1h-21zM237 261h21v1h-21zM123 262h21v1h-21zM235 262h22v1h-22zM124 263h22v1h-22zM233 263h23v1h-23zM125 264h23v1h-23zM232 264h23v1h-23zM126 265h24v1h-24zM230 265h24v1h-24zM128 266h24v1h-24zM228 266h24v1h-24zM129 267h25v1h-25zM226 267h25v1h-25zM130 268h26v1h-26zM224 268h26v1h-26zM131 269h27v1h-27zM221 269h28v1h-28zM133 270h28v1h-28zM218 270h29v1h-29zM134 271h30v1h-30zM215 271h31v1h-31zM136 272h31v1h-31zM212 272h32v1h-32zM137 273h34v1h-34zM209 273h34v1h-34zM139 274h37v1h-37zM203 274h38v1h-38zM140 275h49v1h-49zM191 275h48v1h-48zM142 276h96v1h-96zM144 277h92v1h-92zM146 278h88v1h-88zM148 279h84v1h-84zM150 280h80v1h-80zM152 281h75v1h-75zM155 282h69v1h-69zM158 283h64v1h-64zM161 284h58v1h-58zM165 285h50v1h-50zM170 286h40v1h-40zM175 287h30v1h-30zM182 288h15v1h-15z" />
              <path fill="rgba(85,195,207,0.9725)" d="M203 91h1v1h-1zM190 156h1v1h-1zM172 287h1v1h-1z" />
              <path fill="rgba(85,195,207,0.9490)" d="M204 91h1v1h-1z" />
              <path fill="rgba(85,197,208,0.9137)" d="M205 91h1v1h-1zM171 106h1v1h-1z" />
              <path fill="rgba(86,196,206,0.7765)" d="M206 91h1v1h-1z" />
              <path fill="rgba(85,197,207,0.5882)" d="M207 91h1v1h-1z" />
              <path fill="rgba(88,196,209,0.3882)" d="M208 91h1v1h-1z" />
              <path fill="rgba(37,82,82,0.1333)" d="M209 91h1v1h-1z" />
              <path fill="rgba(0,0,0,0.0549)" d="M210 91h1v1h-1zM143 100h1v1h-1zM250 109h1v1h-1zM125 112h1v1h-1zM157 133h3v1h-3zM288 170h1v1h-1zM199 173h1v1h-1zM132 176h1v1h-1zM225 177h1v1h-1zM290 188h1v1h-1zM290 191h1v1h-1zM89 193h1v1h-1zM249 198h1v1h-1zM110 223h1v1h-1zM103 238h1v1h-1zM195 239h1v1h-1zM131 271h1v1h-1zM181 273h1v1h-1zM245 273h1v1h-1zM137 275h1v1h-1zM228 282h1v1h-1zM159 285h1v1h-1z" />
              <path fill="rgba(8,15,15,0.1333)" d="M165 92h1v1h-1z" />
              <path fill="rgba(87,196,207,0.3569)" d="M166 92h1v1h-1z" />
              <path fill="rgba(86,196,207,0.6392)" d="M167 92h1v1h-1z" />
              <path fill="rgba(85,195,205,0.8471)" d="M168 92h1v1h-1z" />
              <path fill="rgba(86,196,207,0.9451)" d="M169 92h1v1h-1zM208 106h1v1h-1zM143 222h1v1h-1zM190 225h1v1h-1z" />
              <path fill="rgba(85,197,207,0.9765)" d="M170 92h1v1h-1zM158 95h1v1h-1zM101 144h1v1h-1zM148 211h1v1h-1zM285 216h1v1h-1zM172 273h1v1h-1zM163 285h1v1h-1z" />
              <path fill="rgba(85,196,207,0.9882)" d="M208 92h1v1h-1zM219 109h1v1h-1zM249 110h1v1h-1zM224 111h1v1h-1zM126 113h1v1h-1zM255 115h1v1h-1zM264 124h1v1h-1zM265 125h1v1h-1zM113 126h1v1h-1zM132 126h1v1h-1zM131 127h1v1h-1zM127 131h1v1h-1zM247 133h1v1h-1zM107 134h1v1h-1zM273 136h1v1h-1zM183 141h1v1h-1zM273 143h1v1h-1zM145 151h1v1h-1zM188 152h1v1h-1zM97 153h1v1h-1zM111 155h1v1h-1zM95 159h1v1h-1zM235 159h1v1h-1zM109 160h1v1h-1zM108 163h1v1h-1zM139 164h1v1h-1zM93 166h1v1h-1zM261 169h1v1h-1zM260 171h1v1h-1zM227 176h1v1h-1zM274 177h1v1h-1zM288 179h1v1h-1zM202 183h1v1h-1zM248 197h1v1h-1zM179 200h1v1h-1zM274 202h1v1h-1zM121 203h1v1h-1zM92 207h1v1h-1zM286 211h1v1h-1zM115 216h1v1h-1zM145 217h1v1h-1zM114 218h1v1h-1zM113 220h1v1h-1zM96 222h1v1h-1zM189 222h1v1h-1zM268 223h1v1h-1zM193 231h1v1h-1zM264 231h1v1h-1zM278 234h1v1h-1zM106 235h1v1h-1zM197 240h1v1h-1zM228 240h1v1h-1zM199 244h1v1h-1zM226 244h1v1h-1zM132 245h1v1h-1zM130 250h1v1h-1zM229 265h1v1h-1zM128 267h1v1h-1zM225 267h1v1h-1zM132 270h1v1h-1zM160 284h1v1h-1zM168 286h1v1h-1z" />
              <path fill="rgba(84,195,207,0.9725)" d="M209 92h1v1h-1zM269 152h1v1h-1zM230 236h1v1h-1z" />
              <path fill="rgba(86,196,207,0.7922)" d="M211 92h1v1h-1zM133 107h1v1h-1zM149 264h1v1h-1zM245 272h1v1h-1z" />
              <path fill="rgba(86,195,207,0.5804)" d="M212 92h1v1h-1z" />
              <path fill="rgba(85,196,207,0.2706)" d="M213 92h1v1h-1z" />
              <path fill="rgba(0,0,0,0.0941)" d="M214 92h1v1h-1zM192 105h1v1h-1zM247 107h1v1h-1zM229 115h1v1h-1zM245 126h1v1h-1zM145 148h1v1h-1zM115 150h1v1h-1zM269 155h1v1h-1zM273 180h1v1h-1zM273 199h1v1h-1zM90 203h1v1h-1zM271 210h1v1h-1zM183 212h1v1h-1zM147 216h1v1h-1zM98 221h1v1h-1zM196 241h1v1h-1zM253 267h1v1h-1z" />
              <path fill="rgba(0,0,0,0.1098)" d="M161 93h1v1h-1zM221 94h1v1h-1zM176 106h1v1h-1zM184 140h1v1h-1zM276 168h1v1h-1zM106 201h1v1h-1zM288 208h1v1h-1zM241 215h1v1h-1zM282 228h1v1h-1zM267 253h1v1h-1zM235 260h1v1h-1zM230 281h1v1h-1zM212 287h1v1h-1zM207 288h1v1h-1z" />
              <path fill="rgba(86,193,207,0.3725)" d="M162 93h1v1h-1z" />
              <path fill="rgba(85,195,206,0.7216)" d="M163 93h1v1h-1zM105 136h1v1h-1zM186 274h1v1h-1z" />
              <path fill="rgba(85,197,208,0.9098)" d="M164 93h1v1h-1zM95 221h1v1h-1zM228 281h1v1h-1zM177 288h1v1h-1z" />
              <path fill="rgba(85,196,207,0.9765)" d="M165 93h1v1h-1zM157 134h11v1h-11zM100 146h1v1h-1zM240 148h1v1h-1zM233 163h1v1h-1zM91 177h1v1h-1zM104 188h1v1h-1zM104 189h1v1h-1zM104 190h1v1h-1zM104 191h1v1h-1zM250 193h1v1h-1zM217 197h1v1h-1zM91 201h1v1h-1zM287 207h1v1h-1zM99 216h1v1h-1zM95 220h1v1h-1zM237 221h1v1h-1zM111 224h1v1h-1zM196 238h1v1h-1zM106 243h1v1h-1zM111 250h1v1h-1zM118 258h1v1h-1zM121 261h1v1h-1zM149 280h1v1h-1zM199 288h1v1h-1z" />
              <path fill="rgba(86,197,208,0.9608)" d="M214 93h1v1h-1zM186 147h1v1h-1z" />
              <path fill="rgba(87,197,207,0.8549)" d="M215 93h1v1h-1z" />
              <path fill="rgba(86,197,208,0.6157)" d="M216 93h1v1h-1zM288 173h1v1h-1z" />
              <path fill="rgba(64,154,165,0.2667)" d="M217 93h1v1h-1z" />
              <path fill="rgba(0,0,0,0.0627)" d="M218 93h1v1h-1zM241 103h1v1h-1zM156 112h1v1h-1zM270 153h1v1h-1zM233 160h1v1h-1zM163 182h1v1h-1zM170 183h1v1h-1zM89 192h1v1h-1zM174 192h1v1h-1zM248 200h1v1h-1zM178 201h1v1h-1zM106 204h1v1h-1zM243 254h1v1h-1zM144 260h1v1h-1zM213 270h1v1h-1zM198 273h1v1h-1z" />
              <path fill="rgba(0,0,0,0.1882)" d="M158 94h1v1h-1zM148 142h1v1h-1zM229 169h1v1h-1zM90 177h1v1h-1zM215 199h1v1h-1zM103 210h1v1h-1zM223 245h1v1h-1zM232 280h1v1h-1z" />
              <path fill="rgba(87,196,209,0.5412)" d="M159 94h1v1h-1z" />
              <path fill="rgba(85,196,207,0.8588)" d="M160 94h1v1h-1z" />
              <path fill="rgba(85,195,206,0.9882)" d="M217 94h1v1h-1zM121 138h1v1h-1zM282 158h1v1h-1zM92 171h1v1h-1zM174 189h1v1h-1zM127 190h1v1h-1zM284 219h1v1h-1zM97 220h1v1h-1zM283 222h1v1h-1zM138 232h1v1h-1zM254 245h1v1h-1zM270 247h1v1h-1zM245 254h1v1h-1zM207 273h1v1h-1zM157 283h1v1h-1zM211 286h1v1h-1zM181 288h1v1h-1z" />
              <path fill="rgba(85,197,207,0.9412)" d="M218 94h1v1h-1zM278 166h1v1h-1zM288 176h1v1h-1zM257 241h1v1h-1zM249 250h1v1h-1z" />
              <path fill="rgba(85,196,206,0.7608)" d="M219 94h1v1h-1zM124 195h1v1h-1z" />
              <path fill="rgba(83,189,199,0.3961)" d="M220 94h1v1h-1z" />
              <path fill="rgba(0,0,0,0.1294)" d="M155 95h1v1h-1zM257 115h1v1h-1zM140 121h1v1h-1zM235 156h1v1h-1zM277 166h1v1h-1zM197 169h1v1h-1zM91 209h1v1h-1zM106 232h1v1h-1zM255 242h1v1h-1zM230 263h1v1h-1z" />
              <path fill="rgba(86,197,207,0.5020)" d="M156 95h1v1h-1z" />
              <path fill="rgba(85,196,207,0.8627)" d="M157 95h1v1h-1zM140 120h1v1h-1zM262 121h1v1h-1zM113 219h1v1h-1z" />
              <path fill="rgba(86,196,207,0.9922)" d="M220 95h1v1h-1zM271 215h1v1h-1zM137 234h1v1h-1zM252 266h1v1h-1zM164 271h1v1h-1z" />
              <path fill="rgba(85,195,207,0.9569)" d="M221 95h1v1h-1zM135 106h1v1h-1zM90 187h1v1h-1zM90 191h1v1h-1zM288 202h1v1h-1zM186 216h1v1h-1zM241 257h1v1h-1zM206 273h1v1h-1zM230 280h1v1h-1z" />
              <path fill="rgba(85,196,208,0.7647)" d="M222 95h1v1h-1z" />
              <path fill="rgba(80,183,191,0.3608)" d="M223 95h1v1h-1z" />
              <path fill="rgba(69,153,162,0.3333)" d="M153 96h1v1h-1z" />
              <path fill="rgba(84,196,206,0.7608)" d="M154 96h1v1h-1zM185 274h1v1h-1z" />
              <path fill="rgba(85,196,207,0.9647)" d="M155 96h1v1h-1zM151 113h1v1h-1zM137 122h1v1h-1zM266 126h1v1h-1zM175 134h1v1h-1zM272 134h1v1h-1zM181 136h1v1h-1zM270 150h1v1h-1zM208 196h1v1h-1zM216 199h1v1h-1zM288 201h1v1h-1zM213 205h1v1h-1zM100 214h1v1h-1zM94 217h1v1h-1zM141 226h1v1h-1zM231 234h1v1h-1zM117 257h1v1h-1zM178 288h1v1h-1z" />
              <path fill="rgba(85,196,207,0.9216)" d="M224 96h1v1h-1zM229 98h1v1h-1zM148 144h1v1h-1zM277 168h1v1h-1zM108 230h1v1h-1zM180 274h1v1h-1z" />
              <path fill="rgba(87,196,209,0.6078)" d="M225 96h1v1h-1z" />
              <path fill="rgba(44,103,108,0.2039)" d="M226 96h1v1h-1z" />
              <path fill="rgba(0,0,0,0.1137)" d="M150 97h1v1h-1zM138 103h1v1h-1zM215 109h1v1h-1zM287 166h1v1h-1zM289 177h1v1h-1zM171 185h1v1h-1zM247 202h1v1h-1zM157 267h1v1h-1zM216 286h1v1h-1z" />
              <path fill="rgba(86,196,207,0.5255)" d="M151 97h1v1h-1zM134 106h1v1h-1z" />
              <path fill="rgba(85,196,207,0.9020)" d="M152 97h1v1h-1zM120 140h1v1h-1z" />
              <path fill="rgba(85,197,208,0.8235)" d="M227 97h1v1h-1z" />
              <path fill="rgba(85,196,209,0.3882)" d="M228 97h1v1h-1z" />
              <path fill="rgba(8,16,21,0.2431)" d="M148 98h1v1h-1z" />
              <path fill="rgba(84,196,207,0.6902)" d="M149 98h1v1h-1z" />
              <path fill="rgba(85,196,207,0.9608)" d="M150 98h1v1h-1zM231 99h1v1h-1zM176 134h1v1h-1zM288 177h1v1h-1zM257 178h1v1h-1zM90 189h1v1h-1zM251 191h1v1h-1zM150 207h1v1h-1zM101 212h1v1h-1zM110 226h1v1h-1zM104 240h1v1h-1zM251 248h1v1h-1zM268 250h1v1h-1z" />
              <path fill="rgba(84,198,207,0.5608)" d="M230 98h1v1h-1z" />
              <path fill="rgba(0,0,0,0.1569)" d="M231 98h1v1h-1zM107 132h1v1h-1zM124 136h1v1h-1zM121 140h1v1h-1zM176 196h1v1h-1zM121 200h1v1h-1zM289 201h1v1h-1zM153 203h1v1h-1zM272 206h1v1h-1zM240 217h1v1h-1zM107 230h1v1h-1zM234 230h1v1h-1zM193 234h1v1h-1zM206 245h1v1h-1zM226 245h1v1h-1zM138 256h1v1h-1zM167 287h1v1h-1z" />
              <path fill="rgba(0,0,0,0.0588)" d="M145 99h1v1h-1zM133 106h1v1h-1zM202 106h1v1h-1zM265 123h1v1h-1zM246 127h1v1h-1zM247 128h1v1h-1zM153 133h4v1h-4zM276 140h1v1h-1zM185 142h1v1h-1zM111 159h1v1h-1zM89 185h1v1h-1zM290 189h1v1h-1zM290 190h1v1h-1zM92 214h1v1h-1zM268 219h1v1h-1zM275 242h1v1h-1zM155 266h1v1h-1zM216 269h1v1h-1zM174 272h1v1h-1zM156 284h1v1h-1z" />
              <path fill="rgba(52,112,121,0.3647)" d="M146 99h1v1h-1z" />
              <path fill="rgba(85,196,206,0.8235)" d="M147 99h1v1h-1zM196 274h1v1h-1z" />
              <path fill="rgba(87,195,208,0.7020)" d="M232 99h1v1h-1z" />
              <path fill="rgba(0,0,0,0.2353)" d="M233 99h1v1h-1zM260 118h1v1h-1zM102 212h1v1h-1zM206 288h1v1h-1z" />
              <path fill="rgba(50,116,124,0.3804)" d="M144 100h1v1h-1z" />
              <path fill="rgba(86,195,206,0.8706)" d="M145 100h1v1h-1z" />
              <path fill="rgba(85,196,207,0.9804)" d="M233 100h1v1h-1zM245 107h1v1h-1zM160 109h1v1h-1zM109 131h1v1h-1zM274 141h1v1h-1zM144 153h1v1h-1zM286 167h1v1h-1zM274 175h1v1h-1zM199 176h1v1h-1zM225 180h1v1h-1zM104 184h1v1h-1zM104 185h1v1h-1zM126 192h1v1h-1zM207 194h1v1h-1zM288 200h1v1h-1zM274 201h1v1h-1zM119 207h1v1h-1zM273 207h1v1h-1zM183 209h1v1h-1zM282 225h1v1h-1zM266 227h1v1h-1zM279 232h1v1h-1zM277 236h1v1h-1zM229 238h1v1h-1zM258 240h1v1h-1zM133 243h1v1h-1zM119 259h1v1h-1zM120 260h1v1h-1zM251 267h1v1h-1zM201 274h1v1h-1zM147 279h1v1h-1z" />
              <path fill="rgba(85,196,208,0.7490)" d="M234 100h1v1h-1zM105 179h1v1h-1zM91 205h1v1h-1zM238 220h1v1h-1zM148 280h1v1h-1z" />
              <path fill="rgba(16,36,36,0.2471)" d="M235 100h1v1h-1z" />
              <path fill="rgba(32,74,74,0.3098)" d="M142 101h1v1h-1z" />
              <path fill="rgba(85,196,206,0.8431)" d="M143 101h1v1h-1zM229 114h1v1h-1zM112 154h1v1h-1z" />
              <path fill="rgba(85,196,206,0.9765)" d="M235 101h1v1h-1zM163 108h1v1h-1z" />
              <path fill="rgba(85,196,207,0.6941)" d="M236 101h1v1h-1zM289 183h1v1h-1zM189 289h2v1h-2z" />
              <path fill="rgba(0,6,6,0.1765)" d="M237 101h1v1h-1z" />
              <path fill="rgba(0,5,5,0.1882)" d="M140 102h1v1h-1z" />
              <path fill="rgba(89,195,209,0.7333)" d="M141 102h1v1h-1z" />
              <path fill="rgba(86,195,206,0.9882)" d="M142 102h1v1h-1z" />
              <path fill="rgba(87,195,208,0.9569)" d="M237 102h1v1h-1z" />
              <path fill="rgba(85,195,207,0.5647)" d="M238 102h1v1h-1z" />
              <path fill="rgba(0,0,0,0.1216)" d="M239 102h1v1h-1zM231 116h1v1h-1zM146 146h1v1h-1zM213 203h1v1h-1zM114 215h1v1h-1zM258 238h1v1h-1zM229 241h1v1h-1zM249 270h1v1h-1zM180 273h1v1h-1zM139 276h1v1h-1zM200 289h1v1h-1z" />
              <path fill="rgba(83,197,205,0.6000)" d="M139 103h1v1h-1z" />
              <path fill="rgba(85,196,205,0.9647)" d="M140 103h1v1h-1z" />
              <path fill="rgba(87,196,207,0.4392)" d="M240 103h1v1h-1z" />
              <path fill="rgba(76,174,184,0.4196)" d="M137 104h1v1h-1z" />
              <path fill="rgba(86,196,208,0.9098)" d="M138 104h1v1h-1zM108 132h1v1h-1zM125 265h1v1h-1z" />
              <path fill="rgba(86,197,208,0.9922)" d="M181 104h1v1h-1zM126 132h1v1h-1zM116 145h1v1h-1zM284 160h1v1h-1zM168 175h1v1h-1zM288 180h1v1h-1zM288 199h1v1h-1zM144 219h1v1h-1zM190 224h1v1h-1zM138 274h1v1h-1zM197 288h1v1h-1z" />
              <path fill="rgba(86,195,208,0.9922)" d="M182 104h1v1h-1z" />
              <path fill="rgba(84,196,207,0.9843)" d="M183 104h1v1h-1zM155 111h1v1h-1zM255 182h1v1h-1zM267 225h1v1h-1z" />
              <path fill="rgba(85,198,207,0.9608)" d="M184 104h1v1h-1z" />
              <path fill="rgba(87,197,208,0.9451)" d="M185 104h1v1h-1z" />
              <path fill="rgba(86,196,208,0.9333)" d="M186 104h1v1h-1z" />
              <path fill="rgba(85,196,207,0.9255)" d="M187 104h3v1h-3zM239 120h1v1h-1zM105 177h1v1h-1zM103 208h1v1h-1zM232 263h1v1h-1z" />
              <path fill="rgba(85,197,207,0.9255)" d="M190 104h1v1h-1zM117 121h1v1h-1zM267 127h1v1h-1zM283 223h1v1h-1zM233 230h1v1h-1z" />
              <path fill="rgba(86,195,207,0.9333)" d="M191 104h1v1h-1z" />
              <path fill="rgba(85,195,207,0.9373)" d="M192 104h1v1h-1zM153 134h1v1h-1zM246 271h1v1h-1z" />
              <path fill="rgba(86,197,207,0.9451)" d="M193 104h1v1h-1zM92 209h1v1h-1zM238 276h1v1h-1z" />
              <path fill="rgba(86,196,207,0.9529)" d="M194 104h1v1h-1zM221 110h1v1h-1z" />
              <path fill="rgba(85,196,208,0.9725)" d="M195 104h1v1h-1zM242 105h1v1h-1zM127 112h1v1h-1zM112 127h1v1h-1zM246 135h1v1h-1zM119 141h1v1h-1zM256 180h1v1h-1zM272 211h1v1h-1zM108 246h1v1h-1zM234 262h1v1h-1z" />
              <path fill="rgba(86,195,207,0.9882)" d="M196 104h1v1h-1zM163 179h1v1h-1zM235 225h1v1h-1zM240 258h1v1h-1z" />
              <path fill="rgba(86,197,208,0.9961)" d="M198 104h1v1h-1zM259 239h1v1h-1z" />
              <path fill="rgba(85,196,207,0.8275)" d="M241 104h1v1h-1z" />
              <path fill="rgba(28,67,71,0.2824)" d="M242 104h1v1h-1z" />
              <path fill="rgba(0,0,0,0.2157)" d="M135 105h1v1h-1zM239 121h1v1h-1zM115 122h1v1h-1zM271 131h1v1h-1zM208 194h1v1h-1zM106 202h1v1h-1zM106 203h1v1h-1zM185 216h1v1h-1zM189 225h1v1h-1z" />
              <path fill="rgba(85,196,207,0.7686)" d="M136 105h1v1h-1zM95 157h1v1h-1z" />
              <path fill="rgba(85,196,208,0.9922)" d="M174 105h1v1h-1zM193 163h1v1h-1zM166 173h1v1h-1zM133 177h1v1h-1zM272 212h1v1h-1z" />
              <path fill="rgba(87,196,206,0.9216)" d="M176 105h1v1h-1z" />
              <path fill="rgba(85,197,208,0.8667)" d="M177 105h1v1h-1z" />
              <path fill="rgba(85,196,207,0.8000)" d="M178 105h1v1h-1zM90 196h1v1h-1zM105 200h1v1h-1z" />
              <path fill="rgba(49,113,119,0.6471)" d="M179 105h1v1h-1z" />
              <path fill="rgba(8,19,21,0.5333)" d="M180 105h1v1h-1z" />
              <path fill="rgba(0,0,0,0.4667)" d="M181 105h1v1h-1z" />
              <path fill="rgba(0,0,0,0.4118)" d="M182 105h1v1h-1z" />
              <path fill="rgba(0,0,0,0.3137)" d="M183 105h1v1h-1zM280 160h1v1h-1zM251 247h1v1h-1z" />
              <path fill="rgba(0,0,0,0.1843)" d="M184 105h1v1h-1zM275 137h1v1h-1zM183 138h1v1h-1zM109 164h1v1h-1zM270 214h1v1h-1zM199 245h1v1h-1zM222 245h1v1h-1zM222 267h1v1h-1zM162 269h1v1h-1z" />
              <path fill="rgba(0,0,0,0.1176)" d="M185 105h1v1h-1zM244 105h1v1h-1zM223 112h1v1h-1zM114 123h1v1h-1zM189 151h1v1h-1zM262 170h1v1h-1zM275 170h1v1h-1zM134 172h1v1h-1zM90 176h1v1h-1zM254 187h1v1h-1zM220 188h1v1h-1zM105 206h1v1h-1zM235 228h1v1h-1z" />
              <path fill="rgba(0,0,0,0.0863)" d="M186 105h1v1h-1zM143 119h1v1h-1zM97 150h1v1h-1zM114 152h1v1h-1zM113 154h1v1h-1zM194 162h1v1h-1zM108 168h1v1h-1zM107 172h1v1h-1zM133 174h1v1h-1zM260 235h1v1h-1zM169 271h1v1h-1zM240 276h1v1h-1z" />
              <path fill="rgba(0,0,0,0.0784)" d="M190 105h1v1h-1zM124 113h1v1h-1zM135 125h1v1h-1zM274 135h1v1h-1zM95 155h1v1h-1zM282 155h1v1h-1zM263 168h1v1h-1zM202 180h1v1h-1zM89 188h1v1h-1zM89 189h1v1h-1zM148 214h1v1h-1zM99 219h1v1h-1zM187 221h1v1h-1zM266 224h1v1h-1zM236 226h1v1h-1zM230 239h1v1h-1z" />
              <path fill="rgba(0,0,0,0.1059)" d="M193 105h1v1h-1zM167 108h1v1h-1zM129 109h1v1h-1zM227 173h1v1h-1zM155 199h1v1h-1zM146 218h1v1h-1z" />
              <path fill="rgba(0,0,0,0.1373)" d="M194 105h1v1h-1zM251 110h1v1h-1zM140 159h1v1h-1zM154 201h1v1h-1zM172 288h1v1h-1z" />
              <path fill="rgba(0,0,0,0.2275)" d="M195 105h1v1h-1zM221 111h1v1h-1zM259 117h1v1h-1zM187 147h1v1h-1zM252 191h1v1h-1zM288 207h1v1h-1z" />
              <path fill="rgba(0,0,0,0.3647)" d="M196 105h1v1h-1zM163 181h1v1h-1zM230 238h1v1h-1z" />
              <path fill="rgba(0,0,0,0.4706)" d="M197 105h1v1h-1zM230 115h1v1h-1z" />
              <path fill="rgba(0,0,0,0.5373)" d="M198 105h1v1h-1z" />
              <path fill="rgba(15,33,35,0.6078)" d="M199 105h1v1h-1z" />
              <path fill="rgba(59,134,142,0.7333)" d="M200 105h1v1h-1z" />
              <path fill="rgba(87,196,208,0.8314)" d="M201 105h1v1h-1z" />
              <path fill="rgba(88,195,208,0.8863)" d="M202 105h1v1h-1z" />
              <path fill="rgba(85,195,207,0.9529)" d="M203 105h1v1h-1zM287 208h1v1h-1zM212 286h1v1h-1z" />
              <path fill="rgba(85,197,208,0.6235)" d="M243 105h1v1h-1z" />
              <path fill="rgba(87,195,208,0.9804)" d="M170 106h1v1h-1z" />
              <path fill="rgba(85,196,207,0.7922)" d="M172 106h1v1h-1z" />
              <path fill="rgba(38,87,91,0.6353)" d="M173 106h1v1h-1z" />
              <path fill="rgba(0,0,0,0.4000)" d="M174 106h1v1h-1zM226 113h1v1h-1z" />
              <path fill="rgba(0,0,0,0.2784)" d="M175 106h1v1h-1zM113 254h1v1h-1zM217 269h1v1h-1zM143 278h1v1h-1z" />
              <path fill="rgba(0,0,0,0.1686)" d="M203 106h1v1h-1zM129 183h1v1h-1zM136 239h1v1h-1zM203 245h2v1h-2zM165 270h1v1h-1zM163 286h1v1h-1z" />
              <path fill="rgba(0,0,0,0.3373)" d="M204 106h1v1h-1zM209 107h1v1h-1zM273 201h1v1h-1zM247 251h1v1h-1z" />
              <path fill="rgba(2,0,0,0.5020)" d="M205 106h1v1h-1z" />
              <path fill="rgba(51,114,120,0.7098)" d="M206 106h1v1h-1z" />
              <path fill="rgba(85,197,209,0.8235)" d="M207 106h1v1h-1z" />
              <path fill="rgba(85,196,205,0.9882)" d="M209 106h1v1h-1z" />
              <path fill="rgba(60,136,145,0.3529)" d="M245 106h1v1h-1z" />
              <path fill="rgba(0,0,0,0.1765)" d="M132 107h1v1h-1zM105 135h1v1h-1zM152 205h1v1h-1zM108 228h1v1h-1zM135 241h1v1h-1zM180 289h1v1h-1z" />
              <path fill="rgba(87,195,206,0.9882)" d="M166 107h1v1h-1z" />
              <path fill="rgba(86,196,208,0.9294)" d="M167 107h1v1h-1zM121 117h1v1h-1zM110 249h1v1h-1z" />
              <path fill="rgba(82,186,198,0.7569)" d="M168 107h1v1h-1z" />
              <path fill="rgba(0,0,0,0.5255)" d="M169 107h1v1h-1z" />
              <path fill="rgba(0,0,0,0.2471)" d="M170 107h1v1h-1zM261 119h1v1h-1zM166 175h1v1h-1zM106 176h1v1h-1zM216 197h1v1h-1zM101 214h1v1h-1zM194 236h1v1h-1zM134 243h1v1h-1zM168 271h1v1h-1zM136 274h1v1h-1z" />
              <path fill="rgba(0,0,0,0.0902)" d="M171 107h1v1h-1zM103 138h1v1h-1zM94 158h1v1h-1zM274 172h1v1h-1zM256 183h1v1h-1zM210 198h1v1h-1zM112 219h1v1h-1zM284 223h1v1h-1zM105 234h1v1h-1zM273 245h1v1h-1zM178 289h1v1h-1z" />
              <path fill="rgba(0,0,0,0.1490)" d="M208 107h1v1h-1zM136 124h1v1h-1zM236 154h1v1h-1zM112 156h1v1h-1zM106 177h1v1h-1zM221 186h1v1h-1zM214 201h1v1h-1zM184 214h1v1h-1zM145 220h1v1h-1zM104 242h1v1h-1zM207 245h1v1h-1zM216 245h1v1h-1zM112 253h1v1h-1zM199 273h1v1h-1zM238 277h1v1h-1z" />
              <path fill="rgba(2,5,5,0.6353)" d="M210 107h1v1h-1z" />
              <path fill="rgba(84,196,207,0.8118)" d="M211 107h1v1h-1z" />
              <path fill="rgba(87,195,208,0.9529)" d="M212 107h1v1h-1z" />
              <path fill="rgba(86,196,207,0.6431)" d="M246 107h1v1h-1z" />
              <path fill="rgba(76,169,181,0.4078)" d="M131 108h1v1h-1z" />
              <path fill="rgba(86,197,207,0.9255)" d="M132 108h1v1h-1z" />
              <path fill="rgba(87,195,208,0.8863)" d="M164 108h1v1h-1z" />
              <path fill="rgba(17,41,42,0.6588)" d="M165 108h1v1h-1z" />
              <path fill="rgba(0,0,0,0.3294)" d="M166 108h1v1h-1zM264 165h1v1h-1zM164 179h1v1h-1zM289 200h1v1h-1z" />
              <path fill="rgba(0,0,0,0.1725)" d="M212 108h1v1h-1zM244 125h1v1h-1zM98 148h1v1h-1zM188 149h1v1h-1zM167 176h1v1h-1zM253 189h1v1h-1zM220 245h1v1h-1zM130 270h1v1h-1zM206 272h1v1h-1z" />
              <path fill="rgba(0,0,0,0.4431)" d="M213 108h1v1h-1zM273 177h1v1h-1zM257 240h1v1h-1z" />
              <path fill="rgba(52,117,124,0.7176)" d="M214 108h1v1h-1z" />
              <path fill="rgba(86,196,207,0.9137)" d="M215 108h1v1h-1z" />
              <path fill="rgba(86,195,208,0.8471)" d="M247 108h1v1h-1z" />
              <path fill="rgba(11,30,30,0.2667)" d="M248 108h1v1h-1z" />
              <path fill="rgba(87,197,208,0.6549)" d="M130 109h1v1h-1z" />
              <path fill="rgba(85,198,207,0.8745)" d="M161 109h1v1h-1z" />
              <path fill="rgba(6,15,18,0.6196)" d="M162 109h1v1h-1z" />
              <path fill="rgba(0,0,0,0.2863)" d="M163 109h1v1h-1zM144 118h1v1h-1zM143 153h1v1h-1zM258 178h1v1h-1zM157 194h1v1h-1zM182 209h1v1h-1zM94 220h1v1h-1zM280 232h1v1h-1z" />
              <path fill="rgba(0,0,0,0.0667)" d="M164 109h1v1h-1zM227 114h1v1h-1zM241 143h1v1h-1zM273 174h1v1h-1zM226 175h1v1h-1zM89 186h1v1h-1zM126 189h1v1h-1zM217 194h1v1h-1zM289 203h1v1h-1zM119 204h1v1h-1zM111 221h1v1h-1zM265 226h1v1h-1zM139 233h1v1h-1z" />
              <path fill="rgba(0,0,0,0.3843)" d="M216 109h1v1h-1zM120 141h1v1h-1zM269 154h1v1h-1zM105 195h1v1h-1z" />
              <path fill="rgba(22,52,53,0.6941)" d="M217 109h1v1h-1z" />
              <path fill="rgba(85,197,207,0.9098)" d="M218 109h1v1h-1zM241 213h1v1h-1zM131 248h1v1h-1z" />
              <path fill="rgba(84,196,207,0.9608)" d="M248 109h1v1h-1zM142 224h1v1h-1zM260 259h1v1h-1zM259 260h1v1h-1z" />
              <path fill="rgba(85,198,210,0.4941)" d="M249 109h1v1h-1z" />
              <path fill="rgba(85,196,208,0.8471)" d="M129 110h1v1h-1zM272 245h1v1h-1z" />
              <path fill="#55c4cf" d="M133 110h1v1h-1zM124 117h1v1h-1zM122 119h1v1h-1zM117 124h1v1h-1zM249 133h1v1h-1zM248 135h1v1h-1zM167 136h3v1h-3zM160 137h1v1h-1zM162 137h8v1h-8zM171 137h1v1h-1zM173 137h1v1h-1zM247 137h2v1h-2zM246 139h2v1h-2zM153 140h1v1h-1zM246 140h2v1h-2zM245 141h2v1h-2zM245 142h1v1h-1zM151 144h1v1h-1zM244 144h2v1h-2zM243 145h2v1h-2zM149 146h2v1h-2zM243 146h1v1h-1zM149 147h1v1h-1zM148 148h1v1h-1zM242 148h2v1h-2zM148 149h1v1h-1zM241 149h2v1h-2zM241 150h1v1h-1zM240 151h2v1h-2zM146 152h1v1h-1zM240 152h2v1h-2zM146 153h2v1h-2zM240 153h2v1h-2zM239 154h1v1h-1zM146 155h1v1h-1zM239 155h1v1h-1zM239 156h1v1h-1zM144 157h1v1h-1zM238 157h2v1h-2zM144 158h1v1h-1zM237 158h2v1h-2zM144 159h1v1h-1zM237 159h2v1h-2zM236 160h2v1h-2zM142 162h1v1h-1zM236 162h1v1h-1zM142 164h1v1h-1zM140 166h1v1h-1zM233 166h2v1h-2zM140 167h1v1h-1zM233 167h1v1h-1zM139 168h2v1h-2zM233 168h1v1h-1zM139 169h1v1h-1zM232 169h2v1h-2zM138 171h1v1h-1zM232 171h1v1h-1zM137 173h2v1h-2zM230 173h1v1h-1zM137 174h1v1h-1zM229 175h2v1h-2zM229 176h2v1h-2zM135 178h1v1h-1zM228 178h1v1h-1zM227 180h1v1h-1zM133 182h1v1h-1zM225 184h1v1h-1zM225 185h1v1h-1zM126 196h1v1h-1zM182 202h1v1h-1zM209 204h1v1h-1zM184 205h1v1h-1zM209 205h1v1h-1zM185 207h1v1h-1zM263 236h1v1h-1zM261 239h1v1h-1zM257 245h1v1h-1z" />
              <path fill="rgba(85,196,207,0.9176)" d="M158 110h1v1h-1zM243 141h1v1h-1zM192 160h1v1h-1zM274 180h1v1h-1zM289 187h1v1h-1zM289 191h1v1h-1zM153 201h1v1h-1zM288 203h1v1h-1zM93 214h1v1h-1zM171 287h1v1h-1z" />
              <path fill="rgba(45,101,107,0.6627)" d="M159 110h1v1h-1z" />
              <path fill="rgba(0,0,0,0.3333)" d="M160 110h1v1h-1zM141 120h1v1h-1zM105 193h1v1h-1z" />
              <path fill="rgba(0,0,0,0.4353)" d="M219 110h1v1h-1zM238 120h1v1h-1z" />
              <path fill="rgba(75,173,184,0.7569)" d="M220 110h1v1h-1z" />
              <path fill="rgba(85,196,207,0.7255)" d="M250 110h1v1h-1zM242 274h1v1h-1z" />
              <path fill="rgba(58,132,139,0.4314)" d="M127 111h1v1h-1z" />
              <path fill="rgba(88,196,207,0.9451)" d="M128 111h1v1h-1z" />
              <path fill="rgba(85,195,208,0.8314)" d="M156 111h1v1h-1zM133 244h1v1h-1z" />
              <path fill="rgba(0,0,0,0.4824)" d="M157 111h1v1h-1zM138 122h1v1h-1zM188 222h1v1h-1z" />
              <path fill="rgba(0,0,0,0.1451)" d="M158 111h1v1h-1zM268 157h1v1h-1zM135 170h1v1h-1zM228 171h1v1h-1zM201 178h1v1h-1zM161 186h1v1h-1zM209 196h1v1h-1zM180 205h1v1h-1zM267 222h1v1h-1zM208 245h2v1h-2zM215 245h1v1h-1z" />
              <path fill="rgba(2,5,5,0.5922)" d="M222 111h1v1h-1z" />
              <path fill="rgba(85,197,207,0.8902)" d="M223 111h1v1h-1zM242 256h1v1h-1zM202 288h1v1h-1z" />
              <path fill="rgba(86,196,207,0.8745)" d="M251 111h1v1h-1z" />
              <path fill="rgba(11,26,26,0.2745)" d="M252 111h1v1h-1z" />
              <path fill="rgba(86,196,206,0.5961)" d="M126 112h1v1h-1zM287 168h1v1h-1z" />
              <path fill="rgba(82,186,198,0.7529)" d="M154 112h1v1h-1z" />
              <path fill="rgba(0,0,0,0.3569)" d="M155 112h1v1h-1zM105 194h1v1h-1zM133 245h1v1h-1zM124 265h1v1h-1z" />
              <path fill="rgba(2,0,0,0.4667)" d="M224 112h1v1h-1z" />
              <path fill="rgba(86,196,207,0.8353)" d="M225 112h1v1h-1z" />
              <path fill="rgba(86,195,208,0.9333)" d="M252 112h1v1h-1zM160 186h1v1h-1z" />
              <path fill="rgba(75,167,178,0.3882)" d="M253 112h1v1h-1z" />
              <path fill="rgba(86,197,208,0.7216)" d="M125 113h1v1h-1zM91 173h1v1h-1z" />
              <path fill="rgba(78,180,190,0.7059)" d="M152 113h1v1h-1z" />
              <path fill="rgba(0,0,0,0.2667)" d="M153 113h1v1h-1zM137 123h1v1h-1zM149 140h1v1h-1zM271 150h1v1h-1zM173 288h1v1h-1z" />
              <path fill="rgba(84,193,206,0.8118)" d="M227 113h1v1h-1z" />
              <path fill="rgba(86,196,208,0.9686)" d="M253 113h1v1h-1zM224 182h1v1h-1zM118 209h1v1h-1zM129 268h1v1h-1z" />
              <path fill="rgba(86,197,207,0.5843)" d="M254 113h1v1h-1z" />
              <path fill="rgba(86,196,207,0.7686)" d="M124 114h1v1h-1z" />
              <path fill="rgba(86,196,208,0.9765)" d="M149 114h1v1h-1z" />
              <path fill="rgba(84,195,207,0.7294)" d="M150 114h1v1h-1z" />
              <path fill="rgba(0,0,0,0.2745)" d="M151 114h1v1h-1zM231 165h1v1h-1zM273 178h1v1h-1zM103 240h1v1h-1z" />
              <path fill="rgba(0,0,0,0.4157)" d="M228 114h1v1h-1zM148 213h1v1h-1z" />
              <path fill="rgba(87,197,208,0.9922)" d="M230 114h1v1h-1zM172 184h1v1h-1z" />
              <path fill="rgba(86,196,208,0.6627)" d="M255 114h1v1h-1zM265 162h1v1h-1z" />
              <path fill="rgba(85,198,206,0.8549)" d="M123 115h1v1h-1z" />
              <path fill="rgba(86,196,208,0.9882)" d="M147 115h1v1h-1zM241 146h1v1h-1z" />
              <path fill="rgba(87,197,206,0.8039)" d="M148 115h1v1h-1z" />
              <path fill="rgba(0,0,0,0.3412)" d="M149 115h1v1h-1zM105 184h1v1h-1zM207 192h1v1h-1zM178 200h1v1h-1z" />
              <path fill="rgba(85,196,207,0.8745)" d="M231 115h1v1h-1zM288 175h1v1h-1zM114 217h1v1h-1zM106 234h1v1h-1zM147 263h1v1h-1z" />
              <path fill="rgba(85,197,206,0.9922)" d="M232 115h1v1h-1z" />
              <path fill="rgba(87,195,208,0.7373)" d="M256 115h1v1h-1z" />
              <path fill="rgba(3,6,6,0.3176)" d="M121 116h1v1h-1zM227 282h1v1h-1z" />
              <path fill="rgba(86,196,208,0.9137)" d="M122 116h1v1h-1z" />
              <path fill="rgba(88,196,207,0.9922)" d="M145 116h1v1h-1z" />
              <path fill="rgba(86,195,206,0.8824)" d="M146 116h1v1h-1z" />
              <path fill="rgba(0,0,0,0.4235)" d="M147 116h1v1h-1zM242 123h1v1h-1zM114 151h1v1h-1z" />
              <path fill="rgba(2,4,5,0.5490)" d="M232 116h1v1h-1z" />
              <path fill="rgba(87,196,207,0.9333)" d="M233 116h1v1h-1z" />
              <path fill="rgba(87,196,208,0.8235)" d="M257 116h1v1h-1z" />
              <path fill="rgba(0,0,0,0.1961)" d="M258 116h1v1h-1zM225 245h1v1h-1z" />
              <path fill="rgba(6,15,15,0.3373)" d="M120 117h1v1h-1z" />
              <path fill="rgba(86,195,206,0.9529)" d="M144 117h1v1h-1z" />
              <path fill="rgba(22,53,55,0.5843)" d="M145 117h1v1h-1z" />
              <path fill="rgba(0,0,0,0.2118)" d="M233 117h1v1h-1zM272 148h1v1h-1zM144 222h1v1h-1zM233 232h1v1h-1zM219 285h1v1h-1z" />
              <path fill="rgba(67,150,157,0.7137)" d="M234 117h1v1h-1z" />
              <path fill="rgba(85,195,207,0.8706)" d="M258 117h1v1h-1z" />
              <path fill="rgba(6,15,15,0.3255)" d="M119 118h1v1h-1z" />
              <path fill="rgba(88,196,208,0.9294)" d="M120 118h1v1h-1zM118 120h1v1h-1z" />
              <path fill="rgba(85,196,207,0.8078)" d="M143 118h1v1h-1zM183 210h1v1h-1zM104 238h1v1h-1z" />
              <path fill="rgba(0,0,0,0.0431)" d="M234 118h1v1h-1zM106 133h1v1h-1zM169 133h7v1h-7zM177 133h1v1h-1zM180 133h1v1h-1zM280 159h1v1h-1zM137 165h1v1h-1zM166 176h1v1h-1zM89 184h1v1h-1zM290 186h1v1h-1zM173 190h1v1h-1zM207 191h1v1h-1zM290 193h1v1h-1zM157 195h1v1h-1zM118 206h1v1h-1zM186 219h1v1h-1zM231 237h1v1h-1zM227 245h1v1h-1zM118 260h1v1h-1zM119 261h1v1h-1z" />
              <path fill="rgba(0,0,0,0.3961)" d="M235 118h1v1h-1zM263 167h1v1h-1zM250 195h1v1h-1zM266 225h1v1h-1z" />
              <path fill="rgba(86,196,207,0.8941)" d="M236 118h1v1h-1zM127 189h1v1h-1zM220 190h1v1h-1z" />
              <path fill="rgba(85,196,207,0.8824)" d="M259 118h1v1h-1zM261 120h1v1h-1zM289 185h1v1h-1zM94 218h1v1h-1zM238 259h1v1h-1zM208 287h1v1h-1z" />
              <path fill="rgba(6,16,16,0.3216)" d="M118 119h1v1h-1z" />
              <path fill="rgba(84,199,206,0.9294)" d="M119 119h1v1h-1z" />
              <path fill="rgba(85,196,206,0.9647)" d="M141 119h1v1h-1zM99 148h1v1h-1zM231 167h1v1h-1zM287 171h1v1h-1zM135 172h1v1h-1zM91 176h1v1h-1zM124 196h1v1h-1zM91 202h1v1h-1zM152 266h1v1h-1zM179 274h1v1h-1zM207 287h1v1h-1z" />
              <path fill="rgba(2,2,2,0.5569)" d="M142 119h1v1h-1z" />
              <path fill="rgba(0,0,0,0.1529)" d="M236 119h1v1h-1zM102 140h1v1h-1zM91 170h1v1h-1zM273 200h1v1h-1zM106 245h1v1h-1zM217 245h1v1h-1zM270 249h1v1h-1zM242 255h1v1h-1zM173 272h1v1h-1z" />
              <path fill="rgba(45,95,102,0.6941)" d="M237 119h1v1h-1z" />
              <path fill="rgba(88,196,208,0.9843)" d="M238 119h1v1h-1z" />
              <path fill="rgba(85,195,207,0.8902)" d="M260 119h1v1h-1zM139 163h1v1h-1zM269 249h1v1h-1zM169 272h1v1h-1z" />
              <path fill="rgba(6,12,15,0.3294)" d="M117 120h1v1h-1z" />
              <path fill="rgba(0,0,0,0.2314)" d="M262 120h1v1h-1zM99 146h1v1h-1zM238 150h1v1h-1zM154 283h1v1h-1z" />
              <path fill="rgba(0,0,0,0.3059)" d="M116 121h1v1h-1zM123 137h1v1h-1zM169 180h1v1h-1zM105 186h1v1h-1z" />
              <path fill="rgba(47,103,109,0.6980)" d="M139 121h1v1h-1z" />
              <path fill="rgba(84,188,201,0.8118)" d="M240 121h1v1h-1z" />
              <path fill="rgba(0,0,0,0.1804)" d="M263 121h1v1h-1zM273 146h1v1h-1zM237 152h1v1h-1zM192 158h1v1h-1zM267 159h1v1h-1zM160 188h1v1h-1zM115 213h1v1h-1zM93 217h1v1h-1zM97 223h1v1h-1zM202 245h1v1h-1zM221 245h1v1h-1zM149 281h1v1h-1z" />
              <path fill="rgba(86,195,208,0.9020)" d="M116 122h1v1h-1zM248 198h1v1h-1zM132 252h1v1h-1z" />
              <path fill="rgba(11,24,26,0.6235)" d="M241 122h1v1h-1z" />
              <path fill="rgba(86,196,208,0.9804)" d="M242 122h1v1h-1z" />
              <path fill="rgba(87,196,208,0.7922)" d="M263 122h1v1h-1zM209 287h1v1h-1z" />
              <path fill="rgba(0,0,0,0.0980)" d="M264 122h1v1h-1zM109 129h1v1h-1zM234 158h1v1h-1zM162 184h1v1h-1zM127 187h1v1h-1zM206 189h1v1h-1zM175 194h1v1h-1zM120 202h1v1h-1zM94 221h1v1h-1zM263 230h1v1h-1zM192 232h1v1h-1zM138 235h1v1h-1zM111 252h1v1h-1zM151 282h1v1h-1z" />
              <path fill="rgba(86,196,207,0.8275)" d="M115 123h1v1h-1zM109 248h1v1h-1z" />
              <path fill="rgba(85,196,207,0.9490)" d="M243 123h1v1h-1zM271 148h1v1h-1zM142 157h1v1h-1zM102 210h1v1h-1zM133 253h1v1h-1zM124 264h1v1h-1zM250 268h1v1h-1z" />
              <path fill="rgba(86,196,206,0.9922)" d="M263 123h1v1h-1zM242 144h1v1h-1z" />
              <path fill="rgba(86,196,207,0.7098)" d="M264 123h1v1h-1zM275 138h1v1h-1z" />
              <path fill="rgba(85,197,207,0.7647)" d="M114 124h1v1h-1z" />
              <path fill="rgba(86,195,207,0.9961)" d="M134 124h1v1h-1zM248 131h1v1h-1z" />
              <path fill="rgba(88,195,209,0.8392)" d="M135 124h1v1h-1z" />
              <path fill="rgba(85,197,207,0.9137)" d="M244 124h1v1h-1z" />
              <path fill="rgba(85,197,208,0.6588)" d="M265 124h1v1h-1z" />
              <path fill="rgba(86,195,208,0.7176)" d="M113 125h1v1h-1z" />
              <path fill="rgba(86,197,207,0.9922)" d="M133 125h1v1h-1z" />
              <path fill="rgba(56,127,133,0.6941)" d="M134 125h1v1h-1z" />
              <path fill="rgba(86,193,205,0.8353)" d="M245 125h1v1h-1z" />
              <path fill="rgba(84,194,203,0.5608)" d="M266 125h1v1h-1z" />
              <path fill="rgba(84,194,205,0.5608)" d="M112 126h1v1h-1z" />
              <path fill="rgba(11,26,27,0.6196)" d="M133 126h1v1h-1z" />
              <path fill="rgba(62,146,152,0.7216)" d="M246 126h1v1h-1z" />
              <path fill="rgba(86,196,208,0.9961)" d="M247 126h1v1h-1z" />
              <path fill="rgba(46,107,113,0.3725)" d="M267 126h1v1h-1z" />
              <path fill="rgba(36,83,87,0.4118)" d="M111 127h1v1h-1z" />
              <path fill="rgba(0,2,0,0.5922)" d="M132 127h1v1h-1z" />
              <path fill="rgba(32,74,80,0.6784)" d="M247 127h1v1h-1z" />
              <path fill="rgba(87,196,207,0.9961)" d="M248 127h1v1h-1zM144 262h1v1h-1z" />
              <path fill="rgba(0,0,4,0.2510)" d="M268 127h1v1h-1zM250 248h1v1h-1z" />
              <path fill="rgba(5,0,0,0.2118)" d="M110 128h1v1h-1z" />
              <path fill="rgba(87,196,208,0.9922)" d="M130 128h1v1h-1zM128 130h1v1h-1z" />
              <path fill="rgba(2,2,2,0.5647)" d="M131 128h1v1h-1z" />
              <path fill="rgba(8,23,22,0.7373)" d="M248 128h1v1h-1z" />
              <path fill="rgba(85,196,210,0.8235)" d="M268 128h1v1h-1z" />
              <path fill="rgba(0,0,0,0.1020)" d="M269 128h1v1h-1zM125 135h1v1h-1zM243 139h1v1h-1zM139 161h1v1h-1zM286 162h1v1h-1zM92 165h1v1h-1zM255 185h1v1h-1zM219 190h1v1h-1zM289 202h1v1h-1zM179 203h1v1h-1zM113 217h1v1h-1zM108 248h1v1h-1zM224 266h1v1h-1z" />
              <path fill="rgba(85,195,206,0.8314)" d="M110 129h1v1h-1z" />
              <path fill="rgba(0,2,0,0.5373)" d="M130 129h1v1h-1z" />
              <path fill="rgba(2,2,2,0.5294)" d="M248 129h1v1h-1z" />
              <path fill="rgba(87,195,207,0.9961)" d="M249 129h1v1h-1z" />
              <path fill="rgba(84,196,206,0.6784)" d="M269 129h1v1h-1z" />
              <path fill="rgba(86,197,209,0.6078)" d="M109 130h1v1h-1z" />
              <path fill="rgba(0,2,0,0.5333)" d="M129 130h1v1h-1z" />
              <path fill="rgba(86,195,208,0.9098)" d="M248 130h1v1h-1z" />
              <path fill="rgba(84,186,196,0.4039)" d="M270 130h1v1h-1z" />
              <path fill="rgba(37,84,89,0.3804)" d="M108 131h1v1h-1z" />
              <path fill="rgba(0,0,0,0.5686)" d="M128 131h1v1h-1z" />
              <path fill="rgba(0,0,0,0.3725)" d="M247 131h1v1h-1zM106 175h1v1h-1zM273 175h1v1h-1zM211 271h1v1h-1z" />
              <path fill="rgba(85,195,206,0.9412)" d="M270 131h1v1h-1zM274 179h1v1h-1zM243 273h1v1h-1z" />
              <path fill="rgba(2,3,5,0.6039)" d="M127 132h1v1h-1z" />
              <path fill="rgba(85,196,209,0.8471)" d="M247 132h1v1h-1z" />
              <path fill="rgba(85,196,209,0.7961)" d="M271 132h1v1h-1z" />
              <path fill="rgba(87,196,209,0.7569)" d="M107 133h1v1h-1z" />
              <path fill="rgba(86,196,208,0.9922)" d="M125 133h1v1h-1zM205 190h1v1h-1zM94 216h1v1h-1zM261 236h1v1h-1z" />
              <path fill="rgba(19,42,43,0.6471)" d="M126 133h1v1h-1z" />
              <path fill="rgba(0,0,0,0.2824)" d="M246 133h1v1h-1zM186 145h1v1h-1zM111 158h1v1h-1zM137 166h1v1h-1zM268 220h1v1h-1zM231 236h1v1h-1zM255 265h1v1h-1zM178 273h1v1h-1zM211 287h1v1h-1z" />
              <path fill="rgba(84,196,205,0.5451)" d="M272 133h1v1h-1z" />
              <path fill="rgba(66,151,161,0.4706)" d="M106 134h1v1h-1z" />
              <path fill="rgba(84,196,208,0.9961)" d="M124 134h1v1h-1z" />
              <path fill="rgba(70,157,165,0.7451)" d="M125 134h1v1h-1z" />
              <path fill="rgba(17,42,47,0.4078)" d="M152 134h1v1h-1z" />
              <path fill="rgba(85,196,207,0.9725)" d="M155 134h2v1h-2zM168 134h5v1h-5zM288 178h1v1h-1zM125 194h1v1h-1zM187 218h1v1h-1zM140 228h1v1h-1zM104 239h1v1h-1zM150 265h1v1h-1zM236 277h1v1h-1zM225 282h1v1h-1zM179 288h1v1h-1zM200 288h1v1h-1z" />
              <path fill="rgba(85,196,207,0.8980)" d="M180 134h1v1h-1zM289 193h1v1h-1zM105 201h1v1h-1zM115 215h1v1h-1zM105 242h1v1h-1z" />
              <path fill="rgba(4,0,0,0.2784)" d="M181 134h1v1h-1zM238 221h1v1h-1z" />
              <path fill="rgba(85,196,206,0.7804)" d="M246 134h1v1h-1zM184 274h1v1h-1z" />
              <path fill="rgba(4,4,8,0.2549)" d="M273 134h1v1h-1z" />
              <path fill="rgba(85,195,206,0.9373)" d="M106 135h1v1h-1z" />
              <path fill="rgba(88,196,209,0.8627)" d="M124 135h1v1h-1z" />
              <path fill="rgba(84,197,208,0.8471)" d="M152 135h1v1h-1z" />
              <path fill="rgba(84,195,207,0.7725)" d="M181 135h1v1h-1zM273 204h1v1h-1z" />
              <path fill="rgba(85,196,208,0.8235)" d="M273 135h1v1h-1zM286 165h1v1h-1z" />
              <path fill="rgba(87,195,209,0.9059)" d="M123 136h1v1h-1z" />
              <path fill="rgba(2,0,0,0.4039)" d="M151 136h1v1h-1z" />
              <path fill="rgba(86,196,208,0.9843)" d="M152 136h1v1h-1zM114 149h1v1h-1z" />
              <path fill="rgba(0,0,0,0.2588)" d="M182 136h1v1h-1zM284 156h1v1h-1zM265 163h1v1h-1zM108 167h1v1h-1zM223 182h1v1h-1zM92 213h1v1h-1zM272 246h1v1h-1zM241 256h1v1h-1zM214 270h1v1h-1zM147 280h1v1h-1z" />
              <path fill="rgba(78,181,191,0.7137)" d="M245 136h1v1h-1z" />
              <path fill="rgba(84,194,204,0.4902)" d="M274 136h1v1h-1z" />
              <path fill="rgba(27,63,66,0.3333)" d="M104 137h1v1h-1z" />
              <path fill="rgba(85,195,206,0.9686)" d="M122 137h1v1h-1z" />
              <path fill="rgba(88,196,208,0.8078)" d="M151 137h1v1h-1zM203 288h1v1h-1z" />
              <path fill="rgba(85,196,207,0.6902)" d="M182 137h1v1h-1zM233 262h1v1h-1zM188 289h1v1h-1z" />
              <path fill="rgba(0,0,0,0.1412)" d="M244 137h1v1h-1zM147 144h1v1h-1zM261 172h1v1h-1zM273 179h1v1h-1zM104 208h1v1h-1zM137 237h1v1h-1zM210 245h5v1h-5zM238 258h1v1h-1zM147 262h1v1h-1zM254 266h1v1h-1zM126 267h1v1h-1z" />
              <path fill="rgba(85,196,206,0.9686)" d="M245 137h1v1h-1zM185 145h1v1h-1zM136 170h1v1h-1zM211 203h1v1h-1zM280 230h1v1h-1zM134 241h1v1h-1z" />
              <path fill="rgba(85,195,209,0.9294)" d="M274 137h1v1h-1z" />
              <path fill="rgba(84,196,207,0.8784)" d="M104 138h1v1h-1z" />
              <path fill="rgba(0,0,0,0.5137)" d="M122 138h1v1h-1z" />
              <path fill="rgba(0,0,3,0.3412)" d="M150 138h1v1h-1zM279 234h1v1h-1z" />
              <path fill="rgba(87,195,207,0.9804)" d="M151 138h1v1h-1z" />
              <path fill="rgba(69,152,161,0.6392)" d="M244 138h1v1h-1z" />
              <path fill="rgba(85,196,206,0.4941)" d="M103 139h1v1h-1z" />
              <path fill="rgba(76,173,184,0.7451)" d="M121 139h1v1h-1z" />
              <path fill="rgba(89,196,209,0.7569)" d="M150 139h1v1h-1z" />
              <path fill="rgba(85,190,199,0.5882)" d="M183 139h1v1h-1z" />
              <path fill="rgba(84,197,208,0.9490)" d="M244 139h1v1h-1z" />
              <path fill="rgba(0,0,0,0.1608)" d="M276 139h1v1h-1zM141 157h1v1h-1zM260 174h1v1h-1zM128 185h1v1h-1zM197 243h1v1h-1zM205 245h1v1h-1zM218 245h1v1h-1zM225 283h1v1h-1zM199 289h1v1h-1z" />
              <path fill="rgba(85,198,206,0.9412)" d="M103 140h1v1h-1z" />
              <path fill="rgba(84,196,208,0.9686)" d="M150 140h1v1h-1z" />
              <path fill="rgba(85,197,208,0.8902)" d="M183 140h1v1h-1zM198 274h1v1h-1z" />
              <path fill="rgba(20,54,58,0.5373)" d="M243 140h1v1h-1z" />
              <path fill="rgba(87,194,206,0.8000)" d="M275 140h1v1h-1z" />
              <path fill="rgba(86,196,207,0.6627)" d="M102 141h1v1h-1zM187 274h1v1h-1z" />
              <path fill="rgba(47,105,114,0.4667)" d="M184 141h1v1h-1z" />
              <path fill="rgba(3,8,10,0.3882)" d="M275 141h1v1h-1z" />
              <path fill="rgba(0,0,0,0.2039)" d="M101 142h1v1h-1zM117 146h1v1h-1zM266 161h1v1h-1zM222 184h1v1h-1zM269 217h1v1h-1zM201 245h1v1h-1zM232 262h1v1h-1z" />
              <path fill="rgba(87,196,205,0.9686)" d="M102 142h1v1h-1z" />
              <path fill="rgba(31,73,76,0.6471)" d="M119 142h1v1h-1z" />
              <path fill="rgba(86,195,209,0.9490)" d="M149 142h1v1h-1z" />
              <path fill="rgba(86,197,208,0.8275)" d="M184 142h1v1h-1zM250 194h1v1h-1z" />
              <path fill="rgba(12,28,30,0.4980)" d="M242 142h1v1h-1z" />
              <path fill="rgba(85,195,206,0.8510)" d="M274 142h1v1h-1z" />
              <path fill="rgba(86,195,208,0.7216)" d="M101 143h1v1h-1zM204 186h1v1h-1z" />
              <path fill="rgba(85,195,208,0.8706)" d="M118 143h1v1h-1z" />
              <path fill="rgba(87,196,208,0.5765)" d="M148 143h1v1h-1z" />
              <path fill="rgba(86,196,206,0.9804)" d="M184 143h1v1h-1zM105 175h1v1h-1z" />
              <path fill="rgba(3,8,8,0.3608)" d="M185 143h1v1h-1z" />
              <path fill="rgba(85,196,206,0.9059)" d="M242 143h1v1h-1z" />
              <path fill="rgba(17,43,48,0.4627)" d="M274 143h1v1h-1z" />
              <path fill="rgba(0,4,4,0.2353)" d="M100 144h1v1h-1z" />
              <path fill="rgba(85,196,208,0.9765)" d="M117 144h1v1h-1z" />
              <path fill="rgba(0,0,3,0.3569)" d="M118 144h1v1h-1z" />
              <path fill="rgba(85,195,207,0.7686)" d="M185 144h1v1h-1z" />
              <path fill="rgba(2,2,2,0.4745)" d="M241 144h1v1h-1z" />
              <path fill="rgba(85,195,206,0.9059)" d="M273 144h1v1h-1zM130 269h1v1h-1z" />
              <path fill="rgba(85,196,206,0.7412)" d="M100 145h1v1h-1zM274 196h1v1h-1z" />
              <path fill="rgba(66,151,161,0.6941)" d="M117 145h1v1h-1z" />
              <path fill="rgba(67,156,167,0.5333)" d="M147 145h1v1h-1z" />
              <path fill="rgba(86,196,207,0.8824)" d="M241 145h1v1h-1z" />
              <path fill="rgba(58,137,144,0.5686)" d="M273 145h1v1h-1z" />
              <path fill="rgba(87,196,208,0.9216)" d="M116 146h1v1h-1z" />
              <path fill="rgba(84,196,207,0.9137)" d="M147 146h1v1h-1zM289 192h1v1h-1zM268 222h1v1h-1z" />
              <path fill="rgba(85,197,207,0.7098)" d="M186 146h1v1h-1z" />
              <path fill="rgba(0,3,0,0.3804)" d="M240 146h1v1h-1z" />
              <path fill="rgba(86,196,207,0.9294)" d="M272 146h1v1h-1zM142 260h1v1h-1z" />
              <path fill="rgba(86,196,206,0.6980)" d="M99 147h1v1h-1z" />
              <path fill="rgba(86,195,207,0.9922)" d="M115 147h1v1h-1z" />
              <path fill="rgba(5,11,11,0.5569)" d="M116 147h1v1h-1z" />
              <path fill="rgba(49,112,116,0.4902)" d="M146 147h1v1h-1z" />
              <path fill="rgba(85,196,207,0.8196)" d="M240 147h1v1h-1zM105 178h1v1h-1z" />
              <path fill="rgba(78,176,185,0.6314)" d="M272 147h1v1h-1z" />
              <path fill="rgba(87,195,207,0.8706)" d="M115 148h1v1h-1z" />
              <path fill="rgba(85,196,206,0.8863)" d="M146 148h1v1h-1zM184 212h1v1h-1zM205 273h1v1h-1z" />
              <path fill="rgba(85,196,209,0.6471)" d="M187 148h1v1h-1z" />
              <path fill="rgba(0,0,0,0.2980)" d="M239 148h1v1h-1zM93 162h1v1h-1zM105 191h1v1h-1z" />
              <path fill="rgba(84,197,208,0.6196)" d="M98 149h1v1h-1z" />
              <path fill="rgba(0,0,0,0.4549)" d="M115 149h1v1h-1z" />
              <path fill="rgba(5,12,12,0.4275)" d="M145 149h1v1h-1z" />
              <path fill="rgba(86,195,207,0.9373)" d="M187 149h1v1h-1zM165 271h1v1h-1z" />
              <path fill="rgba(85,195,207,0.7647)" d="M239 149h1v1h-1z" />
              <path fill="rgba(87,196,208,0.6784)" d="M271 149h1v1h-1z" />
              <path fill="rgba(85,197,207,0.8392)" d="M114 150h1v1h-1zM163 180h1v1h-1zM174 190h1v1h-1z" />
              <path fill="rgba(87,195,208,0.8431)" d="M145 150h1v1h-1z" />
              <path fill="rgba(53,118,127,0.5608)" d="M188 150h1v1h-1z" />
              <path fill="rgba(87,196,207,0.9647)" d="M239 150h1v1h-1zM143 155h1v1h-1z" />
              <path fill="rgba(80,188,198,0.4353)" d="M97 151h1v1h-1z" />
              <path fill="rgba(3,6,8,0.3608)" d="M144 151h1v1h-1z" />
              <path fill="rgba(85,197,207,0.8941)" d="M188 151h1v1h-1zM223 283h1v1h-1z" />
              <path fill="rgba(85,194,207,0.7098)" d="M238 151h1v1h-1z" />
              <path fill="rgba(88,196,208,0.7490)" d="M270 151h1v1h-1z" />
              <path fill="rgba(85,197,208,0.8549)" d="M97 152h1v1h-1z" />
              <path fill="rgba(85,196,207,0.8314)" d="M113 152h1v1h-1zM269 219h1v1h-1z" />
              <path fill="rgba(85,196,206,0.7922)" d="M144 152h1v1h-1z" />
              <path fill="rgba(15,35,37,0.4588)" d="M189 152h1v1h-1z" />
              <path fill="rgba(87,195,207,0.9529)" d="M238 152h1v1h-1z" />
              <path fill="rgba(0,0,3,0.3294)" d="M270 152h1v1h-1z" />
              <path fill="rgba(5,14,14,0.2118)" d="M96 153h1v1h-1z" />
              <path fill="rgba(0,0,0,0.4275)" d="M113 153h1v1h-1z" />
              <path fill="rgba(85,196,208,0.8314)" d="M189 153h1v1h-1zM126 266h1v1h-1z" />
              <path fill="rgba(72,164,174,0.6510)" d="M237 153h1v1h-1z" />
              <path fill="rgba(84,195,207,0.7843)" d="M269 153h1v1h-1z" />
              <path fill="rgba(85,197,207,0.6706)" d="M96 154h1v1h-1z" />
              <path fill="rgba(85,195,206,0.7176)" d="M143 154h1v1h-1zM288 174h1v1h-1z" />
              <path fill="rgba(0,0,0,0.3608)" d="M190 154h1v1h-1zM225 178h1v1h-1zM134 253h1v1h-1z" />
              <path fill="rgba(21,53,53,0.0941)" d="M283 154h1v1h-1z" />
              <path fill="rgba(2,0,2,0.4863)" d="M112 155h1v1h-1z" />
              <path fill="rgba(0,0,5,0.2039)" d="M142 155h1v1h-1z" />
              <path fill="rgba(87,196,209,0.7608)" d="M190 155h1v1h-1z" />
              <path fill="rgba(43,100,104,0.6078)" d="M236 155h1v1h-1z" />
              <path fill="rgba(85,197,208,0.8431)" d="M268 155h1v1h-1zM197 274h1v1h-1z" />
              <path fill="rgba(87,195,206,0.6549)" d="M283 155h1v1h-1z" />
              <path fill="rgba(50,108,113,0.3804)" d="M95 156h1v1h-1z" />
              <path fill="rgba(85,194,208,0.9059)" d="M111 156h1v1h-1z" />
              <path fill="rgba(86,196,208,0.6392)" d="M142 156h1v1h-1zM128 186h1v1h-1z" />
              <path fill="rgba(0,0,0,0.2706)" d="M191 156h1v1h-1zM142 226h1v1h-1zM133 272h1v1h-1z" />
              <path fill="rgba(85,195,206,0.9216)" d="M236 156h1v1h-1zM194 234h1v1h-1z" />
              <path fill="rgba(4,10,10,0.4902)" d="M268 156h1v1h-1z" />
              <path fill="rgba(6,13,17,0.5255)" d="M282 156h1v1h-1z" />
              <path fill="rgba(86,196,208,0.9529)" d="M283 156h1v1h-1zM91 203h1v1h-1z" />
              <path fill="rgba(34,79,82,0.6196)" d="M111 157h1v1h-1z" />
              <path fill="rgba(16,37,41,0.5647)" d="M235 157h1v1h-1z" />
              <path fill="rgba(86,196,207,0.9020)" d="M267 157h1v1h-1z" />
              <path fill="rgba(85,196,207,0.9137)" d="M282 157h1v1h-1zM260 172h1v1h-1z" />
              <path fill="rgba(84,196,206,0.6275)" d="M284 157h1v1h-1z" />
              <path fill="rgba(85,197,207,0.9608)" d="M110 158h1v1h-1zM105 203h1v1h-1zM117 211h1v1h-1zM135 239h1v1h-1zM133 271h1v1h-1z" />
              <path fill="rgba(81,185,195,0.5961)" d="M141 158h1v1h-1z" />
              <path fill="rgba(87,197,208,0.8980)" d="M235 158h1v1h-1z" />
              <path fill="rgba(40,93,100,0.5725)" d="M267 158h1v1h-1z" />
              <path fill="rgba(2,2,0,0.4471)" d="M281 158h1v1h-1z" />
              <path fill="rgba(86,196,208,0.8863)" d="M284 158h1v1h-1z" />
              <path fill="rgba(47,104,109,0.4235)" d="M94 159h1v1h-1z" />
              <path fill="rgba(85,196,206,0.8000)" d="M110 159h1v1h-1zM289 184h1v1h-1z" />
              <path fill="rgba(86,195,208,0.9412)" d="M141 159h1v1h-1z" />
              <path fill="rgba(72,166,175,0.5725)" d="M192 159h1v1h-1z" />
              <path fill="rgba(0,2,0,0.4941)" d="M234 159h1v1h-1z" />
              <path fill="rgba(87,195,208,0.9216)" d="M266 159h1v1h-1z" />
              <path fill="rgba(86,196,206,0.8706)" d="M281 159h1v1h-1z" />
              <path fill="rgba(87,195,208,0.9686)" d="M284 159h1v1h-1zM232 165h1v1h-1z" />
              <path fill="rgba(85,197,207,0.7451)" d="M94 160h1v1h-1z" />
              <path fill="rgba(0,0,0,0.4980)" d="M110 160h1v1h-1zM109 163h1v1h-1z" />
              <path fill="rgba(74,165,174,0.5569)" d="M140 160h1v1h-1z" />
              <path fill="rgba(85,195,208,0.8549)" d="M234 160h1v1h-1z" />
              <path fill="rgba(67,153,162,0.6157)" d="M266 160h1v1h-1z" />
              <path fill="rgba(87,196,207,0.9843)" d="M281 160h1v1h-1z" />
              <path fill="rgba(82,194,205,0.5216)" d="M285 160h1v1h-1z" />
              <path fill="rgba(85,195,207,0.9412)" d="M94 161h1v1h-1zM108 164h1v1h-1zM274 200h1v1h-1zM151 205h1v1h-1zM173 273h1v1h-1z" />
              <path fill="rgba(84,196,207,0.9373)" d="M109 161h1v1h-1z" />
              <path fill="rgba(88,194,207,0.9255)" d="M140 161h1v1h-1zM255 264h1v1h-1z" />
              <path fill="rgba(23,53,58,0.4863)" d="M193 161h1v1h-1z" />
              <path fill="rgba(0,0,3,0.3922)" d="M233 161h1v1h-1z" />
              <path fill="rgba(85,197,205,0.9412)" d="M265 161h1v1h-1z" />
              <path fill="rgba(84,195,206,0.7882)" d="M280 161h1v1h-1z" />
              <path fill="rgba(86,195,204,0.8118)" d="M285 161h1v1h-1z" />
              <path fill="rgba(86,197,207,0.7529)" d="M109 162h1v1h-1z" />
              <path fill="rgba(28,59,64,0.4706)" d="M139 162h1v1h-1z" />
              <path fill="rgba(85,198,207,0.8706)" d="M193 162h1v1h-1z" />
              <path fill="rgba(85,196,207,0.7961)" d="M233 162h1v1h-1zM274 242h1v1h-1z" />
              <path fill="rgba(88,197,207,0.9451)" d="M285 162h1v1h-1z" />
              <path fill="rgba(88,196,208,0.5922)" d="M93 163h1v1h-1z" />
              <path fill="rgba(0,0,0,0.3922)" d="M194 163h1v1h-1z" />
              <path fill="rgba(0,0,3,0.3059)" d="M232 163h1v1h-1zM244 208h1v1h-1z" />
              <path fill="rgba(86,196,207,0.9608)" d="M264 163h1v1h-1zM136 273h1v1h-1z" />
              <path fill="rgba(85,194,206,0.7373)" d="M279 163h1v1h-1z" />
              <path fill="rgba(37,84,91,0.2980)" d="M286 163h1v1h-1z" />
              <path fill="rgba(87,196,208,0.8667)" d="M93 164h1v1h-1zM219 269h1v1h-1z" />
              <path fill="rgba(10,26,29,0.3843)" d="M138 164h1v1h-1z" />
              <path fill="rgba(86,196,208,0.8118)" d="M194 164h1v1h-1zM236 224h1v1h-1z" />
              <path fill="rgba(85,195,207,0.7451)" d="M232 164h1v1h-1z" />
              <path fill="rgba(85,196,208,0.7412)" d="M264 164h1v1h-1z" />
              <path fill="rgba(0,0,0,0.2000)" d="M278 164h1v1h-1zM181 207h1v1h-1zM246 272h1v1h-1z" />
              <path fill="rgba(87,196,206,0.9608)" d="M279 164h1v1h-1z" />
              <path fill="rgba(87,196,207,0.6235)" d="M286 164h1v1h-1z" />
              <path fill="rgba(86,198,208,0.9569)" d="M93 165h1v1h-1z" />
              <path fill="rgba(84,195,205,0.7647)" d="M108 165h1v1h-1z" />
              <path fill="rgba(87,195,209,0.8392)" d="M138 165h1v1h-1zM91 174h1v1h-1z" />
              <path fill="rgba(85,196,208,0.9843)" d="M194 165h1v1h-1zM211 272h1v1h-1zM143 277h1v1h-1z" />
              <path fill="rgba(0,0,0,0.3020)" d="M195 165h1v1h-1zM272 207h1v1h-1zM237 223h1v1h-1zM261 234h1v1h-1zM259 237h1v1h-1zM131 250h1v1h-1z" />
              <path fill="rgba(86,195,208,0.9725)" d="M263 165h1v1h-1z" />
              <path fill="rgba(82,182,193,0.6745)" d="M278 165h1v1h-1z" />
              <path fill="rgba(14,28,31,0.2863)" d="M92 166h1v1h-1z" />
              <path fill="rgba(0,2,2,0.5490)" d="M108 166h1v1h-1z" />
              <path fill="rgba(85,197,208,0.7216)" d="M195 166h1v1h-1zM287 210h1v1h-1z" />
              <path fill="rgba(86,197,209,0.7216)" d="M231 166h1v1h-1z" />
              <path fill="rgba(86,195,207,0.7882)" d="M263 166h1v1h-1z" />
              <path fill="rgba(84,195,207,0.9490)" d="M286 166h1v1h-1z" />
              <path fill="rgba(84,196,208,0.5804)" d="M92 167h1v1h-1z" />
              <path fill="rgba(86,196,206,0.9686)" d="M107 167h1v1h-1zM245 204h1v1h-1zM252 247h1v1h-1zM214 271h1v1h-1z" />
              <path fill="rgba(85,194,209,0.7765)" d="M137 167h1v1h-1z" />
              <path fill="rgba(86,196,206,0.9647)" d="M195 167h1v1h-1zM168 272h1v1h-1z" />
              <path fill="rgba(0,0,0,0.2392)" d="M230 167h1v1h-1zM122 198h1v1h-1zM151 207h1v1h-1zM109 226h1v1h-1zM222 284h1v1h-1z" />
              <path fill="rgba(56,126,133,0.5882)" d="M277 167h1v1h-1z" />
              <path fill="rgba(38,83,90,0.2902)" d="M287 167h1v1h-1z" />
              <path fill="rgba(85,195,207,0.7882)" d="M92 168h1v1h-1zM111 223h1v1h-1zM194 274h1v1h-1z" />
              <path fill="rgba(86,195,207,0.8706)" d="M107 168h1v1h-1zM106 172h1v1h-1z" />
              <path fill="rgba(81,179,192,0.6078)" d="M196 168h1v1h-1z" />
              <path fill="rgba(76,173,183,0.6667)" d="M230 168h1v1h-1z" />
              <path fill="rgba(86,196,207,0.8471)" d="M262 168h1v1h-1zM153 282h1v1h-1z" />
              <path fill="rgba(85,195,208,0.9059)" d="M92 169h1v1h-1zM286 213h1v1h-1z" />
              <path fill="rgba(74,167,177,0.7020)" d="M107 169h1v1h-1z" />
              <path fill="rgba(85,197,207,0.6941)" d="M136 169h1v1h-1z" />
              <path fill="rgba(86,197,207,0.9412)" d="M196 169h1v1h-1z" />
              <path fill="rgba(2,4,6,0.4941)" d="M262 169h1v1h-1z" />
              <path fill="rgba(22,48,51,0.5882)" d="M276 169h1v1h-1z" />
              <path fill="rgba(86,196,208,0.7647)" d="M287 169h1v1h-1z" />
              <path fill="rgba(0,0,2,0.4549)" d="M107 170h1v1h-1z" />
              <path fill="rgba(28,59,67,0.4941)" d="M197 170h1v1h-1z" />
              <path fill="rgba(61,139,149,0.6039)" d="M229 170h1v1h-1z" />
              <path fill="rgba(86,196,207,0.9216)" d="M276 170h1v1h-1zM96 223h1v1h-1z" />
              <path fill="rgba(29,69,75,0.3059)" d="M91 171h1v1h-1z" />
              <path fill="rgba(87,197,208,0.9608)" d="M106 171h1v1h-1z" />
              <path fill="rgba(0,0,0,0.2235)" d="M107 171h1v1h-1zM200 176h1v1h-1zM168 178h1v1h-1zM245 206h1v1h-1zM256 241h1v1h-1zM109 249h1v1h-1zM141 277h1v1h-1zM234 279h1v1h-1z" />
              <path fill="rgba(90,195,209,0.6667)" d="M135 171h1v1h-1z" />
              <path fill="rgba(86,196,209,0.9059)" d="M197 171h1v1h-1z" />
              <path fill="rgba(88,197,209,0.9255)" d="M229 171h1v1h-1z" />
              <path fill="rgba(27,54,56,0.5529)" d="M261 171h1v1h-1z" />
              <path fill="rgba(2,0,2,0.5569)" d="M275 171h1v1h-1z" />
              <path fill="rgba(86,196,207,0.6314)" d="M91 172h1v1h-1z" />
              <path fill="rgba(5,12,12,0.4000)" d="M198 172h1v1h-1z" />
              <path fill="rgba(17,37,39,0.5412)" d="M228 172h1v1h-1z" />
              <path fill="rgba(85,197,208,0.8941)" d="M275 172h1v1h-1zM285 217h1v1h-1z" />
              <path fill="rgba(39,89,95,0.3804)" d="M288 172h1v1h-1z" />
              <path fill="rgba(85,197,208,0.7412)" d="M106 173h1v1h-1z" />
              <path fill="rgba(83,191,203,0.6118)" d="M134 173h1v1h-1z" />
              <path fill="rgba(85,196,208,0.8588)" d="M198 173h1v1h-1z" />
              <path fill="rgba(86,196,208,0.8941)" d="M228 173h1v1h-1zM210 200h1v1h-1z" />
              <path fill="rgba(51,115,122,0.5922)" d="M260 173h1v1h-1z" />
              <path fill="rgba(0,0,0,0.4588)" d="M274 173h1v1h-1zM246 252h1v1h-1z" />
              <path fill="rgba(50,115,120,0.6235)" d="M106 174h1v1h-1z" />
              <path fill="rgba(85,196,207,0.9529)" d="M134 174h1v1h-1zM200 178h1v1h-1zM223 184h1v1h-1zM195 236h1v1h-1zM115 255h1v1h-1zM261 258h1v1h-1zM258 261h1v1h-1z" />
              <path fill="rgba(86,196,207,0.9961)" d="M165 174h1v1h-1z" />
              <path fill="rgba(64,145,151,0.7529)" d="M166 174h1v1h-1z" />
              <path fill="rgba(0,0,0,0.3176)" d="M199 174h1v1h-1zM165 177h1v1h-1z" />
              <path fill="rgba(9,15,17,0.4627)" d="M227 174h1v1h-1z" />
              <path fill="rgba(85,196,208,0.9333)" d="M259 174h1v1h-1zM159 284h1v1h-1z" />
              <path fill="rgba(85,197,207,0.8549)" d="M274 174h1v1h-1zM249 269h1v1h-1z" />
              <path fill="rgba(87,195,207,0.9451)" d="M91 175h1v1h-1z" />
              <path fill="rgba(55,127,130,0.5059)" d="M133 175h1v1h-1z" />
              <path fill="rgba(87,194,207,0.9725)" d="M165 175h1v1h-1z" />
              <path fill="rgba(0,0,2,0.6078)" d="M167 175h1v1h-1z" />
              <path fill="rgba(85,195,207,0.7843)" d="M199 175h1v1h-1z" />
              <path fill="rgba(87,196,206,0.8431)" d="M227 175h1v1h-1z" />
              <path fill="rgba(85,190,201,0.6471)" d="M259 175h1v1h-1z" />
              <path fill="rgba(85,195,208,0.9686)" d="M105 176h1v1h-1z" />
              <path fill="rgba(84,195,206,0.9059)" d="M133 176h1v1h-1z" />
              <path fill="rgba(80,184,196,0.7922)" d="M165 176h1v1h-1z" />
              <path fill="rgba(85,196,205,0.9490)" d="M168 176h1v1h-1z" />
              <path fill="rgba(3,0,0,0.3804)" d="M226 176h1v1h-1z" />
              <path fill="rgba(87,197,209,0.9490)" d="M258 176h1v1h-1z" />
              <path fill="rgba(0,0,0,0.2196)" d="M259 176h1v1h-1zM289 178h1v1h-1zM204 185h1v1h-1zM212 203h1v1h-1zM286 216h1v1h-1zM239 219h1v1h-1zM200 245h1v1h-1zM125 266h1v1h-1zM200 273h1v1h-1z" />
              <path fill="rgba(0,2,0,0.4784)" d="M273 176h1v1h-1z" />
              <path fill="rgba(31,71,76,0.3922)" d="M132 177h1v1h-1z" />
              <path fill="rgba(85,195,207,0.9882)" d="M164 177h1v1h-1z" />
              <path fill="rgba(48,109,116,0.7059)" d="M168 177h1v1h-1z" />
              <path fill="rgba(82,187,194,0.6588)" d="M200 177h1v1h-1z" />
              <path fill="rgba(85,196,208,0.8118)" d="M226 177h1v1h-1zM261 235h1v1h-1z" />
              <path fill="rgba(86,194,206,0.7176)" d="M258 177h1v1h-1z" />
              <path fill="rgba(48,112,118,0.4824)" d="M90 178h1v1h-1z" />
              <path fill="rgba(85,196,208,0.8431)" d="M132 178h1v1h-1zM188 221h1v1h-1z" />
              <path fill="rgba(85,194,205,0.8157)" d="M164 178h1v1h-1z" />
              <path fill="rgba(86,196,209,0.9686)" d="M169 178h1v1h-1z" />
              <path fill="rgba(79,182,192,0.6196)" d="M90 179h1v1h-1z" />
              <path fill="rgba(3,10,10,0.2863)" d="M131 179h1v1h-1z" />
              <path fill="rgba(85,189,200,0.7765)" d="M169 179h1v1h-1z" />
              <path fill="rgba(55,128,134,0.5294)" d="M201 179h1v1h-1z" />
              <path fill="rgba(84,197,207,0.7961)" d="M225 179h1v1h-1z" />
              <path fill="rgba(84,196,208,0.7647)" d="M257 179h1v1h-1z" />
              <path fill="rgba(16,32,37,0.4353)" d="M289 179h1v1h-1z" />
              <path fill="rgba(86,198,208,0.6627)" d="M90 180h1v1h-1z" />
              <path fill="rgba(85,196,208,0.6980)" d="M105 180h1v1h-1z" />
              <path fill="rgba(87,195,208,0.7843)" d="M131 180h1v1h-1z" />
              <path fill="rgba(85,197,208,0.9843)" d="M170 180h1v1h-1z" />
              <path fill="rgba(85,196,207,0.9098)" d="M201 180h1v1h-1zM289 186h1v1h-1z" />
              <path fill="rgba(0,0,0,0.3216)" d="M224 180h1v1h-1zM105 185h1v1h-1zM217 195h1v1h-1zM154 266h1v1h-1zM181 289h1v1h-1z" />
              <path fill="rgba(0,0,3,0.3647)" d="M257 180h1v1h-1z" />
              <path fill="rgba(71,158,168,0.5490)" d="M289 180h1v1h-1z" />
              <path fill="rgba(86,196,208,0.7059)" d="M90 181h1v1h-1z" />
              <path fill="rgba(60,134,143,0.5961)" d="M105 181h1v1h-1z" />
              <path fill="rgba(87,196,208,0.9765)" d="M131 181h1v1h-1z" />
              <path fill="rgba(85,197,207,0.8471)" d="M170 181h1v1h-1z" />
              <path fill="rgba(0,2,5,0.4039)" d="M202 181h1v1h-1z" />
              <path fill="rgba(89,195,208,0.7451)" d="M224 181h1v1h-1z" />
              <path fill="rgba(84,195,205,0.8353)" d="M256 181h1v1h-1z" />
              <path fill="rgba(83,185,197,0.6000)" d="M289 181h1v1h-1z" />
              <path fill="rgba(86,196,208,0.7686)" d="M90 182h1v1h-1zM187 219h1v1h-1z" />
              <path fill="rgba(24,54,59,0.4588)" d="M105 182h1v1h-1z" />
              <path fill="rgba(86,195,207,0.7294)" d="M130 182h1v1h-1z" />
              <path fill="rgba(84,196,207,0.8667)" d="M162 182h1v1h-1z" />
              <path fill="rgba(0,0,2,0.4039)" d="M170 182h1v1h-1z" />
              <path fill="rgba(85,196,206,0.8588)" d="M202 182h1v1h-1z" />
              <path fill="rgba(2,0,2,0.4627)" d="M256 182h1v1h-1z" />
              <path fill="rgba(86,196,206,0.8235)" d="M274 182h1v1h-1zM112 221h1v1h-1z" />
              <path fill="rgba(87,197,208,0.6353)" d="M289 182h1v1h-1zM109 227h1v1h-1z" />
              <path fill="rgba(86,196,206,0.8863)" d="M90 183h1v1h-1z" />
              <path fill="rgba(87,196,208,0.9804)" d="M104 183h1v1h-1z" />
              <path fill="rgba(3,5,5,0.3765)" d="M105 183h1v1h-1z" />
              <path fill="rgba(0,0,0,0.4392)" d="M162 183h1v1h-1zM219 191h1v1h-1z" />
              <path fill="rgba(85,196,204,0.9059)" d="M171 183h1v1h-1z" />
              <path fill="rgba(0,0,0,0.3098)" d="M203 183h1v1h-1zM105 192h1v1h-1zM150 209h1v1h-1zM141 228h1v1h-1zM265 255h1v1h-1z" />
              <path fill="rgba(84,191,203,0.6706)" d="M223 183h1v1h-1z" />
              <path fill="rgba(84,197,206,0.8784)" d="M255 183h1v1h-1z" />
              <path fill="rgba(68,155,162,0.7333)" d="M274 183h1v1h-1z" />
              <path fill="rgba(86,196,207,0.9373)" d="M90 184h1v1h-1z" />
              <path fill="rgba(86,197,206,0.6941)" d="M129 184h1v1h-1z" />
              <path fill="rgba(85,195,207,0.9020)" d="M161 184h1v1h-1zM220 284h1v1h-1z" />
              <path fill="rgba(2,0,0,0.5216)" d="M171 184h1v1h-1z" />
              <path fill="rgba(86,196,207,0.8000)" d="M203 184h1v1h-1z" />
              <path fill="rgba(85,195,208,0.9882)" d="M254 184h1v1h-1z" />
              <path fill="rgba(12,23,25,0.5176)" d="M255 184h1v1h-1z" />
              <path fill="rgba(25,57,60,0.6824)" d="M274 184h1v1h-1z" />
              <path fill="rgba(85,196,208,0.9490)" d="M90 185h1v1h-1zM90 193h1v1h-1zM262 257h1v1h-1z" />
              <path fill="rgba(4,8,8,0.5294)" d="M161 185h1v1h-1z" />
              <path fill="rgba(85,197,207,0.9373)" d="M172 185h1v1h-1z" />
              <path fill="rgba(88,196,208,0.9804)" d="M203 185h1v1h-1z" />
              <path fill="rgba(66,153,162,0.5882)" d="M222 185h1v1h-1z" />
              <path fill="rgba(87,195,207,0.8941)" d="M254 185h1v1h-1z" />
              <path fill="rgba(9,23,23,0.6549)" d="M274 185h1v1h-1z" />
              <path fill="rgba(86,197,209,0.9529)" d="M90 186h1v1h-1z" />
              <path fill="rgba(87,195,206,0.9804)" d="M104 186h1v1h-1z" />
              <path fill="rgba(44,92,98,0.6431)" d="M172 186h1v1h-1z" />
              <path fill="rgba(87,195,206,0.9333)" d="M222 186h1v1h-1z" />
              <path fill="rgba(85,195,208,0.9922)" d="M253 186h1v1h-1z" />
              <path fill="rgba(31,73,77,0.5451)" d="M254 186h1v1h-1z" />
              <path fill="rgba(3,8,8,0.6471)" d="M274 186h1v1h-1z" />
              <path fill="rgba(87,196,207,0.9765)" d="M104 187h1v1h-1z" />
              <path fill="rgba(0,0,0,0.2941)" d="M105 187h1v1h-1zM173 189h1v1h-1zM105 190h1v1h-1zM250 269h1v1h-1z" />
              <path fill="rgba(85,196,207,0.9294)" d="M128 187h1v1h-1z" />
              <path fill="rgba(7,20,18,0.6000)" d="M160 187h1v1h-1z" />
              <path fill="rgba(84,196,206,0.9686)" d="M204 187h1v1h-1z" />
              <path fill="rgba(0,0,0,0.1647)" d="M205 187h1v1h-1zM246 204h1v1h-1zM262 232h1v1h-1zM228 243h1v1h-1zM219 245h1v1h-1zM132 251h1v1h-1zM266 254h1v1h-1z" />
              <path fill="rgba(32,74,79,0.5294)" d="M221 187h1v1h-1z" />
              <path fill="rgba(87,194,207,0.9176)" d="M253 187h1v1h-1z" />
              <path fill="rgba(0,0,0,0.6353)" d="M274 187h1v1h-1z" />
              <path fill="rgba(0,0,0,0.2902)" d="M105 188h1v1h-1zM105 189h1v1h-1zM278 236h1v1h-1zM152 265h1v1h-1zM160 285h1v1h-1z" />
              <path fill="rgba(77,169,180,0.5333)" d="M127 188h1v1h-1z" />
              <path fill="rgba(86,195,207,0.9529)" d="M159 188h1v1h-1z" />
              <path fill="rgba(77,177,186,0.7529)" d="M173 188h1v1h-1z" />
              <path fill="rgba(60,141,147,0.6039)" d="M205 188h1v1h-1z" />
              <path fill="rgba(86,196,207,0.9098)" d="M221 188h1v1h-1z" />
              <path fill="rgba(72,167,175,0.6235)" d="M253 188h1v1h-1z" />
              <path fill="rgba(2,0,0,0.6275)" d="M274 188h1v1h-1z" />
              <path fill="rgba(46,110,114,0.6471)" d="M159 189h1v1h-1z" />
              <path fill="rgba(86,197,207,0.9333)" d="M205 189h1v1h-1zM122 200h1v1h-1z" />
              <path fill="rgba(15,36,36,0.4784)" d="M220 189h1v1h-1z" />
              <path fill="rgba(87,196,207,0.9922)" d="M221 189h1v1h-1z" />
              <path fill="rgba(0,0,0,0.6196)" d="M274 189h1v1h-1z" />
              <path fill="rgba(84,196,207,0.9255)" d="M289 189h1v1h-1zM289 190h1v1h-1z" />
              <path fill="rgba(52,117,126,0.4431)" d="M126 190h1v1h-1z" />
              <path fill="rgba(85,197,208,0.9608)" d="M158 190h1v1h-1zM105 202h1v1h-1zM273 243h1v1h-1z" />
              <path fill="rgba(12,29,33,0.4824)" d="M206 190h1v1h-1z" />
              <path fill="rgba(82,189,199,0.6941)" d="M252 190h1v1h-1z" />
              <path fill="rgba(0,0,0,0.6157)" d="M274 190h1v1h-1z" />
              <path fill="rgba(86,196,207,0.8510)" d="M126 191h1v1h-1zM235 261h1v1h-1z" />
              <path fill="rgba(66,149,158,0.6784)" d="M158 191h1v1h-1z" />
              <path fill="rgba(0,0,0,0.3765)" d="M174 191h1v1h-1zM187 220h1v1h-1zM265 227h1v1h-1zM191 229h1v1h-1z" />
              <path fill="rgba(88,195,209,0.8863)" d="M206 191h1v1h-1z" />
              <path fill="rgba(2,0,0,0.6235)" d="M274 191h1v1h-1z" />
              <path fill="rgba(8,22,22,0.3686)" d="M125 192h1v1h-1z" />
              <path fill="rgba(0,0,0,0.2431)" d="M158 192h1v1h-1zM177 198h1v1h-1zM274 243h1v1h-1zM133 252h1v1h-1zM145 261h1v1h-1zM159 268h1v1h-1z" />
              <path fill="rgba(85,197,206,0.9882)" d="M206 192h1v1h-1z" />
              <path fill="rgba(86,197,206,0.8745)" d="M219 192h1v1h-1z" />
              <path fill="rgba(86,197,207,0.7569)" d="M251 192h1v1h-1z" />
              <path fill="rgba(3,9,8,0.6353)" d="M274 192h1v1h-1z" />
              <path fill="rgba(85,195,207,0.9804)" d="M104 193h1v1h-1z" />
              <path fill="rgba(85,196,207,0.8118)" d="M125 193h1v1h-1zM265 228h1v1h-1zM195 274h1v1h-1z" />
              <path fill="rgba(87,195,206,0.7216)" d="M157 193h1v1h-1z" />
              <path fill="rgba(2,4,9,0.4588)" d="M175 193h1v1h-1z" />
              <path fill="rgba(87,195,207,0.8157)" d="M207 193h1v1h-1z" />
              <path fill="rgba(0,0,2,0.4000)" d="M218 193h1v1h-1z" />
              <path fill="rgba(0,0,3,0.3020)" d="M251 193h1v1h-1z" />
              <path fill="rgba(6,15,15,0.6471)" d="M274 193h1v1h-1z" />
              <path fill="rgba(86,195,207,0.9412)" d="M90 194h1v1h-1z" />
              <path fill="rgba(0,3,3,0.2980)" d="M124 194h1v1h-1z" />
              <path fill="rgba(87,195,208,0.9765)" d="M156 194h1v1h-1z" />
              <path fill="rgba(86,196,207,0.9255)" d="M176 194h1v1h-1z" />
              <path fill="rgba(87,195,207,0.8392)" d="M218 194h1v1h-1z" />
              <path fill="rgba(14,31,32,0.6510)" d="M274 194h1v1h-1z" />
              <path fill="rgba(84,196,206,0.8431)" d="M289 194h1v1h-1zM182 274h1v1h-1z" />
              <path fill="rgba(87,196,208,0.9059)" d="M90 195h1v1h-1z" />
              <path fill="rgba(86,197,208,0.9843)" d="M104 195h1v1h-1z" />
              <path fill="rgba(85,197,207,0.7765)" d="M156 195h1v1h-1zM237 222h1v1h-1z" />
              <path fill="rgba(18,42,44,0.5686)" d="M176 195h1v1h-1z" />
              <path fill="rgba(86,197,206,0.7098)" d="M208 195h1v1h-1z" />
              <path fill="rgba(49,113,119,0.6745)" d="M274 195h1v1h-1z" />
              <path fill="rgba(85,196,207,0.7490)" d="M289 195h1v1h-1zM105 199h1v1h-1z" />
              <path fill="rgba(16,37,42,0.4275)" d="M105 196h1v1h-1z" />
              <path fill="rgba(0,0,0,0.2627)" d="M123 196h1v1h-1zM116 211h1v1h-1zM283 225h1v1h-1zM103 239h1v1h-1zM198 289h1v1h-1z" />
              <path fill="rgba(86,194,207,0.9843)" d="M155 196h1v1h-1z" />
              <path fill="rgba(0,0,0,0.3529)" d="M156 196h1v1h-1z" />
              <path fill="rgba(88,195,208,0.9569)" d="M177 196h1v1h-1z" />
              <path fill="rgba(85,196,205,0.7647)" d="M217 196h1v1h-1z" />
              <path fill="rgba(86,196,209,0.8706)" d="M249 196h1v1h-1z" />
              <path fill="rgba(85,196,208,0.6824)" d="M289 196h1v1h-1z" />
              <path fill="rgba(86,196,208,0.7176)" d="M90 197h1v1h-1z" />
              <path fill="rgba(46,112,117,0.5451)" d="M105 197h1v1h-1z" />
              <path fill="rgba(85,195,207,0.7333)" d="M123 197h1v1h-1z" />
              <path fill="rgba(87,195,207,0.8314)" d="M155 197h1v1h-1z" />
              <path fill="rgba(75,172,181,0.6902)" d="M177 197h1v1h-1z" />
              <path fill="rgba(69,157,167,0.6118)" d="M209 197h1v1h-1z" />
              <path fill="rgba(2,5,7,0.4235)" d="M249 197h1v1h-1z" />
              <path fill="rgba(86,196,208,0.8588)" d="M274 197h1v1h-1z" />
              <path fill="rgba(86,197,208,0.6431)" d="M289 197h1v1h-1z" />
              <path fill="rgba(86,198,209,0.6667)" d="M90 198h1v1h-1z" />
              <path fill="rgba(86,195,208,0.6863)" d="M105 198h1v1h-1z" />
              <path fill="rgba(86,196,208,0.9569)" d="M123 198h1v1h-1zM123 263h1v1h-1zM201 288h1v1h-1z" />
              <path fill="rgba(87,195,208,0.9882)" d="M154 198h1v1h-1z" />
              <path fill="rgba(2,0,0,0.4353)" d="M155 198h1v1h-1z" />
              <path fill="rgba(86,197,208,0.9804)" d="M178 198h1v1h-1zM147 213h1v1h-1zM112 222h1v1h-1zM139 230h1v1h-1z" />
              <path fill="rgba(85,197,208,0.9294)" d="M209 198h1v1h-1z" />
              <path fill="rgba(85,194,205,0.6863)" d="M216 198h1v1h-1z" />
              <path fill="rgba(73,167,177,0.6039)" d="M289 198h1v1h-1z" />
              <path fill="rgba(87,195,206,0.6353)" d="M90 199h1v1h-1z" />
              <path fill="rgba(86,196,208,0.6824)" d="M122 199h1v1h-1z" />
              <path fill="rgba(87,196,209,0.8824)" d="M154 199h1v1h-1z" />
              <path fill="rgba(86,197,208,0.7882)" d="M178 199h1v1h-1z" />
              <path fill="rgba(28,65,69,0.5059)" d="M210 199h1v1h-1z" />
              <path fill="rgba(15,30,35,0.4627)" d="M248 199h1v1h-1z" />
              <path fill="rgba(86,197,208,0.9098)" d="M274 199h1v1h-1z" />
              <path fill="rgba(32,74,76,0.5294)" d="M289 199h1v1h-1z" />
              <path fill="rgba(61,136,143,0.5725)" d="M90 200h1v1h-1z" />
              <path fill="rgba(2,0,0,0.5137)" d="M154 200h1v1h-1z" />
              <path fill="rgba(69,157,168,0.6235)" d="M215 200h1v1h-1z" />
              <path fill="rgba(86,195,206,0.9216)" d="M247 200h1v1h-1z" />
              <path fill="rgba(12,23,27,0.2588)" d="M90 201h1v1h-1z" />
              <path fill="rgba(84,194,204,0.5725)" d="M121 201h1v1h-1z" />
              <path fill="rgba(85,196,207,0.8667)" d="M179 201h1v1h-1z" />
              <path fill="rgba(0,0,3,0.3961)" d="M211 201h1v1h-1z" />
              <path fill="rgba(84,195,207,0.9569)" d="M215 201h1v1h-1z" />
              <path fill="rgba(56,127,135,0.5686)" d="M247 201h1v1h-1z" />
              <path fill="rgba(86,196,207,0.8980)" d="M121 202h1v1h-1z" />
              <path fill="rgba(2,7,9,0.5647)" d="M153 202h1v1h-1z" />
              <path fill="rgba(0,0,2,0.4471)" d="M179 202h1v1h-1z" />
              <path fill="rgba(87,195,205,0.8196)" d="M211 202h1v1h-1z" />
              <path fill="rgba(57,122,133,0.5804)" d="M214 202h1v1h-1z" />
              <path fill="rgba(86,196,208,0.9451)" d="M246 202h1v1h-1zM257 262h1v1h-1z" />
              <path fill="rgba(0,0,0,0.4471)" d="M273 202h1v1h-1z" />
              <path fill="rgba(74,171,181,0.4863)" d="M120 203h1v1h-1z" />
              <path fill="rgba(86,197,206,0.9333)" d="M152 203h1v1h-1z" />
              <path fill="rgba(87,195,209,0.9176)" d="M180 203h1v1h-1z" />
              <path fill="rgba(75,168,179,0.6431)" d="M246 203h1v1h-1z" />
              <path fill="rgba(24,52,54,0.5529)" d="M273 203h1v1h-1z" />
              <path fill="rgba(85,196,208,0.8863)" d="M91 204h1v1h-1z" />
              <path fill="rgba(86,197,208,0.8471)" d="M105 204h1v1h-1z" />
              <path fill="rgba(84,197,206,0.8549)" d="M120 204h1v1h-1z" />
              <path fill="rgba(29,66,70,0.5882)" d="M152 204h1v1h-1z" />
              <path fill="rgba(15,35,37,0.5373)" d="M180 204h1v1h-1z" />
              <path fill="rgba(86,197,207,0.9961)" d="M181 204h1v1h-1z" />
              <path fill="rgba(84,195,206,0.6510)" d="M212 204h1v1h-1zM214 286h1v1h-1z" />
              <path fill="rgba(12,27,31,0.4863)" d="M213 204h1v1h-1z" />
              <path fill="rgba(86,196,206,0.7804)" d="M288 204h1v1h-1z" />
              <path fill="rgba(85,196,206,0.9882)" d="M104 205h1v1h-1z" />
              <path fill="rgba(0,0,2,0.5137)" d="M105 205h1v1h-1z" />
              <path fill="rgba(40,92,97,0.4235)" d="M119 205h1v1h-1z" />
              <path fill="rgba(87,195,206,0.9451)" d="M181 205h1v1h-1z" />
              <path fill="rgba(87,196,208,0.7255)" d="M245 205h1v1h-1z" />
              <path fill="rgba(85,196,207,0.8510)" d="M273 205h1v1h-1zM264 230h1v1h-1z" />
              <path fill="rgba(85,195,208,0.6824)" d="M288 205h1v1h-1z" />
              <path fill="rgba(86,197,207,0.6706)" d="M91 206h1v1h-1z" />
              <path fill="rgba(86,197,206,0.8941)" d="M104 206h1v1h-1z" />
              <path fill="rgba(87,197,209,0.8235)" d="M119 206h1v1h-1z" />
              <path fill="rgba(54,121,128,0.6471)" d="M151 206h1v1h-1z" />
              <path fill="rgba(71,152,162,0.6235)" d="M181 206h1v1h-1z" />
              <path fill="rgba(87,196,208,0.9882)" d="M244 206h1v1h-1zM146 215h1v1h-1z" />
              <path fill="rgba(85,196,208,0.9373)" d="M273 206h1v1h-1z" />
              <path fill="rgba(60,139,146,0.5333)" d="M288 206h1v1h-1z" />
              <path fill="rgba(51,112,117,0.3922)" d="M91 207h1v1h-1z" />
              <path fill="rgba(7,11,12,0.5686)" d="M104 207h1v1h-1z" />
              <path fill="rgba(14,28,30,0.3608)" d="M118 207h1v1h-1z" />
              <path fill="rgba(88,196,209,0.9686)" d="M182 207h1v1h-1zM237 260h1v1h-1z" />
              <path fill="rgba(84,196,208,0.8314)" d="M244 207h1v1h-1z" />
              <path fill="rgba(0,0,5,0.2000)" d="M91 208h1v1h-1z" />
              <path fill="rgba(84,196,208,0.9725)" d="M92 208h1v1h-1zM286 212h1v1h-1z" />
              <path fill="rgba(85,196,209,0.7765)" d="M118 208h1v1h-1z" />
              <path fill="rgba(85,194,206,0.7176)" d="M150 208h1v1h-1z" />
              <path fill="rgba(85,191,203,0.7176)" d="M182 208h1v1h-1z" />
              <path fill="rgba(87,195,207,0.9922)" d="M243 208h1v1h-1z" />
              <path fill="rgba(18,37,40,0.5451)" d="M272 208h1v1h-1z" />
              <path fill="rgba(17,42,46,0.6353)" d="M103 209h1v1h-1z" />
              <path fill="rgba(0,3,3,0.3098)" d="M117 209h1v1h-1z" />
              <path fill="rgba(87,195,207,0.8549)" d="M243 209h1v1h-1z" />
              <path fill="rgba(85,195,207,0.7529)" d="M272 209h1v1h-1z" />
              <path fill="rgba(87,196,208,0.8510)" d="M287 209h1v1h-1z" />
              <path fill="rgba(85,197,208,0.8275)" d="M92 210h1v1h-1z" />
              <path fill="rgba(85,195,208,0.7373)" d="M117 210h1v1h-1z" />
              <path fill="rgba(84,194,204,0.7647)" d="M149 210h1v1h-1z" />
              <path fill="rgba(0,0,0,0.3490)" d="M243 210h1v1h-1zM195 238h1v1h-1z" />
              <path fill="rgba(86,195,207,0.9020)" d="M272 210h1v1h-1z" />
              <path fill="rgba(85,196,208,0.7294)" d="M92 211h1v1h-1z" />
              <path fill="rgba(62,143,150,0.7137)" d="M102 211h1v1h-1z" />
              <path fill="rgba(0,0,3,0.3490)" d="M149 211h1v1h-1z" />
              <path fill="rgba(0,0,2,0.4078)" d="M183 211h1v1h-1z" />
              <path fill="rgba(86,197,207,0.8745)" d="M242 211h1v1h-1z" />
              <path fill="rgba(64,149,157,0.4706)" d="M287 211h1v1h-1z" />
              <path fill="rgba(30,70,74,0.4314)" d="M92 212h1v1h-1z" />
              <path fill="rgba(86,194,206,0.6745)" d="M116 212h1v1h-1z" />
              <path fill="rgba(87,196,208,0.8078)" d="M148 212h1v1h-1z" />
              <path fill="rgba(5,7,10,0.4078)" d="M242 212h1v1h-1z" />
              <path fill="rgba(18,40,39,0.5961)" d="M271 212h1v1h-1z" />
              <path fill="rgba(86,196,209,0.9765)" d="M93 213h1v1h-1z" />
              <path fill="rgba(79,179,187,0.7373)" d="M101 213h1v1h-1z" />
              <path fill="rgba(10,19,17,0.5176)" d="M184 213h1v1h-1z" />
              <path fill="rgba(85,197,208,0.8039)" d="M271 213h1v1h-1z" />
              <path fill="rgba(86,195,208,0.5686)" d="M115 214h1v1h-1z" />
              <path fill="rgba(84,196,207,0.8471)" d="M147 214h1v1h-1z" />
              <path fill="rgba(37,88,92,0.5098)" d="M241 214h1v1h-1z" />
              <path fill="rgba(86,196,207,0.9569)" d="M271 214h1v1h-1z" />
              <path fill="rgba(86,195,207,0.7686)" d="M286 214h1v1h-1z" />
              <path fill="rgba(85,196,207,0.7843)" d="M93 215h1v1h-1z" />
              <path fill="rgba(87,195,207,0.7725)" d="M100 215h1v1h-1z" />
              <path fill="rgba(0,0,2,0.4824)" d="M147 215h1v1h-1z" />
              <path fill="rgba(43,98,106,0.6235)" d="M185 215h1v1h-1z" />
              <path fill="rgba(84,196,208,0.9373)" d="M240 215h1v1h-1z" />
              <path fill="rgba(0,2,0,0.5255)" d="M270 215h1v1h-1z" />
              <path fill="rgba(81,184,193,0.4667)" d="M286 215h1v1h-1z" />
              <path fill="rgba(12,26,26,0.4980)" d="M93 216h1v1h-1z" />
              <path fill="rgba(0,0,3,0.3176)" d="M100 216h1v1h-1z" />
              <path fill="rgba(82,191,205,0.4980)" d="M114 216h1v1h-1z" />
              <path fill="rgba(85,196,206,0.8745)" d="M146 216h1v1h-1zM256 242h1v1h-1z" />
              <path fill="rgba(64,148,156,0.5961)" d="M240 216h1v1h-1z" />
              <path fill="rgba(87,195,208,0.8275)" d="M99 217h1v1h-1z" />
              <path fill="rgba(2,6,8,0.5020)" d="M146 217h1v1h-1z" />
              <path fill="rgba(85,196,207,0.7059)" d="M186 217h1v1h-1z" />
              <path fill="rgba(85,196,206,0.9529)" d="M270 217h1v1h-1z" />
              <path fill="rgba(0,0,2,0.4275)" d="M99 218h1v1h-1z" />
              <path fill="rgba(66,150,159,0.4667)" d="M113 218h1v1h-1z" />
              <path fill="rgba(86,196,209,0.8863)" d="M145 218h1v1h-1z" />
              <path fill="rgba(0,0,4,0.2784)" d="M186 218h1v1h-1z" />
              <path fill="rgba(85,194,208,0.6745)" d="M239 218h1v1h-1z" />
              <path fill="rgba(2,4,4,0.5412)" d="M269 218h1v1h-1z" />
              <path fill="rgba(84,195,205,0.6784)" d="M285 218h1v1h-1zM106 244h1v1h-1z" />
              <path fill="rgba(76,173,185,0.6667)" d="M94 219h1v1h-1z" />
              <path fill="rgba(86,194,208,0.8745)" d="M98 219h1v1h-1z" />
              <path fill="rgba(5,11,11,0.5490)" d="M145 219h1v1h-1z" />
              <path fill="rgba(0,0,3,0.3529)" d="M285 219h1v1h-1zM269 250h1v1h-1z" />
              <path fill="rgba(2,0,0,0.4941)" d="M98 220h1v1h-1z" />
              <path fill="rgba(33,76,80,0.4235)" d="M112 220h1v1h-1z" />
              <path fill="rgba(87,196,207,0.9176)" d="M144 220h1v1h-1z" />
              <path fill="rgba(86,196,207,0.9647)" d="M269 220h1v1h-1z" />
              <path fill="rgba(86,196,208,0.9373)" d="M284 220h1v1h-1z" />
              <path fill="rgba(86,195,206,0.9059)" d="M97 221h1v1h-1z" />
              <path fill="rgba(38,86,91,0.6392)" d="M144 221h1v1h-1z" />
              <path fill="rgba(48,109,117,0.6431)" d="M268 221h1v1h-1z" />
              <path fill="rgba(86,196,207,0.7569)" d="M284 221h1v1h-1z" />
              <path fill="rgba(72,167,174,0.7059)" d="M95 222h1v1h-1z" />
              <path fill="rgba(3,10,11,0.6196)" d="M97 222h1v1h-1z" />
              <path fill="rgba(11,22,24,0.3686)" d="M111 222h1v1h-1z" />
              <path fill="rgba(8,17,17,0.4000)" d="M284 222h1v1h-1z" />
              <path fill="rgba(0,0,4,0.2706)" d="M95 223h1v1h-1z" />
              <path fill="rgba(65,150,157,0.7059)" d="M143 223h1v1h-1z" />
              <path fill="rgba(84,197,207,0.9020)" d="M189 223h1v1h-1z" />
              <path fill="rgba(86,197,207,0.9843)" d="M236 223h1v1h-1z" />
              <path fill="rgba(0,0,2,0.4784)" d="M267 223h1v1h-1z" />
              <path fill="rgba(39,90,95,0.4118)" d="M96 224h1v1h-1z" />
              <path fill="rgba(0,3,0,0.3255)" d="M110 224h1v1h-1z" />
              <path fill="rgba(35,82,87,0.6000)" d="M189 224h1v1h-1z" />
              <path fill="rgba(86,196,208,0.8353)" d="M267 224h1v1h-1z" />
              <path fill="rgba(85,197,208,0.7059)" d="M283 224h1v1h-1z" />
              <path fill="rgba(87,195,207,0.7333)" d="M110 225h1v1h-1z" />
              <path fill="rgba(80,182,193,0.7373)" d="M142 225h1v1h-1z" />
              <path fill="rgba(0,3,5,0.3765)" d="M236 225h1v1h-1z" />
              <path fill="rgba(78,179,189,0.7020)" d="M190 226h1v1h-1z" />
              <path fill="rgba(87,196,206,0.8627)" d="M235 226h1v1h-1z" />
              <path fill="rgba(85,195,208,0.8039)" d="M266 226h1v1h-1zM183 274h1v1h-1z" />
              <path fill="rgba(85,196,207,0.8706)" d="M282 226h1v1h-1z" />
              <path fill="rgba(87,196,208,0.7686)" d="M141 227h1v1h-1z" />
              <path fill="rgba(3,0,3,0.3020)" d="M190 227h1v1h-1z" />
              <path fill="rgba(19,48,50,0.4627)" d="M235 227h1v1h-1z" />
              <path fill="rgba(59,132,138,0.4784)" d="M282 227h1v1h-1z" />
              <path fill="rgba(88,196,208,0.9333)" d="M109 228h1v1h-1z" />
              <path fill="rgba(85,195,205,0.7804)" d="M191 228h1v1h-1z" />
              <path fill="rgba(87,195,207,0.8980)" d="M234 228h1v1h-1z" />
              <path fill="rgba(85,196,206,0.5765)" d="M108 229h1v1h-1z" />
              <path fill="rgba(83,197,207,0.8078)" d="M140 229h1v1h-1z" />
              <path fill="rgba(85,196,206,0.9804)" d="M192 229h1v1h-1z" />
              <path fill="rgba(51,111,116,0.5333)" d="M234 229h1v1h-1z" />
              <path fill="rgba(0,0,0,0.4196)" d="M264 229h1v1h-1zM252 246h1v1h-1z" />
              <path fill="rgba(88,197,207,0.6510)" d="M281 229h1v1h-1z" />
              <path fill="rgba(0,0,3,0.3725)" d="M140 230h1v1h-1z" />
              <path fill="rgba(86,196,205,0.8275)" d="M192 230h1v1h-1z" />
              <path fill="rgba(83,187,198,0.5569)" d="M107 231h1v1h-1z" />
              <path fill="rgba(87,196,207,0.8510)" d="M139 231h1v1h-1z" />
              <path fill="rgba(2,0,0,0.4471)" d="M192 231h1v1h-1z" />
              <path fill="rgba(82,189,199,0.6078)" d="M233 231h1v1h-1z" />
              <path fill="rgba(4,10,10,0.4863)" d="M263 231h1v1h-1z" />
              <path fill="rgba(85,197,208,0.7451)" d="M280 231h1v1h-1z" />
              <path fill="rgba(86,195,207,0.9137)" d="M107 232h1v1h-1z" />
              <path fill="rgba(0,0,5,0.4431)" d="M139 232h1v1h-1z" />
              <path fill="rgba(85,196,207,0.8784)" d="M193 232h1v1h-1zM157 268h1v1h-1z" />
              <path fill="rgba(86,195,205,0.9059)" d="M263 232h1v1h-1z" />
              <path fill="rgba(58,132,140,0.4863)" d="M106 233h1v1h-1z" />
              <path fill="rgba(86,195,205,0.8863)" d="M138 233h1v1h-1z" />
              <path fill="rgba(20,47,48,0.5569)" d="M193 233h1v1h-1z" />
              <path fill="rgba(87,196,206,0.6784)" d="M232 233h1v1h-1z" />
              <path fill="rgba(62,139,147,0.6314)" d="M262 233h1v1h-1z" />
              <path fill="rgba(87,195,206,0.8157)" d="M279 233h1v1h-1z" />
              <path fill="rgba(2,4,6,0.5098)" d="M138 234h1v1h-1z" />
              <path fill="rgba(85,197,206,0.9608)" d="M262 234h1v1h-1z" />
              <path fill="rgba(29,67,70,0.4157)" d="M105 235h1v1h-1z" />
              <path fill="rgba(85,196,208,0.9216)" d="M137 235h1v1h-1z" />
              <path fill="rgba(66,148,156,0.6549)" d="M194 235h1v1h-1z" />
              <path fill="rgba(86,194,207,0.7098)" d="M231 235h1v1h-1z" />
              <path fill="rgba(85,197,208,0.8078)" d="M278 235h1v1h-1z" />
              <path fill="rgba(85,195,207,0.8392)" d="M105 236h1v1h-1z" />
              <path fill="rgba(25,57,62,0.6118)" d="M137 236h1v1h-1z" />
              <path fill="rgba(21,51,53,0.5294)" d="M260 236h1v1h-1z" />
              <path fill="rgba(3,3,3,0.3725)" d="M104 237h1v1h-1z" />
              <path fill="rgba(86,195,208,0.9529)" d="M136 237h1v1h-1z" />
              <path fill="rgba(85,195,207,0.7490)" d="M195 237h1v1h-1z" />
              <path fill="rgba(85,197,208,0.7608)" d="M230 237h1v1h-1zM270 248h1v1h-1z" />
              <path fill="rgba(86,196,208,0.9608)" d="M260 237h1v1h-1z" />
              <path fill="rgba(86,196,207,0.7451)" d="M277 237h1v1h-1z" />
              <path fill="rgba(43,93,101,0.6745)" d="M136 238h1v1h-1z" />
              <path fill="rgba(85,198,208,0.8549)" d="M259 238h1v1h-1z" />
              <path fill="rgba(86,197,208,0.9647)" d="M276 238h1v1h-1z" />
              <path fill="rgba(85,197,208,0.8314)" d="M196 239h1v1h-1z" />
              <path fill="rgba(85,198,206,0.8353)" d="M229 239h1v1h-1z" />
              <path fill="rgba(61,139,147,0.6549)" d="M258 239h1v1h-1z" />
              <path fill="rgba(85,195,208,0.6353)" d="M276 239h1v1h-1z" />
              <path fill="rgba(79,182,193,0.6941)" d="M135 240h1v1h-1z" />
              <path fill="rgba(0,2,0,0.4549)" d="M196 240h1v1h-1z" />
              <path fill="rgba(9,22,22,0.4627)" d="M229 240h1v1h-1z" />
              <path fill="rgba(87,195,207,0.9216)" d="M275 240h1v1h-1z" />
              <path fill="rgba(82,189,200,0.6549)" d="M104 241h1v1h-1z" />
              <path fill="rgba(86,196,205,0.8863)" d="M197 241h1v1h-1z" />
              <path fill="rgba(85,195,206,0.8863)" d="M228 241h1v1h-1z" />
              <path fill="rgba(29,67,67,0.4510)" d="M275 241h1v1h-1z" />
              <path fill="rgba(85,190,203,0.7529)" d="M134 242h1v1h-1z" />
              <path fill="rgba(2,0,0,0.5804)" d="M197 242h1v1h-1z" />
              <path fill="rgba(24,56,60,0.5373)" d="M228 242h1v1h-1z" />
              <path fill="rgba(0,0,0,0.3686)" d="M105 243h1v1h-1z" />
              <path fill="rgba(85,197,206,0.9373)" d="M198 243h1v1h-1z" />
              <path fill="rgba(88,196,208,0.9137)" d="M227 243h1v1h-1z" />
              <path fill="rgba(81,189,201,0.7255)" d="M255 243h1v1h-1z" />
              <path fill="rgba(61,140,151,0.6706)" d="M198 244h1v1h-1z" />
              <path fill="rgba(70,160,170,0.5882)" d="M227 244h1v1h-1z" />
              <path fill="rgba(27,67,70,0.6000)" d="M254 244h1v1h-1z" />
              <path fill="rgba(72,169,178,0.5843)" d="M273 244h1v1h-1z" />
              <path fill="rgba(86,195,206,0.8863)" d="M107 245h1v1h-1z" />
              <path fill="rgba(2,6,7,0.5451)" d="M253 245h1v1h-1z" />
              <path fill="rgba(9,17,20,0.3490)" d="M107 246h1v1h-1z" />
              <path fill="rgba(84,195,207,0.8784)" d="M132 246h1v1h-1z" />
              <path fill="rgba(86,194,206,0.5922)" d="M108 247h1v1h-1z" />
              <path fill="rgba(0,0,2,0.4431)" d="M132 247h1v1h-1z" />
              <path fill="rgba(57,130,136,0.5059)" d="M271 247h1v1h-1z" />
              <path fill="rgba(2,2,4,0.4863)" d="M131 249h1v1h-1z" />
              <path fill="rgba(0,0,4,0.2275)" d="M249 249h1v1h-1z" />
              <path fill="rgba(84,197,207,0.9412)" d="M250 249h1v1h-1z" />
              <path fill="rgba(32,75,79,0.4667)" d="M110 250h1v1h-1z" />
              <path fill="rgba(0,0,4,0.2549)" d="M248 250h1v1h-1z" />
              <path fill="rgba(85,197,207,0.6235)" d="M111 251h1v1h-1z" />
              <path fill="rgba(86,195,206,0.8627)" d="M131 251h1v1h-1z" />
              <path fill="rgba(86,196,206,0.9608)" d="M248 251h1v1h-1z" />
              <path fill="rgba(60,139,148,0.5333)" d="M268 251h1v1h-1z" />
              <path fill="rgba(85,195,208,0.7843)" d="M112 252h1v1h-1z" />
              <path fill="rgba(85,195,208,0.9725)" d="M247 252h1v1h-1z" />
              <path fill="rgba(86,195,206,0.7216)" d="M267 252h1v1h-1z" />
              <path fill="rgba(88,196,208,0.8431)" d="M113 253h1v1h-1z" />
              <path fill="rgba(5,13,13,0.5569)" d="M245 253h1v1h-1z" />
              <path fill="rgba(85,196,205,0.8000)" d="M266 253h1v1h-1z" />
              <path fill="rgba(86,196,208,0.9725)" d="M134 254h1v1h-1z" />
              <path fill="rgba(2,7,7,0.4314)" d="M135 254h1v1h-1z" />
              <path fill="rgba(61,135,143,0.6275)" d="M244 254h1v1h-1z" />
              <path fill="rgba(84,195,206,0.8824)" d="M265 254h1v1h-1z" />
              <path fill="rgba(5,7,10,0.4039)" d="M114 255h1v1h-1z" />
              <path fill="rgba(74,165,175,0.6118)" d="M136 255h1v1h-1z" />
              <path fill="rgba(85,195,207,0.7725)" d="M243 255h1v1h-1z" />
              <path fill="rgba(85,195,207,0.9333)" d="M264 255h1v1h-1z" />
              <path fill="rgba(38,84,91,0.4510)" d="M115 256h1v1h-1z" />
              <path fill="rgba(85,197,207,0.7922)" d="M137 256h1v1h-1z" />
              <path fill="rgba(87,196,207,0.9451)" d="M263 256h1v1h-1zM145 262h1v1h-1z" />
              <path fill="rgba(0,0,3,0.3804)" d="M264 256h1v1h-1z" />
              <path fill="rgba(67,155,165,0.4902)" d="M116 257h1v1h-1z" />
              <path fill="rgba(86,197,207,0.8980)" d="M138 257h1v1h-1z" />
              <path fill="rgba(0,0,0,0.3451)" d="M139 257h1v1h-1zM234 261h1v1h-1zM220 268h1v1h-1z" />
              <path fill="rgba(2,4,6,0.4980)" d="M240 257h1v1h-1z" />
              <path fill="rgba(15,39,39,0.4078)" d="M263 257h1v1h-1z" />
              <path fill="rgba(81,189,199,0.5569)" d="M117 258h1v1h-1z" />
              <path fill="rgba(86,195,205,0.9647)" d="M139 258h1v1h-1z" />
              <path fill="rgba(40,91,98,0.5686)" d="M140 258h1v1h-1z" />
              <path fill="rgba(84,188,199,0.7176)" d="M239 258h1v1h-1z" />
              <path fill="rgba(37,87,89,0.4275)" d="M262 258h1v1h-1z" />
              <path fill="rgba(84,195,206,0.6157)" d="M118 259h1v1h-1z" />
              <path fill="rgba(88,195,206,0.7804)" d="M141 259h1v1h-1z" />
              <path fill="rgba(0,4,0,0.2235)" d="M142 259h1v1h-1z" />
              <path fill="rgba(3,0,0,0.3373)" d="M237 259h1v1h-1z" />
              <path fill="rgba(51,117,123,0.4549)" d="M261 259h1v1h-1z" />
              <path fill="rgba(86,195,207,0.6196)" d="M119 260h1v1h-1z" />
              <path fill="rgba(18,44,46,0.4549)" d="M143 260h1v1h-1z" />
              <path fill="rgba(65,151,161,0.5961)" d="M236 260h1v1h-1z" />
              <path fill="rgba(52,119,125,0.4784)" d="M260 260h1v1h-1z" />
              <path fill="rgba(83,190,202,0.6000)" d="M120 261h1v1h-1z" />
              <path fill="rgba(85,196,205,0.7569)" d="M144 261h1v1h-1zM127 267h1v1h-1z" />
              <path fill="rgba(44,97,106,0.4549)" d="M259 261h1v1h-1z" />
              <path fill="rgba(80,177,188,0.5529)" d="M121 262h1v1h-1z" />
              <path fill="rgba(67,152,160,0.5804)" d="M146 262h1v1h-1z" />
              <path fill="rgba(38,86,91,0.4196)" d="M258 262h1v1h-1z" />
              <path fill="rgba(61,136,144,0.4784)" d="M122 263h1v1h-1z" />
              <path fill="rgba(11,25,25,0.4431)" d="M148 263h1v1h-1z" />
              <path fill="rgba(37,82,87,0.5608)" d="M231 263h1v1h-1z" />
              <path fill="rgba(85,198,207,0.9412)" d="M256 263h1v1h-1z" />
              <path fill="rgba(10,20,22,0.4039)" d="M257 263h1v1h-1z" />
              <path fill="rgba(12,28,30,0.4275)" d="M123 264h1v1h-1z" />
              <path fill="rgba(0,3,0,0.3373)" d="M150 264h1v1h-1z" />
              <path fill="rgba(2,6,6,0.4627)" d="M229 264h1v1h-1z" />
              <path fill="rgba(87,196,208,0.8784)" d="M230 264h1v1h-1z" />
              <path fill="rgba(0,3,0,0.3725)" d="M256 264h1v1h-1z" />
              <path fill="rgba(88,196,209,0.7412)" d="M151 265h1v1h-1z" />
              <path fill="rgba(0,0,0,0.4078)" d="M227 265h1v1h-1z" />
              <path fill="rgba(84,195,207,0.8314)" d="M228 265h1v1h-1z" />
              <path fill="rgba(86,198,208,0.8588)" d="M254 265h1v1h-1z" />
              <path fill="rgba(86,198,206,0.7333)" d="M153 266h1v1h-1z" />
              <path fill="rgba(11,20,25,0.4392)" d="M225 266h1v1h-1z" />
              <path fill="rgba(87,196,207,0.8196)" d="M226 266h1v1h-1z" />
              <path fill="rgba(85,197,206,0.7804)" d="M253 266h1v1h-1z" />
              <path fill="rgba(84,196,207,0.9725)" d="M154 267h1v1h-1z" />
              <path fill="rgba(85,195,207,0.8000)" d="M155 267h1v1h-1z" />
              <path fill="rgba(25,59,64,0.4392)" d="M156 267h1v1h-1z" />
              <path fill="rgba(52,116,121,0.5608)" d="M223 267h1v1h-1z" />
              <path fill="rgba(85,196,206,0.8784)" d="M224 267h1v1h-1zM181 274h1v1h-1z" />
              <path fill="rgba(86,194,205,0.6745)" d="M252 267h1v1h-1z" />
              <path fill="rgba(77,176,185,0.5686)" d="M128 268h1v1h-1z" />
              <path fill="rgba(86,196,207,0.6078)" d="M158 268h1v1h-1z" />
              <path fill="rgba(85,197,208,0.7020)" d="M221 268h1v1h-1z" />
              <path fill="rgba(84,198,207,0.9333)" d="M222 268h1v1h-1z" />
              <path fill="rgba(36,84,89,0.4745)" d="M251 268h1v1h-1z" />
              <path fill="rgba(0,3,3,0.3725)" d="M129 269h1v1h-1z" />
              <path fill="rgba(87,194,206,0.8039)" d="M160 269h1v1h-1z" />
              <path fill="rgba(27,63,67,0.5098)" d="M161 269h1v1h-1z" />
              <path fill="rgba(71,158,169,0.6078)" d="M218 269h1v1h-1z" />
              <path fill="rgba(86,194,206,0.9804)" d="M220 269h1v1h-1z" />
              <path fill="rgba(88,196,208,0.7686)" d="M131 270h1v1h-1z" />
              <path fill="rgba(84,195,207,0.9373)" d="M162 270h1v1h-1z" />
              <path fill="rgba(85,196,207,0.7647)" d="M163 270h1v1h-1z" />
              <path fill="rgba(36,81,87,0.4706)" d="M164 270h1v1h-1z" />
              <path fill="rgba(66,153,161,0.5765)" d="M215 270h1v1h-1z" />
              <path fill="rgba(86,195,209,0.8392)" d="M216 270h1v1h-1z" />
              <path fill="rgba(84,195,206,0.9725)" d="M217 270h1v1h-1z" />
              <path fill="rgba(84,197,204,0.6902)" d="M248 270h1v1h-1z" />
              <path fill="rgba(67,154,163,0.5333)" d="M132 271h1v1h-1z" />
              <path fill="rgba(85,198,209,0.7843)" d="M166 271h1v1h-1z" />
              <path fill="rgba(79,179,190,0.5412)" d="M167 271h1v1h-1z" />
              <path fill="rgba(88,197,208,0.6353)" d="M212 271h1v1h-1z" />
              <path fill="rgba(85,196,208,0.8667)" d="M213 271h1v1h-1z" />
              <path fill="rgba(22,54,56,0.4471)" d="M247 271h1v1h-1z" />
              <path fill="rgba(85,196,207,0.8471)" d="M134 272h1v1h-1zM174 273h1v1h-1z" />
              <path fill="rgba(85,194,207,0.7255)" d="M170 272h1v1h-1z" />
              <path fill="rgba(84,190,201,0.5569)" d="M171 272h1v1h-1z" />
              <path fill="rgba(3,7,7,0.3020)" d="M172 272h1v1h-1z" />
              <path fill="rgba(18,36,36,0.3843)" d="M207 272h1v1h-1z" />
              <path fill="rgba(84,196,207,0.6078)" d="M208 272h1v1h-1z" />
              <path fill="rgba(85,197,207,0.7882)" d="M209 272h1v1h-1z" />
              <path fill="rgba(78,175,184,0.5647)" d="M135 273h1v1h-1z" />
              <path fill="rgba(85,197,208,0.7373)" d="M175 273h1v1h-1z" />
              <path fill="rgba(84,196,207,0.6275)" d="M176 273h1v1h-1z" />
              <path fill="rgba(44,98,103,0.4078)" d="M177 273h1v1h-1z" />
              <path fill="rgba(3,6,6,0.3098)" d="M201 273h1v1h-1z" />
              <path fill="rgba(53,119,128,0.4863)" d="M202 273h1v1h-1z" />
              <path fill="rgba(86,195,206,0.6510)" d="M203 273h1v1h-1z" />
              <path fill="rgba(85,196,207,0.7569)" d="M204 273h1v1h-1z" />
              <path fill="rgba(40,88,92,0.4980)" d="M244 273h1v1h-1z" />
              <path fill="rgba(86,197,206,0.7882)" d="M137 274h1v1h-1z" />
              <path fill="rgba(86,195,206,0.5961)" d="M189 274h1v1h-1z" />
              <path fill="rgba(86,195,207,0.5843)" d="M190 274h1v1h-1z" />
              <path fill="rgba(86,197,206,0.6157)" d="M191 274h1v1h-1z" />
              <path fill="rgba(86,197,209,0.6745)" d="M192 274h1v1h-1z" />
              <path fill="rgba(88,196,206,0.7412)" d="M193 274h1v1h-1z" />
              <path fill="rgba(20,47,50,0.4431)" d="M138 275h1v1h-1z" />
              <path fill="rgba(86,197,207,0.9137)" d="M139 275h1v1h-1z" />
              <path fill="rgba(84,197,209,0.8824)" d="M240 275h1v1h-1z" />
              <path fill="rgba(3,6,6,0.3529)" d="M241 275h1v1h-1z" />
              <path fill="rgba(86,194,207,0.6078)" d="M140 276h1v1h-1z" />
              <path fill="rgba(85,197,208,0.9686)" d="M141 276h1v1h-1z" />
              <path fill="rgba(60,137,147,0.4980)" d="M239 276h1v1h-1z" />
              <path fill="rgba(86,195,207,0.7529)" d="M142 277h1v1h-1z" />
              <path fill="rgba(85,194,206,0.6745)" d="M237 277h1v1h-1z" />
              <path fill="rgba(85,197,206,0.7882)" d="M144 278h1v1h-1z" />
              <path fill="rgba(86,197,207,0.9765)" d="M234 278h1v1h-1z" />
              <path fill="rgba(85,196,207,0.7294)" d="M235 278h1v1h-1z" />
              <path fill="rgba(0,0,3,0.2902)" d="M145 279h1v1h-1z" />
              <path fill="rgba(85,195,206,0.7725)" d="M146 279h1v1h-1z" />
              <path fill="rgba(85,198,209,0.7137)" d="M233 279h1v1h-1z" />
              <path fill="rgba(87,194,206,0.6588)" d="M231 280h1v1h-1z" />
              <path fill="rgba(86,197,208,0.6196)" d="M150 281h1v1h-1z" />
              <path fill="rgba(58,138,148,0.5137)" d="M229 281h1v1h-1z" />
              <path fill="rgba(23,51,55,0.4353)" d="M152 282h1v1h-1z" />
              <path fill="rgba(84,196,207,0.9961)" d="M224 282h1v1h-1z" />
              <path fill="rgba(85,195,208,0.7882)" d="M226 282h1v1h-1z" />
              <path fill="rgba(76,176,185,0.6431)" d="M155 283h1v1h-1z" />
              <path fill="rgba(85,196,208,0.9176)" d="M156 283h1v1h-1z" />
              <path fill="rgba(86,197,207,0.9804)" d="M222 283h1v1h-1z" />
              <path fill="rgba(62,142,149,0.5647)" d="M224 283h1v1h-1z" />
              <path fill="rgba(0,0,3,0.3216)" d="M157 284h1v1h-1z" />
              <path fill="rgba(85,194,204,0.7020)" d="M158 284h1v1h-1z" />
              <path fill="rgba(85,196,208,0.9804)" d="M219 284h1v1h-1z" />
              <path fill="rgba(77,178,189,0.6471)" d="M221 284h1v1h-1z" />
              <path fill="rgba(82,195,206,0.6314)" d="M161 285h1v1h-1z" />
              <path fill="rgba(88,197,208,0.8902)" d="M162 285h1v1h-1z" />
              <path fill="rgba(84,195,208,0.9647)" d="M216 285h1v1h-1z" />
              <path fill="rgba(88,196,207,0.8588)" d="M217 285h1v1h-1z" />
              <path fill="rgba(61,141,151,0.5765)" d="M218 285h1v1h-1z" />
              <path fill="rgba(12,23,26,0.4275)" d="M164 286h1v1h-1z" />
              <path fill="rgba(85,198,208,0.7176)" d="M165 286h1v1h-1z" />
              <path fill="rgba(85,195,209,0.8902)" d="M166 286h1v1h-1z" />
              <path fill="rgba(86,197,209,0.8627)" d="M213 286h1v1h-1z" />
              <path fill="rgba(3,8,8,0.3725)" d="M215 286h1v1h-1z" />
              <path fill="rgba(3,6,6,0.3216)" d="M168 287h1v1h-1z" />
              <path fill="rgba(79,182,193,0.6431)" d="M169 287h1v1h-1z" />
              <path fill="rgba(85,197,207,0.7961)" d="M170 287h1v1h-1z" />
              <path fill="rgba(67,152,159,0.5647)" d="M210 287h1v1h-1z" />
              <path fill="rgba(46,104,111,0.5843)" d="M174 288h1v1h-1z" />
              <path fill="rgba(86,197,206,0.7216)" d="M175 288h1v1h-1z" />
              <path fill="rgba(85,197,206,0.8039)" d="M176 288h1v1h-1z" />
              <path fill="rgba(84,193,205,0.7373)" d="M204 288h1v1h-1z" />
              <path fill="rgba(36,79,84,0.5216)" d="M205 288h1v1h-1z" />
              <path fill="rgba(2,2,2,0.5725)" d="M182 289h1v1h-1z" />
              <path fill="rgba(34,80,84,0.6510)" d="M183 289h1v1h-1z" />
              <path fill="rgba(68,157,166,0.6745)" d="M184 289h1v1h-1z" />
              <path fill="rgba(75,174,183,0.6784)" d="M185 289h1v1h-1z" />
              <path fill="rgba(81,186,195,0.6824)" d="M186 289h1v1h-1z" />
              <path fill="rgba(85,195,207,0.6863)" d="M187 289h1v1h-1zM192 289h1v1h-1z" />
              <path fill="rgba(85,194,207,0.6941)" d="M191 289h1v1h-1z" />
              <path fill="rgba(81,187,198,0.6784)" d="M193 289h1v1h-1z" />
              <path fill="rgba(73,168,175,0.6745)" d="M194 289h1v1h-1z" />
              <path fill="rgba(66,143,149,0.6706)" d="M195 289h1v1h-1z" />
              <path fill="rgba(26,58,62,0.6431)" d="M196 289h1v1h-1z" />
              <path fill="rgba(0,0,0,0.5059)" d="M197 289h1v1h-1z" />
            </svg>
          </div>


          {/* Logo Text */}
          <span className="relative text-cyan-300 text-sm font-semibold transition-colors duration-300 group-hover:text-cyan-200">
            Made by Star AI Lab
          </span>
        </a>
      </section>
    </>
  );
};

export default Hero;