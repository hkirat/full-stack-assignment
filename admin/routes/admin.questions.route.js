const express = require("express");
const postQuestions = require("../controllers/admin.questions.controller");
const adminQuestionsRouter = express();

adminQuestionsRouter.post("/:adminEmail/postQuestions", postQuestions);

module.exports = adminQuestionsRouter;
