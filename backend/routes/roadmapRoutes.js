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

// Add before other routes
router.options('/', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.sendStatus(200)
});

module.exports = router; 