const { v4: uuidv4 } = require("uuid");
const { USERS, validateUser } = require("../model/Users");
const { QUESTIONS } = require("../model/Questions");
const { SUBMISSIONS, validateSubmission } = require("../model/Submission");
const { formatSubmissionsList, formatSubmission } = require("../utils/format");

/* -------------------------------------------------------------------------- */
/*                             LIST OF SUBMISSIONS                            */
/* -------------------------------------------------------------------------- */
exports.getAllSubmissions = async (req, res) => {
  try {
    const formattedSubmissions = formatSubmissionsList();

    return res.status(200).send({
      status: "Pass",
      code: 200,
      data: formattedSubmissions,
      message: "List of submissions",
    });
  } catch (error) {
    res.send({
      message: "Internal Server Error",
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                               ADD SUBMISSIONS                              */
/* -------------------------------------------------------------------------- */
exports.addSubmissions = async (req, res) => {
  try {
    const { error } = validateSubmission(req.body);
    if (error)
      return res.status(400).send({
        status: "Fail",
        code: 400,
        message: error.details.map((error, index) => ({
          error: error.message,
        })),
      });

    const { id: userId } = req.user;
    const { questionId } = req.params;
    const { code } = req.body;

    const questionExist = QUESTIONS.find(
      (question) => question.id === questionId
    );

    if (!questionExist)
      return res.status(400).send({
        status: "Fail",
        code: 400,
        message: "Question does not exist",
      });

    const currentSubmission = {
      id: uuidv4(),
      userId,
      questionId,
      code,
      status: Boolean(Math.random() < 0.5) ? "Accepted" : "Rejected",
    };

    SUBMISSIONS.push(currentSubmission);

    const formattedSubmission = formatSubmission(currentSubmission);

    return res.status(200).send({
      status: "Pass",
      code: 200,
      data: formattedSubmission,
      message: "Successfully submitted",
    });
  } catch (error) {
    res.status(500).send({
      status: "FAIL",
      code: 500,
      message: "Internal Server Error",
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                          GET FILTERED SUBMISSIONS                          */
/* -------------------------------------------------------------------------- */
exports.getFilteredSubmission = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const { status, questionId } = req.query;

    let filteredSubmissions = SUBMISSIONS;

    filteredSubmissions = filteredSubmissions.filter(
      (submission) => submission.userId === userId
    );

    if (status) {
      filteredSubmissions = filteredSubmissions.filter(
        (submission) => submission.status.toLowerCase() === status.toLowerCase()
      );
    }

    if (questionId) {
      filteredSubmissions = filteredSubmissions.filter(
        (submission) => submission.questionId === questionId
      );
    }

    return res.status(200).send({
      status: "Pass",
      code: 200,
      data: filteredSubmissions,
      message: "List of user Submissions",
    });
  } catch (error) {
    res.status(500).send({
      status: "FAIL",
      code: 500,
      message: "Internal Server Error",
    });
  }
};
