import { Github, Linkedin, Twitter, Mail, Heart, ArrowUp, Globe } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { useCosmos } from './SectionKit';

type FooterLink = { name: string; action?: () => void; href?: string };

const Footer = () => {
  const { getContent } = useContent();
  useCosmos();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const scrollToSection = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const footerLinks: Record<string, FooterLink[]> = {
    Company: [
      { name: 'About Us', action: () => scrollToSection('about') },
      { name: 'Our Projects', action: () => scrollToSection('projects') },
      { name: 'Contact', action: () => scrollToSection('contact') },
      { name: 'Careers', href: '#' },
    ],
    Services: [
      { name: 'AI Development', href: '#' },
      { name: 'Machine Learning', href: '#' },
      { name: 'Data Science', href: '#' },
      { name: 'Consulting', href: '#' },
    ],
    Resources: [
      { name: 'Blog', href: '#' },
      { name: 'Documentation', href: '#' },
      { name: 'Case Studies', href: '#' },
      { name: 'White Papers', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: <Globe className="h-5 w-5" />, href: 'https://nilanjan-nayak.my-board.org', name: 'Website', hover: 'hover:text-cyan-300 hover:border-cyan-400/50' },
    { icon: <Github className="h-5 w-5" />, href: 'https://github.com/Nilanjan-Nayak', name: 'GitHub', hover: 'hover:text-white hover:border-white/40' },
    { icon: <Linkedin className="h-5 w-5" />, href: 'https://www.linkedin.com/in/nilanjan-nayak-73b475322/', name: 'LinkedIn', hover: 'hover:text-blue-300 hover:border-blue-400/50' },
    { icon: <Twitter className="h-5 w-5" />, href: 'https://twitter.com', name: 'Twitter', hover: 'hover:text-cyan-300 hover:border-cyan-400/50' },
    { icon: <Mail className="h-5 w-5" />, href: 'mailto:nayaknilanjan2@gmail.com', name: 'Email', hover: 'hover:text-blue-300 hover:border-blue-400/50' },
  ];

  const linkClass = 'inline-block text-blue-200/75 transition-all duration-300 hover:translate-x-1 hover:text-white';

  return (
    <footer className="relative overflow-hidden text-white" style={{ background: 'linear-gradient(180deg, rgba(2,4,10,0) 0%, rgba(2,4,10,.8) 35%, #000 100%)' }}>
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-24 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">


        {/* Links */}
        <div className="grid grid-cols-1 gap-10 py-16 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-5 lg:col-span-2">
            <span className="kit-display kit-gradient-text kit-gradient-inline text-3xl font-bold">Star AI Lab</span>
            <p className="max-w-sm leading-relaxed text-blue-200/75">
              Empowering the future with cutting-edge artificial intelligence and innovative software solutions.
            </p>
            <div className="flex gap-3 pt-1">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.name}
                  aria-label={s.name}
                  className={`rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-blue-200/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_22px_rgba(34,211,238,0.18)] ${s.hover}`}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="kit-display mb-5 text-lg font-semibold text-white">{heading}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    {link.action ? (
                      <button onClick={link.action} className={linkClass}>{link.name}</button>
                    ) : link.href && link.href !== '#' ? (
                      <a href={link.href} className={linkClass}>{link.name}</a>
                    ) : (
                      /* placeholder – not a real page yet */
                      <span className="inline-block cursor-default text-blue-200/40">{link.name}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Wordmark watermark */}
        <div aria-hidden="true" className="pointer-events-none select-none overflow-hidden text-center">
          <div
            className="kit-display font-bold leading-[0.8] tracking-tight"
            style={{
              fontSize: 'clamp(3.5rem, 15vw, 13rem)',
              background: 'linear-gradient(180deg, rgba(96,165,250,0.28), rgba(2,4,10,0) 85%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            STAR AI LAB
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 border-t border-blue-500/20 bg-black/40 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:px-6 md:flex-row lg:px-8">
          <div className="flex items-center text-blue-200/75">
            <span>{getContent('footer', 'copyright', `© ${new Date().getFullYear()} Star AI Labs. Made with`)}</span>
            <Heart className="mx-1 h-4 w-4 animate-pulse text-red-400" />
            <span> Nilanjan</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="cursor-default text-blue-200/40">Privacy Policy</span>
            <span className="cursor-default text-blue-200/40">Terms of Service</span>
            <button
              onClick={scrollToTop}
              title="Back to top"
              aria-label="Back to top"
              className="group rounded-xl bg-gradient-to-r from-blue-600 to-cyan-400 p-3 shadow-lg transition-all duration-300 hover:scale-110 hover:from-cyan-400 hover:to-blue-600 hover:shadow-cyan-400/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            >
              <ArrowUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;