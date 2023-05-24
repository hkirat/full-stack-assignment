const express = require("express");
const {
  getQuestions,
  addQuestion,
} = require("../controllers/question.controllers");

const router = express.Router();

router.get("/", getQuestions);
router.post("/", addQuestion);

module.exports = router;
