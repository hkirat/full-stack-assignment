const { v4: uuidv4 } = require("uuid");
const { USERS, validateUser } = require("../model/Users");
const { QUESTIONS, validateQuestion } = require("../model/Questions");
const { formatQuestionsList, formatQuestion } = require("../utils/format");
const { QUESTION_TYPE } = require("../utils/constants");
const { RES_STATUS } = require("../utils/constants");

/* -------------------------------------------------------------------------- */
/*                                   GET ALL QUESTIONS                        */
/* -------------------------------------------------------------------------- */
exports.getAllQuestions = async (req, res) => {
  try {
    const formattedQuestionsList = formatQuestionsList(QUESTIONS);

    return res.status(200).send({
      status: RES_STATUS.PASS,
      code: 200,
      data: formattedQuestionsList,
      message: "List of questions",
    });
  } catch (error) {
    console.log(
      "🚀 ~ file: question_controller.js:22 ~ exports.getAllQuestions= ~ error:",
      error
    );
    res.status(500).send({
      status: RES_STATUS.FAIL,
      code: 500,
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
        status: RES_STATUS.FAIL,
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
      difficulty: QUESTION_TYPE[Math.floor(Math.random() * 3)],
    };

    QUESTIONS.push(question);

    const formattedQuestion = formatQuestion(question);

    return res.status(200).send({
      status: RES_STATUS.PASS,
      code: 200,
      data: formattedQuestion,
      message: "Question added successfully",
    });
  } catch (error) {
    res.status(500).send({
      status: RES_STATUS.FAIL,
      code: 500,
      message: "Internal Server Error",
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                                    GET SINGLE QUESTIONS                    */
/* -------------------------------------------------------------------------- */
exports.getSingleQuestions = async (req, res) => {
  try {
    const { questionId } = req.params;
    const question = QUESTIONS.find((question) => question.id === questionId);

    if (!question)
      return res.status(200).send({
        status: RES_STATUS.FAIL,
        code: 200,
        data: {},
        message: "Question Not Found",
      });

    const formattedQuestion = formatQuestion(question);

    return res.status(200).send({
      status: RES_STATUS.PASS,
      code: 200,
      data: formattedQuestion,
      message: "Question added successfully",
    });
  } catch (error) {
    res.status(500).send({
      status: RES_STATUS.FAIL,
      code: 500,
      message: "Internal Server Error",
    });
  }
};
