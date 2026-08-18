const mongoose = require('mongoose');

const SiteContentSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    trim: true,
    enum: ['hero', 'about', 'demo', 'demoCards', 'footer', 'contact', 'videos', 'navigation', 'general']
  },
  key: {
    type: String,
    required: true,
    trim: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  label: {
    type: String,
    trim: true,
    default: '' // Human-readable label for admin UI
  },
  fieldType: {
    type: String,
    enum: ['text', 'textarea', 'richtext', 'number', 'url', 'email', 'array', 'object', 'image', 'video'],
    default: 'text'
  }
}, {
  timestamps: true
});

// Compound unique index: one entry per section+key
SiteContentSchema.index({ section: 1, key: 1 }, { unique: true });

module.exports = mongoose.model('SiteContent', SiteContentSchema);
