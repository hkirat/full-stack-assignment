const express = require("express");
const login = require("../controllers/login.controller");
const loginRouter = express();

loginRouter.post("/login", login);

module.exports = loginRouter;
