const responseHandler = (_req, res, next) => {
  res.customJson = (data, message, statusCode) => {
    const response = {
      success: statusCode >= 200 && statusCode < 300,
      data: data,
      message: message,
      statusCode: statusCode,
    };
    res.json(response);
  };

  next();
};

module.exports = responseHandler;