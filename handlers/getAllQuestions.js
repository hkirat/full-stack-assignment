const Question = require("../models/question");

async function getAllQuestionsHandler(req, res) {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  try {
    const totalQuestions = await Question.countDocuments();
    const questions = await Question.find()
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.status(200).json({
      currentPage: page,
      totalPages: Math.ceil(totalQuestions / pageSize),
      totalQuestions,
      questions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
}

module.exports = getAllQuestionsHandler;
