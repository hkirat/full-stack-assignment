const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.tokenDecode = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Authentication token was not found." });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: "Invalid access token." });
  }
};

exports.adminOnly = async (req, res, next) => {
  const userId = req.userId;

  try {
    // Get user with userId from database
    const user = await User.findById(userId);

    if (!user) {
      res.status(401).json({ error: "User not found." });
      return;
    }
    // If user is not admin send error
    if (user.role !== "admin") {
      res.status(403).json({ message: "Unauthorized access." });
      return;
    }
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
};
