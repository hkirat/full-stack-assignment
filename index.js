const express = require("express");
const app = express();
const port = 3001;

const USERS = [];

const QUESTIONS = [
  {
    title: "Two states",
    description: "Given an array, return the maximum of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5",
      },
    ],
  },
];

const SUBMISSIONS = [];

app.use(express.json()); // Parse JSON bodies

app.post("/signup", function (req, res) {
  const { email, password } = req.body;

  // Check if user with the given email already exists
  const userExists = USERS.some((user) => user.email === email);
  if (userExists) {
    res.status(400).send("User already exists");
    return;
  }

  // Store email and password in the USERS array
  USERS.push({ email, password });

  res.sendStatus(200);
});

app.post("/login", function (req, res) {
  const { email, password } = req.body;

  // Find user with the given email
  const user = USERS.find((user) => user.email === email);

  if (!user || user.password !== password) {
    res.status(401).send("Invalid email or password");
    return;
  }

  // Authentication successful, generate a token
  const token = generateToken(); // Replace with your token generation logic

  res.status(200).json({ token });
});

app.get("/questions", function (req, res) {
  res.json(QUESTIONS);
});

app.get("/submissions", function (req, res) {
  res.json(SUBMISSIONS);
});

app.post("/submissions", function (req, res) {
  const submission = req.body;

  // Randomly accept or reject the submission
  const isAccepted = Math.random() < 0.5; // Replace with your acceptance logic

  submission.accepted = isAccepted;
  SUBMISSIONS.push(submission);

  res.sendStatus(200);
});

// Admin route to add a new problem
app.post("/problems", function (req, res) {
  // Ensure only admins can add problems
  const isAdmin = checkAdminPermissions(req); // Replace with your admin check logic

  if (!isAdmin) {
    res.status(403).send("Unauthorized");
    return;
  }

  const problem = req.body;
  QUESTIONS.push(problem);

  res.sendStatus(200);
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});

function generateToken() {
  // Replace with your token generation logic
  return "randomToken";
}

function checkAdminPermissions(req) {
  // Replace with your admin check logic
  const { token } = req.headers;
  return token === "adminToken";
}
