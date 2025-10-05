

import React, { useState } from 'react';
import { 
  RotateCcw, 
  Copy, 
  Check, 
  Star,
  Sparkles, 
  Zap, 
  Brain, 
  ChevronDown,
  Sliders
} from 'lucide-react';
import { MOCK_DEMO_CONTENT, ContentMetrics } from '../mock';

interface AIModel {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  features: string[];
  color: string;
}

const AI_MODELS: AIModel[] = [
  {
    id: 'gpt4',
    name: 'GPT-4 Turbo',
    icon: <Sparkles className="w-5 h-5" />,
    description: 'Most advanced model with superior understanding and creativity',
    features: ['Advanced reasoning', 'Complex task handling', 'Nuanced writing'],
    color: 'bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600'
  },
  {
    id: 'claude3',
    name: 'Claude-3',
    icon: <Brain className="w-5 h-5" />,
    description: 'Specialized in analytical and academic content',
    features: ['Research synthesis', 'Technical writing', 'Data analysis'],
    color: 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700'
  },
  {
    id: 'gemini',
    name: 'Gemini Pro',
    icon: <Zap className="w-5 h-5" />,
    description: 'Balanced performance with fast generation',
    features: ['Fast processing', 'Balanced output', 'Multilingual support'],
    color: 'bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-600'
  }
];

const CONTENT_TYPES = [
  { id: 'blog', label: 'Blog Post' },
  { id: 'email', label: 'Email' },
  { id: 'social', label: 'Social Media' },
  { id: 'marketing', label: 'Marketing Copy' },
  { id: 'product', label: 'Product Description' }
];

const TONES = [
  { id: 'professional', label: 'Professional' },
  { id: 'casual', label: 'Casual' },
  { id: 'friendly', label: 'Friendly' },
  { id: 'authoritative', label: 'Authoritative' },
  { id: 'persuasive', label: 'Persuasive' }
];

