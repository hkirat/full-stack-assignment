const express = require("express");
const bcrypt = require("bcrypt");
const admin = express.Router();
const {
  adminSignin,
  adminSignup,
} = require("../../controller/admin/adminAuth.controller");

admin.post("/signup", adminSignup);
admin.post("/signin", adminSignin);
// admin.post('/signout',);

module.exports = admin;
