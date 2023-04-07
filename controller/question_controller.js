const { v4: uuidv4 } = require("uuid");
const { USERS, validateUser } = require("../model/Users");
const { QUESTIONS, validateQuestion } = require("../model/Questions");

/* -------------------------------------------------------------------------- */
/*                                   GET ALL QUESTIONS                        */
/* -------------------------------------------------------------------------- */
exports.getAllQuestions = async (req, res) => {
  try {
    return res.status(200).send({
      status: "Pass",
      code: 200,
      data: QUESTIONS,
      message: "List of questions",
    });
  } catch (error) {
    res.send({
      message: "Internal Server Error",
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                                    POST QUESTIONS                          */
/* -------------------------------------------------------------------------- */
exports.addQuestions = async (req, res) => {
  try {
    const { error } = validateQuestion(req.body);
    if (error)
      return res.status(400).send({
        status: "Fail",
        code: 400,
        message: error.details.map((error, index) => ({
          error: error.message,
        })),
      });

    const { id: userId } = req.user;
    const { title, description, testCases } = req.body;

    const question = {
      id: uuidv4(),
      title,
      description,
      testCases,
      creatorId: userId,
    };

    QUESTIONS.push(question);

    return res.status(200).send({
      status: "Pass",
      code: 200,
      data: question,
      message: "Question added successfully",
    });
  } catch (error) {
    res.send({
      message: "Internal Server Error",
    });
  }
};
