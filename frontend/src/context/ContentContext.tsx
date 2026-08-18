import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface ContentContextType {
  content: Record<string, Record<string, any>>;
  loading: boolean;
  error: string | null;
  getContent: (section: string, key: string, fallback?: any) => any;
  refreshContent: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType>({} as ContentContextType);

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<Record<string, Record<string, any>>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/api/content`);
      if (response.ok) {
        const data = await response.json();
        setContent(data.content || {});
        setError(null);
      } else {
        console.log('Content API not available, using defaults');
        setError(null); // Don't show error to users
      }
    } catch (err) {
      console.log('Content API connection failed, using defaults');
      setError(null); // Don't show error to users
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  /**
   * Get content value with fallback.
   * Usage: getContent('hero', 'title', 'Default Title')
   */
  const getContent = useCallback((section: string, key: string, fallback?: any) => {
    if (content[section] && content[section][key] !== undefined) {
      return content[section][key];
    }
    return fallback;
  }, [content]);

  const refreshContent = useCallback(async () => {
    setLoading(true);
    await fetchContent();
  }, [fetchContent]);

  return (
    <ContentContext.Provider value={{ content, loading, error, getContent, refreshContent }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => useContext(ContentContext);

export default ContentContext;
