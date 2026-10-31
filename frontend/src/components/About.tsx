import { Target, Lightbulb, Users, Award, Rocket, Shield, Sparkles } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { SectionShell, SectionHeader, Reveal, SpotlightCard, CountUp } from './SectionKit.tsx';

const values = [
  {
    icon: Lightbulb,
    title: 'Innovation First',
    description: "We push the boundaries of what's possible with AI and emerging technologies.",
  },
  {
    icon: Users,
    title: 'Collaborative Approach',
    description: 'Our diverse team brings together expertise from various domains to create comprehensive solutions.',
  },
  {
    icon: Award,
    title: 'Excellence Driven',
    description: 'We maintain the highest standards in every project, ensuring quality and reliability.',
  },
  {
    icon: Shield,
    title: 'Ethical AI',
    description: 'We develop AI solutions with responsibility, transparency, and ethical considerations at their core.',
  },
];

const defaultStats = [
  { number: '1+', label: 'Years Experience' },
  { number: '1+', label: 'AI Models Trained' },
  { number: '0+', label: 'Industry Partners' },
  { number: '2+', label: 'Data Points Processed' },
];

const About = () => {
  const { getContent } = useContent();
  const stats = getContent('about', 'stats', defaultStats);

  return (
    <SectionShell id="about" tone="blue">
      <SectionHeader
        icon={<Target className="h-4 w-4" />}
        badge={getContent('about', 'title', 'About Star AI Labs')}
        title="Pioneering the Future of "
        highlight="Artificial Intelligence"
        subtitle={getContent(
          'about',
          'subtitle',
          'Founded with a vision to democratize AI technology, Star AI Labs is at the forefront of developing intelligent solutions that transform industries and improve lives.'
        )}
      />

      {/* ---------- Mission & Vision ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-20">
        {[
          {
            icon: Rocket,
            title: 'Our Mission',
            label: 'MISSION',
            accent: 'cyan',
            text: 'A full-stack platform designed to provide users with a complete collection of AI-powered shortcut solutions. The platform offers an intuitive interface and well-structured sections, allowing anyone to access AI features easily and efficiently — without requiring technical expertise.',
          },
          {
            icon: Target,
            title: 'Our Vision',
            label: 'VISION',
            accent: 'violet',
            text: 'To be the leading catalyst in the AI revolution — creating a world where intelligent technology enhances human potential and drives sustainable progress. We envision a future where AI seamlessly integrates into daily life, making it more efficient, creative, and meaningful.',
          },
        ].map(({ icon: Icon, title, label, accent, text }, i) => {
          const accentColors = {
            cyan: {
              text: 'text-cyan-400',
              border: 'border-cyan-400/20',
              bg: 'bg-cyan-500/10',
              glow: 'group-hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]',
              line: 'bg-gradient-to-r from-cyan-400 to-transparent',
            },
            violet: {
              text: 'text-violet-400',
              border: 'border-violet-400/20',
              bg: 'bg-violet-500/10',
              glow: 'group-hover:shadow-[0_0_30px_rgba(167,139,250,0.15)]',
              line: 'bg-gradient-to-r from-violet-400 to-transparent',
            },
          }[accent]!;

          return (
            <Reveal key={title} delay={i * 120}>
              <SpotlightCard className={`group h-full overflow-hidden p-7 md:p-8 transition-all duration-500 ${accentColors.glow}`}>
                <div className="relative z-10">
                  {/* Label with line */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border ${accentColors.border} ${accentColors.bg} ${accentColors.text}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-semibold tracking-[0.2em] ${accentColors.text}`}>{label}</span>
                      <span className={`h-px w-8 ${accentColors.line}`} />
                    </div>
                  </div>

                  <h3 className="kit-display mb-3 text-2xl md:text-[1.75rem] font-bold text-white tracking-tight">{title}</h3>
                  <p className="text-[0.95rem] leading-relaxed text-blue-100/70 transition-colors duration-300 group-hover:text-blue-100/90">
                    {text}
                  </p>
                </div>
              </SpotlightCard>
            </Reveal>
          );
        })}
      </div>

      {/* ---------- Core Values ---------- */}
      <Reveal className="mb-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-slate-900/60 border border-cyan-500/20 text-cyan-300 text-xs font-mono tracking-wider">
            <Sparkles className="h-3 w-3" />
            <span>CORE VALUES</span>
          </div>
          <h3 className="kit-display text-3xl font-bold text-white md:text-4xl tracking-tight">
            What We Stand For
          </h3>
        </div>

        <div className="overflow-hidden rounded-2xl border border-blue-400/10 shadow-xl shadow-black/30">
          <div className="grid grid-cols-1 gap-px bg-blue-400/10 md:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, description }, idx) => (
              <div
                key={title}
                className="group relative bg-[#050b1c]/95 p-6 transition-all duration-500 hover:bg-[#081330]"
              >
                {/* Number badge */}
                <div className="absolute top-5 right-5 text-[10px] font-mono text-slate-600 group-hover:text-cyan-400/60 transition-colors">
                  0{idx + 1}
                </div>

                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-cyan-300 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:border-cyan-300/50 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.25)]">
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="kit-display mb-2 text-lg font-semibold text-white tracking-tight">{title}</h4>
                <p className="text-sm leading-relaxed text-blue-100/60 transition-colors duration-300 group-hover:text-blue-100/85">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ---------- Stats Band ---------- */}
      <Reveal className="mb-20">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0a1226]/90 to-[#02040a]/95 px-6 py-12 backdrop-blur-2xl md:px-10">
          <div className="pointer-events-none absolute -left-32 -top-32 h-64 w-64 rounded-full bg-blue-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl" />

          <div className="relative text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-slate-900/60 border border-cyan-500/20 text-cyan-300 text-xs font-mono tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>METRICS</span>
            </div>
            <h3 className="kit-display text-3xl font-bold text-white md:text-4xl tracking-tight">
              Impact by Numbers
            </h3>
          </div>

          <div className="relative grid grid-cols-2 gap-y-8 lg:grid-cols-4 lg:divide-x lg:divide-white/10">
            {stats.map((stat: { number: string; label: string }, i: number) => (
              <div key={i} className="group text-center px-4">
                <CountUp
                  value={stat.number}
                  className="kit-display kit-gradient-text text-4xl md:text-5xl font-bold tracking-tight"
                />
                <div className="mt-2 text-sm font-medium text-blue-200/80 transition-colors duration-300 group-hover:text-cyan-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ---------- Team ---------- */}
      <Reveal>
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-950/40 backdrop-blur-xl p-8 md:p-12 text-center">
          {/* Decorative accent lines */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-32 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-32 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

          <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded-full bg-slate-900/60 border border-cyan-500/20 text-cyan-300 text-xs font-mono tracking-wider">
            <Users className="h-3 w-3" />
            <span>THE TEAM</span>
          </div>

          <h3 className="kit-display mb-4 text-3xl font-bold text-white md:text-4xl tracking-tight">
            Expert Minds, United Purpose
          </h3>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-blue-200/75">
            Our multidisciplinary team combines decades of experience in artificial intelligence, machine learning, and software engineering. We're passionate about pushing the boundaries of what's possible and delivering solutions that make a real difference.
          </p>
        </div>
      </Reveal>
    </SectionShell>
  );
};

export default About;