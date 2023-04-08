const express = require("express");
const router = express.Router();
const { getAllQuestions } = require("../controllers/questionsController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.get("/questions", authMiddleware, getAllQuestions);

//TODO: Only Admins can post questions
//router.post()

module.exports = router;
