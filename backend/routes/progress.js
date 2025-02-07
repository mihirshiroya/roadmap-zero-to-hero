const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const UserProgress = require('../models/userProgressModel');
const { DateTime } = require('luxon');
const { requireAuth } = require('../middleware/authMiddleware');

// Add authentication middleware
router.use(requireAuth);

// Timeline endpoint
router.get('/timeline', async (req, res) => {
  try {
    const timelineData = await UserProgress.aggregate([
      {
        $match: {
          userId: req.user.id,
          'completedCheckpoints.completedAt': { $exists: true }
        }
      },
      { $unwind: '$completedCheckpoints' },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$completedCheckpoints.completedAt"
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.set({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    });
    
    res.json(timelineData);
  } catch (error) {
    console.error('Timeline error:', error);
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
});

// History endpoint
router.get('/history', async (req, res) => {
  try {
    const progressList = await UserProgress.find({ userId: req.user.id })
      .populate('roadmapId', 'name status')
      .lean();

    let allCompletions = [];
    
    progressList.forEach(progressDoc => {
      progressDoc.completedCheckpoints.forEach(checkpoint => {
        allCompletions.push({
          ...checkpoint,
          roadmap: progressDoc.roadmapId ? {
            _id: progressDoc.roadmapId._id,
            name: progressDoc.roadmapId.name,
            status: progressDoc.roadmapId.status
          } : null
        });
      });
    });

    const history = allCompletions
      .sort((a, b) => b.completedAt - a.completedAt)
      .map(item => ({
        ...item,
        completedAt: DateTime.fromJSDate(item.completedAt).toISO()
      }));

    res.json(history);
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({
      error: 'Server error',
      details: error.message
    });
  }
});

module.exports = router; 