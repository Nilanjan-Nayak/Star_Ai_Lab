import { Target, Lightbulb, Users, Award, Rocket, Shield, Sparkles, Trophy, Cpu, Presentation, CheckCircle2 } from 'lucide-react';
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
  { number: '8+', label: 'Competitions & Hackathons' },
  { number: '6+', label: 'Project Exhibitions' },
  { number: '12+', label: 'AI Models & Architectures' },
  { number: '25K+', label: 'Data Points & Inferences' },
];

const exhibitions = [
  {
    event: 'National Agro-Tech Innovation Expo',
    project: 'AgriVision AI',
    badge: 'Smart Agriculture & Deep Vision',
    year: '2024 - 2025',
    track: 'Computer Vision & Multilingual RAG',
    accent: 'emerald',
    description: 'Showcased our multilingual agricultural intelligence system capable of 97.8% diagnostic accuracy across 15,000+ crop samples, integrated with satellite GIS telemetry and instant advisory in Bengali, Hindi, and English.',
    metrics: ['97.8% Diagnostic Accuracy', '15,000+ Crop Samples', 'Trilingual Voice/RAG'],
    achievement: 'Featured Exhibition Prototype',
  },
  {
    event: 'National AI & Developer Tools Hackathon',
    project: 'Star Interview Preparation',
    badge: 'Generative AI & Autonomous Agent',
    year: '2024',
    track: 'Full-Stack LLM Evaluation Sandbox',
    accent: 'cyan',
    description: 'Demonstrated an autonomous AI technical interviewer platform featuring real-time speech synthesis, live code execution sandbox, and dynamic rubric evaluation for aspiring software engineers.',
    metrics: ['Sub-second LLM Latency', 'Live Code Sandbox', 'Multi-turn Evaluation'],
    achievement: 'Top Hackathon Contender',
  },
  {
    event: 'Mobile Edge AI & HealthTech Showcase',
    project: 'Star AI Assistant',
    badge: 'Edge Computing & Biometrics',
    year: '2024',
    track: 'On-Device Deep Learning & Mobile',
    accent: 'violet',
    description: 'Exhibited a cross-platform intelligent health companion powered by lightweight on-device TensorFlow Lite models for continuous biometric anomaly detection and encrypted telemetry sync.',
    metrics: ['On-Device TFLite Inference', 'Encrypted Telemetry', 'Zero-Cloud Latency'],
    achievement: 'HealthTech Showcase Finalist',
  },
  {
    event: 'IoT Systems & Smart Hardware Exhibition',
    project: 'Smart Storage Telemetry & IoT',
    badge: 'Hardware & Sensor Networks',
    year: '2024',
    track: 'Edge Hardware & Time-Series Analytics',
    accent: 'amber',
    description: 'Presented a distributed IoT hardware array utilizing Raspberry Pi and Arduino microcontrollers streaming live environmental telemetry to InfluxDB and Grafana analytics dashboards.',
    metrics: ['Real-time InfluxDB Stream', 'Multi-sensor Hardware Array', 'Custom Grafana Panels'],
    achievement: 'Hardware-Software Innovation',
  },
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
              <span>TRACK RECORD</span>
            </div>
            <h3 className="kit-display text-3xl font-bold text-white md:text-4xl tracking-tight">
              Impact by Numbers
            </h3>
            <p className="text-sm text-blue-200/60 mt-2 max-w-lg mx-auto">
              Real metrics from our active competition submissions, prototypes, and laboratory research.
            </p>
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

      {/* ---------- Exhibitions & Competitions Showcase ---------- */}
      <Reveal className="mb-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-4 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-wider">
            <Trophy className="h-3.5 w-3.5 text-cyan-400" />
            <span>EXHIBITIONS & COMPETITIONS</span>
          </div>
          <h3 className="kit-display text-3xl font-bold text-white md:text-4xl tracking-tight">
            Proven Across Competitions & <span className="kit-gradient-text">Tech Exhibitions</span>
          </h3>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-blue-200/75 mt-3">
            Our AI lab actively showcases engineering prototypes at national hackathons, agricultural innovation summits, and smart hardware expos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exhibitions.map((item, idx) => {
            const colorScheme = {
              emerald: {
                badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
                glow: 'hover:shadow-[0_0_35px_rgba(16,185,129,0.18)] hover:border-emerald-500/40',
                dot: 'bg-emerald-400',
                icon: 'text-emerald-400',
              },
              cyan: {
                badgeBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
                glow: 'hover:shadow-[0_0_35px_rgba(34,211,238,0.18)] hover:border-cyan-500/40',
                dot: 'bg-cyan-400',
                icon: 'text-cyan-400',
              },
              violet: {
                badgeBg: 'bg-violet-500/10 border-violet-500/30 text-violet-300',
                glow: 'hover:shadow-[0_0_35px_rgba(167,139,250,0.18)] hover:border-violet-500/40',
                dot: 'bg-violet-400',
                icon: 'text-violet-400',
              },
              amber: {
                badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
                glow: 'hover:shadow-[0_0_35px_rgba(245,158,11,0.18)] hover:border-amber-500/40',
                dot: 'bg-amber-400',
                icon: 'text-amber-400',
              },
            }[item.accent] || {
              badgeBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
              glow: 'hover:shadow-[0_0_35px_rgba(34,211,238,0.18)] hover:border-cyan-500/40',
              dot: 'bg-cyan-400',
              icon: 'text-cyan-400',
            };

            return (
              <Reveal key={item.event} delay={idx * 100}>
                <SpotlightCard
                  className={`group relative h-full rounded-2xl border border-white/10 bg-[#060c1d]/90 p-7 transition-all duration-500 ${colorScheme.glow}`}
                >
                  <div className="relative z-10 flex flex-col h-full">
                    {/* Top Header */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`inline-block h-2 w-2 rounded-full ${colorScheme.dot}`} />
                          <span className="text-[11px] font-mono tracking-wider uppercase text-slate-400">
                            {item.event}
                          </span>
                        </div>
                        <h4 className="kit-display text-xl md:text-2xl font-bold text-white group-hover:text-cyan-200 transition-colors">
                          {item.project}
                        </h4>
                      </div>

                      <span className={`px-2.5 py-1 text-[11px] font-mono font-medium rounded-full border ${colorScheme.badgeBg} shrink-0`}>
                        {item.year}
                      </span>
                    </div>

                    {/* Track info */}
                    <div className="mb-4">
                      <span className="inline-block text-xs font-medium text-cyan-400/90 bg-cyan-950/40 border border-cyan-500/20 px-2.5 py-0.5 rounded">
                        Track: {item.track}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm leading-relaxed text-blue-100/70 mb-6 flex-1">
                      {item.description}
                    </p>

                    {/* Metrics Pills */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {item.metrics.map((metric) => (
                        <div
                          key={metric}
                          className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-blue-200/90"
                        >
                          <CheckCircle2 className={`h-3 w-3 ${colorScheme.icon}`} />
                          <span>{metric}</span>
                        </div>
                      ))}
                    </div>

                    {/* Achievement Footer */}
                    <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-mono">Recognition:</span>
                      <span className="font-semibold text-white/90 flex items-center gap-1.5">
                        <Trophy className={`h-3.5 w-3.5 ${colorScheme.icon}`} />
                        {item.achievement}
                      </span>
                    </div>
                  </div>
                </SpotlightCard>
              </Reveal>
            );
          })}
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
