/**
 * Seed script to populate initial site content into MongoDB.
 * Run: node scripts/seedContent.js
 * 
 * This creates the editable content entries that power the public website.
 * Content values match the current hardcoded text in the frontend components.
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const SiteContent = require('../models/SiteContent');

const initialContent = [
  // ──────────────────────────────────────────────
  // HERO SECTION
  // ──────────────────────────────────────────────
  { section: 'hero', key: 'badge', value: 'Next-Gen AI Research Lab', label: 'Badge Text', fieldType: 'text' },
  { section: 'hero', key: 'title', value: 'Star AI Lab', label: 'Main Title', fieldType: 'text' },
  { section: 'hero', key: 'subtitle', value: 'Pioneering the Future of Artificial Intelligence', label: 'Subtitle', fieldType: 'text' },
  { section: 'hero', key: 'description', value: 'We build intelligent systems that transform industries. From advanced neural networks to production-ready AI solutions.', label: 'Description', fieldType: 'textarea' },
  { section: 'hero', key: 'ctaPrimary', value: 'Explore Projects', label: 'Primary Button Text', fieldType: 'text' },
  { section: 'hero', key: 'ctaSecondary', value: 'Watch Demo', label: 'Secondary Button Text', fieldType: 'text' },

  // ──────────────────────────────────────────────
  // ABOUT SECTION
  // ──────────────────────────────────────────────
  { section: 'about', key: 'title', value: 'About Star AI Lab', label: 'Section Title', fieldType: 'text' },
  { section: 'about', key: 'subtitle', value: 'Pushing the boundaries of artificial intelligence', label: 'Section Subtitle', fieldType: 'text' },
  {
    section: 'about', key: 'stats', label: 'Statistics', fieldType: 'array',
    value: [
      { number: '8+', label: 'Competitions & Hackathons' },
      { number: '6+', label: 'Project Exhibitions' },
      { number: '12+', label: 'AI Models & Architectures' },
      { number: '25K+', label: 'Data Points & Inferences' }
    ]
  },
  {
    section: 'about', key: 'values', label: 'Core Values', fieldType: 'array',
    value: [
      { icon: 'Lightbulb', title: 'Innovation First', description: "We push the boundaries of what's possible with AI and emerging technologies." },
      { icon: 'Users', title: 'Collaborative Approach', description: 'Our diverse team brings together expertise from various domains to create comprehensive solutions.' },
      { icon: 'Award', title: 'Excellence Driven', description: 'We maintain the highest standards in every project, ensuring quality and reliability.' },
      { icon: 'Shield', title: 'Ethical AI', description: 'We develop AI solutions with responsibility, transparency, and ethical considerations at their core.' }
    ]
  },
  { section: 'about', key: 'description', value: 'Star AI Lab is a cutting-edge artificial intelligence research and development lab focused on building next-generation AI solutions. Our mission is to democratize AI technology and make it accessible for businesses of all sizes.', label: 'About Description', fieldType: 'textarea' },

  // ──────────────────────────────────────────────
  // DEMO / VIDEO SECTION
  // ──────────────────────────────────────────────
  { section: 'demo', key: 'badge', value: 'Premium Demo Experience', label: 'Badge Text', fieldType: 'text' },
  { section: 'demo', key: 'title', value: 'Watch Our', label: 'Section Title', fieldType: 'text' },
  { section: 'demo', key: 'titleHighlight', value: 'AI/APP Innovation', label: 'Title Highlighted Part', fieldType: 'text' },
  { section: 'demo', key: 'subtitle', value: 'Experience the cutting-edge capabilities of Star AI Lab through our exclusive demonstration', label: 'Section Subtitle', fieldType: 'textarea' },

  // ──────────────────────────────────────────────
  // VIDEOS
  // ──────────────────────────────────────────────
  {
    section: 'videos', key: 'mainVideo', label: 'Main Demo Video', fieldType: 'object',
    value: {
      src: '/src/img/LOGO amimation.mp4',
      title: 'Complete AI Platform Overview',
      description: 'A comprehensive look at our AI platform and its capabilities',
      poster: ''
    }
  },

  // ──────────────────────────────────────────────
  // DEMO CARDS
  // ──────────────────────────────────────────────
  {
    section: 'demoCards', key: 'cards', label: 'Demo Cards', fieldType: 'array',
    value: [
      { title: 'Content Magic', description: 'Generate professional & unic Content Magic with AI' },
      { title: 'AI Assistant', description: 'Your personal AI powered assistant' },
      { title: 'Code Generator', description: 'Generate code snippets instantly' }
    ]
  },

  // ──────────────────────────────────────────────
  // CONTACT SECTION
  // ──────────────────────────────────────────────
  { section: 'contact', key: 'title', value: 'Get in Touch', label: 'Section Title', fieldType: 'text' },
  { section: 'contact', key: 'subtitle', value: "Have a project in mind? Let's collaborate and build something amazing together.", label: 'Section Subtitle', fieldType: 'textarea' },
  { section: 'contact', key: 'email', value: 'starailab.info@gmail.com', label: 'Contact Email', fieldType: 'email' },
  {
    section: 'contact', key: 'socialLinks', label: 'Social Links', fieldType: 'array',
    value: [
      { platform: 'GitHub', url: 'https://github.com/starailabs', icon: 'Github' },
      { platform: 'LinkedIn', url: 'https://linkedin.com/', icon: 'Linkedin' },
      { platform: 'Twitter', url: 'https://twitter.com/', icon: 'Twitter' }
    ]
  },

  // ──────────────────────────────────────────────
  // FOOTER
  // ──────────────────────────────────────────────
  { section: 'footer', key: 'copyright', value: '© 2024 Star AI Lab. All rights reserved.', label: 'Copyright Text', fieldType: 'text' },
  { section: 'footer', key: 'tagline', value: 'Pioneering the Future of AI', label: 'Tagline', fieldType: 'text' },
  {
    section: 'footer', key: 'links', label: 'Footer Links', fieldType: 'array',
    value: [
      { label: 'Home', href: '#home' },
      { label: 'About', href: '#about' },
      { label: 'Projects', href: '#projects' },
      { label: 'Contact', href: '#contact' }
    ]
  },

  // ──────────────────────────────────────────────
  // GENERAL / NAVIGATION
  // ──────────────────────────────────────────────
  { section: 'general', key: 'siteName', value: 'Star AI Lab', label: 'Site Name', fieldType: 'text' },
  { section: 'general', key: 'siteDescription', value: 'Next-Gen AI Research & Development Lab', label: 'Site Description', fieldType: 'text' },
  {
    section: 'navigation', key: 'links', label: 'Navigation Links', fieldType: 'array',
    value: [
      { label: 'Home', href: '#home' },
      { label: 'About', href: '#about' },
      { label: 'Projects', href: '#projects' },
      { label: 'Contact', href: '#contact' }
    ]
  }
];

const contentStorage = require('../services/contentStorage');

async function seedContent() {
  try {
    console.log('📝 Saving initial content to local JSON store...');
    contentStorage.saveLocalContent(initialContent);
    console.log('✅ Local content store populated!');

    if (process.env.MONGODB_URI) {
      try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 3000 });
        console.log('✅ Connected to MongoDB');

        for (const item of initialContent) {
          await SiteContent.findOneAndUpdate(
            { section: item.section, key: item.key },
            item,
            { upsert: true, new: true }
          );
        }
        console.log('✅ MongoDB content seeding complete!');
        await mongoose.disconnect();
      } catch (dbErr) {
        console.log('ℹ️ Could not seed MongoDB (using local JSON store instead)');
      }
    }
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
  } finally {
    process.exit(0);
  }
}

seedContent();
