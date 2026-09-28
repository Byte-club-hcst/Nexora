const registrationService = require('../services/registration.service');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * POST /api/registration
 */
exports.createRegistration = async (req, res, next) => {
  try {
    const uid = req.user.uid;
    const verifiedEmail = req.user.email;

    if (!verifiedEmail) {
      return sendError(res, 'A verified email address is required to register.', 400);
    }

    const registration = await registrationService.createRegistration(
      uid,
      verifiedEmail,
      req.body
    );

    return sendSuccess(res, { registration }, 201, 'Registration submitted successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/registration/me
 */
exports.getMyRegistration = async (req, res, next) => {
  try {
    const registration = await registrationService.getMyRegistration(req.user.uid);
    if (!registration) {
      return sendError(res, 'No registration found for this account.', 404);
    }

    return sendSuccess(res, { registration });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/registration/payment-proof
 */
exports.uploadPaymentProof = async (req, res, next) => {
  try {
    const uid = req.user.uid;
    const result = await registrationService.uploadPaymentProof(uid, req.file);

    return sendSuccess(res, result, 200, 'Payment screenshot uploaded successfully. Pending verification.');
  } catch (err) {
    next(err);
  }
};
