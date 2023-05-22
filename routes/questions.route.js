const express = require("express");
const questions = require("../controllers/questions.controller");
const questionsRouter = express();

questionsRouter.post("/questions", questions);

module.exports = questionsRouter;
