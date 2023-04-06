const express = require("express");
const { signup, login } = require("../../controller/auth_controller");

const route = express.Router();

route.use("/signup", signup);
route.use("/login", login);

module.exports = route;
