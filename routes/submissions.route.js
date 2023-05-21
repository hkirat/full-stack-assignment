const express = require("express");
const {
  getSubmissions,
  postSubmissions,
} = require("../controllers/submissions.controller");
const submissionsRouter = express();

submissionsRouter.get("/getSubmissions/:questionTitle", getSubmissions);
submissionsRouter.post("/postSubmissions", postSubmissions);

module.exports = submissionsRouter;
