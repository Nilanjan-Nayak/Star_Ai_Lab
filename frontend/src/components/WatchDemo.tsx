
import { Star, Zap, } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useContent } from '../context/ContentContext';

const WatchDemo = () => {
  const { getContent } = useContent();
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elementId = entry.target.getAttribute('data-animate');
            if (elementId) {
              setVisibleElements(prev => new Set([...prev, elementId]));
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px -50px 0px'
      }
    );

    const elementsToObserve = sectionRef.current?.querySelectorAll('[data-animate]');
    elementsToObserve?.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const isVisible = (elementId: string) => visibleElements.has(elementId);

  const mainVideo = getContent('videos', 'mainVideo', {
    src: '/src/img/LOGO amimation.mp4',
    title: 'Complete AI Platform Overview',
    description: 'A comprehensive look at our AI platform and its capabilities'
  });

  return (
    <section ref={sectionRef} id="demo" className="py-24 bg-premium-deep relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-cyan-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/3 to-cyan-400/3 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div>


          {/* Premium Header Section with Professional Shadows */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-black/90 via-slate-900/80 to-black/90 border border-blue-500/40 rounded-full text-blue-300 text-sm font-semibold mb-8 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.8),0_8px_16px_rgba(59,130,246,0.3),0_4px_8px_rgba(6,182,212,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]">
              <Star className="h-5 w-5 mr-3 text-cyan-400" />
              {getContent('demo', 'badge', 'Premium Demo Experience')}
              <Zap className="h-5 w-5 ml-3 text-blue-400" />
            </div>

            <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]">
              {getContent('demo', 'title', 'Watch Our')}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 mt-2 pb-3 pt-1 leading-snug drop-shadow-[0_4px_8px_rgba(59,130,246,0.4)]">
                {getContent('demo', 'titleHighlight', 'AI/APP Innovation')}
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]">
              {getContent('demo', 'subtitle', 'Experience the cutting-edge capabilities of Star AI Lab through our exclusive demonstration')}
            </p>
          </div>

        </div>

        {/* Featured Main Video */}
        <div
          data-animate="main-video"
          className={`mb-20 transition-all duration-1000 ease-out ${isVisible('main-video')
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-95'
            }`}
        >
          <div className="max-w-4xl mx-auto relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 via-cyan-400/15 to-blue-600/20 rounded-3xl blur-2xl"></div>
            <div className="relative bg-premium-glass  border border-premium-blue rounded-3xl p-6 shadow-premium-void  transition-all duration-500 ">
              <div className="relative bg-black rounded-2xl overflow-hidden border border-blue-300/20">
                <video
                  width="100%"
                  height="400"
                  controls
                  className="relative z-10 rounded-2xl"
                  style={{ objectFit: 'cover' }}
                  poster={mainVideo?.poster || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 675'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23000000'/%3E%3Cstop offset='50%25' style='stop-color:%231e3a8a'/%3E%3Cstop offset='100%25' style='stop-color:%230066ff'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23bg)'/%3E%3Ctext x='50%25' y='45%25' font-family='Inter, sans-serif' font-size='48' font-weight='bold' fill='white' text-anchor='middle'%3EStar AI Lab%3C/text%3E%3Ctext x='50%25' y='65%25' font-family='Inter, sans-serif' font-size='24' fill='%2393c5fd' text-anchor='middle'%3EMain Demo%3C/text%3E%3C/svg%3E"}
                >
                  <source src={mainVideo?.src || "/src/img/LOGO amimation.mp4"} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-xl font-bold text-white mb-2 ">
                  {mainVideo?.title || 'Complete AI Platform Overview'}
                </h3>
                <p className="text-blue-200/80 text-sm">
                  {mainVideo?.description || 'A comprehensive look at our AI platform and its capabilities'}
                </p>
              </div>
            </div>
          </div>
        </div>



        {/* Premium Info Section */}
        <div
          data-animate="info-section"
          className={`mt-20 transition-all duration-1000 delay-300 ease-out ${
            isVisible('info-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="max-w-5xl mx-auto relative">
            {/* Outer glow */}
            <div className="absolute -inset-3 bg-gradient-to-r from-blue-600/10 via-cyan-400/8 to-blue-600/10 rounded-3xl blur-2xl"></div>

            <div className="relative bg-gradient-to-br from-slate-900/80 via-[#0a1628]/90 to-slate-900/80 backdrop-blur-2xl rounded-3xl border border-blue-500/15 overflow-hidden shadow-[0_25px_50px_rgba(0,0,0,0.7),0_10px_20px_rgba(30,58,138,0.15)]">
              
              {/* Top gradient accent bar */}
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-blue-400/60 to-transparent"></div>

              <div className="p-10 md:p-14">
                {/* Grid layout */}
                <div className="grid md:grid-cols-[auto_1fr] gap-8 items-center">
                  
                  {/* Left: Icon cluster */}
                  <div className="flex md:flex-col items-center justify-center gap-4 md:pr-10 md:border-r border-blue-500/10">
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl"></div>
                      <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-400/10 border border-blue-400/20 flex items-center justify-center">
                        <Zap className="w-8 h-8 text-cyan-400" />
                      </div>
                    </div>
                    <div className="hidden md:block w-[2px] h-8 bg-gradient-to-b from-blue-400/30 to-transparent"></div>
                    <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/15 to-cyan-500/10 border border-blue-400/10 flex items-center justify-center">
                      <Star className="w-5 h-5 text-blue-400/70" />
                    </div>
                  </div>

                  {/* Right: Content */}
                  <div className="text-center md:text-left space-y-5">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight leading-snug">
                        Experience the Future of
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300"> AI Innovation</span>
                      </h3>
                      <p className="text-base md:text-lg text-gray-400 leading-relaxed max-w-2xl">
                        This exclusive demonstration showcases our latest breakthroughs in artificial intelligence — from real-world applications to next-generation capabilities.
                      </p>
                    </div>

                    {/* Feature pills */}
                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                      {['Real-World Applications', 'Next-Gen AI Models', 'Live Demonstrations'].map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-4 py-2 text-xs font-semibold tracking-wide uppercase rounded-full bg-blue-500/8 text-blue-300/80 border border-blue-500/15 backdrop-blur-sm"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 mr-2"></span>
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Powered by line */}
                    <div className="pt-4 border-t border-blue-500/10">
                      <p className="text-sm text-blue-400/50 font-medium tracking-widest uppercase">
                        Powered by Star AI Lab — Cutting-Edge Intelligence
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom gradient accent bar */}
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>


    </section>
  );
};

export default WatchDemo;














