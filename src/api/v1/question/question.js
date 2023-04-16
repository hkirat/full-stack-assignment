const { questions } = require("../../../specs/index");
const response = require("../../../helpers/api/index");

const fetchAll = (req, res) => {
  try {
    return res.status(200).json(response.success(questions));
  } catch (error) {
    res
      .status(error.status || 500)
      .json(
        error.status
          ? response.error(null, error.message)
          : response.error("There was an internal server error", null)
      );
  }
};

const create = (req, res) => {
  try {
    const { title } = req.body;

    const existingQuestion = questions.find((q) => q.title === title);
    if (existingQuestion) {
      const error = new Error(
        "A question with same title already exists in our collections"
      );
      error.status = 422;
      throw error;
    }

    questions.push({
      ...req.body,
      _id: questions[questions.length - 1]._id + 1,
    });
    return res
      .status(200)
      .json(response.success(questions[questions.length - 1]));
  } catch (error) {
    res
      .status(error.status || 500)
      .json(
        error.status
          ? response.error(null, error.message)
          : response.error("There was an internal server error", null)
      );
  }
};

module.exports = { fetchAll, create };
