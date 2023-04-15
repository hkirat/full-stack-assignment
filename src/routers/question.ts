import express from "express";
import addQuestionHandler from "../handlers/addQuestion";
import getQuestionsHandler from "../handlers/getQuestions";
import { adminOnly, tokenDecode } from "../middlewares/auth";

const questionRouter = express.Router();

questionRouter.post("/question", tokenDecode, adminOnly, addQuestionHandler);
questionRouter.get("/question", getQuestionsHandler);

export default questionRouter;
