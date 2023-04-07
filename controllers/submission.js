const { SUBMISSIONS } = require("../data/submissionDB");

exports.getSubmissions = (req, res) => {
  const questionId = req.query.questionId;
  const userId = req.query.userId;

  const filteredSubmissions = SUBMISSIONS.filter((submission) => {
    return (
      (!questionId || submission.questionId === parseInt(questionId)) &&
      (!userId || submission.userId === parseInt(userId))
    );
  });

  res.status(200).send(filteredSubmissions);
};

exports.postSubmission = (req, res) => {
  const userId = req.body.userId;
  const questionId = req.body.questionId;
  const code = req.body.code;
  const submittedAt = new Date().toISOString();

  const isAccepted = Math.random() < 0.5;

  const submission = {
    userId,
    questionId,
    code,
    submittedAt,
    isAccepted,
  };

  SUBMISSIONS.push(submission);

  res.status(200).json(submission);
};
