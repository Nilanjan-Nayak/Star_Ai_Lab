import React, { useState, useEffect } from 'react';
import { Menu, X, Github, Linkedin, Mail } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Track scroll position for smooth transitions
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  // Smart navbar visibility and background transitions
  const isInHeroSection = scrollY < 80;
  const isScrolled = scrollY > 50;
  const backgroundOpacity = Math.min(Math.max((scrollY - 30) / 120, 0), 1);
  const borderOpacity = Math.min(Math.max((scrollY - 50) / 100, 0), 1);
  const shadowIntensity = Math.min(scrollY / 200, 1);
  const scrollProgress = Math.min(scrollY / (window.innerHeight || 1), 1);

  // Dynamic navbar styles with premium transitions
  const navbarStyle = {
    background: isInHeroSection 
      ? 'transparent'
      : `linear-gradient(135deg, rgba(15, 23, 42, ${0.95 * backgroundOpacity}), rgba(30, 41, 59, ${0.90 * backgroundOpacity}), rgba(51, 65, 85, ${0.85 * backgroundOpacity}))`,
    backdropFilter: isInHeroSection ? 'none' : `blur(${12 + (backgroundOpacity * 12)}px) saturate(${100 + (backgroundOpacity * 80)}%)`,
    WebkitBackdropFilter: isInHeroSection ? 'none' : `blur(${12 + (backgroundOpacity * 12)}px) saturate(${100 + (backgroundOpacity * 80)}%)`,
    borderBottom: `1px solid rgba(34, 211, 238, ${0.2 * borderOpacity})`,
    boxShadow: isInHeroSection 
      ? 'none' 
      : `0 ${4 + (shadowIntensity * 16)}px ${16 + (shadowIntensity * 24)}px rgba(0, 0, 0, ${0.1 + (shadowIntensity * 0.4)}), 0 0 ${20 * shadowIntensity}px rgba(59, 130, 246, ${0.1 * shadowIntensity})`,
    transition: 'all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  };

  // Smart text color transitions
  const getTextColorClass = (isActive = false) => {
    if (isInHeroSection) {
      return isActive 
        ? 'text-white drop-shadow-lg' 
        : 'text-white/90 hover:text-cyan-300 hover:drop-shadow-lg';
    }
    return isActive 
      ? 'text-white' 
      : 'text-cyan-200 hover:text-white';
  };

  // Logo styles with smart transitions
  const logoImageStyle = {
    borderColor: isInHeroSection 
      ? `rgba(59, 130, 246, ${0.6 + (0.4 * (1 - backgroundOpacity))})` 
      : `rgba(59, 130, 246, ${0.4 + (0.3 * backgroundOpacity)})`,
    background: isInHeroSection 
      ? `rgba(255, 255, 255, ${0.15 - (0.05 * backgroundOpacity)})` 
      : `rgba(255, 255, 255, ${0.1 + (0.05 * backgroundOpacity)})`,
    boxShadow: isInHeroSection 
      ? `0 0 ${10 + (10 * (1 - backgroundOpacity))}px rgba(59, 130, 246, ${0.3 * (1 - backgroundOpacity)})` 
      : `0 0 ${5 + (5 * backgroundOpacity)}px rgba(59, 130, 246, ${0.2 * backgroundOpacity})`,
    transition: 'all 0.5s ease-out',
  };

  // Mobile menu background
  const mobileMenuStyle = {
    background: `linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.95))`,
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  };

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out"
      style={navbarStyle}
    >
      {/* Scroll progress indicator */}
      <div 
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 ease-out"
        style={{ 
          width: `${scrollProgress * 100}%`,
          opacity: isScrolled ? 1 : 0 
        }}
      />
      
      <div className="relative mx-4 px-4">
        <div className="flex items-center justify-between h-16">
          {/* Professional Logo with Simple Transitions */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => scrollToSection("home")}
          >
            <span className={`font-bold text-2xl leading-tight transition-colors duration-300 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent`}>
              Star AI Lab
            </span>
            
          </div>

          {/* Professional Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {['home', 'about', 'projects', 'contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className={`px-4 py-2 transition-colors duration-300 font-medium capitalize ${getTextColorClass()}`}
              >
                {item}
              </button>
            ))}
            
            {/* Professional Social Links */}
            <div 
              className="flex items-center space-x-2 pl-6 ml-6 transition-all duration-300"
              style={{
                borderLeft: `1px solid rgba(34, 211, 238, ${0.3 * (isInHeroSection ? 0.7 : 1)})`,
              }}
            >
              <SocialIcon 
                href="https://github.com" 
                icon={<Github className="h-5 w-5" />} 
                isInHero={isInHeroSection}
              />
              <SocialIcon 
                href="https://linkedin.com" 
                icon={<Linkedin className="h-5 w-5" />} 
                isInHero={isInHeroSection}
              />
              <SocialIcon 
                href="mailto:info@example.com" 
                icon={<Mail className="h-5 w-5" />} 
                isInHero={isInHeroSection}
              />
            </div>
          </div>

          {/* Professional Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className={`p-3 transition-colors duration-300 ${getTextColorClass()}`}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        {isOpen && (
          <div 
            className="md:hidden border-t transition-all duration-500"
            style={{
              ...mobileMenuStyle,
              borderTopColor: `rgba(34, 211, 238, ${0.2 * borderOpacity})`,
            }}
          >
            <div className="py-6 space-y-2">
              {/* Mobile Logo */}
              <div className="flex items-center justify-center pb-4 mb-4"
                style={{
                  borderBottom: `1px solid rgba(34, 211, 238, ${0.2 * borderOpacity})`,
                }}
              >
                <span className="font-bold text-xl leading-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Star AI Lab
                </span>
              </div>

              {/* Mobile Menu Items */}
              {['home', 'about', 'projects', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="group relative block w-full text-left px-6 py-4 text-cyan-200 hover:text-white transition-all duration-300 font-medium"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 mx-2"></div>
                  <span className="relative z-10 capitalize">{item}</span>
                </button>
              ))}
              
              {/* Mobile Social Links */}
              <div 
                className="flex items-center justify-center space-x-4 pt-6 mt-6"
                style={{
                  borderTop: `1px solid rgba(34, 211, 238, ${0.2 * borderOpacity})`,
                }}
              >
                <SocialIcon href="https://github.com" icon={<Github className="h-6 w-6" />} mobile />
                <SocialIcon href="https://linkedin.com" icon={<Linkedin className="h-6 w-6" />} mobile />
                <SocialIcon href="mailto:info@example.com" icon={<Mail className="h-6 w-6" />} mobile />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Professional Social Icon Component
const SocialIcon = ({ 
  href, 
  icon, 
  mobile = false, 
  isInHero = false 
}: { 
  href: string; 
  icon: React.ReactNode; 
  mobile?: boolean;
  isInHero?: boolean;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`${mobile ? 'p-4' : 'p-3'} transition-colors duration-300 ${
      isInHero 
        ? 'text-white/90 hover:text-cyan-300' 
        : 'text-cyan-300 hover:text-white'
    }`}
  >
    {icon}
  </a>
);

export default Navbar;