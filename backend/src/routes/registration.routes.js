const express = require('express');
const multer = require('multer');
const router = express.Router();
const registrationController = require('../controllers/registration.controller');
const { requireAuth } = require('../middleware/auth');
const { uploadLimiter } = require('../middleware/rateLimit');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
});

// All registration routes require authentication
router.use(requireAuth);

// POST /api/registration — create registration
router.post('/', registrationController.createRegistration);

// GET /api/registration/me — get own registration status
router.get('/me', registrationController.getMyRegistration);

// POST /api/registration/payment-proof — upload proof screenshot
router.post(
  '/payment-proof',
  uploadLimiter,
  upload.single('proof'),
  registrationController.uploadPaymentProof
);

module.exports = router;
