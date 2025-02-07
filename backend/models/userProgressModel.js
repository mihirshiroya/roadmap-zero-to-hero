const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  roadmapId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Roadmap',
    required: true
  },
  completedCheckpoints: [{
    stepId: Number,
    checkpointId: String,
    completedAt: { type: Date, default: Date.now }
  }],
}, { timestamps: true });

// Compound index for faster queries
userProgressSchema.index({ userId: 1, roadmapId: 1 });

module.exports = mongoose.model('UserProgress', userProgressSchema); 