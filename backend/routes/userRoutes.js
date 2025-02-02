const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Create user
router.post('/', async (req, res) => {
  try {
    const { clerkUserId, email, firstName, lastName } = req.body;
    
    const newUser = new User({
      clerkUserId,
      email,
      firstName,
      lastName
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
