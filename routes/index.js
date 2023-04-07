const express = require("express");

const route = express.Router();

route.use("/auth", require("./auth"));
route.use("/question", require("./question"));
route.use("/submission", require("./submissions"));

module.exports = route;
