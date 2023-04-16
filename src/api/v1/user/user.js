const moment = require("moment");
// later these should be moved into a service
const { createJwtTokens } = require("../../../helpers/authentication.js/index");
const response = require("../../../helpers/api/index");

const {
  users,
  roleWisePermissions,
  questions,
} = require("../../../specs/index");

const login = async (req, res) => {
  try {
    const tokens = createJwtTokens(req.user);
    res.status(200).json(response.success(tokens));
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

const signUp = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doesUserAlreadyExist = users.find((u) => u.email === email);
    if (doesUserAlreadyExist) {
      return res.status(200).json({
        sucess: false,
        error:
          "The email is already registered in our Systtem.Please try logging in or resetting your password",
      });
    }
    if (!password || typeof password !== "string" || password.length < 4) {
      return res.status(200).json({
        sucess: false,
        error: "Please provide a valid password",
      });
    }
    users.push({
      email,
      password,
      role: "user",
      key: `${Date.now()}randomString`,
      keyExpiry: moment().add("minutes", 10),
    });
    return res.status(200).json({ success: true, message: "Please logIn" });
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
const fetchAllSubmissionsByUser = (req, res) => {
  try {
    const { email } = req.user;
    const user = users.find((u) => u.email === email);
    return res.status(200).json({ success: true, submissions: user.questions });
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

const addSubmissionToQuestion = (req, res) => {
  try {
    const { email } = req.user;
    const { submission, _id: questionId } = req.body;
    const user = users.find((u) => u.email === email);

    if (!questions.find((q) => q._id === questionId)) {
      const error = new Error(
        "The concerned question does not exist in our System."
      );
      error.status = 422;
      throw error;
    }

    if (Math.random() < 0.5) {
      const error = new Error("Your Submission was rejected");
      error.status = 422;
      throw error;
    }
    if (!user.questions[questionId]) {
      user.questions[questionId] = [];
    }
    user.questions[questionId].push({ submission, questionId });

    return res.status(200).json({ success: true, submissions: user.questions });
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

module.exports = {
  login,
  signUp,
  fetchAllSubmissionsByUser,
  addSubmissionToQuestion,
};
