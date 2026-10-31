const { recordVisit, recordThreat, extractClientIP } = require('../services/visitorTracker');

// Attack Patterns
const SQLI_PATTERNS = [
  /(\b(union\s+select|select\s+.*\s+from|insert\s+into|drop\s+table|delete\s+from|alter\s+table|update\s+.*\s+set)\b)/i,
  /('(\s*or\s*|\s*and\s*)[\d\w\s'=]+)/i,
  /(\b(benchmark\s*\(|sleep\s*\(|waitfor\s+delay)\b)/i,
  /(--|\/\*|\*\/|;\s*drop|;\s*shutdown)/i,
  /(\binformation_schema\b)/i
];

const XSS_PATTERNS = [
  /<script[\s\S]*?>/i,
  /javascript\s*:/i,
  /onerror\s*=/i,
  /onload\s*=/i,
  /<img[\s\S]*?onerror/i,
  /<svg[\s\S]*?onload/i,
  /document\.cookie/i,
  /eval\s*\(/i,
  /<iframe[\s\S]*?>/i
];

const PATH_TRAVERSAL_PATTERNS = [
  /(\.\.\/|\.\.\\)/,
  /(\/etc\/(passwd|shadow|hosts))/i,
  /(\.env|\.git|\.aws|\.htaccess|web\.config)/i,
  /(wp-admin|wp-login\.php|phpmyadmin|pma|xmlrpc\.php)/i,
  /(\/proc\/self|\/boot\.ini)/i
];

const SCANNER_UA_PATTERNS = [
  /sqlmap/i,
  /nikto/i,
  /acunetix/i,
  /nmap/i,
  /masscan/i,
  /wpscan/i,
  /dirbuster/i,
  /gobuster/i,
  /nuclei/i
];

// In-memory rate tracker for rapid brute force attacks
const ipRequestCounts = new Map();

// Helper to check string against regex array
const matchPatterns = (input, patterns) => {
  if (!input || typeof input !== 'string') return null;
  for (const pattern of patterns) {
    if (pattern.test(input)) {
      return pattern.toString();
    }
  }
  return null;
};

// Inspect recursively in objects
const inspectPayload = (obj, patterns) => {
  if (!obj) return null;
  if (typeof obj === 'string') {
    return matchPatterns(obj, patterns);
  }
  if (typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      const foundInKey = matchPatterns(key, patterns);
      if (foundInKey) return `${key}: ${foundInKey}`;
      const foundInVal = inspectPayload(obj[key], patterns);
      if (foundInVal) return `${key}=>${foundInVal}`;
    }
  }
  return null;
};

/**
 * Express Security Shield & Traffic Monitoring Middleware
 */
const securityShield = async (req, res, next) => {
  const path = req.originalUrl || req.url || '';
  const clientIp = extractClientIP(req);

  // Skip static static file extensions from heavy security & visit tracking
  const isStaticFile = /\.(png|jpe?g|gif|webp|svg|css|js|map|ico|woff2?|ttf|eot)$/i.test(path);

  // 1. Check Rate Limit / Rapid Burst Flooding
  const now = Date.now();
  const ipData = ipRequestCounts.get(clientIp) || { count: 0, resetTime: now + 60000 };
  if (now > ipData.resetTime) {
    ipData.count = 1;
    ipData.resetTime = now + 60000;
  } else {
    ipData.count += 1;
  }
  ipRequestCounts.set(clientIp, ipData);

  // If more than 120 requests in 1 minute, flag as DoS / scraping abuse
  if (ipData.count > 120 && !isStaticFile) {
    console.warn(`🚨 Rate abuse detected from ${clientIp} (${ipData.count} req/min)`);
    recordThreat({
      req,
      threatType: 'DDoS / Rapid Request Flooding',
      payload: `${ipData.count} requests in 60 seconds to ${path}`,
      severity: 'HIGH'
    });

    return res.status(429).json({
      success: false,
      error: 'Too many requests. Rate limit exceeded by Star AI Lab Security Shield.',
      shieldActive: true
    });
  }

  // 2. Check Scanner / Malicious User Agents
  const userAgent = req.headers['user-agent'] || '';
  const scannerMatch = matchPatterns(userAgent, SCANNER_UA_PATTERNS);
  if (scannerMatch) {
    console.warn(`🚨 Malicious scanner tool intercepted from ${clientIp}: ${userAgent}`);
    await recordThreat({
      req,
      threatType: 'Automated Exploitation Scanner',
      payload: `Scanner UA: ${userAgent}`,
      severity: 'CRITICAL'
    });

    return res.status(403).json({
      success: false,
      error: 'ACCESS DENIED: Automated vulnerability scanner blocked by Star AI Lab Shield.',
      incidentLogged: true
    });
  }

  // 3. Check Path Traversal & Sensitive Probing in URL
  const decodedPath = decodeURIComponent(path);
  const pathMatch = matchPatterns(decodedPath, PATH_TRAVERSAL_PATTERNS);
  if (pathMatch) {
    console.warn(`🚨 Path Traversal / Secret Probing detected from ${clientIp}: ${path}`);
    await recordThreat({
      req,
      threatType: 'Path Traversal / Credential Probing',
      payload: `Target Path: ${path} (Match: ${pathMatch})`,
      severity: 'CRITICAL'
    });

    return res.status(403).json({
      success: false,
      error: 'ACCESS DENIED: Path traversal / file probing detected.',
      incidentLogged: true,
      alertDispatched: true
    });
  }

  // 4. Check SQL Injection in Query and Body
  const queryStr = JSON.stringify(req.query || {});
  const sqliInQuery = matchPatterns(queryStr, SQLI_PATTERNS);
  const sqliInBody = inspectPayload(req.body, SQLI_PATTERNS);

  if (sqliInQuery || sqliInBody) {
    const payload = sqliInQuery ? `Query: ${queryStr}` : `Body: ${JSON.stringify(req.body)}`;
    console.warn(`🚨 SQL Injection attempt detected from ${clientIp}: ${payload}`);
    await recordThreat({
      req,
      threatType: 'SQL Injection (SQLi) Attempt',
      payload,
      severity: 'CRITICAL'
    });

    return res.status(403).json({
      success: false,
      error: 'ACCESS DENIED: SQL Injection pattern intercepted by Star AI Lab Shield.',
      incidentLogged: true,
      alertDispatched: true
    });
  }

  // 5. Check Cross-Site Scripting (XSS) in Query and Body
  const xssInQuery = matchPatterns(queryStr, XSS_PATTERNS);
  const xssInBody = inspectPayload(req.body, XSS_PATTERNS);

  if (xssInQuery || xssInBody) {
    const payload = xssInQuery ? `Query: ${queryStr}` : `Body: ${JSON.stringify(req.body)}`;
    console.warn(`🚨 XSS attack attempt detected from ${clientIp}: ${payload}`);
    await recordThreat({
      req,
      threatType: 'Cross-Site Scripting (XSS) Attack',
      payload,
      severity: 'HIGH'
    });

    return res.status(403).json({
      success: false,
      error: 'ACCESS DENIED: Malicious XSS payload intercepted by Star AI Lab Shield.',
      incidentLogged: true,
      alertDispatched: true
    });
  }

  // If request is clean, record passive visit (only for API routes or page pings, not every asset)
  if (!isStaticFile && !path.startsWith('/uploads/')) {
    recordVisit(req);
  }

  next();
};

module.exports = securityShield;

