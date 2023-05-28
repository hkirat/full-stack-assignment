const loggingMiddleware = (req, res, next) => {
  const startTime = new Date();

  // Override the `res.end` method to log the response
  const originalEnd = res.end;
  res.end = (chunk, encoding) => {
    const duration = new Date() - startTime;

    // Log the response status code, duration, and timestamp
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.url} - ${
        res.statusCode
      } (${duration}ms)`
    );

    // Call the original `res.end` method
    res.end = originalEnd;
    res.end(chunk, encoding);
  };

  next();
};

module.exports = loggingMiddleware;
