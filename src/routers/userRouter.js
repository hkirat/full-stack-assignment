const catchAsync = require("../../utils/errors/catchAsync");
const validateUserSignup = require("../../utils/JoiSchema/validateUserSignup");
const validateUserLogin = require("../../utils/JoiSchema/validateUserLogin");
const User = require("../models/User");
const express = require("express");
const router = express.Router();

router.post(
  "/signup",
  validateUserSignup,
  catchAsync(async (req, res, next) => {
    const user = await new User(req.body);
    user.save();
    res.send({ message: user });
  })
);

router.post(
  "/login",
  validateUserLogin,
  catchAsync(async (req, res, next) => {
    const user = await User.findByCred(req.body.email, req.body.password);
    if (!user) {
      res.send("Sorry no user found");
    } else {
      const token = await user.genAuthToken();
      res.send({ user, token });
    }
  })
);

module.exports = router;
