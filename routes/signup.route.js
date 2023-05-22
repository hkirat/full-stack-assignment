const express = require("express");
const signup = require("../controllers/signup.controller");
const signupRouter = express();

signupRouter.post("/signup", signup);

module.exports = signupRouter;
