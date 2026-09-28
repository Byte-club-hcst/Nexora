const submissionService = require('../services/submission.service');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * POST /api/submission
 */
exports.createSubmission = async (req, res, next) => {
  try {
    const uid = req.user.uid;
    const submission = await submissionService.createSubmission(uid, req.body, req.files);

    return sendSuccess(res, { submission }, 201, 'Abstract and poster submitted successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/submission/me
 */
exports.getMySubmission = async (req, res, next) => {
  try {
    const uid = req.user.uid;
    const submission = await submissionService.getMySubmission(uid);
    if (!submission) {
      return sendError(res, 'No abstract submission found for this account.', 404);
    }

    return sendSuccess(res, { submission });
  } catch (err) {
    next(err);
  }
};
