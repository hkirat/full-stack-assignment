const express = require('express');
const app = express();
const port = 3001;

const USERS = [];

const QUESTIONS = [{
  title: "Two states",
  description: "Given an array, return the maximum of the array?",
  testCases: [{
    input: "[1,2,3,4,5]",
    output: "5"
  }]
}];

const SUBMISSIONS = [];

// Signup route
app.post('/signup', (req, res) => {
  const { email, password } = req.body;

  const userExists = USERS.some(user => user.email === email);

  if (userExists) {
    res.status(409).send('User with this email already exists');
  } else {
    USERS.push({ email, password });
    res.sendStatus(200);
  }
});

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = USERS.find(user => user.email === email && user.password === password);

  if (user) {
    const token = generateToken(); // Generate a token for authentication
    res.status(200).json({ token });
  } else {
    res.sendStatus(401);
  }
});

// Questions route
app.get('/questions', (req, res) => {
  res.json(QUESTIONS);
});

// Submissions route
app.get('/submissions', (req, res) => {
  res.json(SUBMISSIONS);
});

app.post('/submissions', (req, res) => {
  // Accept or reject the solution randomly
  const isAccepted = Math.random() < 0.5;

  // Store the submission in the SUBMISSIONS array
  const submission = {
    solution: req.body.solution,
    isAccepted
  };
  SUBMISSIONS.push(submission);

  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// Helper function to generate a random token
function generateToken() {
  return Math.random().toString(36).substr(2);
}
