const express = require('express');
const contentStorage = require('../services/contentStorage');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// GET /api/content — Get all site content
router.get('/', async (req, res) => {
  try {
    const rawContent = await contentStorage.getAllContent();

    const grouped = {};
    rawContent.forEach(item => {
      if (!grouped[item.section]) {
        grouped[item.section] = {};
      }
      grouped[item.section][item.key] = item.value;
    });

    res.json({ content: grouped, raw: rawContent });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.json({ content: {}, raw: [] }); // Never throw 500 error
  }
});

// GET /api/content/:section — Get content for a specific section
router.get('/:section', async (req, res) => {
  try {
    const { section } = req.params;
    const rawContent = await contentStorage.getAllContent();
    const sectionItems = rawContent.filter(i => i.section === section);

    const result = {};
    sectionItems.forEach(item => {
      result[item.key] = item.value;
    });

    res.json({ section, content: result });
  } catch (error) {
    console.error('Error fetching section content:', error);
    res.json({ section: req.params.section, content: {} });
  }
});

// PUT /api/content/:section/:key — Update a specific content field
router.put('/:section/:key', adminAuth, async (req, res) => {
  try {
    const { section, key } = req.params;
    const { value, label, fieldType } = req.body;

    if (value === undefined || value === null) {
      return res.status(400).json({ message: 'Value is required' });
    }

    const content = await contentStorage.updateContentItem(section, key, value, label, fieldType);
    res.json({ message: 'Content updated successfully', content });
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ message: 'Error updating content: ' + error.message });
  }
});

// GET /api/content/admin/schema — Get content schema for admin UI
router.get('/admin/schema', adminAuth, async (req, res) => {
  try {
    const rawContent = await contentStorage.getAllContent();

    const schema = {};
    rawContent.forEach(item => {
      if (!schema[item.section]) {
        schema[item.section] = [];
      }
      schema[item.section].push({
        key: item.key,
        value: item.value,
        label: item.label || item.key,
        fieldType: item.fieldType || 'text',
        updatedAt: item.updatedAt
      });
    });

    res.json({ schema });
  } catch (error) {
    console.error('Error fetching content schema:', error);
    res.status(500).json({ message: 'Error fetching content schema: ' + error.message });
  }
});

module.exports = router;
