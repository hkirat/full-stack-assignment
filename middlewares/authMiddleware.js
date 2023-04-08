const jwt = require("jsonwebtoken");
const USERS = require("../models/User");

exports.authMiddleware = function (req, res, next) {
  const token = req.cookies["token"];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    const user = USERS.find((val) => val.id === decoded.user.id);
    if (!user) {
      return res.status(401).json({ error: "User doesn't exists" });
    }
    next(); // TODO: might remove later
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

//TODO: add a admin authentication
