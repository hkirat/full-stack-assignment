const express = require("express");
const { signup, login } = require("../../controller/auth_controller");

const route = express.Router();

route.post("/signup", signup);
route.post("/login", login);

module.exports = route;
