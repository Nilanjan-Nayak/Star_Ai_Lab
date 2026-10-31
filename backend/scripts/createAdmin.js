/**
 * Create the super admin user in MongoDB.
 * Run: node scripts/createAdmin.js
 * 
 * This is a one-time script to create your admin account.
 * After running, you can log in via the hidden admin panel using face verification + OTP.
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const ADMIN_USERNAME = 'nilanjan';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'starailab.info@gmail.com';
const ADMIN_PASSWORD = 'StarAiLab@2024'; // Change this! Will be bcrypt hashed.

async function createAdmin() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI not set in .env');
      process.exit(1);
    }

    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected');

    // Check if admin already exists
    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log('⚠️  Admin user already exists. Updating to super admin...');
      existing.role = 'admin';
      existing.isSuperAdmin = true;
      existing.isActive = true;
      await existing.save();
      console.log('✅ Updated existing user to super admin');
    } else {
      const admin = new User({
        username: ADMIN_USERNAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: 'admin',
        isSuperAdmin: true,
        isActive: true
      });
      await admin.save();
      console.log('✅ Super admin user created!');
    }

    console.log(`\n📋 Admin Details:`);
    console.log(`   Username: ${ADMIN_USERNAME}`);
    console.log(`   Email:    ${ADMIN_EMAIL}`);
    console.log(`   Role:     admin (super)`);
    console.log(`\n🔐 Login via: Ctrl+Shift+K (press 3 times) → Face Verification → Email OTP`);
    console.log(`📧 OTP will be sent to: ${ADMIN_EMAIL}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

createAdmin();
