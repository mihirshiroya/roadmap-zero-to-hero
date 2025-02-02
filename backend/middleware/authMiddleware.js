const { clerkClient } = require('@clerk/clerk-sdk-node');

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No valid authorization header' });
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const { sub: userId } = await clerkClient.verifyToken(token);
      
      if (!userId) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      // Add user info to request
      req.user = {
        id: userId
      };

      next();
    } catch (verifyError) {
      console.error('Token verification failed:', verifyError);
      return res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

module.exports = { requireAuth }; 