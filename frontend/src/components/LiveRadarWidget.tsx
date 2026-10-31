import React, { useState, useEffect } from 'react';
import { Radio, ShieldCheck, Activity, Globe, Server, X, Users } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface PublicStats {
  activeOnline: number;
  totalVisits: number;
  servers: { server: string; count: number }[];
  systemStatus: string;
  threatsBlocked: number;
  recentPublicStream: {
    maskedIp: string;
    serverSource: string;
    device: string;
    browser: string;
    path: string;
    timeAgo: string;
  }[];
}

const LiveRadarWidget: React.FC = () => {
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Ping backend on initial load
  useEffect(() => {
    const pingServer = async () => {
      try {
        await fetch(`${API_BASE}/api/visitors/ping`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            path: window.location.pathname,
            referrer: document.referrer || 'Direct',
            userAgent: navigator.userAgent
          })
        });
      } catch (e) {
        // Silent
      }
    };
    pingServer();
  }, []);

  // Poll public stats every 10 seconds
  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/visitors/public-stats`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setStats(json.data);
          setLastUpdated(new Date());
        }
      }
    } catch (e) {
      // Offline fallback
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const activeCount = stats?.activeOnline || 1;
  const threatsBlocked = stats?.threatsBlocked || 0;

  return (
    <>
      {/* Floating Radar Pill Button */}
      <div className="fixed bottom-5 left-5 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/30 hover:border-cyan-400/60 shadow-[0_4px_20px_rgba(6,182,212,0.25)] backdrop-blur-md transition-all duration-300"
          title="Open Star AI Lab Live Telemetry & Security Radar"
        >
          {/* Pulsing beacon */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
          </span>

          <span className="text-xs font-semibold text-white/90 group-hover:text-cyan-300 transition-colors">
            {activeCount} Online
          </span>

          <span className="hidden sm:inline-block text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            Live Radar
          </span>

          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 ml-0.5" />
        </button>
      </div>

      {/* Expanded Cosmic Radar Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-cyan-500/30 rounded-2xl p-6 shadow-[0_10px_40px_rgba(6,182,212,0.2)] text-white">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
                  <Radio className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-wide text-white flex items-center gap-2">
                    Live Telemetry & Security Radar
                    <span className="px-2 py-0.5 text-[9px] rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                      Public Feed
                    </span>
                  </h3>
                  <p className="text-[11px] text-white/40">Real-time visitor flow & server monitoring</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2.5 my-4">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                  <Users className="w-3 h-3 text-cyan-400" /> Active
                </div>
                <div className="text-xl font-extrabold text-cyan-400">{activeCount}</div>
                <div className="text-[9px] text-emerald-400/80 mt-0.5">Online now</div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                  <Activity className="w-3 h-3 text-purple-400" /> Total Visits
                </div>
                <div className="text-xl font-extrabold text-purple-300">{stats?.totalVisits || 1}</div>
                <div className="text-[9px] text-white/30 mt-0.5">Recorded hits</div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> Shield
                </div>
                <div className="text-xl font-extrabold text-emerald-400">
                  {threatsBlocked > 0 ? `${threatsBlocked} Blocked` : '100%'}
                </div>
                <div className="text-[9px] text-emerald-400/80 mt-0.5">Zero Breaches</div>
              </div>
            </div>

            {/* Top Origin Servers */}
            <div className="mb-4 p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-xs font-semibold text-white/70 mb-2 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-cyan-400" /> Top Origin Servers / Referrers
              </div>
              <div className="flex flex-wrap gap-1.5">
                {stats?.servers && stats.servers.length > 0 ? (
                  stats.servers.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] flex items-center gap-1.5"
                    >
                      <Globe className="w-3 h-3 opacity-60" />
                      {s.server}
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-cyan-400/20 text-cyan-200">
                        {s.count}
                      </span>
                    </span>
                  ))
                ) : (
                  <span className="text-white/30 text-xs">Direct Server Navigation</span>
                )}
              </div>
            </div>

            {/* Live Stream with Masked IPs */}
            <div>
              <div className="text-xs font-semibold text-white/70 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> Live Visitor Stream (Privacy Protected)
                </span>
                <span className="text-[10px] text-white/30">Auto-refreshing</span>
              </div>

              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 text-xs">
                {stats?.recentPublicStream && stats.recentPublicStream.length > 0 ? (
                  stats.recentPublicStream.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 text-[11px]"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-cyan-300">{item.maskedIp}</span>
                        <span className="text-white/30">•</span>
                        <span className="text-white/60 truncate max-w-[130px]">{item.serverSource}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/40 text-[10px]">
                        <span>{item.device}</span>
                        <span>{item.browser}</span>
                        <span className="text-emerald-400/70 font-mono">
                          {new Date(item.timeAgo).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-white/30 text-xs">Waiting for incoming traffic pings...</div>
                )}
              </div>
            </div>

            {/* Security Guarantee Notice */}
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-white/40">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Malicious intrusion detection & active firewall
              </span>
              <span>Updated {lastUpdated.toLocaleTimeString()}</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default LiveRadarWidget;

