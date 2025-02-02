const Roadmap = require('../models/roadmapModel');
const UserProgress = require('../models/userProgressModel');

exports.getAllRoadmaps = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    const roadmaps = await Roadmap.find();
    
    // Get user progress for all roadmaps
    const userProgress = await UserProgress.find({
      userId: req.user.id,
      roadmapId: { $in: roadmaps.map(r => r._id) }
    });

    // Calculate progress for each roadmap
    const roadmapsWithProgress = roadmaps.map(roadmap => {
      const progress = userProgress.find(
        p => p.roadmapId.toString() === roadmap._id.toString()
      );

      const totalCheckpoints = roadmap.steps.reduce(
        (sum, step) => sum + step.checkpoints.length, 0
      );

      const completedCount = progress ? progress.completedCheckpoints.length : 0;
      
      return {
        _id: roadmap._id,
        name: roadmap.name,
        expected_completion_time: roadmap.expected_completion_time,
        logo_url: roadmap.logo_url,
        steps: roadmap.steps,
        progress: {
          completedCount,
          totalCheckpoints,
          percentage: totalCheckpoints > 0 
            ? Math.round((completedCount / totalCheckpoints) * 100) 
            : 0
        }
      };
    });

    res.status(200).json(roadmapsWithProgress);
  } catch (error) {
    console.error('Error in getAllRoadmaps:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getRoadmapById = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    const roadmap = await Roadmap.findById(req.params.id);
    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found' });
    }

    const progress = await UserProgress.findOne({
      userId: req.user.id,
      roadmapId: roadmap._id
    });

    const totalCheckpoints = roadmap.steps.reduce(
      (sum, step) => sum + step.checkpoints.length, 0
    );

    const completedCheckpoints = progress ? progress.completedCheckpoints : [];
    
    const roadmapWithProgress = {
      ...roadmap.toObject(),
      progress: {
        completedCheckpoints,
        completedCount: completedCheckpoints.length,
        totalCheckpoints,
        percentage: totalCheckpoints > 0 
          ? Math.round((completedCheckpoints.length / totalCheckpoints) * 100)
          : 0
      }
    };

    res.status(200).json(roadmapWithProgress);
  } catch (error) {
    console.error('Error in getRoadmapById:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const { stepId, checkpointId } = req.body;
    const roadmapId = req.params.id;

    // Get roadmap to calculate total checkpoints
    const roadmap = await Roadmap.findById(roadmapId);
    const totalCheckpoints = roadmap.steps.reduce(
      (sum, step) => sum + step.checkpoints.length, 0
    );

    // Update progress
    const updatedProgress = await UserProgress.findOneAndUpdate(
      { userId: req.user.id, roadmapId },
      { $addToSet: { completedCheckpoints: { stepId, checkpointId } } },
      { new: true, upsert: true }
    );

    res.status(200).json({
      roadmapId,
      progress: {
        completedCount: updatedProgress.completedCheckpoints.length,
        completedCheckpoints: updatedProgress.completedCheckpoints,
        totalCheckpoints // Send back to frontend
      }
    });

  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(400).json({ error: error.message });
  }
};