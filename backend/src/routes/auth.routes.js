const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { requireAuth } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimit');

// POST /api/auth/complete-signup
router.post('/complete-signup', authLimiter, requireAuth, authController.completeSignup);

// GET /api/auth/me
router.get('/me', requireAuth, authController.getMe);

module.exports = router;
