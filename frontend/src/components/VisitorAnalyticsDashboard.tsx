import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Globe, 
  Smartphone, 
  Monitor, 
  Tablet,
  RefreshCw,
  TrendingUp,
  Clock,
  MapPin,
  Activity,
  Eye,
  UserCheck,
  Calendar
} from 'lucide-react';

interface VisitorStats {
  totalVisitors: number;
  uniqueEmails: number;
  returningVisitors: number;
  newVisitors: number;
  todayVisitors: number;
  lastVisit: string | null;
  source: string;
}

interface DeviceStats {
  desktop: number;
  mobile: number;
  tablet: number;
}

interface BrowserStats {
  chrome: number;
  firefox: number;
  safari: number;
  edge: number;
  other: number;
}

interface RecentVisitor {
  id: string;
  deviceType: string;
  browser: string;
  isReturning: boolean;
  visitCount: number;
  timestamp: string;
  country?: string;
  hashedEmail: string; // Anonymized
}

const VisitorAnalyticsDashboard: React.FC = () => {
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [deviceStats, setDeviceStats] = useState<DeviceStats | null>(null);
  const [browserStats, setBrowserStats] = useState<BrowserStats | null>(null);
  const [recentVisitors, setRecentVisitors] = useState<RecentVisitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Auto-refresh every 30 seconds
  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAnalytics = async () => {
    try {
      setError(null);
      
      // Fetch main statistics
      const statsResponse = await fetch('/api/visitors/stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.data);
      }

      // Fetch detailed analytics
      const analyticsResponse = await fetch('/api/visitors/analytics');
      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json();
        setDeviceStats(analyticsData.data.devices);
        setBrowserStats(analyticsData.data.browsers);
        setRecentVisitors(analyticsData.data.recentVisitors);
      }

      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      setError('Failed to fetch analytics data');
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
    color: string;
  }> = ({ title, value, icon, trend, color }) => (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 hover:border-blue-500/30 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        {trend && (
          <span className="text-green-400 text-sm font-medium flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            {trend}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
        <p className="text-gray-400 text-sm">{title}</p>
      </div>
    </div>
  );

  const ProgressBar: React.FC<{ 
    label: string; 
    value: number; 
    total: number; 
    color: string;
  }> = ({ label, value, total, color }) => {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    
    return (
      <div className="mb-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-300">{label}</span>
          <span className="text-sm text-gray-400">{value} ({percentage.toFixed(1)}%)</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${color}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="py-16 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 text-blue-400 animate-spin mx-auto mb-4" />
              <p className="text-gray-300">Loading visitor analytics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mb-6">
            <Activity className="h-8 w-8 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">
            Visitor Analytics Dashboard
          </h1>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-6">
            Real-time visitor insights from MongoDB Atlas - Privacy protected & anonymized
          </p>

          <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Last updated: {lastUpdated}</span>
            </div>
            <button
              onClick={fetchAnalytics}
              className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Main Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard
              title="Total Visitors"
              value={stats.totalVisitors}
              icon={<Users className="h-6 w-6 text-white" />}
              color="bg-blue-500/20"
            />
            <StatCard
              title="Unique Visitors"
              value={stats.uniqueEmails}
              icon={<UserCheck className="h-6 w-6 text-white" />}
              color="bg-green-500/20"
            />
            <StatCard
              title="Returning Visitors"
              value={stats.returningVisitors}
              icon={<RefreshCw className="h-6 w-6 text-white" />}
              color="bg-purple-500/20"
            />
            <StatCard
              title="Today's Visitors"
              value={stats.todayVisitors}
              icon={<Calendar className="h-6 w-6 text-white" />}
              color="bg-cyan-500/20"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Device Analytics */}
          {deviceStats && (
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Device Types
              </h3>
              
              <div className="space-y-4">
                <ProgressBar
                  label="Desktop"
                  value={deviceStats.desktop}
                  total={deviceStats.desktop + deviceStats.mobile + deviceStats.tablet}
                  color="bg-blue-500"
                />
                <ProgressBar
                  label="Mobile"
                  value={deviceStats.mobile}
                  total={deviceStats.desktop + deviceStats.mobile + deviceStats.tablet}
                  color="bg-green-500"
                />
                <ProgressBar
                  label="Tablet"
                  value={deviceStats.tablet}
                  total={deviceStats.desktop + deviceStats.mobile + deviceStats.tablet}
                  color="bg-purple-500"
                />
              </div>
            </div>
          )}

          {/* Browser Analytics */}
          {browserStats && (
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Browsers
              </h3>
              
              <div className="space-y-4">
                <ProgressBar
                  label="Chrome"
                  value={browserStats.chrome}
                  total={Object.values(browserStats).reduce((a, b) => a + b, 0)}
                  color="bg-yellow-500"
                />
                <ProgressBar
                  label="Firefox"
                  value={browserStats.firefox}
                  total={Object.values(browserStats).reduce((a, b) => a + b, 0)}
                  color="bg-orange-500"
                />
                <ProgressBar
                  label="Safari"
                  value={browserStats.safari}
                  total={Object.values(browserStats).reduce((a, b) => a + b, 0)}
                  color="bg-blue-400"
                />
                <ProgressBar
                  label="Edge"
                  value={browserStats.edge}
                  total={Object.values(browserStats).reduce((a, b) => a + b, 0)}
                  color="bg-cyan-500"
                />
                <ProgressBar
                  label="Others"
                  value={browserStats.other}
                  total={Object.values(browserStats).reduce((a, b) => a + b, 0)}
                  color="bg-gray-500"
                />
              </div>
            </div>
          )}

          {/* Data Source Info */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Privacy & Data
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <span className="text-green-300 text-sm">Data Source</span>
                <span className="text-white font-medium">MongoDB Atlas</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <span className="text-blue-300 text-sm">Privacy Level</span>
                <span className="text-white font-medium">Anonymized</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <span className="text-purple-300 text-sm">Real-time Updates</span>
                <span className="text-white font-medium">30 seconds</span>
              </div>
              
              <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <p className="text-yellow-300 text-xs">
                  🔒 <strong>Privacy Protected:</strong> No personal information (emails, usernames) 
                  is displayed. All data is anonymized and aggregated.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {recentVisitors.length > 0 && (
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Visitor Activity (Anonymized)
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="text-left py-3 px-4 text-gray-300">Device</th>
                    <th className="text-left py-3 px-4 text-gray-300">Browser</th>
                    <th className="text-left py-3 px-4 text-gray-300">Type</th>
                    <th className="text-left py-3 px-4 text-gray-300">Visits</th>
                    <th className="text-left py-3 px-4 text-gray-300">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentVisitors.slice(0, 10).map((visitor) => (
                    <tr key={visitor.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {visitor.deviceType === 'mobile' ? <Smartphone className="h-4 w-4 text-green-400" /> :
                           visitor.deviceType === 'tablet' ? <Tablet className="h-4 w-4 text-purple-400" /> :
                           <Monitor className="h-4 w-4 text-blue-400" />}
                          <span className="text-white capitalize">{visitor.deviceType}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-300 capitalize">{visitor.browser}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          visitor.isReturning 
                            ? 'bg-blue-500/20 text-blue-300' 
                            : 'bg-green-500/20 text-green-300'
                        }`}>
                          {visitor.isReturning ? 'Returning' : 'New'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-300">{visitor.visitCount}</td>
                      <td className="py-3 px-4 text-gray-400">
                        {new Date(visitor.timestamp).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-400">
            <MapPin className="h-4 w-4" />
            <span>Powered by MongoDB Atlas • Real-time Analytics • Privacy First</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorAnalyticsDashboard;
