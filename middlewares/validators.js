const { body } = require("express-validator");

//Adding validation and santization

exports.emailValidation = body("email")
  .isEmail()
  .normalizeEmail()
  .withMessage("Invalid email address");
exports.passwordValidation = body("password")
  .isLength({ min: 8 })
  .escape()
  .withMessage("Password must be at least 8 characters long");
