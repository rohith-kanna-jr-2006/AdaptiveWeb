/**
  * 404 Not Found handler.
  * Ensures uniform error response structure across the application.
  */
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Resource not found: ${req.method} ${req.originalUrl}`
    }
  });
};

module.exports = notFoundHandler;
