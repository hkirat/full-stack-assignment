const { validationResult } = require("express-validator");
const QUESTIONS = require("../models/Questions");

exports.getAllQuestions = (req, res) => {
  try {
    const formattedQuestions = QUESTIONS;

    res.status(200).json(formattedQuestions);
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};

exports.addQuestion = (req, res) => {
  // Validate and sanitize inputs using express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const { title, description, testCases } = req.body;

    const newQuestion = {
      id: QUESTIONS.length + 1,
      title,
      description,
      testCases,
    };

    QUESTIONS.push(newQuestion);
    res
      .status(201)
      .json({ message: "Question added successfully!", question: newQuestion });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};
