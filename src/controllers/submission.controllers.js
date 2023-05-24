const getSubmissionsOfProblem = async (req, res) => {
  // return the users submissions for this problem
  res.send("Hello World from route 4!");
};

const addSubmissionToProblem = async (req, res) => {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  res.send("Hello World from route 4!");
};

module.exports = { getSubmissionsOfProblem, addSubmissionToProblem };
