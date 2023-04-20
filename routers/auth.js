const express = require("express");
const signupHandler = require("../handlers/signup");
const loginHandler = require("../handlers/login");

const authRouter = express.Router();

authRouter.post("/signup", signupHandler);
authRouter.post("/login", loginHandler);

module.exports = authRouter;
