const {emailPasswordSchema} = require("./schema");

// Export a middleware function that performs the params validation
const requiredParamsValidator = (req, res, next) => {
  const { error, value } = emailPasswordSchema.validate(req.body, {
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

module.exports = {requiredParamsValidator}
