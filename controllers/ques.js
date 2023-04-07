const { QUESTIONS } = require("../data/quesDb");

exports.questions = (req, res) => {
  res.status(200).send(QUESTIONS);
};
