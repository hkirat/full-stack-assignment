const QUESTIONS = require("../models/Questions");

exports.getAllQuestions = (req, res) => {
  try {
    const formattedQuestions = QUESTIONS;

    res.status(200).json(formattedQuestions);
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};

//TODO: Admin can post questions
