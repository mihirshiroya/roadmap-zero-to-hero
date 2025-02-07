// server.js
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
const mime = require('mime-types');
const faqRoutes = require('./routes/faqRoutes');
const progressRouter = require('./routes/progress');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Clerk
const clerk = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });


// Global middleware to ensure proper content types for all responses
app.use((req, res, next) => {
  // Ensure JSON responses have proper Content-Type
  const oldJson = res.json;
  res.json = function(obj) {
    res.setHeader('Content-Type', 'application/json');
    return oldJson.call(this, obj);
  };
  next();
});


// CORS configuration
const corsOptions = process.env.NODE_ENV === 'production' 
  ? {
      origin: 'https://roadmap-zero-to-hero.onrender.com',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Origin'],
      credentials: true
    }
  : {
      origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Origin'],
      credentials: true
    };

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Webhook middleware before body parsing
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api/webhooks')) {
    express.raw({ type: 'application/json' })(req, res, next);
  } else {
    next();
  }
});

// Standard body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Updated static file serving paths
if (process.env.NODE_ENV === 'production') {
  // Serve from public directory
  app.use('/', express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, filePath) => {
      const mimeType = mime.lookup(filePath);
      if (mimeType) {
        res.setHeader('Content-Type', mimeType);
        res.setHeader('X-Content-Type-Options', 'nosniff');
      }
      
      // Special handling for JavaScript modules
      if (filePath.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      }
    }
  }));

  // Serve assets
  app.use('/assets', express.static(path.join(__dirname, 'public/assets'), {
    setHeaders: (res, filePath) => {
      const mimeType = mime.lookup(filePath);
      if (mimeType) {
        res.setHeader('Content-Type', mimeType);
        res.setHeader('X-Content-Type-Options', 'nosniff');
      }
    }
  }));
}

// API Routes with explicit content type headers
app.use('/api/users', userRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/quiz-stats', quizStatsRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/progress', progressRouter);

// Public route example with explicit content type
app.get('/api/public', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json({ message: 'This is a public route' });
});

// Health check endpoint with explicit content type
app.get('/health', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({ status: 'ok' });
});

// // Client-side routing handler - AFTER API routes
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res, next) => {
    // Skip this middleware if the request is for an API route
    if (req.path.startsWith('/api/')) {
      return next();
    }
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

// Error handler must be last
app.use(errorHandler);

// MongoDB connection
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