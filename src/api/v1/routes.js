const express = require("express");
const { authRoutesV1, userRoutesV1 } = require("./user/routes");
const { questionRoutesV1 } = require("./question/routes");
const {
  requireUserloginWithEmail,
  requireUserAuthenticationUsingJWT,
} = require("../../helpers/authentication.js/index");
const { authError } = require("../../helpers/api/index");

const v1Routes = express.Router();

v1Routes.use("/auth", authRoutesV1);
v1Routes.use("/user", requireUserAuthenticationUsingJWT, userRoutesV1);
v1Routes.use("/questions", requireUserAuthenticationUsingJWT, questionRoutesV1);

module.exports = v1Routes;
