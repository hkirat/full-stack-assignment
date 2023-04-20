const jwt = require("jsonwebtoken");
const config = require("../config");

// Create JWT authentication token
function createAuthToken(userId) {
  const payload = { userId };
  const jwtSecret = config.jwtSecret; // JWT secret

  // If secret is not present then raise a error
  if (!jwtSecret) throw new Error("JWT secret not provided");

  const authToken = jwt.sign(payload, jwtSecret);
  return authToken;
}

module.exports = { createAuthToken };
