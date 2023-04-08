const { validationResult } = require("express-validator");
const QUESTIONS = require("../models/Questions");
const SUBMISSIONS = require("../models/Submissions");

exports.getSubmissionsByQuestion = (req, res) => {
  try {
    const questionId = req.params.questionId;

    const submissions = SUBMISSIONS.filter(
      (val) => val.questionId.toString() === questionId
    );

    return res.status(200).json(submissions);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.submitSolution = (req, res) => {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

  try {
    const question = QUESTIONS.find(
      (val) => val.id.toString() === req.params.questionId
    );
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    const userId = req.user.id;
    const code = req.body.code;

    const submission = {
      userId: userId,
      code: code,
      status: Math.random() > 0.5 ? "ACCEPTED" : "REJECTED",
    };

    const submissionIndex = SUBMISSIONS.findIndex(
      (s) => s.questionID === req.params.questionId
    );

    if (submissionIndex === -1) {
      SUBMISSIONS.push({
        questionId: req.params.questionId,
        submissions: [submission],
      });
    } else {
      SUBMISSIONS[submissionIndex].submissions.push(submission);
    }

    return res.status(201).json({ message: "Solution submitted successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};
