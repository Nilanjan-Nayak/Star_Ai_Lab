const fs = require('fs');
const path = require('path');
const Project = require('../models/Project');
const crypto = require('crypto');

const PROJECT_STORE_PATH = path.join(__dirname, '../data/projects_store.json');

const ensureDataDir = () => {
  const dir = path.dirname(PROJECT_STORE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// ── Local file operations ──

const getLocalProjects = () => {
  ensureDataDir();
  if (fs.existsSync(PROJECT_STORE_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(PROJECT_STORE_PATH, 'utf8'));
    } catch (e) {
      console.error('Error reading local projects store:', e);
    }
  }
  // First run — seed with demo projects
  const seeded = seedDemoProjects();
  return seeded;
};

const saveLocalProjects = (projects) => {
  ensureDataDir();
  try {
    fs.writeFileSync(PROJECT_STORE_PATH, JSON.stringify(projects, null, 2));
  } catch (e) {
    console.error('Error saving local projects store:', e);
  }
};

// Generate a unique hex ID (like MongoDB ObjectId)
const generateId = () => crypto.randomBytes(12).toString('hex');

// ── Demo project seed data ──

const seedDemoProjects = () => {
  const now = new Date().toISOString();
  const demos = [
    {
      _id: generateId(),
      title: 'Media Storage',
      description: 'An IoT-based environmental monitoring system that tracks air quality, temperature, humidity, and noise levels.',
      shortDescription: 'IoT system for real-time environmental monitoring with sensor networks and cloud analytics.',
      category: 'storage',
      status: 'Completed',
      technologies: ['Arduino', 'Raspberry Pi', 'Python', 'AWS IoT', 'InfluxDB', 'Grafana'],
      tags: ['iot', 'environmental-monitoring', 'sensors'],
      githubUrl: 'https://github.com/starailabs/iot-monitoring',
      liveUrl: '',
      featured: false,
      imageUrl: '',
      startDate: '2024-04-01',
      createdAt: '2024-04-01T00:00:00.000Z',
      updatedAt: now,
    },
    {
      _id: generateId(),
      title: 'Star AI',
      description: 'A comprehensive mobile health monitoring application with AI-powered health insights.',
      shortDescription: 'AI-powered mobile app for comprehensive health monitoring and personalized insights.',
      category: 'AI/ML',
      status: 'In Progress',
      technologies: ['React Native', 'Python', 'TensorFlow', 'Firebase', 'Node.js', 'MongoDB'],
      tags: ['mobile-app', 'healthcare', 'ai-insights'],
      githubUrl: 'https://github.com/starailabs/health-monitor-app',
      liveUrl: '',
      featured: true,
      imageUrl: '',
      startDate: '2024-05-01',
      createdAt: '2024-05-01T00:00:00.000Z',
      updatedAt: now,
    },
    {
      _id: generateId(),
      title: 'Carreerkick',
      description: 'A blockchain-based supply chain tracking system that provides transparency and traceability.',
      shortDescription: 'Blockchain system for transparent supply chain tracking with smart contracts.',
      category: 'AI/ML',
      status: 'In Progress',
      technologies: ['Web3.js', 'React', 'Tailwind CSS', 'Node.js'],
      tags: ['blockchain', 'supply-chain', 'smart-contracts'],
      githubUrl: 'https://github.com/starailabs/blockchain-supply-chain',
      liveUrl: '',
      featured: false,
      imageUrl: '',
      startDate: '2024-06-01',
      createdAt: '2024-06-01T00:00:00.000Z',
      updatedAt: now,
    },
  ];

  saveLocalProjects(demos);
  console.log(`📦 Seeded ${demos.length} demo projects to local store`);
  return demos;
};

// ── CRUD operations (MongoDB + local fallback) ──

/**
 * Get all projects. Tries MongoDB first, falls back to local JSON.
 */
const getAllProjects = async (query = {}) => {
  try {
    let mongoQuery = {};
    if (query.featured === 'true') mongoQuery.featured = true;
    if (query.category) mongoQuery.category = query.category;
    if (query.status) mongoQuery.status = query.status;

    const projects = await Project.find(mongoQuery)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    if (projects && projects.length > 0) {
      // Sync to local store
      saveLocalProjects(projects);
      return projects;
    }
  } catch (err) {
    console.log('ℹ️ MongoDB unavailable for projects, using local store');
  }

  // Fallback: local JSON
  let localProjects = getLocalProjects();

  // Apply filters locally
  if (query.featured === 'true') {
    localProjects = localProjects.filter(p => p.featured === true);
  }
  if (query.category) {
    localProjects = localProjects.filter(p => p.category === query.category);
  }
  if (query.status) {
    localProjects = localProjects.filter(p => p.status === query.status);
  }

  // Sort by createdAt descending
  localProjects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return localProjects;
};

/**
 * Get a single project by ID.
 */
const getProjectById = async (id) => {
  try {
    const project = await Project.findById(id).lean().exec();
    if (project) return project;
  } catch (err) {
    // Fallback
  }
  const projects = getLocalProjects();
  return projects.find(p => p._id === id || p._id.toString() === id) || null;
};

/**
 * Create a new project.
 */
const createProject = async (projectData) => {
  let savedProject = null;

  try {
    const project = new Project(projectData);
    savedProject = (await project.save()).toObject();
  } catch (err) {
    console.log('ℹ️ Saving project to local store');
    savedProject = {
      ...projectData,
      _id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  // Always sync to local
  const projects = getLocalProjects();
  projects.push(savedProject);
  saveLocalProjects(projects);

  return savedProject;
};

/**
 * Update an existing project by ID.
 */
const updateProject = async (id, updateData) => {
  let updatedProject = null;

  try {
    updatedProject = await Project.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).lean().exec();
  } catch (err) {
    // Fallback
  }

  const projects = getLocalProjects();
  const index = projects.findIndex(p => p._id === id || p._id.toString() === id);

  if (updatedProject) {
    if (index >= 0) {
      projects[index] = updatedProject;
    } else {
      projects.push(updatedProject);
    }
    saveLocalProjects(projects);
    return updatedProject;
  }

  // Local-only update
  if (index < 0) return null;
  projects[index] = { ...projects[index], ...updateData, updatedAt: new Date().toISOString() };
  saveLocalProjects(projects);
  return projects[index];
};

/**
 * Delete a project by ID.
 */
const deleteProject = async (id) => {
  let deletedProject = null;

  try {
    deletedProject = await Project.findByIdAndDelete(id).lean().exec();
  } catch (err) {
    // Fallback
  }

  const projects = getLocalProjects();
  const index = projects.findIndex(p => p._id === id || p._id.toString() === id);

  if (index >= 0) {
    const removed = projects.splice(index, 1)[0];
    saveLocalProjects(projects);
    return deletedProject || removed;
  }

  return deletedProject;
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getLocalProjects,
  saveLocalProjects,
};
