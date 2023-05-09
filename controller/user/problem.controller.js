const { QUESTIONS } = require("../../model/user.model");
const { SUBMISSION } = require("../../model/user.model");

// get all questions
const getAllQuestions = (req, res) => {
  // check if no questions are there
  if (QUESTIONS.length === 0) {
    return res.status(200).json({ message: "No questions are found!" });
  } else {
    return res.status(200).json({ message: QUESTIONS });
  }
};

// submission controllers...

// post a submission for problem..
const postSubmission = (req, res) => {
  const sub = req.body;
  const question = sub?.qid || 1;

  // dummy submission...
  const num = Math.floor(Math.random() * 10) % 2 === 0 ? true : false;
  // check if the question submitted in past
  const checkSub = SUBMISSION.find((submission) => submission.qid === question);
  // if submitted push new submission to it.
  if (checkSub) {
    checkSub.submissions.push(sub);
  } else {
    SUBMISSION.push({ qid: question, submissions: [sub] });
  }

  if (num)
    return res
      .status(200)
      .json({ message: "submission successful", data: SUBMISSION });
  else
    return res
      .status(200)
      .json({ message: "submission failed", data: SUBMISSION });
};
// get submissions for a problem
const getSubmission = (req, res) => {
  const sub = req.body;
  const question = sub?.qid || 1;
  // check if the question submitted in past
  const checkSub = SUBMISSION.find((submission) => submission.qid === question);
  if (checkSub) {
    return res.status(200).json({ message: checkSub.submissions });
  } else {
    return res.status(200).json({ message: "no submissions are found!" });
  }
};

module.exports = { getAllQuestions, getSubmission, postSubmission };
