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

exports.codeValidator = body("code")
  .notEmpty()
  .withMessage("Code is required")
  .escape();

exports.createQuestionValidator = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape()
    .withMessage("Title is required"),
  body("description")
    .trim()
    .isLength({ min: 1, max: 500 })
    .escape()
    .withMessage("Description is required"),
  body("testCases")
    .isArray()
    .notEmpty()
    .withMessage("Test cases must be an array with at least one element"),
  body("testCases.*.input")
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape()
    .withMessage("Test case must have input and output fields"),
  body("testCases.*.output")
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape()
    .withMessage("Test case must have input and output fields"),
];
