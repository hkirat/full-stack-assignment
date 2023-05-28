const isAdmin = (req, _res, next) => {
  // Check if the user is an admin
  if (req.user.email !== 'admin@admin.com') {
    const err = new Error("Only admins can perform this operation");
    err.statusCode = 403;
    return next(err);
  }

  next();
};

module.exports = isAdmin;