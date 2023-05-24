const getQuestions = async (req, res) => {
  //return the user all the questions in the QUESTIONS array
  res.send("Hello World from route 3!");
};

const addQuestion = async (req, res) => {
  // leaving as hard todos
  // Create a route that lets an admin add a new problem
  // ensure that only admins can do that.
};

module.exports = { getQuestions, addQuestion };
