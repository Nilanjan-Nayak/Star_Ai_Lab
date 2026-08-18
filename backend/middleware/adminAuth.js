const jwt = require('jsonwebtoken');
const adminStorage = require('../services/adminStorage');

/**
 * Admin-only authentication middleware.
 * Requires valid JWT + role === 'admin' + isSuperAdmin === true
 */
const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');

    // Retrieve super admin safely (supports DB + local JSON fallback)
    const adminWrapper = await adminStorage.getSuperAdmin();
    const user = adminWrapper.admin;

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'User not found or inactive' });
    }

    if (user.role !== 'admin' || !user.isSuperAdmin) {
      return res.status(403).json({ message: 'Access denied. Super admin privileges required.' });
    }

    req.user = decoded;
    req.adminUser = user;
    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = adminAuth;
