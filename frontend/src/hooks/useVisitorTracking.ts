import { useState, useEffect, useCallback } from 'react';

interface VisitorData {
  email: string;
  username: string;
}

interface VisitorTrackingConfig {
  sessionDuration: number; // in milliseconds
  apiEndpoint: string;
}

const DEFAULT_CONFIG: VisitorTrackingConfig = {
  sessionDuration: 24 * 60 * 60 * 1000, // 24 hours
  apiEndpoint: 'http://localhost:5000/api/visitors/track',
};

export const useVisitorTracking = (config: Partial<VisitorTrackingConfig> = {}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  // Local storage keys
  const VISITOR_DATA_KEY = 'star_ai_lab_visitor_data';
  const LAST_VISIT_KEY = 'star_ai_lab_last_visit';

  // Check if user needs to fill out the form
  const shouldShowPopup = useCallback(() => {
    try {
      const lastVisit = localStorage.getItem(LAST_VISIT_KEY);
      const visitorData = localStorage.getItem(VISITOR_DATA_KEY);
      const sessionKey = `star_ai_lab_session_${Date.now()}`;

      // Always show popup if no visitor data exists
      if (!visitorData) {
        console.log('🆕 New visitor detected - showing popup');
        return true;
      }

      // Always show popup if no last visit recorded
      if (!lastVisit) {
        console.log('🆕 No visit history - showing popup');
        return true;
      }

      // Check for new browser session (incognito, new tab after browser restart)
      const sessionStorage = window.sessionStorage;
      const currentSession = sessionStorage.getItem('star_ai_lab_current_session');
      
      if (!currentSession) {
        // New browser session detected
        console.log('🆕 New browser session detected - showing popup');
        sessionStorage.setItem('star_ai_lab_current_session', sessionKey);
        return true;
      }

      // Check if session has expired (24 hours)
      const lastVisitTime = new Date(lastVisit).getTime();
      const now = new Date().getTime();
      const timeDifference = now - lastVisitTime;

      if (timeDifference > finalConfig.sessionDuration) {
        console.log('⏰ Session expired - showing popup');
        // Clear old session and create new one
        sessionStorage.setItem('star_ai_lab_current_session', sessionKey);
        return true;
      }

      // Check if visitor data is corrupted or incomplete
      try {
        const parsedData = JSON.parse(visitorData);
        if (!parsedData.email || !parsedData.username) {
          console.log('🔧 Incomplete visitor data - showing popup');
          return true;
        }
      } catch (parseError) {
        console.log('🔧 Corrupted visitor data - showing popup');
        return true;
      }

      console.log('✅ Returning visitor within session - skipping popup');
      return false;
    } catch (error) {
      console.error('Error checking visitor session:', error);
      return true; // Show popup on error to be safe
    }
  }, [finalConfig.sessionDuration]);

  // Test API health on initialization
  useEffect(() => {
    const testAPIHealth = async () => {
      try {
        console.log('🩺 Testing API health:', finalConfig.apiEndpoint.replace('/track', '/health'));
        const healthResponse = await fetch(finalConfig.apiEndpoint.replace('/track', '/health'), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (healthResponse.ok) {
          const healthData = await healthResponse.json();
          console.log('✅ API Health check successful:', healthData);
        } else {
          console.warn('⚠️  API Health check returned non-200:', healthResponse.status);
        }
      } catch (healthError) {
        console.error('❌ API Health check failed:', healthError);
      }
    };

    testAPIHealth();
  }, [finalConfig.apiEndpoint]);

  // Initialize visitor tracking on component mount
  useEffect(() => {
    const checkVisitorStatus = () => {
      if (shouldShowPopup()) {
        // Add a small delay to ensure page has loaded
        setTimeout(() => {
          setIsPopupOpen(true);
        }, 1000);
      } else {
        // Update last visit time for existing users
        updateLastVisit();
      }
    };

    checkVisitorStatus();
  }, [shouldShowPopup]);

  // Update last visit timestamp
  const updateLastVisit = () => {
    try {
      localStorage.setItem(LAST_VISIT_KEY, new Date().toISOString());
    } catch (error) {
      console.error('Error updating last visit:', error);
    }
  };

  // Submit visitor data to backend
  const submitVisitorData = useCallback(async (data: VisitorData) => {
    setIsLoading(true);
    setError(null);

    console.log('🚀 Submitting visitor data to:', finalConfig.apiEndpoint);
    console.log('📤 Data being sent:', data);

    try {
      // Test if the endpoint is reachable first
      console.log('🔍 Testing API connectivity...');
      
      const response = await fetch(finalConfig.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        console.log('❌ Response not OK, trying to parse error...');
        let errorData;
        try {
          errorData = await response.json();
          console.log('📋 Error response data:', errorData);
        } catch (parseError) {
          console.log('⚠️  Could not parse error response as JSON');
          const textResponse = await response.text();
          console.log('📄 Raw error response:', textResponse);
          throw new Error(`Server error (${response.status}): ${textResponse || 'Unknown error'}`);
        }
        throw new Error(errorData.message || `Server error (${response.status})`);
      }

      const result = await response.json();
      console.log('📥 Successful response:', result);

      // Store visitor data and update last visit
      localStorage.setItem(VISITOR_DATA_KEY, JSON.stringify({
        ...data,
        submittedAt: new Date().toISOString(),
      }));
      updateLastVisit();

      console.log('✅ Visitor data submitted successfully:', result);
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('❌ Error submitting visitor data:', {
        error: err,
        message: errorMessage,
        endpoint: finalConfig.apiEndpoint,
        data: data
      });
      
      // Enhanced error handling
      if (err instanceof TypeError && err.message.includes('fetch')) {
        console.error('🌐 Network error detected - server may not be running or CORS issue');
        setError('Unable to connect to server. Please check if the server is running.');
      } else {
        setError(errorMessage);
      }
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [finalConfig.apiEndpoint]);

  // Close popup handler
  const closePopup = useCallback(() => {
    setIsPopupOpen(false);
    setError(null);
  }, []);

  // Get stored visitor data
  const getStoredVisitorData = useCallback(() => {
    try {
      const data = localStorage.getItem(VISITOR_DATA_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading stored visitor data:', error);
      return null;
    }
  }, []);

  // Force show popup (for testing or re-registration)
  const forceShowPopup = useCallback(() => {
    setIsPopupOpen(true);
  }, []);

  // Clear visitor data (for testing or logout)
  const clearVisitorData = useCallback(() => {
    try {
      localStorage.removeItem(VISITOR_DATA_KEY);
      localStorage.removeItem(LAST_VISIT_KEY);
      setIsPopupOpen(true);
    } catch (error) {
      console.error('Error clearing visitor data:', error);
    }
  }, []);

  // Check if visitor is registered
  const isVisitorRegistered = useCallback(() => {
    const data = getStoredVisitorData();
    return !!data;
  }, [getStoredVisitorData]);

  return {
    // State
    isPopupOpen,
    isLoading,
    error,
    
    // Actions
    submitVisitorData,
    closePopup,
    forceShowPopup,
    clearVisitorData,
    
    // Data
    getStoredVisitorData,
    isVisitorRegistered,
    
    // Utilities
    shouldShowPopup,
  };
};
