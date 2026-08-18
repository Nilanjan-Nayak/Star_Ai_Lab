import { Target, Lightbulb, Users, Award, Rocket, Shield } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useContent } from '../context/ContentContext';

const About = () => {
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

  const values = [
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: "Innovation First",
      description: "We push the boundaries of what's possible with AI and emerging technologies."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Collaborative Approach",
      description: "Our diverse team brings together expertise from various domains to create comprehensive solutions."
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Excellence Driven",
      description: "We maintain the highest standards in every project, ensuring quality and reliability."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Ethical AI",
      description: "We develop AI solutions with responsibility, transparency, and ethical considerations at their core."
    }
  ];

  const defaultStats = [
    { number: "1+", label: "Years Experience" },
    { number: "1+", label: "AI Models Trained" },
    { number: "0+", label: "Industry Partners" },
    { number: "2+", label: "Data Points Processed" }
  ];

  const stats = getContent('about', 'stats', defaultStats);

  return (
    <section ref={sectionRef} id="about" className="py-20 bg-premium-deep relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-cyan-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/3 to-cyan-400/3 rounded-full blur-3xl animate-spin-slow"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div 
          data-animate="header"
          className={`text-center mb-16 transition-all duration-1000 ease-out ${
            isVisible('header') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center px-6 py-3 bg-premium-glass border border-premium-blue rounded-full text-blue-300 text-sm font-medium mb-6 backdrop-blur-lg  transition-colors duration-300">
            <Target className="h-4 w-4 mr-2     " />
            {getContent('about', 'title', 'About Star AI Labs')}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Pioneering the Future of
            <span className="text-premium-gradient block md:inline-block pb-2 pt-1"> Artificial Intelligence</span>
          </h2>
          <p className="text-xl text-blue-200/90 max-w-3xl mx-auto leading-relaxed">
            {getContent('about', 'subtitle', 'Founded with a vision to democratize AI technology, Star AI Labs is at the forefront of developing intelligent solutions that transform industries and improve lives.')}
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
          <div 
            data-animate="mission"
            className={`relative bg-premium-glass backdrop-blur-xl border border-blue-500/20 p-8 md:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_40px_rgba(34,211,238,0.15)] hover:border-cyan-500/40 transition-all duration-500 group overflow-hidden ${
              isVisible('mission') 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 -translate-x-8'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex items-start mb-6">
              <div className="flex-shrink-0 p-3.5 bg-blue-500/10 border border-blue-500/30 rounded-2xl mr-5 group-hover:border-cyan-400/50 group-hover:bg-cyan-400/10 transition-colors duration-500">
                <Rocket className="h-7 w-7 text-cyan-400" />
              </div>
              <div className="pt-1">
                <h3 className="text-2xl font-bold text-white tracking-wide group-hover:text-cyan-300 transition-colors duration-300">Our Mission</h3>
                <div className="h-1 w-12 bg-cyan-500/50 rounded-full mt-2 group-hover:w-20 transition-all duration-500"></div>
              </div>
            </div>
            <p className="relative z-10 text-blue-100/70 text-[1.05rem] leading-relaxed group-hover:text-blue-100/90 transition-colors duration-300">
              This is my developed Full Stack platform, designed to provide users with a complete 
              collection of Artificial Intelligence-based shortcut solutions. The platform offers a user-friendly interface 
              and a well-structured website divided into different sections, allowing users to access AI-powered features easily and efficiently
              even without direct technical expertise.
            </p>
          </div>

          <div 
            data-animate="vision"
            className={`relative bg-premium-glass backdrop-blur-xl border border-blue-500/20 p-8 md:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_40px_rgba(59,130,246,0.15)] hover:border-blue-500/40 transition-all duration-500 group overflow-hidden ${
              isVisible('vision') 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 translate-x-8'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex items-start mb-6">
              <div className="flex-shrink-0 p-3.5 bg-blue-500/10 border border-blue-500/30 rounded-2xl mr-5 group-hover:border-blue-400/50 group-hover:bg-blue-400/10 transition-colors duration-500">
                <Target className="h-7 w-7 text-blue-400" />
              </div>
              <div className="pt-1">
                <h3 className="text-2xl font-bold text-white tracking-wide group-hover:text-blue-300 transition-colors duration-300">Our Vision</h3>
                <div className="h-1 w-12 bg-blue-500/50 rounded-full mt-2 group-hover:w-20 transition-all duration-500"></div>
              </div>
            </div>
            <p className="relative z-10 text-blue-100/70 text-[1.05rem] leading-relaxed group-hover:text-blue-100/90 transition-colors duration-300">
              To be the leading catalyst in the AI revolution, creating a world where intelligent technology enhances human potential and drives sustainable progress. We envision a future where AI seamlessly integrates into daily life, making it more efficient, creative, and meaningful.
            </p>
          </div>
        </div>

        {/* Values */}
        <div 
          data-animate="values-header"
          className={`mb-20 transition-all duration-1000 ease-out ${
            isVisible('values-header') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <h3 className="text-3xl font-bold text-center text-white mb-12">Our Core Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                data-animate={`value-${index}`}
                className={`text-center group transition-all duration-700 ease-out ${
                  isVisible(`value-${index}`) 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-black/60 to-black/20 border border-white/10 text-blue-400 rounded-2xl mb-6 shadow-xl group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] group-hover:border-blue-500/50 group-hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  {value.icon}
                </div>
                <h4 className="text-xl font-bold text-white tracking-tight mb-3 group-hover:text-blue-300 transition-colors duration-300">{value.title}</h4>
                <p className="text-blue-100/60 leading-relaxed group-hover:text-blue-100/90 transition-colors duration-300">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div 
          data-animate="stats"
          className={`relative bg-gradient-to-br from-[#0a0f1c]/90 to-[#02040a]/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-16 text-center shadow-2xl hover:shadow-[0_0_40px_rgba(34,211,238,0.1)] hover:border-cyan-500/20 transition-all duration-700 overflow-hidden ${
            isVisible('stats') 
              ? 'opacity-100 scale-100' 
              : 'opacity-0 scale-95'
          }`}
        >
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <h3 className="text-3xl font-bold text-white mb-12">Our Impact by Numbers</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat: { number: string; label: string }, index: number) => (
              <div 
                key={index} 
                className="text-center group"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className={`text-4xl md:text-5xl font-bold text-premium-gradient mb-2 group-hover:scale-110 transition-all duration-500 ${
                  isVisible('stats') ? 'animate-count-up' : ''
                }`}>
                  {stat.number}
                </div>
                <div className="text-blue-200 font-medium group-hover:text-cyan-300 transition-colors duration-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Introduction */}
        <div 
          data-animate="team"
          className={`mt-20 text-center transition-all duration-1000 ease-out ${
            isVisible('team') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <h3 className="text-3xl font-bold text-white mb-6">Expert Team</h3>
          <p className="text-lg text-blue-200/90 max-w-4xl mx-auto leading-relaxed">
            Our multidisciplinary team combines decades of experience in artificial intelligence, machine learning, software engineering, and domain expertise. We're passionate about pushing the boundaries of what's possible and committed to delivering solutions that make a real difference.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;