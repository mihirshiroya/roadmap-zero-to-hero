const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  clerkUserId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  profile: {
    firstName: String,
    lastName: String,
    username: { type: String, unique: true, sparse: true },
    avatar: String
  },
  preferences: {
    skillLevel: { 
      type: String, 
      enum: ['beginner', 'intermediate', 'advanced'], 
      default: 'beginner' 
    },
    learningGoals: [{
      type: String, 
      enum: ['coding', 'design', 'marketing']
    }]
  },
  activity: {
    lastLogin: Date,
    streakDays: { type: Number, default: 0 }
  },
  quizStats: {
    attempts: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 }
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('User', userSchema);
