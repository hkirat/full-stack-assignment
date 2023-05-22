const { SUBMISSION } = require("../database");

const getSubmissions = (req, res) => {
  const { questionTitle } = req.params;
  const submissionResults = [];
  SUBMISSION.forEach((submission) => {
    if (submission.questionTitle === questionTitle) {
      submissionResults.push({ accepted: submission.accepted });
    }
  });
  res.status(200).json(submissionResults);
};

const postSubmissions = (req, res) => {
  const { email, questionTitle } = req.body;
  const randomValue = Math.random() < 0.5;
  SUBMISSION.push({ email, questionTitle, accepted: randomValue });
  res.status(201).send("Submission saved");
};

module.exports = { getSubmissions, postSubmissions };
