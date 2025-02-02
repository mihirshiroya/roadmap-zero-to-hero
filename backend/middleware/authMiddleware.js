const { clerkClient } = require('@clerk/clerk-sdk-node');

const requireAuth = async (req, res, next) => {
  // Allow OPTIONS request to pass through without authentication
  if (req.method === 'OPTIONS') {
    return next();
  }
  
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
    req.user = { id: userId };
    next();
  } catch (verifyError) {
    console.error('Token verification failed:', verifyError);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { requireAuth }; 