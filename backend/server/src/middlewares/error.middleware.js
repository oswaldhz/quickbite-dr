const logger = require('../utils/logger');
const AppError = require('../utils/AppError');
const { NODE_ENV } = require('../config/env');

// Handle Sequelize specific errors
const handleSequelizeError = (err) => {
  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map(e => e.message).join(', ');
    return new AppError(`Validation error: ${messages}`, 400);
  }
  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors[0].path;
    return new AppError(`${field} already exists`, 409);
  }
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return new AppError('Invalid reference: related record does not exist', 400);
  }
  return err;
};

const errorHandler = (err, req, res, next) => {
  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    user: req.user?.id
  });

  // Handle known errors
  let error = err;
  if (error.name && error.name.startsWith('Sequelize')) {
    error = handleSequelizeError(error);
  }

  // Operational errors (AppError instances)
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message
    });
  }

  // Unknown errors
  const statusCode = error.statusCode || 500;
  const message = NODE_ENV === 'production'
    ? 'Internal server error'
    : error.message || 'Something went wrong';

  res.status(statusCode).json({
    success: false,
    message,
    ...(NODE_ENV !== 'production' && { stack: error.stack })
  });
};

module.exports = errorHandler;