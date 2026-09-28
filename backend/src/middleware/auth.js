const { auth } = require('../config/firebase');
const { sendError } = require('../utils/response');

/**
 * Verify Firebase ID Token from Authorization header
 */
async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return sendError(res, 'Authentication token missing. Please sign in.', 401);
  }

  try {
    const decoded = await auth.verifyIdToken(token);
    req.user = decoded; // Contains uid, email, email_verified, role (from custom claims)
    next();
  } catch (err) {
    console.error('[AuthMiddleware] Token verification failed:', err.message);
    return sendError(res, 'Invalid or expired session. Please sign in again.', 401);
  }
}

module.exports = { requireAuth };
