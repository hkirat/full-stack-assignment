const express = require("express");
const app = express();
const port = 3001;

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

//signup
app.post("/signup", function (req, res) {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const isAdmin = req.body.isAdmin;

    const user = USERS.find((user) => user.username === username);

    if (!user || user.password !== password) {
      res.status(401).send("Invalid username or password");
      return;
    }

    res.status(200).send("Sign in successful");
  } catch (error) {
    res.status(500).send(error);
  }
});

//login
app.post("/login", function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  const userExists = USERS.some((user) => user.email === email);

  if (userExists) {
    res.status(409).send("User with this email already exists");
    return;
  }

  const token = Math.random().toString(36).substr(2);

  USERS.push({ email, password, token });

  res.status(200).send("Login successful");
});

app.get("/questions", function (req, res) {
  res.status(200).send(QUESTIONS);
});

//get submissions
app.get("/submissions", function (req, res) {
  const title = req.query.title;
  const submissions = SUBMISSIONS.filter(
    (submission) => submission.title === title
  );
  res.status(200).json(submissions);
});

//create submissions
app.post("/submissions", function (req, res) {
  const { title, solution } = req.body;

  const isAccepted = Math.random() < 0.5;

  const submission = { title, solution, isAccepted };

  SUBMISSIONS.push(submission);

  res.status(200).json({ isAccepted });
});

//create new questions
app.post("/createProblems", function (req, res) {
  const { title, description, testCases } = req.body;
  const isAdmin = req.user.isAdmin;

  if (isAdmin) {
    QUESTIONS.push({ title, description, testCases });
    res.status(200).json({ message: "Problem created successfully" });
  } else {
    res.status(401).send("You are not authenticated");
  }
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
