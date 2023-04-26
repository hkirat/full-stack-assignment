const Joi = require('joi');

// Define the schema for the request payload
const emailPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

module.exports = {emailPasswordSchema};