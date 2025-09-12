const express = require('express');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const googleSheetsService = require('../services/googleSheets');
const Visitor = require('../models/Visitor');

const router = express.Router();

// Rate limiting for visitor tracking
const visitorRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many visitor tracking requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation rules for visitor data
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

// Helper function to get client IP address
const getClientIP = (req) => {
  return req.headers['x-forwarded-for'] || 
         req.headers['x-real-ip'] || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
         req.ip ||
         'Unknown';
};

// Helper function to get user agent
const getUserAgent = (req) => {
  return req.headers['user-agent'] || 'Unknown';
};

// POST /api/visitors/track - Track a new visitor
router.post('/track', visitorRateLimit, visitorValidation, async (req, res) => {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { email, username } = req.body;
    
    // Collect visitor data
    const visitorData = {
      email: email.toLowerCase(),
      username: username.trim(),
      ipAddress: getClientIP(req),
      userAgent: getUserAgent(req),
      timestamp: new Date().toISOString(),
    };

    // Save to MongoDB (primary storage)
    try {
      const { visitor, isNew } = await Visitor.trackVisitor(visitorData);
      
      console.log(`✅ Visitor tracked in MongoDB: ${visitor.email} (${isNew ? 'New' : 'Returning'})`);
      
      // Try to sync to Google Sheets as backup (optional)
      try {
        await googleSheetsService.addVisitorRecord(visitorData);
        console.log('📊 Visitor data synced to Google Sheets');
      } catch (sheetError) {
        console.log('⚠️  Google Sheets sync failed (optional):', sheetError.message);
      }
      
      res.json({
        success: true,
        message: `Visitor ${isNew ? 'registered' : 'updated'} successfully`,
        data: {
          visitor: {
            id: visitor._id,
            email: visitor.email,
            username: visitor.username,
            visitCount: visitor.visitCount,
            isReturning: visitor.isReturning,
            lastVisit: visitor.lastVisit,
          },
          isNew,
          timestamp: new Date().toISOString(),
        },
      });
      
    } catch (mongoError) {
      console.error('MongoDB error:', mongoError.message);
      
      // Fallback: try Google Sheets if MongoDB fails
      try {
        const result = await googleSheetsService.addVisitorRecord(visitorData);
        
        res.json({
          success: true,
          message: 'Visitor tracked successfully (Google Sheets backup)',
          data: {
            timestamp: result.timestamp,
            rowsAdded: result.rowsAdded,
            fallback: 'google-sheets'
          },
        });
      } catch (sheetError) {
        // Both failed - return success but note the issue
        res.json({
          success: true,
          message: 'Visitor data received (storage temporarily unavailable)',
          data: {
            timestamp: visitorData.timestamp,
            demo: true,
            warning: 'Data storage temporarily unavailable'
          },
        });
      }
    }

  } catch (error) {
    console.error('Error tracking visitor:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while tracking visitor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// GET /api/visitors/stats - Get visitor statistics
router.get('/stats', async (req, res) => {
  try {
    // Try MongoDB first
    try {
      const stats = await Visitor.getStats();
      
      res.json({
        success: true,
        data: {
          ...stats,
          source: 'mongodb'
        },
      });
      return;
    } catch (mongoError) {
      console.log('MongoDB stats failed, trying Google Sheets:', mongoError.message);
      
      // Fallback to Google Sheets
      const stats = await googleSheetsService.getVisitorStats();
      
      res.json({
        success: true,
        data: {
          ...stats,
          source: 'google-sheets'
        },
      });
    }
  } catch (error) {
    console.error('Error getting visitor stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving visitor statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// GET /api/visitors/health - Check Google Sheets connection
router.get('/health', async (req, res) => {
  try {
    const isInitialized = googleSheetsService.isInitialized();
    
    if (!isInitialized) {
      const initResult = await googleSheetsService.initialize();
      
      if (!initResult) {
        return res.status(503).json({
          success: false,
          message: 'Google Sheets service unavailable',
          details: 'Service account not configured or connection failed',
        });
      }
    }

    // Try to get stats to test connection
    const stats = await googleSheetsService.getVisitorStats();
    
    res.json({
      success: true,
      message: 'Google Sheets service is healthy',
      data: {
        initialized: true,
        ...stats,
      },
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(503).json({
      success: false,
      message: 'Google Sheets service health check failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// GET /api/visitors/analytics - Get detailed visitor analytics
router.get('/analytics', async (req, res) => {
  try {
    // Get device statistics
    const deviceStats = await Visitor.aggregate([
      {
        $group: {
          _id: '$device',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get browser statistics
    const browserStats = await Visitor.aggregate([
      {
        $group: {
          _id: '$browser',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent visitors (anonymized)
    const recentVisitors = await Visitor.find()
      .sort({ lastVisit: -1 })
      .limit(20)
      .select('device browser isReturning visitCount lastVisit _id')
      .exec();

    // Format device stats
    const devices = {
      desktop: 0,
      mobile: 0,
      tablet: 0
    };
    deviceStats.forEach(stat => {
      if (devices.hasOwnProperty(stat._id)) {
        devices[stat._id] = stat.count;
      }
    });

    // Format browser stats
    const browsers = {
      chrome: 0,
      firefox: 0,
      safari: 0,
      edge: 0,
      other: 0
    };
    browserStats.forEach(stat => {
      if (browsers.hasOwnProperty(stat._id)) {
        browsers[stat._id] = stat.count;
      } else {
        browsers.other += stat.count;
      }
    });

    // Format recent visitors (anonymized)
    const formattedRecentVisitors = recentVisitors.map(visitor => ({
      id: visitor._id.toString(),
      deviceType: visitor.device || 'unknown',
      browser: visitor.browser || 'unknown',
      isReturning: visitor.isReturning,
      visitCount: visitor.visitCount,
      timestamp: visitor.lastVisit,
      hashedEmail: 'user_' + visitor._id.toString().substring(0, 8) // Anonymized identifier
    }));

    res.json({
      success: true,
      data: {
        devices,
        browsers,
        recentVisitors: formattedRecentVisitors
      }
    });

  } catch (error) {
    console.error('Error getting visitor analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving visitor analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// POST /api/visitors/test - Test endpoint for development
router.post('/test', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ message: 'Endpoint not available in production' });
  }

  try {
    const testData = {
      email: 'test@example.com',
      username: 'Test User',
      ipAddress: getClientIP(req),
      userAgent: getUserAgent(req),
    };

    const { visitor, isNew } = await Visitor.trackVisitor(testData);
    
    res.json({
      success: true,
      message: 'Test visitor record added successfully',
      data: {
        visitor: {
          id: visitor._id,
          device: visitor.device,
          browser: visitor.browser,
          visitCount: visitor.visitCount,
          isNew
        }
      },
    });
  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({
      success: false,
      message: 'Test failed',
      error: error.message,
    });
  }
});

module.exports = router;
