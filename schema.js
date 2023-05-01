const joi = require('joi');

// Define the schema for the request payload while signing up or signing in
const emailPasswordSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
  role: joi.string().optional().default('user')
});
// Define the schema for the request payload while storing a submission
const submissionSchema = joi.object({
  questionId: joi.number().required(),
  code: joi.string().required(),
  language: joi.string().valid('javascript', 'python').required()
});
// Define the schema for the request payload while submitting a question
const questionSchema = joi.object({
  title: joi.string().required(),
  description: joi.string().optional(),
  testCases: joi.array().items(joi.object({
    input: joi.string().required(),
    output: joi.string().required()
  })).min(1).required()
});

module.exports = {emailPasswordSchema, submissionSchema, questionSchema};