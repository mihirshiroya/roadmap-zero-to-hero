const mongoose = require('mongoose');

const checkpointSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  }
});

const stepSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  timeEstimate: {
    type: String,
    required: true
  },
  checkpoints: [checkpointSchema]
});

const roadmapSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  expected_completion_time: {
    type: String,
    required: true
  },
  logo_url: {
    type: String,
    required: true
  },
  steps: [stepSchema]
}, { timestamps: true, collection: 'roadmaps' });

module.exports = mongoose.model('Roadmap', roadmapSchema); 