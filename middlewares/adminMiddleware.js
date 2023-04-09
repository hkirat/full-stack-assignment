const jwt = require("jsonwebtoken");
const ADMINS = require("../models/Admin");

exports.adminMiddleware = function (req, res, next) {
  const token = req.cookies["token"];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded.admin;
    const admin = ADMINS.find((val) => val.id === decoded.admin.id);
    if (!admin) {
      return res.status(401).json({ error: "Admin doesn't exists" });
    }
    next(); // TODO: might remove later
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
