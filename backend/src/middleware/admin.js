const { sendError } = require('../utils/response');

/**
 * Enforce admin role based on verified Firebase custom claims
 * Never trusts client-side role assertions
 */
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return sendError(res, 'Access denied. Administrative privileges required.', 403);
  }
  next();
}

module.exports = { requireAdmin };
