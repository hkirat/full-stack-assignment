const express = require("express");
const app = express();
const port = 3001;

const USERS = [];

const QUESTIONS = [
  {
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{ input: "[1,2,3,4,8]", output: "8" }],
  },
  {
    title: "Palindrome",
    description:
      "Write a function that checks if a given string is a palindrome",
    testCases: [
      {
        input: "'racecar'",
        output: "true",
      },
      {
        input: "'hello'",
        output: "false",
      },
    ],
  },
  {
    title: "Fibonacci",
    description: "Write a function that returns the nth Fibonacci number",
    testCases: [
      {
        input: "4",
        output: "3",
      },
      {
        input: "7",
        output: "13",
      },
    ],
  },
  {
    title: "Factorial",
    description:
      "Write a function that computes the factorial of a given number",
    testCases: [
      {
        input: "5",
        output: "120",
      },
      {
        input: "10",
        output: "3628800",
      },
    ],
  },
];

const SUBMISSION = [];

app.post("/signup", function (req, res) {
  const { email, password } = req.body;

  const checkUser = USERS.some((user) => user.email === email);

  if (checkUser) {
    return res.status(409).send({ message: "User already exists" });
  }

  USERS.push({ email, password });
  return res.status(200).send({ message: "User created" });
});

app.post("/login", function (req, res) {
  const { email, password } = req.body;

  const checkUser = USERS.some((user) => user.email === email);

  if (!checkUser || checkUser.password !== password) {
    return res.status(401).send({ message: "Invalid credentials" });
  }

  const authToken = "randomstring";

  checkUser.token = authToken;

  return res.status(200).json({ authToken });
});

app.get("/questions", function (req, res) {
  return res.json(QUESTIONS);
});

app.get("/submissions", function (req, res) {
  return res.json(SUBMISSION);
});

app.post("/submissions", function (req, res) {
  const { problemTitle, solution } = req.body;

  const isAccepted = Math.random() > 0.5;

  SUBMISSION.push({ problemTitle, solution, isAccepted });

  if (isAccepted) {
    res.status(200).json({ message: "Accepted" });
  } else {
    res.status(400).json({ message: "Wrong Answer" });
  }
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.post("/add-problem", function (req, res) {
  const isAdmin = true;

  const { title, description, testCases } = req.body;
  if (isAdmin) {
    QUESTIONS.push({ title, description, testCases });
    return res.status(200).json({ message: "Problem added" });
  }

  return res.status(401).json({ message: "Unauthorized" });
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
