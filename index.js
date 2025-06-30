
const express = require('express');
const app = express();
const port = 3001;

app.use(express.json()); // Middleware to parse JSON bodies

const USERS = [];

const QUESTIONS = [{
  title: "Two states",
  description: "Given an array, return the maximum of the array?",
  testCases: [{
    input: "[1,2,3,4,5]",
    output: "5"
  }]
}];

const SUBMISSION = [];

// POST /signup
app.post('/signup', function (req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Email and password required");
  }

  const userExists = USERS.find(user => user.email === email);
  if (userExists) {
    return res.status(400).send("User already exists");
  }

  USERS.push({ email, password });
  return res.status(200).send("Signup successful");
});

// POST /login
app.post('/login', function (req, res) {
  const { email, password } = req.body;

  const user = USERS.find(user => user.email === email);

  if (!user || user.password !== password) {
    return res.status(401).send("Invalid email or password");
  }

  // For now, using a random string as token
  const token = Math.random().toString(36).substring(2);
  return res.status(200).json({ message: "Login successful", token });
});

// GET /questions
app.get('/questions', function (req, res) {
  return res.status(200).json(QUESTIONS);
});

// GET /submissions
app.get("/submissions", function (req, res) {
  return res.status(200).json(SUBMISSION);
});

// POST /submissions
app.post("/submissions", function (req, res) {
  const { problemTitle, code } = req.body;

  if (!problemTitle || !code) {
    return res.status(400).send("Missing problem title or code");
  }

  const accepted = Math.random() < 0.5; // Randomly accept or reject
  const submission = { problemTitle, code, status: accepted ? "Accepted" : "Rejected" };

  SUBMISSION.push(submission);
  return res.status(200).json(submission);
});

// TODO: Admin-only route to add new questions

app.listen(port, function () {
  console.log(`Server listening on port ${port}`);
});
