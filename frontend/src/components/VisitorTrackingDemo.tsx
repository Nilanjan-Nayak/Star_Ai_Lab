import React from 'react';
import { Users, Database, Eye, BarChart3, Shield, Clock } from 'lucide-react';
import { useVisitorTracking } from '../hooks/useVisitorTracking';

const VisitorTrackingDemo: React.FC = () => {
  const {
    forceShowPopup,
    clearVisitorData,
    getStoredVisitorData,
    isVisitorRegistered,
  } = useVisitorTracking();

  const visitorData = getStoredVisitorData();

  return (
    <div className="py-16 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mb-6">
            <Database className="h-8 w-8 text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4">
            Real-time Visitor Tracking
          </h2>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Advanced visitor analytics with Google Sheets integration. 
            Every visit is automatically logged with IP, timestamp, and user details.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-blue-500/20">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="h-6 w-6 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Auto Detection</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Automatically detects new and returning visitors with smart session management.
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-blue-500/20">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="h-6 w-6 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Real-time Sync</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Data is instantly synchronized to Google Sheets for real-time analytics and reporting.
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-blue-500/20">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Privacy First</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Secure data collection with user consent and transparent privacy practices.
            </p>
          </div>
        </div>

        {/* Current Status */}
        <div className="bg-gradient-to-r from-slate-800/80 to-blue-800/80 backdrop-blur-xl rounded-2xl p-8 border border-blue-500/30 mb-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <Users className="h-6 w-6" />
            Current Visitor Status
          </h3>

          {isVisitorRegistered() ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-medium">Visitor Registered</span>
              </div>
              
              {visitorData && (
                <div className="bg-slate-900/50 rounded-lg p-4 space-y-2">
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Email:</span>
                      <span className="text-white ml-2">{visitorData.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Username:</span>
                      <span className="text-white ml-2">{visitorData.username}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Registered:</span>
                      <span className="text-white ml-2">
                        {new Date(visitorData.submittedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-yellow-400 font-medium">Not Registered - Popup should appear</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={forceShowPopup}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Show Registration Popup
          </button>
          
          <button
            onClick={clearVisitorData}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Clear Visitor Data
          </button>
        </div>

        {/* Data Collection Info */}
        <div className="mt-12 bg-blue-500/10 rounded-xl p-6 border border-blue-500/20">
          <div className="flex items-start gap-3">
            <Clock className="h-6 w-6 text-blue-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-lg font-semibold text-blue-300 mb-2">Data Collection Details</h4>
              <div className="text-sm text-blue-200 space-y-1">
                <p>• <strong>Session Duration:</strong> 24 hours (configurable)</p>
                <p>• <strong>Data Collected:</strong> Email, Username, IP Address, Timestamp, User Agent</p>
                <p>• <strong>Storage:</strong> Google Sheets real-time synchronization</p>
                <p>• <strong>Privacy:</strong> User consent required, secure transmission</p>
                <p>• <strong>Rate Limiting:</strong> 5 requests per minute per IP</p>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Implementation */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-400">
            <Database className="h-4 w-4" />
            <span>Powered by Google Sheets API • Real-time Data Sync • Privacy Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorTrackingDemo;
