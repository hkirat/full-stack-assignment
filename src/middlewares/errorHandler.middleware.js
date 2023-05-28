const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: {
      message: err.message || "Internal Server Error",
      statusCode: statusCode,
    },
  });
};

module.exports = errorHandler;
