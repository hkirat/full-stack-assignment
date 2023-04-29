import { USERS } from "../models/datasets.js";

export const isAuthenticated = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(404).json({
      success: false,
      message: "Login Fisrt",
    });
  }
  next();
};

export const isAdmin = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(404).json({
      success: false,
      message: "Login Fisrt",
    });
  }
  const user = USERS.find((user) => user.userid == token);

  if (user.userType != "admin") {
    return res.status(200).json({
      success: false,
      message: "Only Admins can Add Questions",
    });
  }
  next();
};
