const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.hashPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

exports.comparePasswords = async (password, hashedPassword) => {
  const result = await bcrypt.compare(password, hashedPassword);
  return result;
};

exports.generateToken = (payload) => {
  const secret = process.env.JWT_SECRET_KEY;
  const expiresIn = process.env.EXPIRES_IN;

  const options = {
    expiresIn,
  };

  return jwt.sign(payload, secret, options);
};

exports.verifyToken = (token) => {
  const secret = process.env.JWT_SECRET_KEY;

  return jwt.verify(token, secret);
};
