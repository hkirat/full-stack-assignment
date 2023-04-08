const express = require("express");
const {
  getSubmissionsByQuestion,
  submitSolution,
} = require("../controllers/submissionController");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const { codeValidator } = require("../middlewares/validators");

// Get submissions based on specific question
router.get(
  "/submissions/:questionId",
  authMiddleware,
  getSubmissionsByQuestion
);

// Submit a solution for a specific question
router.post(
  "/submissions/:questionId",
  authMiddleware,
  [codeValidator],
  submitSolution
);

module.exports = router;
