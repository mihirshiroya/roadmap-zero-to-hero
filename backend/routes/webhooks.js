const express = require('express');
const router = express.Router();
const { Webhook } = require('svix');
const User = require('../models/User');

// Helper function for validating required fields
const validateRequiredFields = (data) => {
  const required = {
    id: data.id,
    email: data.email_addresses?.[0]?.email_address,
    firstName: data.first_name,
    lastName: data.last_name,
    username: data.username
  };

  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }

  return true;
};

// Helper function to extract user data from Clerk webhook payload
const extractUserData = (data) => {
  console.log('Processing user data:', {
    id: data.id,
    email: data.email_addresses?.[0]?.email_address,
    username: data.username
  });

  // Validate all required fields exist
  validateRequiredFields(data);

  // Get primary email
  const primaryEmail = data.email_addresses?.find(
    email => email.id === data.primary_email_address_id
  )?.email_address;

  if (!primaryEmail) {
    throw new Error('No valid primary email found');
  }

  const userData = {
    clerkUserId: data.id,
    email: primaryEmail,
    profile: {
      firstName: data.first_name,
      lastName: data.last_name,
      username: data.username,
      avatar: data.profile_image_url // Map to avatar instead of imageUrl
    },
    preferences: {
      skillLevel: 'beginner',
      learningGoals: [] // Will be empty initially, user can update later
    },
    activity: {
      lastLogin: new Date(data.created_at),
      streakDays: 0
    },
    quizStats: {
      attempts: 0,
      correctAnswers: 0,
      totalQuestions: 0,
      accuracy: 0
    },
    createdAt: new Date()
  };

  // Validate the constructed user data
  if (!userData.clerkUserId || !userData.email) {
    throw new Error('Invalid user data structure');
  }

  return userData;
};

// Webhook handler
router.post('/clerk', 
  // Middleware is now handled in index.js
  async (req, res) => {
    try {
      const payload = req.body.toString();
      
      // Get headers in a proxy-safe way
      const svixHeaders = {
        'svix-id': req.header('svix-id'),
        'svix-timestamp': req.header('svix-timestamp'),
        'svix-signature': req.header('svix-signature')
      };

      // Debug logging (remove in production)
      console.log('Received webhook with headers:', svixHeaders);
      console.log('Payload length:', payload.length);

      if (!svixHeaders['svix-id'] || !svixHeaders['svix-timestamp'] || !svixHeaders['svix-signature']) {
        return res.status(400).json({ error: 'Missing required Svix headers' });
      }

      const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
      let evt;
      try {
        evt = wh.verify(payload, svixHeaders);
      } catch (err) {
        console.error('Signature verification failed:', err.message);
        console.error('Received signature:', svixHeaders['svix-signature']);
        console.error('Expected secret:', process.env.CLERK_WEBHOOK_SECRET?.slice(0, 6) + '...');
        return res.status(401).json({ error: 'Invalid signature' });
      }
      
      // Handle the event
      switch (evt.type) {
        case 'user.created': {
          // Check if user already exists
          const existingUser = await User.findOne({
            $or: [
              { clerkUserId: evt.data.id },
              { email: evt.data.email_addresses?.[0]?.email_address }
            ]
          });

          if (existingUser) {
            console.log('User already exists:', evt.data.id);
            return res.status(200).json({
              success: true,
              message: 'User already exists'
            });
          }

          // Extract and validate user data
          const userData = extractUserData(evt.data);

          // Create new user
          const newUser = new User(userData);
          const validationError = newUser.validateSync();
          
          if (validationError) {
            console.error('Validation error:', validationError);
            return res.status(400).json({
              error: 'Invalid user data',
              details: validationError.message
            });
          }

          await newUser.save();
          console.log('User created successfully:', evt.data.id);

          return res.status(200).json({
            success: true,
            message: 'User created successfully'
          });
        }

        case 'user.updated': {
          const updatedUser = await User.findOneAndUpdate(
            { clerkUserId: evt.data.id },
            { 
              $set: {
                email: evt.data.email_addresses?.[0]?.email_address,
                'profile.firstName': evt.data.first_name,
                'profile.lastName': evt.data.last_name,
                'profile.avatar': evt.data.profile_image_url,
                'activity.lastLogin': new Date()
              }
            },
            { new: true }
          );

          if (!updatedUser) {
            return res.status(404).json({
              error: 'User not found',
              message: `No user found with clerkUserId: ${evt.data.id}`
            });
          }

          return res.status(200).json({
            success: true,
            message: 'User updated successfully'
          });
        }

        default: {
          console.log('Unhandled event type:', evt.type);
          return res.status(200).json({
            success: true,
            message: `Event type ${evt.type} acknowledged`
          });
        }
      }
    } catch (err) {
      console.error('Webhook error:', err);
      res.status(400).json({ error: err.message });
    }
  }
);

module.exports = router;