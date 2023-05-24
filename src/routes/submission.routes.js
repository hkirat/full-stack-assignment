const express = require("express");
const {
  getSubmissionsOfProblem,
  addSubmissionToProblem,
} = require("../controllers/submission.controllers");

const router = express.Router();

router.get("/", getSubmissionsOfProblem);
router.post("/", addSubmissionToProblem);

module.exports = router;