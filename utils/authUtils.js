import jwt from "jsonwebtoken";
import { JWT_EXPIRE, JWT_SECRET } from "../config/index.js";

export const generateJwtToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};

export const validateToken = (req) => {
  const token = req.get("Authorization");

  if (!token) return false;

  const payload = jwt.verify(token, JWT_SECRET);
  req.user = payload;

  return true;
};
