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
} = require("../../controller/user/problem.controller");

// auth routes
user.post("/signup", userSignup);
user.post("/signin", userSignin);
// user.post('/signout',);

// question routes
user.get("/questions", getAllQuestions);
// user.get('/question/:id')  to get a single question

// submission routes
user.get("/submissions", getSubmission);
user.post("/submissions", postSubmission);

module.exports = user;
