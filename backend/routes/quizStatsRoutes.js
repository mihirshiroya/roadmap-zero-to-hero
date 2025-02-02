const express = require('express');
const router = express.Router();
const quizStatsController = require('../controllers/quizStatsController');
const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');

// Add authentication middleware
router.use(ClerkExpressWithAuth());

router.post('/update', quizStatsController.updateQuizStats);
router.get('/', quizStatsController.getQuizStats);

module.exports = router; 