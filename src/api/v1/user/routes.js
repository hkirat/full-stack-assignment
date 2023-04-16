const express = require("express");
const {
  requireUserloginWithEmail,
  requireUserAuthenticationUsingJWT,
  helpers,
} = require("../../../helpers/authentication.js/index");
const { authError } = require("../../../helpers/api/index");
const user = require("./user");
const response = require("../../../helpers/api/index");

const authRoutesV1 = express.Router();
const userRoutesV1 = express.Router();
/* 
    Authentication Routes 
*/

// register user
authRoutesV1.post("/register", user.signUp, authError);

authRoutesV1.post("/login", requireUserloginWithEmail, user.login, authError);

//  refresh access token
authRoutesV1.post("/token");
//  get current user
authRoutesV1.get("/user");

/*
    userRoutesV1
*/
userRoutesV1.get("/submissions", user.fetchAllSubmissionsByUser, authError);

userRoutesV1.post("/submissions", user.addSubmissionToQuestion, authError);

module.exports = { authRoutesV1, userRoutesV1 };
