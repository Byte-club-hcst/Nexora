const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { requireAuth } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');

// All admin routes strictly enforce Firebase token verification + admin custom claims
router.use(requireAuth, requireAdmin);

// Analytics
router.get('/dashboard', adminController.getDashboard);

// Registrations & Payments
router.get('/registrations', adminController.listRegistrations);
router.patch('/registrations/:id/verify', adminController.verifyRegistration);

// Submissions & Reviews
router.get('/submissions', adminController.listSubmissions);
router.patch('/submissions/:id/review', adminController.reviewSubmission);

// Participant Detail & File Access
router.get('/participant/:uid', adminController.getParticipantDetail);
router.get('/participant/:uid/file-url', adminController.getFileSignedUrl);

// Audit Trail
router.get('/audit-logs', adminController.getAuditLogs);

// Event Configuration Management
router.put('/event-config', adminController.updateEventConfig);

// Announcements Management
router.post('/announcements', adminController.createAnnouncement);
router.delete('/announcements/:id', adminController.deleteAnnouncement);

module.exports = router;
