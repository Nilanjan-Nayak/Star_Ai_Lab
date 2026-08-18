const fs = require('fs');
const path = 'd:/Personal/Projects/Personal Project/Star Ai/Star_Ai_Lab/frontend/src/components/Hero.tsx';

let content = fs.readFileSync(path, 'utf8');

// Replace 1: Imports and state
const target1 = `import { ArrowRight, Play, ChevronDown, Code, Cpu, Zap, Brain } from 'lucide-react';

const Hero = () => {
  // Professional star animation styles with directional movements`;

const replacement1 = `import { useState, useEffect } from 'react';
import { ArrowRight, Play, ChevronDown, Code, Cpu, Zap, Brain, Clock, Calendar } from 'lucide-react';

const Hero = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit', second: '2-digit' });
  };
  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Professional star animation styles with directional movements`;

// Replace 2: Badges
const target2 = `              {/* Left Column - Enhanced Content */}
              <div className="space-y-8">
                {/* Premium Badge */}
                <div className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 bg-black/40 border border-blue-500/30 rounded-full text-blue-300 text-xs md:text-sm font-medium backdrop-blur-xl shadow-2xl">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3 animate-pulse" />
                  Nialanjan Nayak
                </div>
                <div className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 bg-black/40 border border-blue-500/30 rounded-full text-blue-300 text-xs md:text-sm font-medium backdrop-blur-xl shadow-2xl">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3 animate-pulse" />
                  Powering the Future of Enterprise Intelligence
                </div>`;

const replacement2 = `              {/* Left Column - Enhanced Content */}
              <div className="space-y-8">
                {/* Premium Badges */}
                <div className="flex flex-wrap gap-4">
                  <div className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 bg-black/40 border border-blue-500/30 rounded-full text-blue-300 text-xs md:text-sm font-medium backdrop-blur-xl shadow-2xl">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3 animate-pulse" />
                    Nialanjan Nayak
                  </div>
                  
                  {/* Digital Clock Badge */}
                  <div className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 bg-black/40 border border-cyan-500/30 rounded-full text-cyan-300 text-xs md:text-sm font-medium backdrop-blur-xl shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                    <Clock className="w-4 h-4 mr-2 text-cyan-400" />
                    <span className="font-mono tracking-wider">{formatTime(currentTime)}</span>
                    <span className="mx-3 border-l border-cyan-500/30 h-4"></span>
                    <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                    <span>{formatDate(currentTime)}</span>
                  </div>
                </div>

                <div className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 bg-black/40 border border-blue-500/30 rounded-full text-blue-300 text-xs md:text-sm font-medium backdrop-blur-xl shadow-2xl">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 animate-pulse" />
                  Powering the Future of Enterprise Intelligence
                </div>`;

if (content.includes(target1) && content.includes(target2)) {
  content = content.replace(target1, replacement1);
  content = content.replace(target2, replacement2);
  fs.writeFileSync(path, content, 'utf8');
  console.log('Success');
} else {
  console.log('Targets not found');
  if (!content.includes(target1)) console.log('Target 1 missing');
  if (!content.includes(target2)) console.log('Target 2 missing');
}
