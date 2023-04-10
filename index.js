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

const SUBMISSIONS = [];

app.use(express.json());

// Signup route
app.post("/signup", function (req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send("Email and password are required");
    return;
  }

  const userExists = USERS.some((user) => user.email === email);

  if (userExists) {
    res.status(409).send("User already exists");
    return;
  }

  USERS.push({ email, password });

  res.status(200).send("User registered successfully");
});

// Login route
app.post("/login", function (req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send("Email and password are required");
    return;
  }

  const user = USERS.find((user) => user.email === email);

  if (!user || user.password !== password) {
    res.status(401).send("Invalid credentials");
    return;
  }

  const token = "random-token"; // Generate random token for authentication

  res.status(200).json({ token });
});

// Get all questions
app.get("/questions", function (req, res) {
  res.status(200).json(QUESTIONS);
});

// Get user's submissions for a problem
app.get("/submissions", function (req, res) {
  // Assume user is authenticated
  const submissions = SUBMISSIONS.filter(
    (submission) => submission.user === req.user.email
  );

  res.status(200).json(submissions);
});

// Submit a solution for a problem
app.post("/submissions", function (req, res) {
  // Assume user is authenticated
  const { question, code } = req.body;

  if (!question || !code) {
    res.status(400).send("Question and code are required");
    return;
  }

  const accepted = Math.random() < 0.5; // Randomly accept or reject submission

  SUBMISSIONS.push({ user: req.user.email, question, code, accepted });

  res.status(200).send("Submission saved successfully");
});

// Add a new problem (admin only)
app.post("/questions", function (req, res) {
  // Assume user is authenticated as admin
  const { title, description, testCases } = req.body;

  if (!title || !description || !testCases || !Array.isArray(testCases)) {
    res
      .status(400)
      .send(
        "Title, description and test cases are required and must be an array"
      );
    return;
  }

  QUESTIONS.push({ title, description, testCases });

  res.status(200).send("Problem added successfully");
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
