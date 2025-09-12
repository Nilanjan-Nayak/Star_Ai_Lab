const mongoose = require('mongoose');

const VisitorSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
    minlength: [2, 'Username must be at least 2 characters'],
    maxlength: [50, 'Username cannot exceed 50 characters']
  },
  ipAddress: {
    type: String,
    default: 'Unknown'
  },
  userAgent: {
    type: String,
    default: 'Unknown'
  },
  location: {
    country: String,
    city: String,
    region: String
  },
  visitCount: {
    type: Number,
    default: 1
  },
  lastVisit: {
    type: Date,
    default: Date.now
  },
  firstVisit: {
    type: Date,
    default: Date.now
  },
  isReturning: {
    type: Boolean,
    default: false
  },
  source: {
    type: String,
    default: 'direct' // direct, google, facebook, etc.
  },
  device: {
    type: String,
    default: 'unknown' // mobile, desktop, tablet
  },
  browser: {
    type: String,
    default: 'unknown' // chrome, firefox, safari, etc.
  }
}, {
  timestamps: true
});

// Index for better query performance
VisitorSchema.index({ email: 1 });
VisitorSchema.index({ ipAddress: 1 });
VisitorSchema.index({ createdAt: -1 });
VisitorSchema.index({ lastVisit: -1 });

// Static method to track or update visitor
VisitorSchema.statics.trackVisitor = async function(visitorData) {
  try {
    // Check if visitor already exists by email
    let visitor = await this.findOne({ email: visitorData.email });
    
    if (visitor) {
      // Update existing visitor
      visitor.lastVisit = new Date();
      visitor.visitCount += 1;
      visitor.isReturning = true;
      visitor.ipAddress = visitorData.ipAddress || visitor.ipAddress;
      visitor.userAgent = visitorData.userAgent || visitor.userAgent;
      
      await visitor.save();
      return { visitor, isNew: false };
    } else {
      // Create new visitor
      visitor = new this({
        email: visitorData.email,
        username: visitorData.username,
        ipAddress: visitorData.ipAddress,
        userAgent: visitorData.userAgent,
        device: parseDevice(visitorData.userAgent),
        browser: parseBrowser(visitorData.userAgent),
        isReturning: false
      });
      
      await visitor.save();
      return { visitor, isNew: true };
    }
  } catch (error) {
    throw new Error(`Failed to track visitor: ${error.message}`);
  }
};

// Static method to get visitor statistics
VisitorSchema.statics.getStats = async function() {
  try {
    const totalVisitors = await this.countDocuments();
    const uniqueEmails = await this.distinct('email').then(emails => emails.length);
    const returningVisitors = await this.countDocuments({ isReturning: true });
    const todayVisitors = await this.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    });
    
    const lastVisitor = await this.findOne().sort({ lastVisit: -1 });
    
    return {
      totalVisitors,
      uniqueEmails,
      returningVisitors,
      newVisitors: totalVisitors - returningVisitors,
      todayVisitors,
      lastVisit: lastVisitor ? lastVisitor.lastVisit : null
    };
  } catch (error) {
    throw new Error(`Failed to get visitor stats: ${error.message}`);
  }
};

// Helper functions
function parseDevice(userAgent) {
  if (!userAgent) return 'unknown';
  
  if (/mobile|android|iphone|ipad|tablet/i.test(userAgent)) {
    if (/ipad|tablet/i.test(userAgent)) return 'tablet';
    return 'mobile';
  }
  return 'desktop';
}

function parseBrowser(userAgent) {
  if (!userAgent) return 'unknown';
  
  if (userAgent.includes('Chrome')) return 'chrome';
  if (userAgent.includes('Firefox')) return 'firefox';
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'safari';
  if (userAgent.includes('Edge')) return 'edge';
  if (userAgent.includes('Opera')) return 'opera';
  return 'unknown';
}

module.exports = mongoose.model('Visitor', VisitorSchema);
