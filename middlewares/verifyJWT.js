const jwt = require("jsonwebtoken");

export const ACCESS_TOKEN_SECRET = "ThisShouldBeInDotEnvFile";

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); // Invalid token
    req.user = decoded.userInfo.username;
    next();
  });
};

module.exports = verifyJWT;
