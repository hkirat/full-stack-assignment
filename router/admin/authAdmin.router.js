const express = require("express");
const bcrypt = require("bcrypt");
const adminAuth = express.Router();
const {
  adminSignin,
  adminSignup,
} = require("../../controller/admin/adminAuth.controller");

adminAuth.post("/signup", adminSignup);
adminAuth.post("/signin", adminSignin);
// adminAuth.post('/signout',);

module.exports = adminAuth;
