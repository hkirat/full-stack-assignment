class AppError extends Error {
    constructor(message, statusCode, stat=null) {
      const status = (stat) ? stat : `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      super(message);
      this.statusCode = statusCode;
      this.status = status;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = AppError;