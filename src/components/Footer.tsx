import { Cpu, Github, Linkedin, Twitter, Mail, Heart, ArrowUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const footerLinks = {
    company: [
      { name: 'About Us', action: () => scrollToSection('about') },
      { name: 'Our Projects', action: () => scrollToSection('projects') },
      { name: 'Contact', action: () => scrollToSection('contact') },
      { name: 'Careers', href: '#' }
    ],
    services: [
      { name: 'AI Development', href: '#' },
      { name: 'Machine Learning', href: '#' },
      { name: 'Data Science', href: '#' },
      { name: 'Consulting', href: '#' }
    ],
    resources: [
      { name: 'Blog', href: '#' },
      { name: 'Documentation', href: '#' },
      { name: 'Case Studies', href: '#' },
      { name: 'White Papers', href: '#' }
    ]
  };

  const socialLinks = [
    {
      icon: <Github className="h-5 w-5" />,
      href: 'https://github.com',
      name: 'GitHub',
      hover: 'hover:text-gray-300 hover:bg-gray-800/50'
    },
    {
      icon: <Linkedin className="h-5 w-5" />,
      href: 'https://linkedin.com',
      name: 'LinkedIn',
      hover: 'hover:text-blue-400 hover:bg-blue-500/20'
    },
    {
      icon: <Twitter className="h-5 w-5" />,
      href: 'https://twitter.com',
      name: 'Twitter',
      hover: 'hover:text-cyan-400 hover:bg-cyan-500/20'
    },
    {
      icon: <Mail className="h-5 w-5" />,
      href: 'mailto:info@starailabs.com',
      name: 'Email',
      hover: 'hover:text-blue-400 hover:bg-blue-500/20'
    }
  ];

  return (
    <footer className="bg-premium-void text-white relative">
      {/* Premium Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-cyan-400/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-xl shadow-lg">
                <Cpu className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-premium-gradient">Star AI Labs</span>
            </div>
            <p className="text-blue-200/90 leading-relaxed mb-6">
              Pioneering the future of artificial intelligence through innovative solutions that transform industries and enhance human potential. We're dedicated to making AI accessible and impactful for businesses worldwide.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 bg-premium-glass backdrop-blur-lg border border-premium-blue rounded-lg transition-all duration-300 ${social.hover} hover:scale-110 shadow-lg`}
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  {link.action ? (
                    <button
                      onClick={link.action}
                      className="text-blue-200/80 hover:text-white transition-colors duration-300 hover:translate-x-1 transform"
                    >
                      {link.name}
                    </button>
                  ) : (
                    <a
                      href={link.href}
                      className="text-blue-200/80 hover:text-white transition-colors duration-300 hover:translate-x-1 transform inline-block"
                    >
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-blue-200/80 hover:text-white transition-colors duration-300 hover:translate-x-1 transform inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-blue-200/80 hover:text-white transition-colors duration-300 hover:translate-x-1 transform inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="relative z-10 border-t border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center text-blue-200/80 mb-4 md:mb-0">
              <span>© 2024 Star AI Labs. Made with</span>
              <Heart className="h-4 w-4 text-red-400 mx-1 animate-pulse" />
              <span>and cutting-edge AI</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <a href="#" className="text-blue-200/80 hover:text-white transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="text-blue-200/80 hover:text-white transition-colors duration-300">
                Terms of Service
              </a>
              <button
                onClick={scrollToTop}
                className="p-3 bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-cyan-400 hover:to-blue-600 rounded-lg transition-all duration-300 group shadow-lg hover:shadow-xl hover:scale-110"
                title="Back to top"
              >
                <ArrowUp className="h-4 w-4 group-hover:transform group-hover:-translate-y-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;