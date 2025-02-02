const User = require('../models/User');

exports.updateQuizStats = async (req, res) => {
  try {
    console.log('Received update request:', req.body);
    console.log('Authenticated user ID:', req.auth.userId);
    
    const { correctAnswers, totalQuestions } = req.body;
    const userId = req.auth.userId;

    const user = await User.findOneAndUpdate(
      { clerkUserId: userId },
      [
        {
          $set: {
            'quizStats.attempts': { $add: ['$quizStats.attempts', 1] },
            'quizStats.correctAnswers': { $add: ['$quizStats.correctAnswers', correctAnswers] },
            'quizStats.totalQuestions': { $add: ['$quizStats.totalQuestions', totalQuestions] }
          }
        },
        {
          $set: {
            'quizStats.accuracy': {
              $multiply: [
                { $divide: ['$quizStats.correctAnswers', '$quizStats.totalQuestions'] },
                100
              ]
            }
          }
        }
      ],
      { new: true, runValidators: true }
    );

    console.log('Updated user stats:', user.quizStats);
    res.status(200).json(user.quizStats);
  } catch (error) {
    console.error('Update error:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getQuizStats = async (req, res) => {
  try {
    // Clerk stores user ID in req.auth.userId
    const userId = req.auth.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await User.findOne({ clerkUserId: userId });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(user.quizStats || {
      attempts: 0,
      correctAnswers: 0,
      totalQuestions: 0,
      accuracy: 0
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}; 