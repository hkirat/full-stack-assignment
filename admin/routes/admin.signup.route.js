const express = require("express");
const adminSignup = require("../controllers/admin.signup.controller");
const adminSignupRouter = express();

adminSignupRouter.post("/adminSignup", adminSignup);

module.exports = adminSignupRouter;
