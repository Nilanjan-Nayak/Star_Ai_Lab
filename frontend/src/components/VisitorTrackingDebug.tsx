import React, { useState } from 'react';
import { useVisitorTracking } from '../hooks/useVisitorTracking';

const VisitorTrackingDebug: React.FC = () => {
  const {
    isPopupOpen,
    submitVisitorData,
    clearVisitorData,
    getStoredVisitorData,
    isVisitorRegistered,
    forceShowPopup,
    shouldShowPopup,
    error
  } = useVisitorTracking();

  const [debugInfo, setDebugInfo] = useState<any>(null);

  const runDiagnostics = () => {
    const storedData = getStoredVisitorData();
    const lastVisit = localStorage.getItem('star_ai_lab_last_visit');
    const sessionData = sessionStorage.getItem('star_ai_lab_current_session');
    
    const diagnostics = {
      isPopupOpen,
      isVisitorRegistered: isVisitorRegistered(),
      shouldShowPopup: shouldShowPopup(),
      storedVisitorData: storedData,
      lastVisit,
      sessionData,
      error,
      timestamp: new Date().toISOString()
    };
    
    console.log('🔍 Visitor Tracking Diagnostics:', diagnostics);
    setDebugInfo(diagnostics);
  };

  const testSubmission = async () => {
    try {
      console.log('🧪 Testing visitor submission...');
      await submitVisitorData({
        email: 'debug@test.com',
        username: 'DebugUser'
      });
      console.log('✅ Debug submission successful');
    } catch (error) {
      console.error('❌ Debug submission failed:', error);
    }
  };

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 p-4 bg-gray-900 text-white rounded-lg shadow-lg max-w-sm">
      <h3 className="font-bold mb-2">Visitor Tracking Debug</h3>
      
      <div className="space-y-2 text-sm">
        <button 
          onClick={runDiagnostics}
          className="w-full bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
        >
          Run Diagnostics
        </button>
        
        <button 
          onClick={clearVisitorData}
          className="w-full bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded"
        >
          Clear Data & Show Popup
        </button>
        
        <button 
          onClick={forceShowPopup}
          className="w-full bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
        >
          Force Show Popup
        </button>
        
        <button 
          onClick={testSubmission}
          className="w-full bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded"
        >
          Test API Submission
        </button>
      </div>

      {debugInfo && (
        <details className="mt-3">
          <summary className="cursor-pointer text-xs">Debug Info</summary>
          <pre className="text-xs mt-2 bg-gray-800 p-2 rounded overflow-auto max-h-32">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </details>
      )}

      {error && (
        <div className="mt-2 p-2 bg-red-600 rounded text-xs">
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default VisitorTrackingDebug;
