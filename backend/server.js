const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const dns = require('dns');
require('dotenv').config();

// Fix Windows DNS resolution issue for MongoDB SRV records
if (process.env.ENABLE_MONGODB === 'true') {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (e) {}
}

const projectRoutes = require('./routes/projects');
const authRoutes = require('./routes/auth');
const adminAuthRoutes = require('./routes/adminAuth');
const contentRoutes = require('./routes/content');
const contactRoutes = require('./routes/contact');
const visitorRoutes = require('./routes/visitors');
const teamRoutes = require('./routes/team');
const securityShield = require('./middleware/securityShield');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: false
}));

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5000'
];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Star AI Lab Real-time Security Shield & Traffic Monitor
app.use(securityShield);

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.set('bufferCommands', false);

if (process.env.MONGODB_URI && process.env.ENABLE_MONGODB === 'true') {
  mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    console.log(`📊 Database: ${process.env.MONGODB_URI.split('@')[1].split('/')[0]}`);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('⚠️  MongoDB connection failed. App running in resilient offline fallback mode.');
    console.log('🔧 Check your MongoDB connection string and credentials.');
  });
} else {
  console.log('ℹ️  MongoDB is disabled. App running in offline fallback mode.');
}

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin-auth', adminAuthRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/team', teamRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Star AI Labs API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱  URL: ${process.env.FRONTEND_URL || 'http://localhost:5000'}`);
});
