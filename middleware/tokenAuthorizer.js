const jwt = require("jsonwebtoken");

const Authorization = (req, res, next) => {
  const header = req.headers.authorization;
  if (header) {
    jwt.verify(header.split(" ")[1], process.env.SECRETKEY, (err, user) => {
      if (err) {
        return res.status(403).json({ err: "Token expired try login" });
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(403).json({ err: "Please try login to access" });
  }
};

module.exports = Authorization;
