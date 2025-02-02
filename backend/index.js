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
      origin: '*',
      methods: '*',
      allowedHeaders: '*',
      optionsSuccessStatus: 204
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

// Production static file serving with proper MIME types
if (process.env.NODE_ENV === 'production') {
  // Serve static files with strict MIME type checking
  app.use(express.static(path.join(__dirname, '../frontend/dist'), {
    setHeaders: (res, filePath) => {
      const mimeType = mime.lookup(filePath);
      if (mimeType) {
        res.setHeader('Content-Type', mimeType);
        // Add additional security headers
        res.setHeader('X-Content-Type-Options', 'nosniff');
      }
      
      // Special handling for JavaScript modules
      if (filePath.endsWith('.js')) {
        if (filePath.includes('module') || filePath.includes('esm')) {
          res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        }
      }
    }
  }));

  // Handle client-side routing while preserving MIME types
  app.get('*', (req, res) => {
    if (req.headers.accept && req.headers.accept.includes('text/html')) {
      res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  });
}

// API Routes with explicit content type headers
app.use('/api/users', userRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/quiz-stats', quizStatsRoutes);
app.use('/api/webhooks', webhookRoutes);

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

// Error handler
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