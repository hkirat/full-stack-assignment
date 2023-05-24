import { QUESTIONS } from "../models/Question.js";

const getAllQuestions = (req, res) => {
  return res.status(200).json({ data: { questions: QUESTIONS } });
};

export { getAllQuestions };
