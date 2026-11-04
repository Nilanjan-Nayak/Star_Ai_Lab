const express = require('express');
const teamStorage = require('../services/teamStorage');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// GET /api/team — Get all team members
router.get('/', async (req, res) => {
  try {
    const members = await teamStorage.getAllMembers();
    res.json({ success: true, members });
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch team members' });
  }
});

// GET /api/team/:id — Get a single team member
router.get('/:id', async (req, res) => {
  try {
    const member = await teamStorage.getMemberById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }
    res.json({ success: true, member });
  } catch (error) {
    console.error('Error fetching team member:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch team member' });
  }
});

// POST /api/team — Add a new team member (Admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, role } = req.body;
    if (!name || !role) {
      return res.status(400).json({ success: false, message: 'Name and role are required' });
    }
    const newMember = await teamStorage.addMember(req.body);
    res.status(201).json({ success: true, message: 'Team member added successfully', member: newMember });
  } catch (error) {
    console.error('Error adding team member:', error);
    res.status(500).json({ success: false, message: 'Failed to add team member: ' + error.message });
  }
});

// PUT /api/team/:id — Update a team member (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const updated = await teamStorage.updateMember(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }
    res.json({ success: true, message: 'Team member updated successfully', member: updated });
  } catch (error) {
    console.error('Error updating team member:', error);
    res.status(500).json({ success: false, message: 'Failed to update team member: ' + error.message });
  }
});

// DELETE /api/team/:id — Delete a team member (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const success = await teamStorage.deleteMember(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }
    res.json({ success: true, message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({ success: false, message: 'Failed to delete team member: ' + error.message });
  }
});

module.exports = router;

