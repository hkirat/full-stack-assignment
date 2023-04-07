const jwt = require("jsonwebtoken");
const { verifyToken } = require("../utils/common");

exports.authenticated = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res
        .status(401)
        .send({ message: "No token, authorization denied" });
    }

    const decoded = verifyToken(token);
    const { user } = decoded;

    req.user = user;

    next();
  } catch (error) {
    res.status(500).send({
      status: "Fail",
      code: 500,
      message: "Internal Server Error",
    });
  }
};
