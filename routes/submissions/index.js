const express = require("express");
const { getAllSubmissions } = require("../../controller/submission_controller");

const route = express.Router();

route.get("/", getAllSubmissions);

module.exports = route;
