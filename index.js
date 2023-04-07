const express = require("express");
const app = express();
const port = 3001;

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

app.use(express.json());

app.post("/signup", function (req, res) {
  const { email, password } = req.body;

  const exitingUser = USERS.find((user) => user.email === email);

  if (exitingUser) {
    return res
      .status(400)
      .json({ message: "User already exits with this email" });
  }

  USERS.push({ email, password, isAdmin: false });

  return res.status(200).json({ message: "User created successfully " });
});

app.post("/login", function (req, res) {
  const { email, password } = req.body;

  const user = USERS.find((user) => user.email === email);

  if (!user) {
    return res.status(401).json({ message: "Invalid email" });
  }

  if (user.password !== password) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const token = Math.random().toString(36).substring(2);

  return res.status(200).json({ message: "Login successful", token });
});

app.get("/questions", function (req, res) {
  res.json(QUESTIONS);
});

app.get("/submissions", function (req, res) {
  const problemName = req.query.problem;

  const problemSubmissions = SUBMISSION.filter(
    (submission) => submission.problem === problemName
  );

  res.json(problemSubmissions);
});

app.post("/submissions", function (req, res) {
  const { email, problem, code } = req.body;

  const status = Math.random() < 0.5 ? "rejected" : "accepted";

  SUBMISSION.push({
    email,
    problem,
    code,
    status,
    time: new Date().toISOString,
  });

  res.json({ status });
});

// Middleware to check if the user is an admin
function checkAdmin(req, res, next) {
  const userEmail = req.body.email;

  const user = USERS.find((user) => user.email === userEmail);

  if (!user || !user.isAdmin) {
    res.status(401).send("You are not authorized to perform this");
    return;
  }

  next();
}

app.post("/questions", checkAdmin, function (req, res) {
  const { title, description, testCases } = req.body;

  QUESTIONS.push({
    title,
    description,
    testCases,
  });

  res.status(200).send("Problem added successfully");
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
