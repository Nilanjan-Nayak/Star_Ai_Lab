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
    enum: ['AI/ML', 'Web Development', 'Mobile App', 'Data Science', 'IoT', 'Blockchain', 'Other'],
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
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
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