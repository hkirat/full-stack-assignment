const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) return res.status(401).json({ message: "Access denied" });
  jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
    if (err)
      return res.status(401).json({
        message: "Failed to authenticate token",
      });
    req.user = data;
    next();
  });
};

module.exports = verifyJWT;
