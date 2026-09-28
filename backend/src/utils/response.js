/**
 * Standardized JSON API responses per Phase 15 specification
 */

const sendSuccess = (res, data = {}, status = 200, message = null) => {
  const response = {
    success: true,
    data,
  };
  if (message) {
    response.message = message;
  }
  return res.status(status).json(response);
};

const sendError = (res, message = 'An error occurred', status = 400, errors = null) => {
  const response = {
    success: false,
    message,
  };
  if (errors) {
    response.errors = errors;
  }
  return res.status(status).json(response);
};

module.exports = {
  sendSuccess,
  sendError,
};
