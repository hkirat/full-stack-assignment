const usermodel = require("./model/user.js");
const questionModel = require("./model/question.js");
const submissionModel = require("./model/submission.js");

const {
  userExists,
  addUser,
  getUser,
  updateUser,
  getUserSubmissions,
  addUserSubmission,
  getQuestions,
  addQuestion,
} = require("./config/fakedatabase.js");

const {
  generateAccessToken,
  verifyAccessToken,
} = require("./middleware/auth.js");

const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());

const port = 3001;
const constants = require("./lib/constants.js");

addQuestion(
  new questionModel(
    "Two states",
    "Given an array , return the maximum of the array?",
    [
      {
        input: "[1,2,3,4,5]",
        output: "5",
      },
    ]
  )
);

app.post("/signup", (req, res) => {
  if (req.query == null) {
    res.status(400).send(Constants.STATUS_CODES[400]);
  }

  // Add logic to decode body
  // body should have email and password
  const { email, password, isAdmin } = req.query;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  if (userExists(email) === false) {
    const user = new usermodel(email ?? "", password ?? "", isAdmin ?? false);
    addUser(user);
  }

  // return back 200 status code to the client
  res.status(200).send(constants.STATUS_CODES[200]);
});

app.post("/login", (req, res) => {
  if (req.query == null) {
    res.status(400).send(constants.STATUS_CODES[400]);
  }

  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.query;

  // Check if the user with the given email exists in the USERS array
  if (userExists(email) === false) {
    res.status(401).send(constants.STATUS_CODES[401]);
    return false;
  }

  // Also ensure that the password is the same
  // If the password is not the same, return back 401 status code to the client
  const user = getUser(email);
  if (user.password !== password) {
    res.status(401).send(constants.STATUS_CODES[401]);
    return false;
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  user.token = generateAccessToken(user.email, user.isAdmin);
  updateUser(user);
  res
    .cookie(constants.AUTH_COOKIE, user.token, {
      httpOnly: true,
      secure: false,
    })
    .status(200)
    .send(constants.STATUS_CODES[200]);
});

app.get("/questions", verifyAccessToken, (req, res) => {
  //return the user all the questions in the QUESTIONS array
  res.status(200).json(getQuestions());
});

app.get("/submissions", verifyAccessToken, (req, res) => {
  // return the users submissions for this problem
  res.status(200).json(getUserSubmissions(req.user.email));
});

app.post("/submissions", verifyAccessToken, (req, res) => {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const { questionId, submittedSolution } = req.query;
  const submission = new submissionModel(
    req.user.email,
    questionId,
    submittedSolution
  );
  submission.passedTests = Math.random() < 0.5;
  addUserSubmission(submission);
  res.status(200).send(constants.STATUS_CODES[200]);
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/questions", verifyAccessToken, (req, res) => {
  const { title, description, input, output } = req.query;
  const question = new questionModel(title, description, [
    { input: input, output: output },
  ]);
  addQuestion(question);
  res.status(200).send(constants.STATUS_CODES[200]);
});

app.post("/logout", verifyAccessToken, (req, res) => {
  res
    .clearCookie(constants.AUTH_COOKIE)
    .status(200)
    .send(constants.STATUS_CODES[200]);
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
