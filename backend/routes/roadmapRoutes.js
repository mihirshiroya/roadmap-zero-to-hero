const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');

const {
  getAllRoadmaps,
  getRoadmapById,
  updateProgress
} = require('../controllers/roadmapController');

router.get('/', requireAuth, getAllRoadmaps);
router.get('/:id', requireAuth, getRoadmapById);
router.patch('/:id/progress', requireAuth, updateProgress);

module.exports = router; 