const express = require("express");
const addQuestionHandler = require("../handlers/addQuestion");
const getAllQuestionsHandler = require("../handlers/getAllQuestions");
const { adminOnly, tokenDecode } = require("../middlewares/auth");

const questionRouter = express.Router();

questionRouter.post("/question", tokenDecode, adminOnly, addQuestionHandler);
questionRouter.get("/question", getAllQuestionsHandler);

module.exports = questionRouter;
