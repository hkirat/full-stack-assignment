const Submission = require("../models/submission");

async function getSubmissions(req, res) {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  try {
    const { questionId } = req.query;

    const startIndex = (page - 1) * pageSize;

    const totalSubmissions = await Submission.countDocuments({
      questionId,
      status: "ACCEPTED",
    });

    const submissions = await Submission.find({
      questionId,
      status: "ACCEPTED",
    })
      .populate("questionId")
      .populate("userId", "-password -email -createdAt -updatedAt")
      .select("-code -error")
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(pageSize)
      .exec();

    const response = {
      currentPage: page,
      totalPages: Math.ceil(totalSubmissions / pageSize),
      totalSubmissions,
      submissions: submissions.map((submission) => ({
        ...submission.toObject(),

        question: submission.questionId,
        questionId: undefined,

        user: submission.userId,
        userId: undefined,
      })),
    };
    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = getSubmissions;
