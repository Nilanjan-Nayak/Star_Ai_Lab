const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const Otp = require('../models/Otp');

const LOCAL_STORE_PATH = path.join(__dirname, '../data/admin_store.json');

// Ensure data directory exists
const ensureDataDir = () => {
  const dir = path.dirname(LOCAL_STORE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Default admin profile
const DEFAULT_ADMIN = {
  _id: '65a000000000000000000001',
  id: '65a000000000000000000001',
  username: 'nilanjan',
  email: process.env.ADMIN_EMAIL || 'starailab.info@gmail.com',
  role: 'admin',
  isSuperAdmin: true,
  faceDescriptor: [],
  otpAttempts: 0,
  lastOtpRequest: null,
  isActive: true
};

// Load local admin state
const getLocalAdmin = () => {
  ensureDataDir();
  if (fs.existsSync(LOCAL_STORE_PATH)) {
    try {
      const data = JSON.parse(fs.readFileSync(LOCAL_STORE_PATH, 'utf8'));
      return { ...DEFAULT_ADMIN, ...data.admin };
    } catch (e) {
      console.error('Error reading local admin store:', e);
    }
  }
  saveLocalAdmin(DEFAULT_ADMIN);
  return DEFAULT_ADMIN;
};

// Save local admin state
const saveLocalAdmin = (adminData) => {
  ensureDataDir();
  try {
    const current = getLocalAdmin();
    const updated = { ...current, ...adminData };
    fs.writeFileSync(LOCAL_STORE_PATH, JSON.stringify({ admin: updated }, null, 2));
    return updated;
  } catch (e) {
    console.error('Error saving local admin store:', e);
  }
};

// Local OTP store
let localOtps = [];

/**
 * Get super admin from MongoDB (with local JSON fallback)
 */
const getSuperAdmin = async () => {
  try {
    const admin = await User.findOne({ role: 'admin', isSuperAdmin: true }).exec();
    if (admin) {
      return {
        admin,
        isLocal: false,
        save: async (updateObj) => {
          Object.assign(admin, updateObj);
          await admin.save();
          saveLocalAdmin(admin.toObject());
        }
      };
    }
  } catch (err) {
    console.log('ℹ️ MongoDB unavailable, using local admin store');
  }

  // Fallback to local store
  const localAdmin = getLocalAdmin();
  return {
    admin: localAdmin,
    isLocal: true,
    save: async (updateObj) => {
      saveLocalAdmin(updateObj);
    }
  };
};

/**
 * Save OTP (MongoDB with local fallback)
 */
const saveOtp = async (email, code) => {
  try {
    await Otp.deleteMany({ email });
    await Otp.create({ email, code });
  } catch (err) {
    console.log('ℹ️ Saving OTP to local store');
  }

  // Always keep in local array for backup
  localOtps = localOtps.filter(o => o.email !== email);
  localOtps.push({
    email,
    code,
    verified: false,
    attempts: 0,
    createdAt: Date.now()
  });
};

/**
 * Verify OTP (MongoDB with local fallback)
 */
const verifyOtpCode = async (email, code) => {
  // Check local store first for fast validation
  const localMatch = localOtps.find(o => o.email === email && o.code === code && !o.verified);
  const now = Date.now();
  if (localMatch && (now - localMatch.createdAt) < 5 * 60 * 1000) {
    localMatch.verified = true;
    return true;
  }

  try {
    const record = await Otp.findOne({ email, code, verified: false });
    if (record) {
      record.verified = true;
      await record.save();
      return true;
    }
  } catch (err) {
    // Ignore DB error
  }

  return false;
};

module.exports = {
  getSuperAdmin,
  saveOtp,
  verifyOtpCode,
  getLocalAdmin,
  saveLocalAdmin
};
