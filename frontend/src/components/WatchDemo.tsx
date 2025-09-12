
import { Star, Zap, Play, Clock, Users,  } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const WatchDemo = () => {
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
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

  const demoVideos = [
    {
      id: 1,
      title: "AI Model Training",
      description: "Watch our advanced AI models learn and adapt in real-time",
      duration: "3:45",
      category: "Machine Learning",
      thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 225'%3E%3Cdefs%3E%3ClinearGradient id='bg1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23000000'/%3E%3Cstop offset='50%25' style='stop-color:%231e3a8a'/%3E%3Cstop offset='100%25' style='stop-color:%230066ff'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23bg1)'/%3E%3Ctext x='50%25' y='45%25' font-family='Inter, sans-serif' font-size='16' font-weight='bold' fill='white' text-anchor='middle'%3EAI Training%3C/text%3E%3Ctext x='50%25' y='65%25' font-family='Inter, sans-serif' font-size='12' fill='%2393c5fd' text-anchor='middle'%3EDemo Video%3C/text%3E%3C/svg%3E",
      videoSrc: "/src/img/LOGO amimation.mp4"
    },
    {
      id: 2,
      title: "Data Processing",
      description: "See how we process and analyze massive datasets efficiently",
      duration: "2:30",
      category: "Data Science",
      thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 225'%3E%3Cdefs%3E%3ClinearGradient id='bg2' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23000000'/%3E%3Cstop offset='50%25' style='stop-color:%2306b6d4'/%3E%3Cstop offset='100%25' style='stop-color:%2300d4ff'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23bg2)'/%3E%3Ctext x='50%25' y='45%25' font-family='Inter, sans-serif' font-size='16' font-weight='bold' fill='white' text-anchor='middle'%3EData Processing%3C/text%3E%3Ctext x='50%25' y='65%25' font-family='Inter, sans-serif' font-size='12' fill='%2393c5fd' text-anchor='middle'%3EDemo Video%3C/text%3E%3C/svg%3E",
      videoSrc: "/src/img/LOGO amimation.mp4"
    },
    {
      id: 3,
      title: "Real-time Analytics",
      description: "Experience our real-time analytics and insights generation",
      duration: "4:15",
      category: "Analytics",
      thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 225'%3E%3Cdefs%3E%3ClinearGradient id='bg3' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23000000'/%3E%3Cstop offset='50%25' style='stop-color:%233b82f6'/%3E%3Cstop offset='100%25' style='stop-color:%2360a5fa'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23bg3)'/%3E%3Ctext x='50%25' y='45%25' font-family='Inter, sans-serif' font-size='16' font-weight='bold' fill='white' text-anchor='middle'%3EReal-time Analytics%3C/text%3E%3Ctext x='50%25' y='65%25' font-family='Inter, sans-serif' font-size='12' fill='%2393c5fd' text-anchor='middle'%3EDemo Video%3C/text%3E%3C/svg%3E",
      videoSrc: "/src/img/LOGO amimation.mp4"
    }
  ];

  const handleVideoPlay = (videoId: number) => {
    setActiveVideo(activeVideo === videoId ? null : videoId);
  };
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
            Premium Demo Experience
            <Zap className="h-5 w-5 ml-3 text-blue-400" />
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]">
            Watch Our
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 mt-2 drop-shadow-[0_4px_8px_rgba(59,130,246,0.4)]">
              AI/APP Innovation
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]">
            Experience the cutting-edge capabilities of Star AI Lab through our  
            <span className="text-blue-300 font-medium"> exclusive demonstration</span>
          </p>
        </div>

        </div>

        {/* Featured Main Video */}
        <div 
          data-animate="main-video"
          className={`mb-20 transition-all duration-1000 ease-out ${
            isVisible('main-video') 
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
                  poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 675'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23000000'/%3E%3Cstop offset='50%25' style='stop-color:%231e3a8a'/%3E%3Cstop offset='100%25' style='stop-color:%230066ff'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23bg)'/%3E%3Ctext x='50%25' y='45%25' font-family='Inter, sans-serif' font-size='48' font-weight='bold' fill='white' text-anchor='middle'%3EStar AI Lab%3C/text%3E%3Ctext x='50%25' y='65%25' font-family='Inter, sans-serif' font-size='24' fill='%2393c5fd' text-anchor='middle'%3EMain Demo%3C/text%3E%3C/svg%3E"
                >
                  <source src="/src/img/LOGO amimation.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-xl font-bold text-white mb-2 ">
                  Complete AI Platform Overview
                </h3>
                <p className="text-blue-200/80 text-sm">
                  A comprehensive look at our AI platform and its capabilities
                </p>
              </div>
            </div>
          </div>
        </div>

        

        {/* Enhanced Info Section with Professional Shadows */}
        <div className="text-center mt-16">
          <div className="max-w-3xl mx-auto bg-gradient-to-r from-slate-900/50 via-blue-950/30 to-slate-900/50 backdrop-blur-xl p-8 rounded-2xl border border-blue-500/20 shadow-[0_20px_40px_rgba(0,0,0,0.6),0_10px_20px_rgba(30,58,138,0.2),0_5px_10px_rgba(59,130,246,0.1),inset_0_1px_0_rgba(255,255,255,0.05)]">
            <p className="text-lg text-gray-300 leading-relaxed mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
              This exclusive demonstration showcases our latest AI innovations and real-world applications.
            </p>
            <p className="text-sm text-blue-300 font-medium drop-shadow-[0_2px_4px_rgba(59,130,246,0.4)]">
              Powered by cutting-edge artificial intelligence technology
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WatchDemo;














