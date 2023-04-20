const express = require("express");
const addSubmissionHandler = require("../handlers/addSubmission");
const getSubmissionsHandler = require("../handlers/getSubmissions");
const { tokenDecode } = require("../middlewares/auth");

const submissionRouter = express.Router();

submissionRouter.post("/submission", tokenDecode, addSubmissionHandler);
submissionRouter.get("/submission", getSubmissionsHandler);

module.exports = submissionRouter;
