const adminService = require('../services/admin.service');
const eventService = require('../services/event.service');
const auditService = require('../services/audit.service');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * GET /api/admin/dashboard
 */
exports.getDashboard = async (req, res, next) => {
  try {
    const stats = await adminService.getDashboardStats();
    return sendSuccess(res, { stats });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/registrations
 */
exports.listRegistrations = async (req, res, next) => {
  try {
    const { status, search, limit, offset } = req.query;
    const result = await adminService.listRegistrations({
      status,
      search,
      limit,
      offset,
    });
    return sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/admin/registrations/:id/verify
 */
exports.verifyRegistration = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;
    const adminUid = req.user.uid;

    const result = await adminService.verifyRegistration(adminUid, id, status, reason);
    return sendSuccess(res, result, 200, `Payment status updated to ${status}.`);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/submissions
 */
exports.listSubmissions = async (req, res, next) => {
  try {
    const { track, status, search, limit, offset } = req.query;
    const result = await adminService.listSubmissions({
      track,
      status,
      search,
      limit,
      offset,
    });
    return sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/admin/submissions/:id/review
 */
exports.reviewSubmission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, feedback } = req.body;
    const adminUid = req.user.uid;

    const result = await adminService.reviewSubmission(adminUid, id, status, feedback);
    return sendSuccess(res, result, 200, `Submission marked as ${status}.`);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/participant/:uid
 */
exports.getParticipantDetail = async (req, res, next) => {
  try {
    const { uid } = req.params;
    const adminUid = req.user.uid;

    const result = await adminService.getParticipantDetail(adminUid, uid);
    return sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/participant/:uid/file-url
 */
exports.getFileSignedUrl = async (req, res, next) => {
  try {
    const { uid } = req.params;
    const { fileType } = req.query; // 'payment-proof' | 'abstract' | 'poster'
    const adminUid = req.user.uid;

    const result = await adminService.getFileSignedUrl(adminUid, fileType, uid);
    return sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/audit-logs
 */
exports.getAuditLogs = async (req, res, next) => {
  try {
    const { limit, offset } = req.query;
    const logs = await auditService.getLogs({
      limit: parseInt(limit, 10) || 50,
      offset: parseInt(offset, 10) || 0,
    });
    return sendSuccess(res, { logs });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/admin/event-config
 */
exports.updateEventConfig = async (req, res, next) => {
  try {
    const adminUid = req.user.uid;
    const updated = await eventService.updateEventConfig(adminUid, req.body);
    return sendSuccess(res, { config: updated }, 200, 'Event configuration updated.');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/admin/announcements
 */
exports.createAnnouncement = async (req, res, next) => {
  try {
    const adminUid = req.user.uid;
    const { title, content, priority, category } = req.body;
    if (!title || !content) {
      return sendError(res, 'Title and content are required.', 400);
    }
    const created = await eventService.createAnnouncement(adminUid, {
      title,
      content,
      priority,
      category,
    });
    return sendSuccess(res, { announcement: created }, 201, 'Announcement posted.');
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/admin/announcements/:id
 */
exports.deleteAnnouncement = async (req, res, next) => {
  try {
    const adminUid = req.user.uid;
    const { id } = req.params;
    await eventService.deleteAnnouncement(adminUid, id);
    return sendSuccess(res, null, 200, 'Announcement deleted.');
  } catch (err) {
    next(err);
  }
};
