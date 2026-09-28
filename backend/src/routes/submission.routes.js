const express = require('express');
const multer = require('multer');
const router = express.Router();
const submissionController = require('../controllers/submission.controller');
const { requireAuth } = require('../middleware/auth');
const { uploadLimiter } = require('../middleware/rateLimit');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB per file max
});

// All submission routes require authentication
router.use(requireAuth);

// POST /api/submission
router.post(
  '/',
  uploadLimiter,
  upload.fields([
    { name: 'abstractFile', maxCount: 1 },
    { name: 'posterFile', maxCount: 1 },
    { name: 'poster', maxCount: 1 }, // Fallback for backwards compatibility
  ]),
  submissionController.createSubmission
);

// GET /api/submission/me
router.get('/me', submissionController.getMySubmission);

module.exports = router;
