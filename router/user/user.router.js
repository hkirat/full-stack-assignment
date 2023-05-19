const express = require("express");
const bcrypt = require("bcrypt");
const user = express.Router();
const {
  userSignin,
  userSignup,
} = require("../../controller/user/userAuth.controller");
const {
  getAllQuestions,
  getSubmission,
  postSubmission,
  getQuestion,
} = require("../../controller/user/problem.controller");
const Authorization = require("../../middleware/tokenAuthorizer");

// auth routes
user.post("/signup", userSignup);
user.post("/signin", userSignin);
// user.post('/signout',);

// question routes
user.get("/problems/all", getAllQuestions);
user.get("/question/:id", Authorization, getQuestion); // to get a single question

// submission routes
user.get("/submissions", Authorization, getSubmission);
user.post("/submissions", Authorization, postSubmission);

module.exports = user;
