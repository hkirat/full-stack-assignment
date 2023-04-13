const jwt = require("jsonwebtoken");
const constants = require("../lib/constants.js");
const { getUser } = require("../config/fakedatabase.js");

const generateAccessToken = (email, isAdmin) => {
  return jwt.sign({ email: email, is_admin: isAdmin }, constants.TOKEN_SECRET, {
    expiresIn: "1800s",
  });
};

const verifyAccessToken = (req, res, next) => {
  if (!req.cookies) {
    return res.status(401).send(constants.STATUS_CODES[401]);
  }

  const token = req.cookies["access_token"];

  if (!token) {
    return res.status(401).send(constants.STATUS_CODES[401]);
  }

  const decoded = jwt.verify(token, constants.TOKEN_SECRET);
  req.user = getUser(decoded.email);
  if (
    constants.ADMIN_ROUTES[req.path.replace("/", "")] != null &&
    constants.ADMIN_ROUTES[req.path.replace("/", "")] === req.method &&
    req.user.isAdmin === false
  ) {
    return res.status(401).send(constants.STATUS_CODES[401]);
  }
  return next();
};

module.exports = { generateAccessToken, verifyAccessToken };
