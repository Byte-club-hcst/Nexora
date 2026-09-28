const multer = require('multer');
const env = require('../config/env');

function errorHandler(err, req, res, next) {
  // Always log server-side
  console.error('[ErrorHandler]', {
    method: req.method,
    url: req.originalUrl,
    message: err.message,
    stack: env.isProduction ? undefined : err.stack,
  });

  // Handle Multer upload errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Uploaded file exceeds the maximum permitted file size.',
      });
    }
    return res.status(400).json({
      success: false,
      message: `File upload error: ${err.message}`,
    });
  }

  // Handle JSON parse errors
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON payload received in request.',
    });
  }

  // Custom or assigned HTTP status
  const status = err.status || (err.statusCode && typeof err.statusCode === 'number' ? err.statusCode : 500);
  
  let message = err.message;
  if (status === 500 && env.isProduction) {
    message = 'An unexpected internal error occurred. Please try again later.';
  }

  res.status(status).json({
    success: false,
    message,
    ...(err.errors ? { errors: err.errors } : {}),
  });
}

module.exports = errorHandler;
