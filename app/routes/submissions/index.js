const express = require("express");
const {
  getAllSubmissions,
  addSubmissions,
  getFilteredSubmission,
} = require("../../controller/submission_controller");

const route = express.Router();

route.get("/", getAllSubmissions);
route.post("/:questionId", addSubmissions);
route.post("/:userId", getFilteredSubmission);

module.exports = route;
