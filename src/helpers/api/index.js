const success = (data) => {
  return { success: true, ...data };
};

const unAuthorized = () => {
  return { success: false, error: "You are not Authorized to access this" };
};
const error = (systemError, userErrorMessage, data = {}) => {
  if (systemError) {
    return { success: false, error: userErrorMessage };
  }
  return { success: false, error: userErrorMessage };
};
//  this is a middleware to handle error while route handling with regard to authorization
const authError = (err, req, res, next) => {
  return res.status(err.status || 401).json(error(null, err.message));
};
module.exports = { success, error, unAuthorized, authError };
