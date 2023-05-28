const { SUBMISSION } = require("../database/data");

const getSubmissionsOfProblem = async (req, res) => {
  // return the users submissions for this problem
  const problemId = Number.parseInt(req.params.id);
  const submissions = SUBMISSION.filter(
    (submission) => submission.problemId === problemId
  );

  res.customJson(submissions, "Submissions fetched successfully", 200);
};

const addSubmissionToProblem = async (req, res, next) => {
  try {
    // let the user submit a problem, randomly accept or reject the solution
    // Store the submission in the SUBMISSION array above
    const problemId = Number.parseInt(req.params.id);
    const { code } = req.body;
    if (!code) {
      const err = new Error("No code provided");
      err.statusCode = 400;
      throw err;
    }
    const status = Math.random() > 0.5 ? "Accepted" : "Rejected";
    const submission = {
      id: SUBMISSION.length,
      problemId,
      code,
      status,
      submittedBy: req.user.id,
      submittedAt: new Date(),
    };
    SUBMISSION.push(submission);
    res.customJson(submission, "Submission added successfully", 200);
  } catch (error) {
    next(error);
  }
};

module.exports = { getSubmissionsOfProblem, addSubmissionToProblem };
