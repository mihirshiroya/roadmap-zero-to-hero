const express = require('express');
const router = express.Router();
const FAQ = require('../models/faqModel');

router.get('/', async (req, res) => {
  try {
    const faqTopics = await FAQ.find().sort({ createdAt: -1 });
    
    if (!faqTopics || faqTopics.length === 0) {
      return res.status(404).json({ error: 'No FAQs found' });
    }

    res.json(faqTopics);
  } catch (error) {
    console.error('FAQ fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch FAQs',
      details: error.message
    });
  }
});

module.exports = router; 