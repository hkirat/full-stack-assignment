const express = require("express");
const v1Routes = require("./v1/routes");
const routes = express.Router();
routes.use("/v1", v1Routes);

module.exports = routes;
