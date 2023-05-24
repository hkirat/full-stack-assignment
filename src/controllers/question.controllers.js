const { QUESTIONS } = require("../database/data");

const getQuestions = async (_req, res) => {
  //return the user all the questions in the QUESTIONS array
  res.customJson(QUESTIONS, "Questions fetched successfully", 200);
};

const addQuestion = async (req, res, next) => {
  try {
    // leaving as hard todos
    // Create a route that lets an admin add a new problem
    // ensure that only admins can do that.
    const { title, description, testCases } = req.body;
    if (!title || !description || !testCases) {
      const err = new Error("Please provide all the required fields");
      err.statusCode = 400;
      throw err;
    }

    const newQuestion = {
      title,
      description,
      testCases,
    };

    QUESTIONS.push(newQuestion);
    res.customJson(newQuestion, "Question added successfully", 201)
  } catch (error) {
    next(error);
  }
};

module.exports = { getQuestions, addQuestion };
