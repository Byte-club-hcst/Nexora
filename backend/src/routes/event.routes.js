const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');

// GET /api/event/config
router.get('/config', eventController.getConfig);

// GET /api/event/announcements
router.get('/announcements', eventController.getAnnouncements);

module.exports = router;
