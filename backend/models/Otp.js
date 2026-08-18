const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  code: {
    type: String,
    required: true
  },
  attempts: {
    type: Number,
    default: 0,
    max: 5
  },
  verified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 // Auto-delete after 5 minutes (TTL index)
  }
});

// Index for quick lookup
OtpSchema.index({ email: 1, code: 1 });

module.exports = mongoose.model('Otp', OtpSchema);
