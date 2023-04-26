const express = require("express");
const {
  getAllSubmissions,
  addSubmissions,
  getFilteredSubmission,
  getSingleSubmission,
} = require("../../controller/submission_controller");

const route = express.Router();

route.get("/", getAllSubmissions);
route.get("/:questionId", getSingleSubmission);
route.post("/:questionId", addSubmissions);
route.post("/:userId", getFilteredSubmission);

module.exports = route;
