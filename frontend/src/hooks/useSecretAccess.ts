import { useState, useEffect, useCallback } from 'react';

/**
 * Secret access hook — listens for Ctrl+Shift+K pressed 3 times quickly.
 * No URL, no button, completely invisible to public users.
 */
export const useSecretAccess = () => {
  const [isAdminLoginVisible, setIsAdminLoginVisible] = useState(false);
  const [, setKeySequence] = useState<number[]>([]);

  const REQUIRED_PRESSES = 3;
  const TIME_WINDOW = 2000; // 2 seconds to press 3 times

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ctrl+Shift+K
    if (e.ctrlKey && e.shiftKey && e.key === 'K') {
      e.preventDefault();
      const now = Date.now();

      setKeySequence(prev => {
        // Filter out old presses outside the time window
        const recent = [...prev, now].filter(t => now - t < TIME_WINDOW);

        if (recent.length >= REQUIRED_PRESSES) {
          setIsAdminLoginVisible(true);
          return [];
        }

        return recent;
      });
    }

    // Escape to close
    if (e.key === 'Escape' && isAdminLoginVisible) {
      setIsAdminLoginVisible(false);
    }
  }, [isAdminLoginVisible]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const closeAdminLogin = useCallback(() => {
    setIsAdminLoginVisible(false);
  }, []);

  const openAdminLogin = useCallback(() => {
    setIsAdminLoginVisible(true);
  }, []);

  return {
    isAdminLoginVisible,
    closeAdminLogin,
    openAdminLogin
  };
};
