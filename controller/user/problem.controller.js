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

// get a signle question based on query...
const getQuestion = (req, res) => {
  const id = req.params.id;
  const data = QUESTIONS.find((q) => q.id === parseInt(id));

  if (data) return res.status(200).json({ msg: data });
  else return res.status(400).json({ err: "something went wrong" });
};

// submission controllers...

// post a submission for problem..
const postSubmission = (req, res) => {
  const sub = req.body;
  const question = sub?.qid;

  // dummy submission...
  const result = Math.floor(Math.random() * 10) % 2 === 0 ? true : false;
  // check if the question submitted in past
  const checkSub = SUBMISSION.find((submission) => submission.qid === question);
  // if submitted push new submission to it.
  let subMission = { code: sub.code, result: result };
  if (checkSub) {
    checkSub.submissions.push(subMission);
  } else {
    SUBMISSION.push({ qid: question, submissions: [subMission] });
  }

  if (result)
    return res.status(200).json({
      msg: "submission successful",
      data: subMission,
    });
  else
    return res.status(200).json({ err: "submission failed", data: subMission });
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

module.exports = {
  getAllQuestions,
  getSubmission,
  postSubmission,
  getQuestion,
};
