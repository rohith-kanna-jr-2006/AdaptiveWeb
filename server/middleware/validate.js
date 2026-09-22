/**
 * Higher-order middleware to execute validation rules.
 * @param {Function} validatorFn - Function returning { error, value } or string message
 */
const validate = (validatorFn) => {
  return (req, res, next) => {
    const error = validatorFn(req);
    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: typeof error === 'string' ? error : error.message
        }
      });
    }
    next();
  };
};

module.exports = validate;
