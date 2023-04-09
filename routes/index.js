const express = require("express");
const { authenticated } = require("../middleware/authenticated");

const route = express.Router();

route.use("/auth", require("./auth"));
route.use("/user", require("./user"));
route.use("/question", authenticated, require("./question"));
route.use("/submission", authenticated, require("./submissions"));

module.exports = route;
