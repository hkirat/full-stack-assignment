const jwt = require("jsonwebtoken");
const { verifyToken } = require("../utils/common");
const { USERS } = require("../model/Users");

exports.authenticated = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).send({
        status: "FAIL",
        code: 401,
        message: "No token, authorization denied",
      });
    }

    const decoded = verifyToken(token);
    const { user: decodedUser } = decoded;

    const currentUser = USERS.find((user) => user.id === decodedUser.id);

    if (!currentUser)
      return res.status(400).send({
        status: "FAIL",
        code: 400,
        message: "User not found",
      });

    const { email, id } = currentUser;

    req.user = { email, id };

    next();
  } catch (error) {
    console.log(
      "🚀 ~ file: authenticated.js:35 ~ exports.authenticated= ~ error:",
      error
    );
    res.status(500).send({
      status: "Fail",
      code: 500,
      message: "Internal Server Error",
    });
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const user = USERS.find((user) => user.id === userId);

    if (!user) {
      return res.status(400).send({
        status: "Fail",
        code: 400,
        message: "User Not Found",
      });
    }

    if (!user.isAdmin) {
      return res.status(400).send({
        status: "Fail",
        code: 400,
        message: "Only admin can access this route",
      });
    }

    next();
  } catch (error) {
    res.status(500).send({
      status: "Fail",
      code: 500,
      message: "Internal Server Error",
    });
  }
};
