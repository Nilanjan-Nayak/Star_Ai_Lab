const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Project = require('../models/Project');

// Sample projects data
const sampleProjects = [
  {
    title: "AI-Powered Chatbot Platform",
    description: "An intelligent conversational AI platform built with natural language processing capabilities. This chatbot can understand context, maintain conversation flow, and provide accurate responses across multiple domains. Features include sentiment analysis, intent recognition, and multi-language support.",
    shortDescription: "Intelligent conversational AI with natural language processing and multi-domain support.",
    category: "AI/ML",
    status: "Completed",
    technologies: ["Python", "TensorFlow", "NLTK", "Flask", "React", "PostgreSQL"],
    tags: ["nlp", "chatbot", "machine-learning", "conversational-ai"],
    githubUrl: "https://github.com/starailabs/ai-chatbot",
    liveUrl: "https://chatbot-demo.starailabs.com",
    featured: true
  },
  {
    title: "Computer Vision Quality Control System",
    description: "A real-time computer vision system for automated quality control in manufacturing. Uses deep learning models to detect defects, measure dimensions, and classify products with 99.5% accuracy. Integrated with industrial cameras and production line systems.",
    shortDescription: "Real-time computer vision system for automated manufacturing quality control.",
    category: "AI/ML",
    status: "In Progress",
    technologies: ["Python", "OpenCV", "PyTorch", "Docker", "Redis", "FastAPI"],
    tags: ["computer-vision", "quality-control", "manufacturing", "deep-learning"],
    githubUrl: "https://github.com/starailabs/cv-quality-control",
    featured: true
  },
  {
    title: "Smart Analytics Dashboard",
    description: "A comprehensive business intelligence dashboard with predictive analytics capabilities. Features real-time data processing, interactive visualizations, and machine learning-powered forecasting. Built with modern web technologies and scalable architecture.",
    shortDescription: "Business intelligence dashboard with predictive analytics and real-time data processing.",
    category: "Web Development",
    status: "Completed",
    technologies: ["React", "D3.js", "Node.js", "MongoDB", "Python", "Kafka"],
    tags: ["analytics", "dashboard", "business-intelligence", "data-visualization"],
    githubUrl: "https://github.com/starailabs/smart-dashboard",
    liveUrl: "https://dashboard-demo.starailabs.com",
    featured: false
  },
  {
    title: "IoT Environmental Monitoring",
    description: "An IoT-based environmental monitoring system that tracks air quality, temperature, humidity, and noise levels. Uses sensor networks, edge computing, and cloud analytics to provide real-time environmental insights and alerts.",
    shortDescription: "IoT system for real-time environmental monitoring with sensor networks and cloud analytics.",
    category: "IoT",
    status: "Completed",
    technologies: ["Arduino", "Raspberry Pi", "Python", "AWS IoT", "InfluxDB", "Grafana"],
    tags: ["iot", "environmental-monitoring", "sensors", "edge-computing"],
    githubUrl: "https://github.com/starailabs/iot-monitoring",
    featured: false
  },
  {
    title: "Blockchain Supply Chain Tracker",
    description: "A blockchain-based supply chain tracking system that provides transparency and traceability for products from manufacture to delivery. Features smart contracts, QR code integration, and immutable transaction records.",
    shortDescription: "Blockchain system for transparent supply chain tracking with smart contracts.",
    category: "Blockchain",
    status: "Planning",
    technologies: ["Solidity", "Ethereum", "Web3.js", "React", "IPFS", "Node.js"],
    tags: ["blockchain", "supply-chain", "smart-contracts", "transparency"],
    githubUrl: "https://github.com/starailabs/blockchain-supply-chain",
    featured: false
  },
  {
    title: "Mobile Health Monitoring App",
    description: "A comprehensive mobile health monitoring application with AI-powered health insights. Features symptom tracking, medication reminders, vital signs monitoring, and personalized health recommendations powered by machine learning.",
    shortDescription: "AI-powered mobile app for comprehensive health monitoring and personalized insights.",
    category: "Mobile App",
    status: "In Progress",
    technologies: ["React Native", "Python", "TensorFlow", "Firebase", "Node.js", "MongoDB"],
    tags: ["mobile-app", "healthcare", "ai-insights", "health-monitoring"],
    githubUrl: "https://github.com/starailabs/health-monitor-app",
    featured: true
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/star-ai-labs');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminUser = new User({
      username: 'admin',
      email: 'admin@starailabs.com',
      password: 'admin123',
      role: 'admin'
    });

    await adminUser.save();
    console.log('Created admin user');

    // Create sample projects
    await Project.insertMany(sampleProjects);
    console.log(`Created ${sampleProjects.length} sample projects`);

    console.log('Database seeded successfully!');
    console.log('\nAdmin Credentials:');
    console.log('Email: admin@starailabs.com');
    console.log('Password: admin123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedDatabase();