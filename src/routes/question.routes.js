const express = require("express");
const {
  getQuestions,
  addQuestion,
} = require("../controllers/question.controllers");
const authMiddleware = require("../middlewares/auth.middleware");
const isAdmin = require('../middlewares/isAdmin.middleware');

const router = express.Router();

router.get("/", getQuestions);
router.post("/", authMiddleware, isAdmin, addQuestion);

module.exports = router;
