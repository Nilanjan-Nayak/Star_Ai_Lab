import { useState, useEffect, useCallback } from 'react';

interface ScrollTransitionOptions {
  targetElementId?: string;
  threshold?: number;
  debounceMs?: number;
}

export const useScrollTransition = (options: ScrollTransitionOptions = {}) => {
  const {
    targetElementId = 'hero-numeric-element',
    threshold = 0,
    debounceMs = 16 // ~60fps
  } = options;

  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isTargetAtTop, setIsTargetAtTop] = useState(false);

  // Debounced scroll handler for performance
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    setScrollY(currentScrollY);
    
    // Check if we've scrolled past the threshold
    setIsScrolled(currentScrollY > threshold);
    
    // Check if target element has reached the top
    const targetElement = document.getElementById(targetElementId);
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      const isAtTop = rect.top <= 100; // Element is at or near the top
      setIsTargetAtTop(isAtTop);
    }
  }, [targetElementId, threshold]);

  // Debounce function
  const debounce = useCallback((func: () => void, delay: number) => {
    let timeoutId: number;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(func, delay);
    };
  }, []);

  const debouncedHandleScroll = useCallback(
    debounce(handleScroll, debounceMs),
    [handleScroll, debounceMs]
  );

  useEffect(() => {
    // Use requestAnimationFrame for smooth performance
    let ticking = false;
    
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [handleScroll]);

  return {
    isScrolled,
    scrollY,
    isTargetAtTop,
    scrollProgress: Math.min(scrollY / (window.innerHeight || 1), 1)
  };
};