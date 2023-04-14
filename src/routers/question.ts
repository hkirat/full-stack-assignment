import express from "express";
import addQuestionHandler from "../handlers/addQuestion";
import { adminOnly, tokenDecode } from "../middlewares/auth";
// import getQuestionHandler from "../handlers/getQuestion";

const questionRouter = express.Router();

questionRouter.post("/question", tokenDecode, adminOnly, addQuestionHandler);
// questionRouter.post("/question", getQuestionHandler);

export default questionRouter;
