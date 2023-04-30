const jwt = require('jsonwebtoken');
const {emailPasswordSchema, submissionSchema} = require("./schema");

// Use JWT_SECRET environment variables to sign and verify JWTs
const SIGN_UP_SECRET = `${process.env.JWT_SECRET_SIGN_UP}`;

// Export a middleware function that performs the params validation while signing up or signing in
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

// Export a middleware function that performs the params validation while storing a submission
const reqParamsValidatorSub = (req, res, next) => {
  const { error, value } = submissionSchema.validate(req.body, {
    abortEarly: false, // Include all validation errors, not just the first one
    messages: {
      'string.valid': 'Only javascript and python submissions are accepted'
    },
  });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return res.status(400).json({ errors });
  }
  req.validatedData = value;
  next();
};

// Export a middleware function that performs the access token validation
const verifyAccessToken = (req, res, next) => {
  const accessToken = req.cookies['access-token'];

  // Check if the access token is present
  if (!accessToken) {
      return res.status(401).json({ error: 'Unauthorized: Access token not provided.' });
  }

  // Verify the access token
  try {
    const decodedToken = jwt.verify(accessToken, SIGN_UP_SECRET);
    req.user = decodedToken.email;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid access token.' });
  }
}

module.exports = {requiredParamsValidator, verifyAccessToken, reqParamsValidatorSub}
