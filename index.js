const express = require("express");
const app = express();
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const userMiddleWare = require("../full-stack-assignment/middleware/user");
const adminMiddleWare = require("../full-stack-assignment/middleware/admin");

dotenv.config();

//middleware provided by Express to parse incoming JSON requests.
app.use(express.json());

const port = process.env.PORT;

let USERS = [];

let QUESTIONS = [
  {
    id: 1,
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5",
      },
    ],
  },
];

let SUBMISSION = [];

const isInputValid = (input, res) => {
  if (
    !(
      Object.hasOwn(input, "username") &&
      Object.hasOwn(input, "password") &&
      Object.hasOwn(input, "role")
    )
  ) {
    res.status(404).send("Request is missing required fields");
    return false;
  }
  return true;
};

const signupValidation = (input, res) => {
  const existingUserIndex = USERS.findIndex(
    (user) => user["username"] === input["username"]
  );
  if (existingUserIndex !== -1) {
    res.status(404).send("Failed to Signup. User already exists.");
    return false;
  }
  return true;
};

const loginValidation = (input, res) => {
  const user = USERS.find((user) => user["username"] === input["username"]);
  const result = user && user["password"] === input["password"];
  if (!result) {
    res.status(401).send("Failed to Login. User does not exist");
    return false;
  }
  return true;
};

app.post("/signup", function (req, res) {
  const input = req.body;

  // Add logic to decode body
  // body should have email and password
  if (!isInputValid(input, res)) return;
  if (!signupValidation(input, res)) return;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  USERS = [...USERS, input];

  // return back 200 status code to the client
  res.status(200).send("Signup successfull!");
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const input = req.body;
  if (!isInputValid(input, res)) return;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  if (!loginValidation(input, res)) return;

  const token = jwt.sign(
    {
      username: input["username"],
      password: input["password"],
      role: input["role"],
    },
    process.env.JWT_SECRET
  );

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  res.status(200).send({ token });
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.status(200).send({ questions: QUESTIONS });
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  // res.send("Hello World from route 4!");
  res.status(200).send({ submissions: SUBMISSION });
});

const isSubmissionValid = (input, res) => {
  if (
    !(Object.hasOwn(input, "questionId") && Object.hasOwn(input, "solution"))
  ) {
    res.status(404).send("Request is missing required fields");
    return false;
  }

  if (
    QUESTIONS.findIndex((question) => +question.id === +input["questionId"]) ===
    -1
  ) {
    res.status(404).send("Question does not exist");
    return false;
  }

  return true;
};

const submissionResultOptions = ["ACCEPT", "REJECT"];

const getRandomInt = (min, max) => {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);

  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
};

app.post("/submissions", function (req, res) {
  const input = req.body;
  if (!isSubmissionValid(input, res)) return;

  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const result = {
    questionId: input.questionId,
    solution: input.solution,
    submissionResult: submissionResultOptions[getRandomInt(0, 2)],
  };

  SUBMISSION = [...SUBMISSION, result];

  res.status(200).send({ result });
});

const isQuestionValid = ({ id, title, description, testCases }, res) => {
  if (!(id && title && description && testCases)) {
    res.status(404).json({ message: "Request is missing required fields" });
    return false;
  }

  if (QUESTIONS.findIndex((question) => question.id === id) !== -1) {
    res
      .status(404)
      .json({ message: "Question already exist. Please enter a new question" });
    return false;
  }

  return true;
};

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post("/question", userMiddleWare, adminMiddleWare, (req, res) => {
  const { id, title, description, testCases } = req.body.question;
  if (!isQuestionValid({ id, title, description, testCases }, res)) return;

  QUESTIONS = [...QUESTIONS, req.body.question];
  res.status(200).json({ question: req.body.question });
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
