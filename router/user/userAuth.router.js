const express = require("express");
const bcrypt = require("bcrypt");
const userAuth = express.Router();
const {
  userSignin,
  userSignup,
} = require("../../controller/user/userAuth.controller");

userAuth.post("/signup", userSignup);
userAuth.post("/signin", userSignin);
// userAuth.post('/signout',);

module.exports = userAuth;
