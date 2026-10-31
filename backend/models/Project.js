const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    trim: true,
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  technologies: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    required: [true, 'Project category is required'],
    enum: ['AI/ML', 'Web Development', 'Mobile App', 'Data Science', 'IoT', 'Blockchain', 'storage', 'Other'],
    default: 'AI/ML'
  },
  status: {
    type: String,
    enum: ['In Progress', 'Completed', 'On Hold', 'Planning'],
    default: 'In Progress'
  },
  imageUrl: {
    type: String,
    default: ''
  },
  githubUrl: {
    type: String,
    default: ''
  },
  liveUrl: {
    type: String,
    default: ''
  },
  featured: {
    type: Boolean,
    default: false
  },
  startDate: {
    type: String,
    default: ''
  },
  endDate: {
    type: Date
  },
  projectType: {
    type: String,
    enum: ['Solo Project', 'Team Project', 'Group Collaboration'],
    default: 'Solo Project'
  },
  howCompleted: {
    type: String,
    default: ''
  },
  toolsUsed: [{
    type: String,
    trim: true
  }],
  futureScope: [{
    type: String,
    trim: true
  }],
  teamMembers: [{
    name: { type: String, required: true },
    role: { type: String, default: 'Contributor' },
    contribution: { type: String, default: '' },
    avatar: { type: String, default: '' },
    github: { type: String, default: '' }
  }],
  timelinePhases: [{
    phase: { type: String, default: '' },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    completed: { type: Boolean, default: false }
  }],
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Index for better search performance
ProjectSchema.index({ title: 'text', description: 'text', technologies: 'text' });

module.exports = mongoose.model('Project', ProjectSchema);