const Ai_Demo = () => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showOutput, setShowOutput] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [currentPrompt, setCurrentPrompt] = useState<string>(MOCK_DEMO_CONTENT.inputPrompt);
  const [outputContent, setOutputContent] = useState<string>(MOCK_DEMO_CONTENT.outputContent);
  const [contentMetrics, setContentMetrics] = useState<ContentMetrics>(MOCK_DEMO_CONTENT.metrics);

  const [contentType, setContentType] = useState(CONTENT_TYPES[0]);
  const [tone, setTone] = useState(TONES[0]);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [wordCount, setWordCount] = useState<number>(200);
  const [temperature, setTemperature] = useState<number>(0.7);

  // Add selectedModel state to fix missing variable errors
  const [selectedModel, setSelectedModel] = useState<AIModel>(AI_MODELS[0]);

  const handleGenerate = async (): Promise<void> => {
    setIsGenerating(true);
    setShowOutput(false);

    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${BACKEND_URL}/api/generate-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: currentPrompt,
          model: selectedModel.id,
          contentType: contentType.id,
          tone: tone.id,
          wordCount,
          temperature
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Update state with real response
        setOutputContent(data.content);
        setContentMetrics(data.metrics);
      }
    } catch (error) {
      console.error('Content generation failed:', error);
      // Fall back to mock data if API fails
    }

    setIsGenerating(false);
    setShowOutput(true);
  };

  const handleCopy = (): void => {
    navigator.clipboard.writeText(outputContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = (): void => {
    setShowOutput(false);
    setCurrentPrompt(MOCK_DEMO_CONTENT.inputPrompt);
    setSelectedModel(AI_MODELS[0]);
    setContentType(CONTENT_TYPES[0]);
    setTone(TONES[0]);
    setWordCount(200);
    setTemperature(0.7);
  };

  return (
    <section id="demo" className="py-24 bg-premium-deep relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0">
        {/* Animated Background Orbs */}
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-cyan-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/3 to-cyan-400/3 rounded-full blur-3xl animate-spin-slow"></div>
        
        {/* Premium Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6IiBmaWxsPSIjMkE0MzdBIiBmaWxsLW9wYWNpdHk9Ii4wNSIvPjxwYXRoIGQ9Ik0wIDMwaDMwdjMwSDB6IiBmaWxsPSIjMkE0MzdBIiBmaWxsLW9wYWNpdHk9Ii4wNSIvPjxwYXRoIGQ9Ik0zMCAwaDMwdjMwSDMweiIgZmlsbD0iIzJBNDM3QSIgZmlsbC1vcGFjaXR5PSIuMDUiLz48cGF0aCBkPSJNMCAwaDMwdjMwSDB6IiBmaWxsPSIjMkE0MzdBIiBmaWxsLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-40"></div>
        
        {/* Premium Glow Effects */}
        <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-blue-500/10 via-cyan-500/5 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-blue-500/10 via-cyan-500/5 to-transparent"></div>
      </div>

      <div className="container relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-black/90 via-slate-900/80 to-black/90 border border-blue-500/40 rounded-full text-blue-300 text-sm font-semibold mb-8 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.8),0_8px_16px_rgba(59,130,246,0.3),0_4px_8px_rgba(6,182,212,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]">
            <Star className="h-5 w-5 mr-3 text-cyan-400" />
            Premium AI Content Generation
            <Zap className="h-5 w-5 ml-3 text-blue-400" />
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]">
            Experience
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 mt-2 drop-shadow-[0_4px_8px_rgba(59,130,246,0.4)]">
              AI Content Magic
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]">
            Experience the power of advanced AI models generating  
            <span className="text-blue-300 font-medium"> high-quality content in real-time</span>
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Settings Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Content Settings */}
              <div className="glass-premium p-6 rounded-2xl border border-cyan-500/20 backdrop-blur-xl hover:border-cyan-400/30 transition-all duration-300">
                <h3 className="text-lg font-semibold mb-4 text-cyan-300">Content Settings</h3>

                {/* Content Type */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-cyan-300/90 mb-2">
                    Content Type
                  </label>
                  <select
                    value={contentType.id}
                    onChange={(e) => setContentType(CONTENT_TYPES.find(t => t.id === e.target.value) || CONTENT_TYPES[0])}
                    className="w-full p-2.5 rounded-lg bg-gray-900/50 border border-cyan-500/20 text-cyan-100 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all duration-300"
                  >
                    {CONTENT_TYPES.map(type => (
                      <option key={type.id} value={type.id}>{type.label}</option>
                    ))}
                  </select>
                </div>

                {/* Tone */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-cyan-300/90 mb-2">
                    Tone
                  </label>
                  <select
                    value={tone.id}
                    onChange={(e) => setTone(TONES.find(t => t.id === e.target.value) || TONES[0])}
                    className="w-full p-2.5 rounded-lg bg-gray-900/50 border border-cyan-500/20 text-cyan-100 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all duration-300"
                  >
                    {TONES.map(t => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </div>

                {/* Advanced Settings */}
                <div className="space-y-4">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-sm text-cyan-300 hover:text-cyan-400"
                  >
                    <Sliders className="w-4 h-4" />
                    Advanced Settings
                    <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                  </button>
                  {showAdvanced && (
                    <div className="pt-2 space-y-4">
                      {/* Word Count */}
                      <div>
                        <label className="block text-sm font-medium text-cyan-300/90 mb-2">
                          Word Count: {wordCount}
                        </label>
                        <input
                          type="range"
                          min="100"
                          max="1000"
                          step="50"
                          value={wordCount}
                          onChange={(e) => setWordCount(parseInt(e.target.value))}
                          className="w-full h-2 bg-cyan-900/50 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                        />
                      </div>

                      {/* Temperature */}
                      <div>
                        <label className="block text-sm font-medium text-cyan-300/90 mb-2">
                          Creativity: {temperature.toFixed(1)}
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={temperature}
                          onChange={(e) => setTemperature(parseFloat(e.target.value))}
                          className="w-full h-2 bg-cyan-900/50 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Input/Output Section */}
            <div className="lg:col-span-3 space-y-6">
              {/* Input Section */}
              <div className="glass-premium p-6 rounded-2xl border border-violet-500/20 backdrop-blur-xl hover:border-violet-400/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"></div>
                    <span className="text-sm font-medium text-violet-300 tracking-wider">PROMPT</span>
                  </div>
                  <button onClick={handleReset} className="text-violet-400 hover:text-violet-300 transition-colors">
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                <textarea
                  value={currentPrompt}
                  onChange={(e) => setCurrentPrompt(e.target.value)}
                  className="w-full h-32 p-4 rounded-xl bg-gray-900/50 border border-violet-500/20 text-violet-100 resize-none focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400/50 placeholder-violet-300/30 transition-all duration-300"
                  placeholder="Describe what content you want to create..."
                />

                <div className="mt-4">
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-white font-medium transition-all bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 hover:opacity-90 disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></div>
                        Generating Content...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generate Content
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Output Section */}
              <div className="glass-premium p-6 rounded-2xl border border-purple-500/20 backdrop-blur-xl hover:border-purple-400/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${showOutput ? 'bg-purple-400 animate-pulse' : 'bg-gray-600'}`}></div>
                    <span className="text-sm font-medium text-purple-300 tracking-wider">GENERATED CONTENT</span>
                  </div>
                  {showOutput && (
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm text-purple-400 hover:text-purple-300 rounded-lg hover:bg-purple-500/10 transition-all duration-300"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  )}
                </div>

                <div className="min-h-[300px] p-4 rounded-xl bg-gray-900/50 border border-purple-500/20">
                  {isGenerating && (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center space-y-4">
                        <div className="relative w-16 h-16 mx-auto">
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
                          <div className="absolute inset-1 rounded-lg bg-white flex items-center justify-center">
                            {selectedModel.icon}
                          </div>
                        </div>
                        <div className="animate-pulse space-y-3">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                        </div>
                        <p className="text-sm text-gray-500">Generating content with {selectedModel.name}...</p>
                      </div>
                    </div>
                  )}

                  {showOutput && (
                    <div className="prose prose-sm max-w-none">
                      {outputContent}
                    </div>
                  )}

                  {!isGenerating && !showOutput && (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <p className="text-sm">Your generated content will appear here</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Metrics */}
              {showOutput && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="glass-premium p-4 rounded-xl border border-blue-500/20 backdrop-blur-xl hover:border-blue-400/30 transition-all duration-300 group">
                    <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:from-blue-300 group-hover:to-cyan-300">{contentMetrics.wordsGenerated}</div>
                    <div className="text-sm text-blue-300/70 group-hover:text-blue-300/90">Words</div>
                  </div>
                  <div className="glass-premium p-4 rounded-xl border border-purple-500/20 backdrop-blur-xl hover:border-purple-400/30 transition-all duration-300 group">
                    <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 group-hover:from-purple-300 group-hover:to-pink-300">{contentMetrics.timeToGenerate}s</div>
                    <div className="text-sm text-purple-300/70 group-hover:text-purple-300/90">Generation Time</div>
                  </div>
                  <div className="glass-premium p-4 rounded-xl border border-cyan-500/20 backdrop-blur-xl hover:border-cyan-400/30 transition-all duration-300 group">
                    <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400 group-hover:from-cyan-300 group-hover:to-teal-300">{contentMetrics.seoScore}%</div>
                    <div className="text-sm text-cyan-300/70 group-hover:text-cyan-300/90">SEO Score</div>
                  </div>
                  <div className="glass-premium p-4 rounded-xl border border-violet-500/20 backdrop-blur-xl hover:border-violet-400/30 transition-all duration-300 group">
                    <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400 group-hover:from-violet-300 group-hover:to-indigo-300">{contentMetrics.readabilityScore}%</div>
                    <div className="text-sm text-violet-300/70 group-hover:text-violet-300/90">Readability</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Ai_Demo };
