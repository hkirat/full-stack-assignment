const express = require("express");
const adminLogin = require("../controllers/admin.login.controller");
const adminLoginRouter = express();

adminLoginRouter.post("/adminLogin", adminLogin);

module.exports = adminLoginRouter;
