const joi = require('joi');

// Define the schema for the request payload while signing up or signing in
const emailPasswordSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});
// Define the schema for the request payload while storing a submission
const submissionSchema = joi.object({
  questionId: joi.number().required(),
  code: joi.string().required(),
  language: joi.string().valid('javascript', 'python').required()
});

module.exports = {emailPasswordSchema, submissionSchema};