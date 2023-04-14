const express = require("express");
const app = express();
const port = 3001;

app.use(express.json());

const USERS = [];

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
  if (USERS.some((user) => user.email === req.body.email)) {
    console.log("Already Signed Up!");
  } else {
    USERS.push({ email: req.body.email, password: req.body.password });
  }
  res.status(200).send("Successfully Signed Up!");
});

app.post("/login", function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  if (
    USERS.some((user) => user.email === email && user.password === password)
  ) {
    res.status(200).send("Successfully logged in");
  } else {
    res.status(401).send("User not found!");
  }
});

app.get("/questions", function (req, res) {
  res.send(QUESTIONS);
});

app.get("/submissions", function (req, res) {
  const userSubmissions = SUBMISSION.filter(
    (user) => user.email === req.body.email
  );
  res.status(200).send(userSubmissions);
});

app.post("/submissions", function (req, res) {
  const submission = req.body.submission;
  const isAccepted = Math.random() < 0.5;
  if (isAccepted) {
    SUBMISSION.push({ ...submission });
    res.status(201).send("Submission Accepted");
  } else {
    res.status(400).send("Submission Rejected");
  }
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
