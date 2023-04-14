import jwt, { Secret } from "jsonwebtoken";
import config from "../config";

// Generate JWT authentication token
function generateAuthToken(userId: string): string {
  const payload = { userId }; // Data to be embedded inside the token
  const jwtSecret = config.jwtSecret; // Token secret
  const jwtExpiration = config.jwtExpiration; // Time after which token is invalid

  // If secret is absent then raise a error
  if (!jwtSecret) throw new Error("JWT secret not provided");

  // Create the auth-token
  const authToken = jwt.sign(payload, jwtSecret as Secret, {
    expiresIn: jwtExpiration,
  });
  return authToken;
}

export { generateAuthToken };
