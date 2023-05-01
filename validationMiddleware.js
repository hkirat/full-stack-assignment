const jwt = require('jsonwebtoken');
const {emailPasswordSchema, submissionSchema, questionSchema} = require("./schema");
const USERS = require('./users');

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
// Export a middleware function that performs the params validation while storing a question
const reqParamsValidatorQues = (req, res, next) => {
  const { error, value } = questionSchema.validate(req.body, {
    abortEarly: false // Include all validation errors, not just the first one
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
// isAdmin middleware function to check if user is an admin
const isAdmin = (req, res, next) => {
  const user = USERS.find(user => user.email === req.user);
  if (!user) {
    return res.status(401).json({ message: 'Invalid user' });
  }
  if (user.role !== 'admin') {
    return res.status(403).json({ message: 'You are not authorized to access this resource' });
  }
  next();
}

module.exports = {requiredParamsValidator, verifyAccessToken, reqParamsValidatorSub, reqParamsValidatorQues, isAdmin}
