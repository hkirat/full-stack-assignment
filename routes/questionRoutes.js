const express = require("express");
const router = express.Router();
const {
  getAllQuestions,
  addQuestion,
} = require("../controllers/questionsController");
const { adminMiddleware } = require("../middlewares/adminMiddleware");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { createQuestionValidator } = require("../middlewares/validators");

router.get("/questions", authMiddleware, getAllQuestions);

//TODO: Only Admins can post questions
router.post(
  "/admin/question",
  adminMiddleware,
  [createQuestionValidator],
  addQuestion
);

module.exports = router;
