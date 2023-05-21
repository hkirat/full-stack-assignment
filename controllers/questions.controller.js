const { QUESTIONS } = require("../database");

const questions = (req, res) => {
  res.status(200).json(QUESTIONS);
};

module.exports = questions;
