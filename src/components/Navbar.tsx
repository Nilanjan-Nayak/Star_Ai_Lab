import React, { useState } from 'react';
import { Menu, X, Github, Linkedin, Mail } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg shadow-2xl z-50 border-b border-cyan-400/20">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-blue-900/80 to-indigo-900/90 backdrop-blur-lg"></div>
      
      <div className="relative mx-4 px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo with Text */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => scrollToSection("home")}
          >
            <img
              src="/src/img/_Pngtree_n_circle_letter_initial_logo_4835121-removebg-preview.png"
              alt="Star AI Labs Logo"
              className="h-10 w-10 object-contain rounded-full border-2 border-blue-500/40 bg-white/10 transition-all duration-300 group-hover:border-cyan-400/60 group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="text-white font-bold text-lg leading-tight group-hover:text-cyan-300 transition-colors duration-300">
                Star AI Lab
              </span>
              <span className="text-cyan-400 text-xs font-medium leading-tight">
                AI Solutions
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {['home', 'about', 'projects', 'contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className="relative px-4 py-2 text-cyan-200 hover:text-white transition-all duration-300 font-medium group"
              >
                <span className="relative z-10 capitalize">{item}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            ))}
            
            {/* Social Links */}
            <div className="flex items-center space-x-2 border-l border-cyan-400/30 pl-6 ml-6">
              <SocialIcon href="https://github.com" icon={<Github className="h-5 w-5" />} />
              <SocialIcon href="https://linkedin.com" icon={<Linkedin className="h-5 w-5" />} />
              <SocialIcon href="mailto:info@example.com" icon={<Mail className="h-5 w-5" />} />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="group relative p-3 text-cyan-300 hover:text-white transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {isOpen ? <X className="relative h-6 w-6" /> : <Menu className="relative h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-cyan-400/20 bg-slate-900/95 backdrop-blur-lg">
            <div className="py-6 space-y-2">
              {/* Mobile Logo */}
              <div className="flex items-center justify-center space-x-3 pb-4 border-b border-cyan-400/20 mb-4">
                <img
                  src="/src/img/_Pngtree_n_circle_letter_initial_logo_4835121-removebg-preview.png"
                  alt="Star AI Labs Logo"
                  className="h-8 w-8 object-contain rounded-full border-2 border-blue-500/40 bg-white/10"
                />
                <div className="flex flex-col">
                  <span className="text-white font-bold text-base leading-tight">
                    Star AI Lab
                  </span>
                  <span className="text-cyan-400 text-xs font-medium leading-tight">
                    AI Solutions
                  </span>
                </div>
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
              <div className="flex items-center justify-center space-x-4 pt-6 border-t border-cyan-400/20 mt-6">
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

// Social Icon Component to reduce repetition
const SocialIcon = ({ href, icon, mobile = false }: { href: string; icon: React.ReactNode; mobile?: boolean }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`group relative ${mobile ? 'p-4' : 'p-3'} text-cyan-300 hover:text-white transition-all duration-300`}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    <div className="relative">{icon}</div>
  </a>
);

export default Navbar;