const Problem = require("../src/models/Problem");

module.exports.isProblemCreator = async (req, res, next) => {
  const { id } = req.params;

  const problem = await Problem.findById(id);
  if (problem && !problem.author.equals(req.user._id)) {
    res.send("UnAuthorized");
  }
  next();
};
