const env = require('../config/env');

/**
  * Centralized error handler middleware.
  * Ensures safe, standard JSON response structure for all application errors.
  */
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  let code = err.code || 'SERVER_ERROR';
  let message = err.message || 'An unexpected server error occurred';

  // Handle SyntaxError (e.g. Malformed JSON)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    code = 'MALFORMED_JSON';
    message = 'Malformed JSON body in request payload';
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    const messages = Object.values(err.errors).map(e => e.message);
    message = messages.join(', ');
  }

  // Handle Mongoose CastError (e.g., invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    code = 'INVALID_ID';
    message = `Invalid value for ${err.path}`;
  }

  // Ensure 500 status code defaults code to SERVER_ERROR
  if (statusCode === 500 && code === 'SERVER_ERROR') {
    message = env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred on the server' 
      : message;
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message
    }
  });
};

module.exports = errorHandler;
