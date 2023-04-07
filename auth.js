import { USERS } from './index.js';
import { ERROR_MESSAGE } from './utils.js';
import jwt from 'jsonwebtoken';

export function validateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader.split(' ')[1];
  if (token == null)
    res.sendStatus(400).json({ message: ERROR_MESSAGE.EMPTY_TOKEN });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      res.status(403).json({ message: ERROR_MESSAGE.INVALID_TOKEN });
    } else {
      if (USERS.has(user.email)) {
        req.user = user;
        next();
      } else {
        res.status(401).json({ message: ERROR_MESSAGE.INVALID_CREDENTIALS });
      }
    }
  });
}

export function generateJwt(email, role) {
  const jwtSecret = process.env.JWT_SECRET;
  return jwt.sign({ email: email, role: role }, jwtSecret);
}
