import { Star, Zap, Rocket, Cpu, Radio } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { SectionShell, SectionHeader, Reveal, SpotlightCard } from './SectionKit.tsx';

const POSTER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 675'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23000000'/%3E%3Cstop offset='50%25' style='stop-color:%231e3a8a'/%3E%3Cstop offset='100%25' style='stop-color:%230066ff'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23bg)'/%3E%3Ctext x='50%25' y='45%25' font-family='Inter, sans-serif' font-size='48' font-weight='bold' fill='white' text-anchor='middle'%3EStar AI Lab%3C/text%3E%3Ctext x='50%25' y='65%25' font-family='Inter, sans-serif' font-size='24' fill='%2393c5fd' text-anchor='middle'%3EMain Demo%3C/text%3E%3C/svg%3E";

const highlights = [
  { icon: Rocket, title: 'Real-World Applications', text: 'See how the platform works on practical, everyday problems.' },
  { icon: Cpu, title: 'Next-Gen AI Models', text: 'A look at the latest models running behind the scenes.' },
  { icon: Radio, title: 'Live Demonstrations', text: 'Watch features in action, start to finish.' },
];

const WatchDemo = () => {
  const { getContent } = useContent();

  const mainVideo = getContent('videos', 'mainVideo', {
    src: '/src/img/LOGO amimation.mp4',
    title: 'Complete AI Platform Overview',
    description: 'A comprehensive look at our AI platform and its capabilities',
  });

  return (
    <SectionShell id="demo" tone="cyan">
      <SectionHeader
        icon={<Star className="h-4 w-4" />}
        badge={getContent('demo', 'badge', 'Premium Demo Experience')}
        title={`${getContent('demo', 'title', 'Watch Our')} `}
        highlight={getContent('demo', 'titleHighlight', 'AI/APP Innovation')}
        subtitle={getContent('demo', 'subtitle', 'Experience the cutting-edge capabilities of Star AI Lab through our exclusive demonstration')}
      />

      {/* Video – cinema frame */}
      <Reveal className="relative mx-auto mb-20 max-w-4xl">
        <div className="pointer-events-none absolute -inset-6 rounded-[2.5rem] bg-gradient-to-r from-blue-600/20 via-cyan-400/15 to-violet-600/20 blur-3xl" />
        <div className="kit-glow-border rounded-3xl">
          <div className="rounded-3xl bg-slate-950/95 p-3 sm:p-5">
            <div className="mb-3 flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500" />
                <span className="h-3 w-3 rounded-full bg-yellow-500" />
                <span className="h-3 w-3 rounded-full bg-green-500" />
                <span className="kit-mono ml-3 text-xs text-blue-300/70">star-ai-lab / demo.mp4</span>
              </div>
              <span className="flex items-center gap-2 text-xs font-medium text-cyan-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
                Demo
              </span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-blue-300/15 bg-black">
              <video className="aspect-video w-full object-cover" controls playsInline preload="metadata" poster={mainVideo?.poster || POSTER}>
                <source src={mainVideo?.src || '/src/img/LOGO amimation.mp4'} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            <div className="px-2 pb-1 pt-5 text-center">
              <h3 className="kit-display mb-1 text-xl font-bold text-white sm:text-2xl">{mainVideo?.title || 'Complete AI Platform Overview'}</h3>
              <p className="text-sm text-blue-200/75">{mainVideo?.description || 'A comprehensive look at our AI platform and its capabilities'}</p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Highlights */}
      <Reveal className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <h3 className="kit-display text-3xl font-bold leading-snug text-white md:text-4xl">
            Experience the Future of <span className="kit-gradient-text kit-gradient-inline">AI Innovation</span>
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-blue-200/75 md:text-lg">
            This exclusive demonstration showcases our latest breakthroughs in artificial intelligence, from real-world applications to next-generation capabilities.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {highlights.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 110}>
              <SpotlightCard className="group h-full p-7">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-cyan-300 transition-all duration-500 group-hover:border-cyan-300/50 group-hover:shadow-[0_0_24px_rgba(34,211,238,0.3)]">
                  <Icon className="h-6 w-6" />
                </div>
                <h4 className="kit-display mb-2 text-lg font-bold text-white">{title}</h4>
                <p className="text-sm leading-relaxed text-blue-100/60">{text}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>

        <p className="mt-10 flex items-center justify-center gap-2 text-center text-sm text-blue-300/60">
          <Zap className="h-4 w-4 text-cyan-400/70" />
          Powered by Star AI Lab
        </p>
      </Reveal>
    </SectionShell>
  );
};

export default WatchDemo;