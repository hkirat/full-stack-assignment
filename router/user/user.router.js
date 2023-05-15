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

// auth routes
user.post("/signup", userSignup);
user.post("/signin", userSignin);
// user.post('/signout',);

// question routes
user.get("/problems/all", getAllQuestions);
user.get("/question/:id", getQuestion); // to get a single question

// submission routes
user.get("/submissions", getSubmission);
user.post("/submissions", postSubmission);

module.exports = user;
