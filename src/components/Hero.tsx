import { ArrowRight, Play, ChevronDown, Code, Cpu, Zap, Brain } from 'lucide-react';

const Hero = () => {
  // Professional star animation styles with directional movements
  const starAnimationStyles = `
    @keyframes twinkle {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.2); }
    }
    
    @keyframes sparkle {
      0%, 100% { opacity: 0.2; transform: scale(0.8) rotate(0deg); }
      25% { opacity: 0.8; transform: scale(1.1) rotate(90deg); }
      50% { opacity: 1; transform: scale(1.3) rotate(180deg); }
      75% { opacity: 0.6; transform: scale(1) rotate(270deg); }
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.4; }
      25% { transform: translateY(-10px) translateX(5px); opacity: 0.8; }
      50% { transform: translateY(-5px) translateX(-3px); opacity: 1; }
      75% { transform: translateY(-15px) translateX(8px); opacity: 0.6; }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 0.2; box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.3); }
      50% { opacity: 0.8; box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.1); }
    }
    
    @keyframes drift {
      0% { transform: translateX(-10px) translateY(0px); opacity: 0.3; }
      25% { transform: translateX(5px) translateY(-8px); opacity: 0.7; }
      50% { transform: translateX(15px) translateY(-3px); opacity: 1; }
      75% { transform: translateX(8px) translateY(-12px); opacity: 0.5; }
      100% { transform: translateX(-10px) translateY(0px); opacity: 0.3; }
    }
    
    @keyframes shimmer {
      0%, 100% { opacity: 0.4; filter: brightness(1); }
      50% { opacity: 1; filter: brightness(1.5); }
    }
    
    @keyframes topToRight {
      0% { transform: translateX(-20px) translateY(-20px); opacity: 0; }
      5% { opacity: 1; }
      95% { opacity: 1; }
      100% { transform: translateX(100vw) translateY(50vh); opacity: 0; }
    }
    
    @keyframes topToBottom {
      0% { transform: translateX(0px) translateY(-20px); opacity: 0; }
      5% { opacity: 1; }
      95% { opacity: 1; }
      100% { transform: translateX(20px) translateY(100vh); opacity: 0; }
    }
    
    @keyframes leftToRight {
      0% { transform: translateX(-20px) translateY(0px); opacity: 0; }
      5% { opacity: 1; }
      95% { opacity: 1; }
      100% { transform: translateX(100vw) translateY(-30px); opacity: 0; }
    }
    
    @keyframes diagonalFlow {
      0% { transform: translateX(-50px) translateY(-50px); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translateX(100vw) translateY(100vh); opacity: 0; }
    }
    
    @keyframes cornerToCorner {
      0% { transform: translateX(0px) translateY(0px); opacity: 0; }
      5% { opacity: 1; }
      95% { opacity: 1; }
      100% { transform: translateX(100vw) translateY(100vh); opacity: 0; }
    }
    
    @keyframes zigzag {
      0% { transform: translateX(-20px) translateY(0px); opacity: 0; }
      10% { opacity: 1; transform: translateX(10vw) translateY(-20px); }
      30% { transform: translateX(30vw) translateY(20px); }
      50% { transform: translateX(50vw) translateY(-10px); }
      70% { transform: translateX(70vw) translateY(30px); }
      90% { opacity: 1; transform: translateX(90vw) translateY(-20px); }
      100% { transform: translateX(100vw) translateY(0px); opacity: 0; }
    }
    
    @keyframes rightToLeft {
      0% { transform: translateX(100vw) translateY(0px); opacity: 0; }
      5% { opacity: 1; }
      95% { opacity: 1; }
      100% { transform: translateX(-20px) translateY(-30px); opacity: 0; }
    }
    
    @keyframes bottomToTop {
      0% { transform: translateX(0px) translateY(100vh); opacity: 0; }
      5% { opacity: 1; }
      95% { opacity: 1; }
      100% { transform: translateX(-20px) translateY(-20px); opacity: 0; }
    }
    
    @keyframes spiral {
      0% { transform: translateX(50vw) translateY(50vh) rotate(0deg) translateX(0px); opacity: 0; }
      10% { opacity: 1; }
      25% { transform: translateX(50vw) translateY(50vh) rotate(90deg) translateX(100px); }
      50% { transform: translateX(50vw) translateY(50vh) rotate(180deg) translateX(150px); }
      75% { transform: translateX(50vw) translateY(50vh) rotate(270deg) translateX(200px); }
      90% { opacity: 1; }
      100% { transform: translateX(50vw) translateY(50vh) rotate(360deg) translateX(300px); opacity: 0; }
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
  `;

  const scrollToProjects = () => {
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Code snippets for animation
  const codeSnippets = [
    "import { AI } from 'star-ai-labs';",
    "const model = new NeuralNetwork({",
    "  layers: [128, 64, 32],",
    "  activation: 'relu',",
    "  optimizer: 'adam'",
    "});",
    "",
    "model.train(dataset).then(() => {",
    "  console.log('Model trained!');",
    "  predict(newData);",
    "});",
    "",
    "// Real-time predictions",
    "const results = await model.predict({",
    "  accuracy: I will try my best,",
    "  confidence: 100.95",
    "});"
  ];

  return (
    <>
      {/* Inject CSS animations */}
      <style dangerouslySetInnerHTML={{ __html: starAnimationStyles }} />
      
      <section id="home" className="relative min-h-screen bg-gradient-to-br from-black via-slate-900 to-blue-950 overflow-hidden">
        {/* Professional Background Layers */}
        <div className="absolute inset-0">
          {/* Deep space gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-blue-900/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-blue-900/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/30 to-black/60" />
          
          {/* Premium nebula effects */}
          <div 
            className="absolute top-0 left-0 w-full h-full opacity-5"
            style={{
              background: 'radial-gradient(ellipse at 20% 30%, #1e40af 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, #3b82f6 0%, transparent 50%), radial-gradient(ellipse at 40% 80%, #06b6d4 0%, transparent 50%)',
              animation: 'nebula 20s ease-in-out infinite'
            }}
          />
          
          {/* Dynamic blue accent clouds */}
          <div className="absolute top-1/6 left-1/5 w-96 h-96 bg-blue-600/4 rounded-full blur-3xl" style={{animation: 'backgroundShift 15s ease-in-out infinite'}} />
          <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-blue-500/6 rounded-full blur-3xl" style={{animation: 'backgroundShift 18s ease-in-out infinite reverse'}} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-blue-400/3 rounded-full blur-3xl" style={{animation: 'backgroundShift 22s ease-in-out infinite'}} />
          <div className="absolute top-3/4 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl" style={{animation: 'backgroundShift 12s ease-in-out infinite reverse'}} />
          <div className="absolute top-1/8 right-1/3 w-72 h-72 bg-blue-700/4 rounded-full blur-3xl" style={{animation: 'backgroundShift 16s ease-in-out infinite'}} />
          <div className="absolute bottom-1/6 left-1/3 w-56 h-56 bg-indigo-500/5 rounded-full blur-2xl" style={{animation: 'backgroundShift 14s ease-in-out infinite reverse'}} />
        </div>

        {/* Professional Enhanced Star Field with Directional Animations */}
        <div className="absolute inset-0">
          {/* Top Corner to Right Corner Stars */}
          {Array.from({ length: 25 }).map((_, i) => (
            <div
              key={`top-to-right-${i}`}
              className="absolute bg-white rounded-full"
              style={{
                width: `${0.5 + Math.random() * 0.8}px`,
                height: `${0.5 + Math.random() * 0.8}px`,
                left: `${Math.random() * 20}%`,
                top: `${Math.random() * 20}%`,
                opacity: 0.4 + Math.random() * 0.6,
                animation: `topToRight ${8 + Math.random() * 12}s linear infinite`,
                animationDelay: `${Math.random() * 20}s`,
                boxShadow: '0 0 2px rgba(255, 255, 255, 0.5)',
              }}
            />
          ))}
          
          {/* Top to Bottom Stars */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={`top-to-bottom-${i}`}
              className="absolute bg-white rounded-full"
              style={{
                width: `${0.4 + Math.random() * 0.6}px`,
                height: `${0.4 + Math.random() * 0.6}px`,
                left: `${Math.random() * 100}%`,
                top: `0%`,
                opacity: 0.3 + Math.random() * 0.5,
                animation: `topToBottom ${6 + Math.random() * 10}s linear infinite`,
                animationDelay: `${Math.random() * 15}s`,
                boxShadow: '0 0 1px rgba(255, 255, 255, 0.4)',
              }}
            />
          ))}
          
          {/* Left to Right Stars */}
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={`left-to-right-${i}`}
              className="absolute bg-white rounded-full"
              style={{
                width: `${0.3 + Math.random() * 0.7}px`,
                height: `${0.3 + Math.random() * 0.7}px`,
                left: `0%`,
                top: `${Math.random() * 100}%`,
                opacity: 0.4 + Math.random() * 0.6,
                animation: `leftToRight ${7 + Math.random() * 8}s linear infinite`,
                animationDelay: `${Math.random() * 18}s`,
                boxShadow: '0 0 2px rgba(255, 255, 255, 0.3)',
              }}
            />
          ))}
          
          {/* Diagonal Flow Stars */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={`diagonal-flow-${i}`}
              className="absolute bg-white rounded-full"
              style={{
                width: `${0.6 + Math.random() * 0.9}px`,
                height: `${0.6 + Math.random() * 0.9}px`,
                left: `${Math.random() * 10}%`,
                top: `${Math.random() * 10}%`,
                opacity: 0.5 + Math.random() * 0.5,
                animation: `diagonalFlow ${10 + Math.random() * 15}s linear infinite`,
                animationDelay: `${Math.random() * 25}s`,
                boxShadow: '0 0 3px rgba(255, 255, 255, 0.6)',
              }}
            />
          ))}
          
          {/* Corner to Corner Stars */}
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={`corner-to-corner-${i}`}
              className="absolute bg-white rounded-full"
              style={{
                width: `${0.7 + Math.random() * 1}px`,
                height: `${0.7 + Math.random() * 1}px`,
                left: `${Math.random() * 5}%`,
                top: `${Math.random() * 5}%`,
                opacity: 0.6 + Math.random() * 0.4,
                animation: `cornerToCorner ${12 + Math.random() * 18}s linear infinite`,
                animationDelay: `${Math.random() * 30}s`,
                boxShadow: '0 0 4px rgba(255, 255, 255, 0.7)',
              }}
            />
          ))}
          
          {/* Zigzag Pattern Stars */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={`zigzag-${i}`}
              className="absolute bg-white rounded-full"
              style={{
                width: `${0.5 + Math.random() * 0.8}px`,
                height: `${0.5 + Math.random() * 0.8}px`,
                left: `0%`,
                top: `${20 + Math.random() * 60}%`,
                opacity: 0.5 + Math.random() * 0.5,
                animation: `zigzag ${9 + Math.random() * 12}s linear infinite`,
                animationDelay: `${Math.random() * 20}s`,
                boxShadow: '0 0 2px rgba(255, 255, 255, 0.5)',
              }}
            />
          ))}
          
          {/* Right to Left Stars */}
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={`right-to-left-${i}`}
              className="absolute bg-white rounded-full"
              style={{
                width: `${0.4 + Math.random() * 0.6}px`,
                height: `${0.4 + Math.random() * 0.6}px`,
                left: `100%`,
                top: `${Math.random() * 100}%`,
                opacity: 0.3 + Math.random() * 0.5,
                animation: `rightToLeft ${8 + Math.random() * 10}s linear infinite`,
                animationDelay: `${Math.random() * 16}s`,
                boxShadow: '0 0 1px rgba(255, 255, 255, 0.4)',
              }}
            />
          ))}
          
          {/* Bottom to Top Stars */}
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={`bottom-to-top-${i}`}
              className="absolute bg-white rounded-full"
              style={{
                width: `${0.5 + Math.random() * 0.7}px`,
                height: `${0.5 + Math.random() * 0.7}px`,
                left: `${Math.random() * 100}%`,
                top: `100%`,
                opacity: 0.4 + Math.random() * 0.4,
                animation: `bottomToTop ${7 + Math.random() * 9}s linear infinite`,
                animationDelay: `${Math.random() * 14}s`,
                boxShadow: '0 0 2px rgba(255, 255, 255, 0.4)',
              }}
            />
          ))}
          
          {/* Spiral Stars */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`spiral-${i}`}
              className="absolute bg-white rounded-full"
              style={{
                width: `${0.8 + Math.random() * 1.2}px`,
                height: `${0.8 + Math.random() * 1.2}px`,
                left: `50%`,
                top: `50%`,
                opacity: 0.6 + Math.random() * 0.4,
                animation: `spiral ${15 + Math.random() * 20}s linear infinite`,
                animationDelay: `${Math.random() * 25}s`,
                boxShadow: '0 0 5px rgba(255, 255, 255, 0.8)',
              }}
            />
          ))}
          
          {/* Static Twinkling Stars for Background */}
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={`static-twinkle-${i}`}
              className="absolute bg-white rounded-full"
              style={{
                width: `${0.3 + Math.random() * 0.5}px`,
                height: `${0.3 + Math.random() * 0.5}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: 0.2 + Math.random() * 0.4,
                animation: `twinkle ${3 + Math.random() * 6}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 10}s`,
              }}
            />
          ))}
          
          {/* Floating Stars */}
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={`floating-${i}`}
              className="absolute bg-white rounded-full"
              style={{
                width: `${0.4 + Math.random() * 0.6}px`,
                height: `${0.4 + Math.random() * 0.6}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: 0.3 + Math.random() * 0.4,
                animation: `float ${5 + Math.random() * 8}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 12}s`,
              }}
            />
          ))}
        </div>

        {/* Main Content Container */}
        <div className="relative z-10 flex items-center min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              
              {/* Left Column - Enhanced Content */}
              <div className="space-y-8">
                {/* Premium Badge */}
                <div className="inline-flex items-center px-6 py-3 bg-black/40 border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium backdrop-blur-xl shadow-2xl">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3 animate-pulse" />
                  Nialanjan Nayak
                </div>
                <div className="inline-flex items-center px-6 py-3 bg-black/40 border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium backdrop-blur-xl shadow-2xl">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3 animate-pulse" />
                  Powering the Future of Enterprise Intelligence
                </div>
                

                {/* Main Headline */}
                <div className="space-y-6">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                    Next-Generation
                    <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                      AI Solutions
                    </span>
                  </h1>
                  
                  <p className="text-xl text-blue-100/90 leading-relaxed max-w-2xl">
                    Revolutionize your enterprise with our cutting-edge artificial intelligence platform. 
                    From machine learning to neural networks, we deliver solutions that transform data into 
                    actionable insights and drive unprecedented business growth.
                  </p>
                </div>

                {/* Feature Highlights */}
                <div className="grid grid-cols-2 gap-4 py-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Brain className="h-5 w-5 text-cyan-400" />
                    </div>
                    <span className="text-blue-200 font-medium">Neural Networks</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Cpu className="h-5 w-5 text-cyan-400" />
                    </div>
                    <span className="text-blue-200 font-medium">Edge Computing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Zap className="h-5 w-5 text-cyan-400" />
                    </div>
                    <span className="text-blue-200 font-medium">Real-time Processing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Code className="h-5 w-5 text-cyan-400" />
                    </div>
                    <span className="text-blue-200 font-medium">Custom APIs</span>
                  </div>
                </div>

                {/* Premium CTAs */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={scrollToProjects}
                    className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-semibold rounded-lg hover:from-cyan-400 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-400/30 transform hover:scale-105"
                  >
                    Explore AI Solutions
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                  
                  <button
                    onClick={scrollToContact}
                    className="inline-flex items-center justify-center px-8 py-4 bg-black/30 border-2 border-blue-400/50 text-blue-200 font-semibold rounded-lg hover:bg-blue-400/10 hover:text-white hover:border-blue-300 transition-all duration-300 backdrop-blur-xl"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    See Live Demo
                  </button>
                </div>

              </div>

              {/* Right Column - Premium Code Visualization */}
              <div className="relative lg:h-[600px] flex items-center justify-center">
                <div className="relative w-full max-w-lg">
                  {/* Main Code Terminal */}
                  <div className="bg-black/60 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6 shadow-2xl shadow-blue-500/20">
                    {/* Terminal Header */}
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-blue-500/20">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-blue-300 text-sm font-medium ml-3">star-ai-labs.tsx</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-green-400 text-xs">Live</span>
                      </div>
                    </div>

                    {/* Code Content */}
                    <div className="space-y-1 font-mono text-sm">
                      {codeSnippets.map((line, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3"
                          style={{
                            animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                          }}
                        >
                          <span className="text-blue-400/50 text-xs w-6 text-right">
                            {line ? index + 1 : ''}
                          </span>
                          <span className={`${
                            line.includes('import') || line.includes('const') || line.includes('await') 
                              ? 'text-purple-400' 
                              : line.includes('//') 
                              ? 'text-green-400' 
                              : line.includes('train') || line.includes('predict')
                              ? 'text-cyan-400'
                              : line.includes('{') || line.includes('}')
                              ? 'text-yellow-400'
                              : line.includes('99.7') || line.includes('0.95')
                              ? 'text-green-300'
                              : 'text-blue-200'
                          }`}>
                            {line}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Terminal Cursor */}
                    <div className="flex items-center mt-4">
                      <span className="text-blue-400 text-sm">$</span>
                      <div className="w-2 h-4 bg-cyan-400 ml-2 animate-pulse"></div>
                    </div>
                  </div>

                  {/* Floating AI Metrics */}
                  <div className="absolute -top-8 -right-5 bg-gradient-to-r from-green-500 to-emerald-400 text-white p-3 rounded-lg shadow-lg shadow-green-500/25 animate-bounce" style={{animationDuration: '3s'}}>
                    <div className="text-sm font-semibold">19.7%</div>
                    <div className="text-xs opacity-90">Learning mode</div>
                  </div>
                  
                  <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-blue-500 to-cyan-400 text-white p-3 rounded-lg shadow-lg shadow-blue-500/25 animate-bounce" style={{animationDuration: '3s', animationDelay: '1s'}}>
                    <div className="text-sm font-semibold">2.4ms</div>
                    <div className="text-xs opacity-90">Response</div>
                  </div>

                  <div className="absolute top-1/2 -left-6 bg-gradient-to-r from-purple-500 to-pink-400 text-white p-2 rounded-lg shadow-lg shadow-purple-500/25 animate-bounce" style={{animationDuration: '3s', animationDelay: '2s'}}>
                    <div className="text-xs font-semibold">AI </div>
                  </div>
                  <div className="absolute top-4 -left-4 bg-gradient-to-r from-purple-500 to-pink-400 text-white p-2 rounded-lg shadow-lg shadow-purple-500/25 animate-bounce" style={{animationDuration: '3s', animationDelay: '2s'}}>
                    <div className="text-xs font-semibold">App</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <button 
            onClick={scrollToProjects}
            className="flex flex-col items-center space-y-2 text-blue-200/70 hover:text-cyan-300 transition-colors duration-200 group"
          >
            <span className="text-sm font-medium">Discover More</span>
            <ChevronDown className="h-5 w-5 animate-bounce group-hover:text-cyan-400 transition-colors duration-200" />
          </button>
        </div>

        {/* Premium Background Decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
        
        {/* Corner Logo */}
        <div 
          className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-black/95 backdrop-blur-xl rounded-full px-5 py-2 pl-2 border-2 border-blue-500/30 shadow-2xl shadow-blue-500/20 transition-all duration-300 cursor-pointer hover:shadow-blue-400/30 hover:border-blue-400/50 group"
          title="Made by Star AI Lab"
        >
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-yellow-400/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          
          {/* Logo Image */}
          <img 
            src="/src/img/_Pngtree_n_circle_letter_initial_logo_4835121-removebg-preview.png"
            alt="Star AI Lab Logo" 
            className="relative w-10 h-10 rounded-full border-2 border-blue-500/40 object-cover bg-white/10"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
              if (nextElement) nextElement.style.display = 'flex';
            }}
          />
          
          {/* Logo Text */}
          <span className="relative text-cyan-300 text-sm font-semibold transition-colors duration-300 group-hover:text-cyan-200">
            Made by Star AI Lab
          </span>
        </div>
      </section>
    </>
  );
};

export default Hero;