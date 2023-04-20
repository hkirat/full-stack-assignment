const Question = require("../models/question");

async function addQuestionHandler(req, res) {
  const { title, statement, testcases } = req.body;

  if (
    !title ||
    !statement ||
    !testcases ||
    testcases.length === 0 ||
    !testcases[0].input ||
    !testcases[0].output
  ) {
    res.status(400).json({
      error: "Title, statement, and testcases are mandatory fields",
    });
    return;
  }

  try {
    const existingTitle = await Question.findOne({
      title,
    });
    const existingStatement = await Question.findOne({ statement });
    let errorMessage = null;

    if (existingTitle && existingStatement) {
      errorMessage = "Question with same title & statement already exists";
    } else if (existingTitle) {
      errorMessage = "Question with same title already exists";
    } else if (existingStatement) {
      errorMessage = "Question with same statement already exists";
    }

    if (errorMessage) {
      res.status(409).json({ message: errorMessage });
      return;
    }

    const question = new Question({ title, statement, testcases });
    await question.save();

    res.status(201).json({ question });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
}

module.exports = addQuestionHandler;
