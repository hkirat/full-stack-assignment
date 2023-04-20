const Submission = require("../models/submission");

async function addSubmissionHandler(req, res) {
  try {
    const { questionId, code, language } = req.body;
    const userId = req.userId;

    if (!questionId || !code || !language) {
      res
        .status(400)
        .json({ error: "questionId, language & code are mandatory fields" });
      return;
    }

    const submission = new Submission({
      questionId,
      userId,
      language,
      code,
      status: Math.random() < 0.5 ? "ACCEPTED" : "REJECTED",
    });
    await submission.save();

    res.status(201).json(submission);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = addSubmissionHandler;
