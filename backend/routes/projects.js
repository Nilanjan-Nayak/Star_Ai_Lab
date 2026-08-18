const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const projectStorage = require('../services/projectStorage');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'project-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Validation rules
const projectValidation = [
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title must be between 1 and 100 characters'),
  body('description').trim().isLength({ min: 1, max: 1000 }).withMessage('Description must be between 1 and 1000 characters'),
  body('shortDescription').trim().isLength({ min: 1, max: 200 }).withMessage('Short description must be between 1 and 200 characters'),
  body('category').isIn(['AI/ML', 'Web Development', 'Mobile App', 'Data Science', 'IoT', 'Blockchain', 'storage', 'Other']).withMessage('Invalid category'),
  body('technologies').optional(),
  body('githubUrl').optional({ values: 'falsy' }).isURL().withMessage('Invalid GitHub URL'),
  body('liveUrl').optional({ values: 'falsy' }).isURL().withMessage('Invalid live URL')
];

// GET /api/projects - Get all projects
router.get('/', async (req, res) => {
  try {
    const { featured, category, status, page, limit } = req.query;

    const allProjects = await projectStorage.getAllProjects({ featured, category, status });

    if (page && limit) {
      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 10;
      const total = allProjects.length;
      const paginated = allProjects.slice((pageNum - 1) * limitNum, pageNum * limitNum);
      return res.json({
        projects: paginated,
        totalPages: Math.ceil(total / limitNum),
        currentPage: pageNum,
        total
      });
    }

    res.json({
      projects: allProjects,
      totalPages: 1,
      currentPage: 1,
      total: allProjects.length
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
});

// GET /api/projects/:id - Get single project
router.get('/:id', async (req, res) => {
  try {
    const project = await projectStorage.getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Error fetching project', error: error.message });
  }
});

// POST /api/projects - Create new project
router.post('/', adminAuth, upload.single('image'), projectValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const projectData = {
      ...req.body,
      technologies: JSON.parse(req.body.technologies || '[]'),
      tags: JSON.parse(req.body.tags || '[]'),
      featured: req.body.featured === 'true' || req.body.featured === true
    };

    if (req.file) {
      projectData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const project = await projectStorage.createProject(projectData);

    res.status(201).json({ message: 'Project created successfully', project });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Error creating project', error: error.message });
  }
});

// PUT /api/projects/:id - Update project
router.put('/:id', adminAuth, upload.single('image'), projectValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updateData = {
      ...req.body,
      technologies: JSON.parse(req.body.technologies || '[]'),
      tags: JSON.parse(req.body.tags || '[]'),
      featured: req.body.featured === 'true' || req.body.featured === true
    };

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const project = await projectStorage.updateProject(req.params.id, updateData);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ message: 'Project updated successfully', project });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Error updating project', error: error.message });
  }
});

// DELETE /api/projects/:id - Delete project
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const project = await projectStorage.deleteProject(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Delete associated image file if exists
    if (project.imageUrl && project.imageUrl.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, '../', project.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Error deleting project', error: error.message });
  }
});

module.exports = router;