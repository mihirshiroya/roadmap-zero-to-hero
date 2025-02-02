require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const { clerkClient } = require('@clerk/clerk-sdk-node');
const { Webhook } = require('svix');
const User = require('./models/User');
const roadmapRoutes = require('./routes/roadmapRoutes');
const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');
const errorHandler = require('./middleware/errorHandler');
const { Clerk } = require('@clerk/clerk-sdk-node');
const quizRoutes = require('./routes/quizRoutes');
const quizStatsController = require('./controllers/quizStatsController');
const quizStatsRoutes = require('./routes/quizStatsRoutes');
const webhookRoutes = require('./routes/webhooks');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Clerk
const clerk = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://roadmap-zero-to-hero.onrender.com'] 
    : '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Webhook middleware FIRST before any body parsing
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api/webhooks')) {
    express.raw({ type: 'application/json' })(req, res, next);
  } else {
    next();
  }
});

// Then add standard body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Add this AFTER MongoDB connection setup and BEFORE routes
if (process.env.NODE_ENV === 'production') {
  // Serve static files from frontend
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
  // Handle client-side routing - should be AFTER all API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

// Routes
app.use('/api/users', userRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/quiz-stats', quizStatsRoutes);
app.use('/api/webhooks', webhookRoutes);

// Public route example
app.get('/api/public', (req, res) => {
  res.json({ message: 'This is a public route' });
});

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handler
app.use(errorHandler);

