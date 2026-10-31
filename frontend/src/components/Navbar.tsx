import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, X, Github, Linkedin, Mail, Sparkles, ArrowUpRight, ChevronRight, Globe, Layers, User, Send, Home as HomeIcon } from 'lucide-react';
import logoImg from '../img/star_ai_lab_logo.png';

export type SectionId = 'home' | 'about' | 'projects' | 'contact';

export interface NavLinkItem {
  id: SectionId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface SocialButtonProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  ariaLabel?: string;
}

const navLinks: NavLinkItem[] = [
  { id: 'home', label: 'Home', icon: HomeIcon },
  { id: 'about', label: 'About', icon: User },
  { id: 'projects', label: 'Projects', icon: Layers },
  { id: 'contact', label: 'Contact', icon: Send },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scrollY, setScrollY] = useState<number>(0);
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [sliderStyle, setSliderStyle] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  });
  const navContainerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const buttonRefs = useRef<{ [key in SectionId]?: HTMLButtonElement | null }>({});

  // Auto-hide navbar when project detail modal is open
  useEffect(() => {
    const handleModalState = (e: any) => {
      setIsModalOpen(Boolean(e.detail?.open));
    };
    window.addEventListener('star-project-modal', handleModalState);
    return () => window.removeEventListener('star-project-modal', handleModalState);
  }, []);

  // Accurate section detection using scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      // Section spy calculation with proportional viewport buffer
      const sections: SectionId[] = ['home', 'about', 'projects', 'contact'];
      const scrollPosition = currentScrollY + Math.min(window.innerHeight * 0.35, 260);

      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionId = sections[i];
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update sliding magnetic active pill position with zero layout shift
  const updateSlider = useCallback(() => {
    const currentBtn = buttonRefs.current[activeSection];
    const navEl = navRef.current;
    if (currentBtn && navEl) {
      const navRect = navEl.getBoundingClientRect();
      const btnRect = currentBtn.getBoundingClientRect();
      setSliderStyle({
        left: btnRect.left - navRect.left,
        width: btnRect.width,
        opacity: 1,
      });
    }
  }, [activeSection]);

  useEffect(() => {
    updateSlider();
    window.addEventListener('resize', updateSlider);
    return () => window.removeEventListener('resize', updateSlider);
  }, [updateSlider]);

  // Close mobile drawer on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);

  const scrollToSection = useCallback((sectionId: SectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
      setIsOpen(false);
    }
  }, []);

  const isScrolled = scrollY > 20;
  const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  const scrollProgress = Math.min(Math.max(scrollY / maxScroll, 0), 1);

  return (
    <>
      {/* ── Top-Screen Dynamic Telemetry Reading Laser Bar ── */}
        <div className={`fixed top-0 left-0 right-0 h-[2px] z-[60] pointer-events-none bg-transparent transition-opacity duration-300 ${isModalOpen ? 'opacity-0' : 'opacity-100'}`}>
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-500 shadow-[0_0_12px_rgba(6,182,212,0.9)] transition-all duration-150 ease-out"
            style={{ width: `${scrollProgress * 100}%`, opacity: scrollY > 10 ? 1 : 0 }}
          />
        </div>

        {/* ── Floating Header Capsule ── */}
          <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-3 sm:px-6 pt-3 sm:pt-4 pointer-events-none ${isModalOpen ? '-translate-y-32 opacity-0' : 'translate-y-0 opacity-100'}`}>
            <div className="w-full max-w-7xl mx-auto">
              {/* Main Navigation Pill */}
              <div
                ref={navContainerRef}
                className={`w-full rounded-full pointer-events-auto transition-all duration-300 ease-out relative ${isScrolled
                    ? 'bg-[#050a17]/92 backdrop-blur-2xl border border-cyan-500/25 shadow-[0_12px_45px_rgba(0,0,0,0.85),0_0_35px_rgba(6,182,212,0.15)]'
                    : 'bg-slate-950/70 backdrop-blur-xl border border-white/[0.12] shadow-[0_8px_32px_rgba(0,0,0,0.45)]'
                  }`}
              >
                {/* Top Specular Edge Highlight */}
                <div
                  className={`absolute inset-x-16 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none rounded-t-full transition-opacity duration-500 ${isScrolled ? 'opacity-100' : 'opacity-40'
                    }`}
                />

                <div className="px-5 sm:px-8 py-3 sm:py-3.5 flex items-center justify-between gap-4">
                  {/* ── Left: Brand Identity Logo ── */}
                  <div
                    onClick={() => scrollToSection('home')}
                    className="flex items-center cursor-pointer select-none flex-shrink-0"
                    role="button"
                    tabIndex={0}
                    aria-label="Star AI Lab Home"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        scrollToSection('home');
                      }
                    }}
                  >
                    <img
                      src={logoImg}
                      alt="Star AI Lab"
                      className="h-8 sm:h-9 md:h-10 w-auto object-contain transition-transform duration-200 hover:scale-105"
                    />
                  </div>

                  {/* ── Center: Fluid Magnetic Sliding Pill Navigation ── */}
                  <nav
                    ref={navRef}
                    className="relative hidden md:flex items-center gap-1 p-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl shadow-inner"
                    aria-label="Main Navigation"
                  >
                    {/* The Single Sliding Smooth Pill Indicator */}
                    <span
                      className="absolute top-1.5 bottom-1.5 rounded-full bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-cyan-500/20 border border-cyan-400/35 shadow-[0_0_16px_rgba(6,182,212,0.25)] pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
                      style={{
                        left: `${sliderStyle.left}px`,
                        width: `${sliderStyle.width}px`,
                        opacity: sliderStyle.opacity,
                      }}
                    />

                    {navLinks.map((link) => {
                      const isActive = activeSection === link.id;

                      return (
                        <button
                          key={link.id}
                          ref={(el) => {
                            buttonRefs.current[link.id] = el;
                          }}
                          onClick={() => scrollToSection(link.id)}
                          className={`relative z-10 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-colors duration-200 select-none flex items-center justify-center ${isActive
                              ? 'text-cyan-300 font-bold'
                              : 'text-slate-300 hover:text-white'
                            }`}
                        >
                          <span>{link.label}</span>
                        </button>
                      );
                    })}
                  </nav>

                  {/* ── Right: Social Actions & Primary CTA Button ── */}
                  <div className="hidden md:flex items-center gap-2.5 flex-shrink-0">
                    {/* Circular Glass Social Buttons */}
                    <div className="flex items-center gap-2">
                      <SocialButton
                        href="https://nilanjan-nayak.my-board.org"
                        icon={<Globe className="w-4 h-4" />}
                        title="Portfolio Website"
                        ariaLabel="Visit Developer Website"
                      />
                      <SocialButton
                        href="https://github.com/Nilanjan-Nayak"
                        icon={<Github className="w-4 h-4" />}
                        title="GitHub Profile"
                        ariaLabel="Visit GitHub Profile"
                      />
                      <SocialButton
                        href="https://www.linkedin.com/in/nilanjan-nayak-73b475322/"
                        icon={<Linkedin className="w-4 h-4" />}
                        title="LinkedIn Profile"
                        ariaLabel="Visit LinkedIn Profile"
                      />
                      <SocialButton
                        href="mailto:nayaknilanjan2@gmail.com"
                        icon={<Mail className="w-4 h-4" />}
                        title="Send Email"
                        ariaLabel="Send Email"
                      />
                    </div>

                    {/* Vertical Separator */}
                    <div className="h-5 w-px bg-white/15 mx-1 hidden lg:block" />

                    {/* High-Impact CTA Button with Light Sweep Animation */}
                    <button
                      onClick={() => scrollToSection('contact')}
                      className="relative group overflow-hidden px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-300 hover:from-cyan-300 hover:to-sky-200 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.65)] transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2"
                      aria-label="Get in Touch"
                    >
                      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
                      <span className="relative z-10">Get in Touch</span>
                      <ArrowUpRight className="relative z-10 w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                    </button>
                  </div>

                  {/* ── Mobile: Action & Drawer Toggle ── */}
                  <div className="md:hidden flex items-center gap-2">
                    <button
                      onClick={() => scrollToSection('contact')}
                      className="p-2 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-semibold flex items-center gap-1 hover:bg-cyan-500/20 active:scale-95 transition-all"
                      aria-label="Quick contact"
                    >
                      <Mail className="w-4 h-4" />
                    </button>

                    <button
                      onClick={toggleMenu}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/90 hover:text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400/30 active:scale-95 transition-all duration-200"
                      aria-label="Toggle navigation menu"
                      aria-expanded={isOpen}
                    >
                      {isOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* ── Mobile Dropdown Drawer with Smooth Glassmorphism ── */}
                {isOpen && (
                  <div className="md:hidden px-4 pb-6 pt-3 border-t border-white/10 space-y-4 bg-[#050a17]/95 backdrop-blur-2xl rounded-b-3xl shadow-2xl">
                    <div className="space-y-1.5 pt-1">
                      {navLinks.map((link) => {
                        const isActive = activeSection === link.id;
                        const Icon = link.icon;

                        return (
                          <button
                            key={link.id}
                            onClick={() => scrollToSection(link.id)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive
                                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 shadow-[0_0_14px_rgba(6,182,212,0.2)]'
                                : 'bg-white/[0.02] text-slate-300 hover:text-white hover:bg-white/[0.06] border border-white/5'
                              }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                              <span>{link.label}</span>
                            </div>
                            <ChevronRight className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-white/20'}`} />
                          </button>
                        );
                      })}
                    </div>

                    {/* Mobile CTA Button */}
                    <button
                      onClick={() => scrollToSection('contact')}
                      className="w-full py-3 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      <span>Get in Touch</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>

                    {/* Mobile Social Links Bar */}
                    <div className="flex items-center justify-center gap-2.5 pt-3 border-t border-white/10">
                      <SocialButton
                        href="https://nilanjan-nayak.my-board.org"
                        icon={<Globe className="w-3.5 h-3.5" />}
                        title="My Website"
                        ariaLabel="Developer Website"
                      />
                      <SocialButton
                        href="https://github.com/Nilanjan-Nayak"
                        icon={<Github className="w-3.5 h-3.5" />}
                        title="GitHub"
                        ariaLabel="GitHub Profile"
                      />
                      <SocialButton
                        href="https://www.linkedin.com/in/nilanjan-nayak-73b475322/"
                        icon={<Linkedin className="w-3.5 h-3.5" />}
                        title="LinkedIn"
                        ariaLabel="LinkedIn Profile"
                      />
                      <SocialButton
                        href="mailto:nayaknilanjan2@gmail.com"
                        icon={<Mail className="w-3.5 h-3.5" />}
                        title="Email"
                        ariaLabel="Send Email"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>
        </>
        );
};

// Reusable Circular Glass Social Action Button with Micro-interactions
const SocialButton: React.FC<SocialButtonProps> = ({
  href,
  icon,
  title,
  ariaLabel,
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    title={title}
    aria-label={ariaLabel || title}
    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/[0.04] hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/40 text-slate-300 hover:text-cyan-300 hover:shadow-[0_0_14px_rgba(6,182,212,0.25)] hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center group relative"
  >
    {icon}
  </a>
);

          export default Navbar;
