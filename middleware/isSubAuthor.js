const Submission = require("../src/models/Submission");

const isSubAuthor = async (req, res, next) => {
  const { subId } = req.params;

  const submission = await Submission.findById(subId);
  if (submission && !submission.author.equals(req.user._id)) {
    res.send("UnAuthorized");
  }
  next();
};

module.exports = isSubAuthor;
