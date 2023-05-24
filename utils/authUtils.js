import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
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

export const encryptPassword = async (password) => {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
};

export const checkPassword = async (password, hash) => {
  console.log(password, hash);
  return await bcrypt.compare(password, hash);
};
