const express = require('express');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const googleSheetsService = require('../services/googleSheets');
const Visitor = require('../models/Visitor');
const adminAuth = require('../middleware/adminAuth');
const {
  recordVisit,
  recordThreat,
  getLiveTrafficData,
  getPublicStats,
  simulateVisit,
  clearThreatAlerts,
  clearTrafficLogs
} = require('../services/visitorTracker');
const { sendSecurityAlertEmail } = require('../services/mailer');

const router = express.Router();

// Rate limiting for manual form submission
const visitorRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    error: 'Too many visitor tracking requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// GET /api/visitors/public-stats - Public Realtime Traffic Statistics (Masked IPs)
router.get('/public-stats', (req, res) => {
  try {
    const stats = getPublicStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching public stats:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve stats' });
  }
});

// POST /api/visitors/ping - Public heartbeat / page navigation ping
router.post('/ping', (req, res) => {
  try {
    const { path, referrer, userAgent } = req.body || {};
    const visit = recordVisit(req, { path, referrer, userAgent });
    res.json({
      success: true,
      data: {
        serverSource: visit.serverSource,
        maskedIp: visit.maskedIp,
        timestamp: visit.timestamp
      }
    });
  } catch (error) {
    console.error('Error in visitor ping:', error);
    res.status(500).json({ success: false, message: 'Failed to record ping' });
  }
});

// GET /api/visitors/live - Admin only: Full live visitors, servers, IPs & Threat Radar
router.get('/live', adminAuth, (req, res) => {
  try {
    const liveData = getLiveTrafficData();
    res.json({
      success: true,
      data: liveData
    });
  } catch (error) {
    console.error('Error fetching live visitor telemetry:', error);
    res.status(500).json({ success: false, message: 'Error retrieving telemetry' });
  }
});

// POST /api/visitors/test-security-alert - Admin only: Test sending a security alert email
router.post('/test-security-alert', adminAuth, async (req, res) => {
  try {
    const clientIp = req.ip || '127.0.0.1';
    const sent = await sendSecurityAlertEmail({
      ip: clientIp,
      threatType: 'TEST SECURITY ALERT (Manual Admin Probe)',
      url: '/api/admin/security-test',
      method: 'POST',
      payload: 'Simulated Probe Payload: {"test": "UNION SELECT 1, 2, admin_key FROM secret_vault"}',
      userAgent: req.headers['user-agent'] || 'Star AI Lab Admin Console',
      referrer: req.headers['referer'] || 'Admin Dashboard Security Radar',
      location: 'Local Admin Station'
    });

    if (sent) {
      res.json({
        success: true,
        message: 'Security alert email dispatched successfully to starailab.info@gmail.com!'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to dispatch test security email. Check SMTP credentials.'
      });
    }
  } catch (error) {
    console.error('Error sending test security alert:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/visitors/security-alerts - Admin only: Clear logged threats
router.delete('/security-alerts', adminAuth, (req, res) => {
  try {
    clearThreatAlerts();
    res.json({ success: true, message: 'Security alerts cleared successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/visitors/traffic-logs - Admin only: Reset traffic logs
router.delete('/traffic-logs', adminAuth, (req, res) => {
  try {
    clearTrafficLogs();
    res.json({ success: true, message: 'Traffic logs reset successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/visitors/simulate-visit - Admin only: Simulate an external visitor for testing
router.post('/simulate-visit', adminAuth, (req, res) => {
  try {
    const { serverSource, browser, os, device, path: targetPath, location, ip } = req.body || {};
    const simulated = simulateVisit({ serverSource, browser, os, device, path: targetPath, location, ip });
    res.json({
      success: true,
      message: 'Simulated visitor ping recorded successfully!',
      data: simulated
    });
  } catch (error) {
    console.error('Simulation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/visitors/simulate-threat - Admin only: Trigger an attack simulation through shield
router.post('/simulate-threat', adminAuth, async (req, res) => {
  try {
    const { threatType, payload, targetPath, attackerIp, severity } = req.body || {};
    const threatRecord = await recordThreat({
      req: {
        headers: {
          'user-agent': 'Automated Cyber Attack Simulator (Star AI Lab Security Test)',
          'referer': 'https://exploit-database.net/payload-tester'
        },
        originalUrl: targetPath || '/api/projects?search=' + encodeURIComponent(payload || "' OR 1=1 --"),
        method: 'POST',
        ip: attackerIp || '185.220.101.42'
      },
      threatType: threatType || 'SQL INJECTION (SQLi) ATTACK',
      payload: payload || `Simulated Breach: SELECT * FROM admin_credentials WHERE '1'='1'`,
      severity: severity || 'CRITICAL'
    });

    res.json({
      success: true,
      message: `Simulated attack [${threatRecord.threatType}] intercepted, logged, and alert email dispatched!`,
      data: threatRecord
    });
  } catch (error) {
    console.error('Threat simulation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Validation rules for visitor form
const visitorValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('username')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Username must be between 2 and 50 characters')
    .matches(/^[a-zA-Z0-9_\s]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and spaces'),
];

// POST /api/visitors/track - Track a new registered visitor
router.post('/track', visitorRateLimit, visitorValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { email, username } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.ip || 'Unknown';
    const userAgent = req.headers['user-agent'] || 'Unknown';

    const visitorData = {
      email: email.toLowerCase(),
      username: username.trim(),
      ipAddress: ip,
      userAgent,
      timestamp: new Date().toISOString(),
    };

    // Save to MongoDB if available
    try {
      const { visitor, isNew } = await Visitor.trackVisitor(visitorData);
      return res.json({
        success: true,
        message: `Visitor ${isNew ? 'registered' : 'updated'} successfully`,
        data: { visitor, isNew }
      });
    } catch (mongoError) {
      // Fallback
      recordVisit(req, { path: '/register-visitor', extra: visitorData });
      return res.json({
        success: true,
        message: 'Visitor tracked successfully (offline store fallback)',
        data: { visitor: visitorData, isNew: true }
      });
    }
  } catch (error) {
    console.error('Error tracking visitor:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while tracking visitor',
    });
  }
});

// GET /api/visitors/stats - Legacy stats endpoint
router.get('/stats', async (req, res) => {
  try {
    const publicStats = getPublicStats();
    res.json({
      success: true,
      data: {
        totalVisitors: publicStats.totalVisits,
        activeVisitors: publicStats.activeOnline,
        topServers: publicStats.servers,
        source: 'local-store'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
