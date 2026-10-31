const fs = require('fs');
const path = require('path');
const { sendSecurityAlertEmail } = require('./mailer');

const DATA_DIR = path.join(__dirname, '../data');
const VISITOR_FILE = path.join(DATA_DIR, 'visitor_store.json');
const THREAT_FILE = path.join(DATA_DIR, 'security_alerts.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory cache
let visitorStore = {
  totalVisits: 0,
  uniqueIPs: [],
  recentVisits: [] // Array of { id, ip, maskedIp, referrer, serverSource, device, browser, os, path, location, timestamp }
};

let threatStore = {
  totalThreats: 0,
  alerts: [] // Array of { id, ip, threatType, url, method, payload, userAgent, referrer, location, timestamp, emailSent }
};

// Load initial data from disk
try {
  if (fs.existsSync(VISITOR_FILE)) {
    const raw = fs.readFileSync(VISITOR_FILE, 'utf-8');
    visitorStore = JSON.parse(raw);
  }
} catch (e) {
  console.log('ℹ️ Initializing new visitor store');
}

try {
  if (fs.existsSync(THREAT_FILE)) {
    const raw = fs.readFileSync(THREAT_FILE, 'utf-8');
    threatStore = JSON.parse(raw);
  }
} catch (e) {
  console.log('ℹ️ Initializing new threat store');
}

// Persistence helpers
const persistVisitors = () => {
  try {
    fs.writeFileSync(VISITOR_FILE, JSON.stringify(visitorStore, null, 2));
  } catch (err) {
    console.error('Failed to persist visitor store:', err.message);
  }
};

const persistThreats = () => {
  try {
    fs.writeFileSync(THREAT_FILE, JSON.stringify(threatStore, null, 2));
  } catch (err) {
    console.error('Failed to persist threat store:', err.message);
  }
};

// Helper: Extract clean IP
const extractClientIP = (req) => {
  let ip = req.headers['x-forwarded-for'] ||
    req.headers['x-real-ip'] ||
    req.headers['cf-connecting-ip'] ||
    req.socket?.remoteAddress ||
    req.connection?.remoteAddress ||
    req.ip ||
    '127.0.0.1';

  if (typeof ip === 'string' && ip.includes(',')) {
    ip = ip.split(',')[0].trim();
  }
  // Strip IPv6 prefix
  if (ip.startsWith('::ffff:')) {
    ip = ip.substring(7);
  }
  if (ip === '::1' || ip === '127.0.0.1') {
    return '127.0.0.1 (Localhost)';
  }
  return ip;
};

// Helper: Mask IP for public viewing (e.g. 192.168.1.5 -> 192.168.***.***)
const maskIP = (ip) => {
  if (!ip || ip.includes('Localhost')) return 'Localhost / Dev';
  const parts = ip.split('.');
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.***.***`;
  }
  return ip.substring(0, Math.min(ip.length, 6)) + '***';
};

// Helper: Parse server origin / referrer
const parseServerSource = (referrer = '') => {
  if (!referrer || referrer === 'Direct') return { server: 'Direct / Bookmark', category: 'direct' };
  try {
    const url = new URL(referrer);
    const host = url.hostname.toLowerCase();
    if (host.includes('google')) return { server: 'Google Search Server', category: 'search' };
    if (host.includes('github')) return { server: 'GitHub Repository', category: 'social' };
    if (host.includes('twitter') || host.includes('x.com')) return { server: 'Twitter / X', category: 'social' };
    if (host.includes('linkedin')) return { server: 'LinkedIn Server', category: 'social' };
    if (host.includes('youtube')) return { server: 'YouTube', category: 'media' };
    if (host.includes('localhost') || host.includes('127.0.0.1')) return { server: 'Localhost Dev Server', category: 'local' };
    return { server: host, category: 'external' };
  } catch (e) {
    return { server: referrer, category: 'external' };
  }
};

// Helper: Parse user-agent
const parseUserAgent = (ua = '') => {
  let browser = 'Unknown Browser';
  let os = 'Unknown OS';
  let device = 'Desktop';

  if (/mobile/i.test(ua)) device = 'Mobile';
  if (/tablet|ipad/i.test(ua)) device = 'Tablet';

  if (/edg/i.test(ua)) browser = 'Microsoft Edge';
  else if (/chrome|crios/i.test(ua)) browser = 'Google Chrome';
  else if (/firefox|fxios/i.test(ua)) browser = 'Mozilla Firefox';
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Apple Safari';
  else if (/curl/i.test(ua)) browser = 'cURL CLI';
  else if (/postman/i.test(ua)) browser = 'Postman';

  if (/windows/i.test(ua)) os = 'Windows';
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
  else if (/linux/i.test(ua)) os = 'Linux';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';

  return { browser, os, device };
};

  // Estimate location with country flag & origin details
  const estimateLocation = (ip, req = null) => {
    if (req && req.headers) {
      const cfCountry = req.headers['cf-ipcountry'] || req.headers['x-country-code'] || req.headers['x-vercel-ip-country'];
      if (cfCountry && cfCountry.length === 2) {
        const code = cfCountry.toUpperCase();
        const flags = {
          IN: '🇮🇳 India',
          US: '🇺🇸 United States',
          GB: '🇬🇧 United Kingdom',
          CA: '🇨🇦 Canada',
          DE: '🇩🇪 Germany',
          FR: '🇫🇷 France',
          SG: '🇸🇬 Singapore',
          JP: '🇯🇵 Japan',
          AU: '🇦🇺 Australia',
          BR: '🇧🇷 Brazil'
        };
        if (flags[code]) return flags[code];
        return `🌐 ${code}`;
      }
    }

    if (!ip || ip.includes('Localhost') || ip === '127.0.0.1' || ip === '::1') {
      return '🖥️ Local Studio / Host Device';
    }
    if (ip.startsWith('10.') || ip.startsWith('192.168.') || ip.startsWith('172.16.')) {
      return '🔒 Private Local Network';
    }
    return '🌐 Global Web Visitor';
  };

  /**
   * Record a visitor ping/page-view
   */
  const recordVisit = (req, extra = {}) => {
    const ip = extractClientIP(req);
    const rawReferrer = req.headers['referer'] || req.headers['origin'] || extra.referrer || 'Direct';
    const ua = req.headers['user-agent'] || extra.userAgent || 'Unknown';
    const targetPath = extra.path || req.originalUrl || req.url || '/';

    const { server, category } = parseServerSource(rawReferrer);
    const { browser, os, device } = parseUserAgent(ua);
    const location = estimateLocation(ip);

    visitorStore.totalVisits = (visitorStore.totalVisits || 0) + 1;
    if (!visitorStore.uniqueIPs.includes(ip)) {
      visitorStore.uniqueIPs.push(ip);
    }

    const visitRecord = {
      id: `v_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      ip,
      maskedIp: maskIP(ip),
      referrer: rawReferrer,
      serverSource: server,
      sourceCategory: category,
      path: targetPath,
      browser,
      os,
      device,
      location,
      timestamp: new Date().toISOString()
    };

    // Keep last 300 visits
    visitorStore.recentVisits.unshift(visitRecord);
    if (visitorStore.recentVisits.length > 300) {
      visitorStore.recentVisits = visitorStore.recentVisits.slice(0, 300);
    }

    persistVisitors();
    return visitRecord;
  };

  /**
   * Record and alert on a malicious threat
   */
  const recordThreat = async ({
    req,
    threatType,
    payload,
    severity = 'HIGH'
  }) => {
    const ip = extractClientIP(req);
    const rawReferrer = req.headers['referer'] || req.headers['origin'] || 'Direct';
    const ua = req.headers['user-agent'] || 'Unknown';
    const url = req.originalUrl || req.url || '/';
    const method = req.method;
    const location = estimateLocation(ip);

    threatStore.totalThreats = (threatStore.totalThreats || 0) + 1;

    const threatRecord = {
      id: `threat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      ip,
      maskedIp: maskIP(ip),
      threatType,
      severity,
      url,
      method,
      payload: String(payload).substring(0, 500),
      userAgent: ua,
      referrer: rawReferrer,
      location,
      timestamp: new Date().toISOString(),
      emailSent: false
    };

    // Dispatch email notification to starailab.info@gmail.com
    const emailResult = await sendSecurityAlertEmail({
      ip,
      threatType,
      url,
      method,
      payload: threatRecord.payload,
      userAgent: ua,
      referrer: rawReferrer,
      location
    });

    threatRecord.emailSent = Boolean(emailResult);

    threatStore.alerts.unshift(threatRecord);
    if (threatStore.alerts.length > 150) {
      threatStore.alerts = threatStore.alerts.slice(0, 150);
    }

    persistThreats();
    return threatRecord;
  };

  /**
   * Calculate active visitors in last 15 mins
   */
  const getActiveVisitorsCount = () => {
    const cutoff = Date.now() - 15 * 60 * 1000;
    const activeIPs = new Set();

    for (const v of visitorStore.recentVisits) {
      const t = new Date(v.timestamp).getTime();
      if (t >= cutoff) {
        activeIPs.add(v.ip);
      } else {
        break; // Sorted newest first
      }
    }

    // Minimum 1 if server is currently processing
    return Math.max(1, activeIPs.size);
  };

  /**
   * Aggregate top referrers / origin servers
   */
  const getOriginServerBreakdown = () => {
    const counts = {};
    for (const v of visitorStore.recentVisits.slice(0, 100)) {
      const key = v.serverSource || 'Direct';
      counts[key] = (counts[key] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([server, count]) => ({ server, count }))
      .sort((a, b) => b.count - a.count);
  };

  /**
   * Device & Browser breakdown statistics
   */
  const getDeviceAndBrowserBreakdown = () => {
    const devices = { Desktop: 0, Mobile: 0, Tablet: 0 };
    const browsers = {};

    const recent = visitorStore.recentVisits.slice(0, 100);
    for (const v of recent) {
      const dev = v.device || 'Desktop';
      devices[dev] = (devices[dev] || 0) + 1;

      const b = v.browser || 'Other';
      browsers[b] = (browsers[b] || 0) + 1;
    }

    return {
      devices: Object.entries(devices).map(([type, count]) => ({ type, count })),
      browsers: Object.entries(browsers)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
    };
  };

  /**
   * Full live traffic data for Admin
   */
  const getLiveTrafficData = () => {
    const { devices, browsers } = getDeviceAndBrowserBreakdown();
    return {
      activeVisitors: getActiveVisitorsCount(),
      totalVisits: visitorStore.totalVisits,
      uniqueVisitors: visitorStore.uniqueIPs.length,
      totalThreats: threatStore.totalThreats,
      serverBreakdown: getOriginServerBreakdown(),
    deviceBreakdown: devices,
      browserBreakdown: browsers,
      recentVisits: visitorStore.recentVisits.slice(0, 60),
      securityAlerts: threatStore.alerts.slice(0, 40)
    };
  };

  /**
   * Publicly visible real-time traffic statistics (Masked IPs)
   */
  const getPublicStats = () => {
    return {
      activeOnline: getActiveVisitorsCount(),
      totalVisits: visitorStore.totalVisits,
      servers: getOriginServerBreakdown().slice(0, 5),
      systemStatus: threatStore.alerts.length > 0 ? 'Shield Guard Active' : 'All Systems Secure',
      threatsBlocked: threatStore.totalThreats,
      recentPublicStream: visitorStore.recentVisits.slice(0, 12).map(v => ({
        maskedIp: v.maskedIp,
        serverSource: v.serverSource,
        device: v.device,
        browser: v.browser,
        path: v.path,
        timeAgo: v.timestamp
      }))
    };
  };

  /**
   * Simulate a realistic visitor ping (for testing live radar dynamics)
   */
  const simulateVisit = ({ serverSource, ip, browser, os, device, path, location }) => {
    visitorStore.totalVisits = (visitorStore.totalVisits || 0) + 1;
    const clientIp = ip || `157.240.${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 250)}`;
    if (!visitorStore.uniqueIPs.includes(clientIp)) {
      visitorStore.uniqueIPs.push(clientIp);
    }

    const visitRecord = {
      id: `v_sim_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ip: clientIp,
      maskedIp: maskIP(clientIp),
      referrer: serverSource || 'https://google.com/search?q=star+ai+lab',
      serverSource: serverSource || 'Google Search Server',
      sourceCategory: 'search',
      path: path || '/projects',
      browser: browser || 'Google Chrome',
      os: os || 'Windows',
      device: device || 'Desktop',
      location: location || '🇮🇳 India',
      timestamp: new Date().toISOString()
    };

    visitorStore.recentVisits.unshift(visitRecord);
    if (visitorStore.recentVisits.length > 300) {
      visitorStore.recentVisits = visitorStore.recentVisits.slice(0, 300);
    }

    persistVisitors();
    return visitRecord;
  };

  /**
   * Clear security alerts (admin only)
   */
  const clearThreatAlerts = () => {
    threatStore.alerts = [];
    threatStore.totalThreats = 0;
    persistThreats();
    return true;
  };

  /**
   * Clear or reset traffic logs (admin only)
   */
  const clearTrafficLogs = () => {
    visitorStore.recentVisits = [];
    visitorStore.uniqueIPs = ['127.0.0.1 (Localhost)'];
    visitorStore.totalVisits = 1;
    persistVisitors();
    return true;
  };

  module.exports = {
    extractClientIP,
    recordVisit,
    recordThreat,
    getLiveTrafficData,
    getPublicStats,
  simulateVisit,
    clearThreatAlerts,
    clearTrafficLogs
  };

