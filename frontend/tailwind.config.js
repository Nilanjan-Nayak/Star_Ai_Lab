/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Professional responsive breakpoints
      screens: {
        'xs': '320px',    // Extra small devices (small phones)
        'sm': '640px',    // Small devices (phones)
        'md': '768px',    // Medium devices (tablets)
        'lg': '1024px',   // Large devices (laptops)
        'xl': '1280px',   // Extra large devices (desktops)
        '2xl': '1536px',  // 2X large devices (large desktops)
        '3xl': '1920px',  // Ultra wide screens
        '4xl': '2560px',  // 4K screens
        
        // Custom breakpoints for specific use cases
        'mobile': {'max': '767px'},
        'tablet': {'min': '768px', 'max': '1023px'},
        'laptop': {'min': '1024px', 'max': '1279px'},
        'desktop': {'min': '1280px'},
        
        // Height-based breakpoints for better mobile experience
        'h-sm': {'raw': '(max-height: 640px)'},
        'h-md': {'raw': '(min-height: 641px) and (max-height: 900px)'},
        'h-lg': {'raw': '(min-height: 901px)'},
      },
      
      // Professional spacing scale
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      
      // Enhanced color palette for professional design
      colors: {
        // Premium Black & Blue Theme
        premium: {
          void: '#000000',
          deep: '#0a0a0a',
          rich: '#111111',
          charcoal: '#1a1a1a',
          slate: '#2a2a2a',
          graphite: '#333333',
          
          // Blue variations
          midnight: '#0f1419',
          navy: '#1e3a8a',
          royal: '#0066ff',
          electric: '#00d4ff',
          cyan: '#06b6d4',
          sky: '#3b82f6',
          azure: '#60a5fa',
          ice: '#93c5fd',
        },
        
        // Glass effect colors
        glass: {
          void: 'rgba(0, 0, 0, 0.95)',
          deep: 'rgba(10, 10, 10, 0.9)',
          rich: 'rgba(17, 17, 17, 0.85)',
          blue: 'rgba(0, 102, 255, 0.1)',
          electric: 'rgba(0, 212, 255, 0.1)',
        }
      },
      
      // Professional typography scale
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
        
        // Responsive typography
        'fluid-sm': 'clamp(0.875rem, 2vw, 1rem)',
        'fluid-base': 'clamp(1rem, 2.5vw, 1.125rem)',
        'fluid-lg': 'clamp(1.125rem, 3vw, 1.25rem)',
        'fluid-xl': 'clamp(1.25rem, 3.5vw, 1.5rem)',
        'fluid-2xl': 'clamp(1.5rem, 4vw, 2rem)',
        'fluid-3xl': 'clamp(1.875rem, 5vw, 3rem)',
        'fluid-4xl': 'clamp(2.25rem, 6vw, 4rem)',
        'fluid-5xl': 'clamp(3rem, 8vw, 6rem)',
      },
      
      // Professional shadows
      boxShadow: {
        'premium-sm': '0 2px 4px rgba(0, 102, 255, 0.1)',
        'premium': '0 4px 8px rgba(0, 102, 255, 0.15)',
        'premium-md': '0 8px 16px rgba(0, 102, 255, 0.2)',
        'premium-lg': '0 16px 32px rgba(0, 102, 255, 0.25)',
        'premium-xl': '0 24px 48px rgba(0, 102, 255, 0.3)',
        'premium-2xl': '0 32px 64px rgba(0, 102, 255, 0.35)',
        
        'electric-sm': '0 2px 4px rgba(0, 212, 255, 0.1)',
        'electric': '0 4px 8px rgba(0, 212, 255, 0.15)',
        'electric-md': '0 8px 16px rgba(0, 212, 255, 0.2)',
        'electric-lg': '0 16px 32px rgba(0, 212, 255, 0.25)',
        
        'glass': '0 8px 32px rgba(0, 0, 0, 0.37)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.5)',
      },
      
      // Professional border radius
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        'DEFAULT': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        'full': '9999px',
      },
      
      // Professional animations
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-down': 'fadeInDown 0.6s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'pulse-gentle': 'pulseGentle 2s infinite',
        'gradient-x': 'gradientX 3s ease infinite',
        'gradient-y': 'gradientY 3s ease infinite',
        'gradient-xy': 'gradientXY 3s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      
      // Professional keyframes
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        gradientX: {
          '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' },
          '50%': { 'background-size': '200% 200%', 'background-position': 'right center' },
        },
        gradientY: {
          '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'center top' },
          '50%': { 'background-size': '200% 200%', 'background-position': 'center bottom' },
        },
        gradientXY: {
          '0%, 100%': { 'background-size': '400% 400%', 'background-position': 'left center' },
          '50%': { 'background-size': '400% 400%', 'background-position': 'right center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { 'box-shadow': '0 0 20px rgba(0, 102, 255, 0.5)' },
          '100%': { 'box-shadow': '0 0 30px rgba(0, 212, 255, 0.8)' },
        },
      },
      
      // Professional backdrop blur
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'DEFAULT': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
      
      // Professional aspect ratios
      aspectRatio: {
        'auto': 'auto',
        'square': '1 / 1',
        'video': '16 / 9',
        'portrait': '3 / 4',
        'landscape': '4 / 3',
        'ultrawide': '21 / 9',
        'golden': '1.618 / 1',
      },
      
      // Professional grid configurations
      gridTemplateColumns: {
        'auto-fit-xs': 'repeat(auto-fit, minmax(200px, 1fr))',
        'auto-fit-sm': 'repeat(auto-fit, minmax(250px, 1fr))',
        'auto-fit-md': 'repeat(auto-fit, minmax(300px, 1fr))',
        'auto-fit-lg': 'repeat(auto-fit, minmax(350px, 1fr))',
        'auto-fit-xl': 'repeat(auto-fit, minmax(400px, 1fr))',
      },
    },
  },
  plugins: [
    // Add custom utilities
    function({ addUtilities, theme }) {
      const newUtilities = {
        // Glass morphism utilities
        '.glass-morphism': {
          'background': 'rgba(255, 255, 255, 0.05)',
          'backdrop-filter': 'blur(20px)',
          '-webkit-backdrop-filter': 'blur(20px)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.glass-morphism-dark': {
          'background': 'rgba(0, 0, 0, 0.4)',
          'backdrop-filter': 'blur(20px)',
          '-webkit-backdrop-filter': 'blur(20px)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
        },
        
        // Professional text gradients
        '.text-gradient-premium': {
          'background': 'linear-gradient(45deg, #0066ff 0%, #00d4ff 50%, #06b6d4 100%)',
          'background-clip': 'text',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
        },
        '.text-gradient-electric': {
          'background': 'linear-gradient(90deg, #00d4ff 0%, #0066ff 50%, #1e3a8a 100%)',
          'background-clip': 'text',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
        },
        
        // Professional hover effects
        '.hover-lift': {
          'transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            'transform': 'translateY(-4px)',
            'box-shadow': '0 20px 40px rgba(0, 102, 255, 0.3)',
          },
        },
        '.hover-glow': {
          'transition': 'all 0.3s ease',
          '&:hover': {
            'box-shadow': '0 0 30px rgba(0, 212, 255, 0.6)',
          },
        },
        
        // Professional scrollbar
        '.scrollbar-premium': {
          '&::-webkit-scrollbar': {
            'width': '8px',
          },
          '&::-webkit-scrollbar-track': {
            'background': 'rgba(0, 0, 0, 0.1)',
            'border-radius': '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            'background': 'linear-gradient(45deg, #0066ff, #00d4ff)',
            'border-radius': '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            'background': 'linear-gradient(45deg, #00d4ff, #06b6d4)',
          },
        },
      }
      
      addUtilities(newUtilities)
    }
  ],
};
