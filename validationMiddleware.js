const Joi = require('joi');

// Define the schema for the request payload
const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Export a middleware function that performs the validation
module.exports = (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false, // Include all validation errors, not just the first one
    messages: {
      'string.email': 'Please enter a valid email address',
      'string.min': 'Password must be at least 6 characters long'
    },
  });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return res.status(400).json({ errors });
  }
  req.validatedData = value;
  next();
};
