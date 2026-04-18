const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map(err => err.msg).join('; ');
    throw new AppError(`Validation error: ${messages}`, 400);
  }
  next();
};

module.exports = validate;