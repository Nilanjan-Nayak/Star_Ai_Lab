import { useState, useEffect } from 'react';
import { Clock, Sparkles } from 'lucide-react';
import cornerLogoImg from '../img/_Pngtree_n_circle_letter_initial_logo_4835121-removebg-preview.png';
import StarAiTeamModal from './StarAiTeamModal.tsx';

const ComingSoon = () => {
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Set launch date (30 days from now)
  const launchDate = new Date();
  launchDate.setDate(launchDate.getDate() + 30);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [launchDate]);

  

  const starAnimationStyles = `
    /* Hide scrollbar */
    ::-webkit-scrollbar {
      display: none;
    }
    * {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    @keyframes twinkle {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.2); }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.4; }
      25% { transform: translateY(-10px) translateX(5px); opacity: 0.8; }
      50% { transform: translateY(-5px) translateX(-3px); opacity: 1; }
      75% { transform: translateY(-15px) translateX(8px); opacity: 0.6; }
    }

    @keyframes nebula {
      0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.05; }
      50% { transform: scale(1.1) rotate(180deg); opacity: 0.08; }
    }

    @keyframes backgroundShift {
      0%, 100% { transform: translate(0, 0) scale(1); }
      25% { transform: translate(10px, -10px) scale(1.05); }
      50% { transform: translate(-5px, 15px) scale(0.95); }
      75% { transform: translate(15px, 5px) scale(1.02); }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes glow {
      0%, 100% {
        opacity: 0.5;
        box-shadow: 0 0 5px rgba(255, 255, 255, 0.3), 0 0 10px rgba(255, 255, 255, 0.1);
      }
      50% {
        opacity: 1;
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.6), 0 0 20px rgba(255, 255, 255, 0.3);
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: starAnimationStyles }} />

      <section className="relative min-h-screen bg-gradient-to-br from-black via-slate-900 to-blue-950 overflow-hidden flex items-center justify-center">
        {/* Background Layers */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-blue-900/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-blue-900/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/30 to-black/60" />

          {/* Nebula effects */}
          <div
            className="absolute top-0 left-0 w-full h-full opacity-5"
            style={{
              background: 'radial-gradient(ellipse at 20% 30%, #1e40af 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, #3b82f6 0%, transparent 50%), radial-gradient(ellipse at 40% 80%, #06b6d4 0%, transparent 50%)',
              animation: 'nebula 20s ease-in-out infinite'
            }}
          />

          {/* Dynamic accent clouds */}
          <div className="absolute top-1/6 left-1/5 w-96 h-96 bg-blue-600/4 rounded-full blur-3xl" style={{animation: 'backgroundShift 15s ease-in-out infinite'}} />
          <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-blue-500/6 rounded-full blur-3xl" style={{animation: 'backgroundShift 18s ease-in-out infinite reverse'}} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-blue-400/3 rounded-full blur-3xl" style={{animation: 'backgroundShift 22s ease-in-out infinite'}} />
        </div>

        {/* Star Field */}
        <div className="absolute inset-0">
          {Array.from({ length: 150 }).map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute bg-white rounded-full"
              style={{
                width: `${0.3 + Math.random() * 0.7}px`,
                height: `${0.3 + Math.random() * 0.7}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: 0.2 + Math.random() * 0.6,
                animation: Math.random() > 0.5 ? `twinkle ${3 + Math.random() * 6}s ease-in-out infinite` : `float ${5 + Math.random() * 8}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 10}s`,
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Logo/Brand */}
          <div className="mb-8">
            <div className="inline-flex items-center px-6 py-3 bg-black/40 border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium backdrop-blur-xl shadow-2xl">
              <Sparkles className="w-4 h-4 mr-2 text-cyan-400" />
              Star AI Labs
            </div>
          </div>

          {/* Main Headline */}
          <div className="space-y-6 mb-12">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Something
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                Amazing
              </span>
              <span className="block text-4xl md:text-5xl lg:text-6xl text-blue-200">
                is Coming Soon
              </span>
            </h1>

            <p className="text-xl text-blue-100/90 leading-relaxed max-w-2xl mx-auto">
              We're working on something extraordinary. Get ready to be amazed by our next big innovation
              that will revolutionize the way you think about AI and technology.
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="mb-12">
            <div className="flex items-center justify-center mb-6">
              <Clock className="w-6 h-6 text-cyan-400 mr-2" />
              <span className="text-blue-200 font-medium">Launch Countdown</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-md mx-auto">
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Minutes', value: timeLeft.minutes },
                { label: 'Seconds', value: timeLeft.seconds }
              ].map((item, index) => (
                <div
                  key={item.label}
                  className="bg-black/40 backdrop-blur-xl border border-blue-500/30 rounded-lg p-4 shadow-2xl"
                  style={{ animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both` }}
                >
                  <div className="text-2xl md:text-3xl font-bold text-cyan-400 mb-1">
                    {item.value.toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm text-blue-200 uppercase tracking-wide">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          

          
        </div>

        {/* Corner Logo / Team Showcase Trigger */}
        <button
          onClick={() => setIsTeamModalOpen(true)}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-black/95 backdrop-blur-xl rounded-full px-5 py-2 pl-2 border-2 border-blue-500/30 shadow-2xl shadow-blue-500/20 transition-all duration-300 cursor-pointer hover:shadow-cyan-400/30 hover:border-cyan-400/60 hover:-translate-y-0.5 active:translate-y-0 group"
          title="Made by Star AI Lab — Click to view Founder & Team"
          aria-label="Made by Star AI Lab — Click to view Founder & Team"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-400/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          <img
            src={cornerLogoImg}
            alt="Star AI Lab Logo"
            className="relative w-10 h-10 rounded-full border-2 border-blue-500/40 object-cover bg-white/10 group-hover:border-cyan-400/70 transition-colors duration-300"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
              if (nextElement) nextElement.style.display = 'flex';
            }}
          />

          <span className="relative text-cyan-300 text-sm font-semibold transition-colors duration-300 group-hover:text-cyan-200">
            Made by Star AI Lab
          </span>
        </button>

        {/* Interactive Star AI Lab Team & Hackathon Squad Modal */}
        <StarAiTeamModal
          isOpen={isTeamModalOpen}
          onClose={() => setIsTeamModalOpen(false)}
        />
      </section>
    </>
  );
};

export default ComingSoon;
