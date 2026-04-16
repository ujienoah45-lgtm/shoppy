class CustomError extends Error {
  constructor(errMsg, statusCode) {
    super(errMsg);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';

    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
};

module.exports = CustomError;