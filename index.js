const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
const port = 3001;

const ADMIN_USER = {
  email: "email123",
  password: "adminpass",
};

const USERS = [];

const isAdmin = (req, res, next) => {
  if (
    req.body.email === ADMIN_USER.email &&
    req.body.password === ADMIN_USER.password
  ) {
    next();
  } else {
    res.status(401).send("unauthorised");
  }
};

const QUESTIONS = [
  {
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

const SUBMISSION = [];

app.post("/signup", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  if (USERS.findIndex((item) => item.email == email) === -1) {
    USERS.push(req.body);
    res.status(200).send("user signed up!");
  } else {
    res.send("user already exists!");
  }
  // return back 200 status code to the client
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  if (
    USERS.findIndex(
      (items) => items.email == email && items.password == password
    ) !== -1
  ) {
    // If the password is the same, return back 200 status code to the client
    // Also send back a token (any random string will do for now)
    res.status(200).send("logged in!");
  } else {
    // If the password is not the same, return back 401 status code to the client
    res.status(401).send("incorrect login and password!");
  }
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.json(QUESTIONS);
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.json(SUBMISSION);
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const toSubmit = {
    id: req.body.id,
    questionId: req.body.questionId,
    code: req.body.code,
  };
  toSubmit.accepted = Math.random() < 0.5 ? "accepted" : "rejected";
  SUBMISSION.push(toSubmit);
  res.json(toSubmit.accepted);
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/addproblems", isAdmin, (req, res) => {
  const problemToAdd = {
    title: req.body.title,
    description: req.body.description,
    testCases: [
      {
        input: req.body.testCases[0].input,
        output: req.body.testCases[0].output,
      },
    ],
  };
  QUESTIONS.push(problemToAdd);
  res.send("added problems!");
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
