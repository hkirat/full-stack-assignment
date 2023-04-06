const express = require("express");

const route = express.Router();

route.use("/auth", require("./auth"));

module.exports = route;
