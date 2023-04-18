const { request } = require("express");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3001;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const USERS = [];

const SUBMISSION = [];

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

app.post("/signup", function (req, res) {
  const { email, password } = req.body;

  const userExists = USERS.find((user) => user.email === email);

  //Check if user exists
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }
  //Store email and password (as is for now) in the USERS array above
  USERS.push({ email, password });

  // return back 200 status code to the client
  return res.status(200).json({ message: "User registered successfully" });
});

app.post("/login", function (req, res) {
  const { email, password } = req.body;

  const user = USERS.find((user) => user.email === email);

  if (!user) {
    return res.status(400).json({ message: "User not found!" });
  }

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  if (user.password !== password) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now
  const token = "any random string";
  return res.status(200).json({ message: "Login successful", token });
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  const title = QUESTIONS.map((q) => q.title);
  const desc = QUESTIONS.map((q) => q.description);
  const testCases = QUESTIONS.map((q) => q.testCases);
  res.json({ title, desc, testCases });
});

app.get("/submissions", function (req, res) {
  res.json(SUBMISSION);
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution

  const { problemId, solution } = req.body;
  const isAccepted = Math.random() < 0.5;
  const submission = { problemId, solution, isAccepted };
  if (!isAccepted) {
    SUBMISSION.push([...submission]);
    res.status(201).send("submission Accepted");
  } else {
    res.status(400).send("submission Rejected");
  }
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
